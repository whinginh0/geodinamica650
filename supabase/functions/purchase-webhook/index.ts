import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.8";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

Deno.serve(async (req: Request) => {
  // Tratar requisição de preflight do CORS
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // Apenas permitir método POST
    if (req.method !== "POST") {
      return new Response(JSON.stringify({ error: "Método não permitido" }), {
        status: 405,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    const body = await req.json();

    console.log("Recebido payload do webhook:", JSON.stringify(body));

    // Extrair e-mail, nome e status de forma ultra-robusta e compatível com a GGCheckout
    const email = (body.customer?.email || body.email || body.buyer?.email || "").toLowerCase().trim();
    const name = body.customer?.name || body.name || body.buyer?.name || 
                 `${body.customer?.first_name || body.first_name || ""} ${body.customer?.last_name || body.last_name || ""}`.trim() || 
                 "Cliente";
    
    // Status do pagamento de forma robusta para a GGCheckout
    const rawStatus = (
      body.payment?.status || 
      body.status || 
      body.event || 
      body.payment_status || 
      "approved"
    ).toLowerCase().trim();

    // Evento principal da GGCheckout
    const eventName = (body.event || "").toLowerCase().trim();

    if (!email) {
      return new Response(JSON.stringify({ error: "E-mail não fornecido no payload" }), {
        status: 400,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    // O pagamento é considerado aprovado se o status do pagamento for "paid"/"approved", ou se o evento indicar pago ("paid" ou "sucesso")
    // E ignoramos eventos como "pix.generated", "boleto.generated", etc.
    const isGenerated = eventName.includes("generated") || eventName.includes("gerado");
    
    const isApproved = !isGenerated && (
      ["approved", "paid", "completed", "payment_approved", "order_approved", "entregue", "pago", "aprovado", "sucesso"].some(s => rawStatus.includes(s)) ||
      ["paid", "approved", "aprovado"].some(s => eventName.includes(s))
    );

    if (!isApproved) {
      console.log(`Compra com evento '${eventName}' e status '${rawStatus}' não é uma aprovação de pagamento. Ignorando.`);
      return new Response(JSON.stringify({ message: "Ignorado (não aprovado)" }), {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    // Determinar plano dinamicamente: Básico vs Premium mapeando a GGCheckout
    const productsTitles = Array.isArray(body.products) 
      ? body.products.map((p: any) => p.title || p.name || "").join(" ")
      : "";

    const planFieldName = (
      body.product_name || 
      body.product?.title || 
      body.product?.name || 
      body.offer_name || 
      body.offer || 
      body.plan_name || 
      body.plan || 
      productsTitles ||
      ""
    ).toLowerCase();

    let plan = "premium"; // Padrão é premium caso não identifique de forma clara

    if (planFieldName.includes("básico") || planFieldName.includes("basico") || planFieldName.includes("basic")) {
      plan = "basic";
    } else if (planFieldName.includes("premium")) {
      plan = "premium";
    } else {
      // Busca global em todo o JSON recebido se os campos principais não contiverem o plano
      const payloadStr = JSON.stringify(body).toLowerCase();
      if (payloadStr.includes("básico") || payloadStr.includes("basico") || payloadStr.includes("basic")) {
        plan = "basic";
      } else if (payloadStr.includes("premium")) {
        plan = "premium";
      }
    }

    console.log(`Plano identificado para a compra: ${plan.toUpperCase()}`);

    // Instanciar o cliente Supabase com a Service Role Key (necessário para ler/gravar na tabela com RLS habilitado)
    const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
    const resendApiKey = Deno.env.get("RESEND_API_KEY") ?? "";

    console.log(`Debug de Segredos: URL=${supabaseUrl ? "OK" : "Vazia"}, Key=${supabaseServiceKey ? "OK" : "Vazia"}, ResendApiKey=${resendApiKey ? `OK (tam: ${resendApiKey.length}, prefixo: ${resendApiKey.substring(0, 5)})` : "Vazia"}`);

    if (!supabaseUrl || !supabaseServiceKey) {
      console.error("Variáveis de ambiente do Supabase não configuradas no Edge Function.");
      return new Response(JSON.stringify({ error: "Erro interno do servidor" }), {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Verificar se o usuário já existe na tabela de membros
    const { data: existingMember, error: fetchError } = await supabase
      .from("members")
      .select("email, password, name, plan")
      .eq("email", email)
      .maybeSingle();

    if (fetchError) {
      console.error("Erro ao consultar tabela de membros:", fetchError);
      return new Response(JSON.stringify({ error: "Erro ao consultar banco de dados" }), {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    let password = "";
    let isNewUser = false;

    if (existingMember) {
      console.log(`Membro já cadastrado: ${email}. Reenviando a senha existente.`);
      password = existingMember.password;

      // Se o plano comprado for premium e o cadastrado for basic, atualiza para premium!
      if (plan === "premium" && existingMember.plan !== "premium") {
        console.log(`Atualizando plano do membro ${email} para PREMIUM.`);
        const { error: updateError } = await supabase
          .from("members")
          .update({ plan: "premium" })
          .eq("email", email);
          
        if (updateError) {
          console.error("Erro ao atualizar plano do membro para Premium:", updateError);
        }
      }
    } else {
      // Gerar senha numérica aleatória de 6 dígitos
      password = Math.floor(100000 + Math.random() * 900000).toString();
      isNewUser = true;

      // Inserir novo membro no banco com o plano detectado
      const { error: insertError } = await supabase
        .from("members")
        .insert({
          email,
          name,
          password,
          plan
        });

      if (insertError) {
        console.error("Erro ao inserir novo membro no banco:", insertError);
        return new Response(JSON.stringify({ error: "Erro ao registrar membro" }), {
          status: 500,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        });
      }
      console.log(`Novo membro inserido com sucesso (${plan.toUpperCase()}): ${email}`);
    }

    // Enviar o e-mail de acesso via Resend
    if (resendApiKey) {
      console.log(`Enviando e-mail de acesso (${plan.toUpperCase()}) via Resend...`);
      const isPremium = plan === "premium";
      const emailSubject = isPremium 
        ? "Seu acesso ao GeoDinâmicas 650+ PREMIUM chegou! 🚀" 
        : "Seu acesso ao GeoDinâmicas 650+ chegou! 🚀";

      const planDetail = isPremium 
        ? `Parab&#233;ns pela sua aquisi&#231;&#227;o do <strong style="font-weight:700;color:#063d20;">GeoDin&#226;micas 650+ Plano PREMIUM</strong>!<br>Seu acesso com <strong style="font-weight:700;">todas as Din&#226;micas BNCC</strong>, B&#244;nus Exclusivos e <strong style="font-weight:700;">Certificado de Conclus&#227;o</strong> j&#225; est&#225; liberado e pronto para uso!` 
        : `Parab&#233;ns pela sua aquisi&#231;&#227;o do <strong style="font-weight:700;color:#063d20;">GeoDin&#226;micas 650+ Plano B&#193;SICO</strong>!<br>Seu acesso j&#225; est&#225; liberado e pronto para uso!`;

      // Template de E-mail Responsivo Premium Oficial
      const emailHtml = `
<!DOCTYPE html>
<html lang="pt-BR" xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="x-apple-disable-message-reformatting">
  <title>${emailSubject}</title>
  <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700;800&display=swap" rel="stylesheet">
  <!--[if mso]>
  <noscript><xml><o:OfficeDocumentSettings><o:PixelsPerInch>96</o:PixelsPerInch></o:OfficeDocumentSettings></xml></noscript>
  <![endif]-->
  <style>
    body, table, td, a { -webkit-text-size-adjust:100%; -ms-text-size-adjust:100%; }
    table, td { mso-table-lspace:0pt; mso-table-rspace:0pt; }
    img { -ms-interpolation-mode:bicubic; border:0; outline:none; text-decoration:none; display:block; }
    body { margin:0 !important; padding:0 !important; width:100% !important; background-color:#cde8d6; }
    a[x-apple-data-detectors] { color:inherit !important; text-decoration:none !important; }
    @media screen and (max-width:640px) {
      .email-container { width:100% !important; }
      .pad { padding:24px 18px !important; }
    }
  </style>
</head>
<body style="margin:0;padding:0;background-color:#cde8d6;">

<table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color:#cde8d6;">
<tr><td align="center" style="padding:36px 12px;">

<table class="email-container" role="presentation" cellspacing="0" cellpadding="0" border="0" width="620" style="max-width:620px;width:100%;background-color:#ffffff;border-radius:24px;overflow:hidden;box-shadow:0 16px 56px rgba(6,61,32,0.25);">

  <!-- ▌STRIPE TOPO -->
  <tr>
    <td style="padding:0;font-size:0;line-height:0;">
      <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
        <tr>
          <td width="25%" style="background-color:#f5b800;height:8px;font-size:0;"></td>
          <td width="50%" style="background-color:#1a7a45;height:8px;font-size:0;"></td>
          <td width="25%" style="background-color:#f5b800;height:8px;font-size:0;"></td>
        </tr>
      </table>
    </td>
  </tr>

  <!-- ▌HEADER -->
  <tr>
    <td align="center" style="background-color:#063d20;padding:36px 30px 32px 30px;">
      <img src="https://i.ibb.co/m5GppDf3/image.png" alt="GeoDinamicas 650+" width="210" style="max-width:210px;height:auto;margin:0 auto 20px auto;display:block;" />
      <table role="presentation" cellspacing="0" cellpadding="0" border="0" align="center">
        <tr>
          <td style="background-color:#f5b800;border-radius:60px;padding:10px 34px;">
            <span style="font-family:Poppins,Arial,sans-serif;font-size:11px;font-weight:700;color:#063d20;letter-spacing:4px;text-transform:uppercase;">${isPremium ? 'PLANO PREMIUM' : 'PLANO BÁSICO'}</span>
          </td>
        </tr>
      </table>
    </td>
  </tr>

  <!-- ▌STRIPE DIVISOR -->
  <tr>
    <td style="padding:0;font-size:0;line-height:0;">
      <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
        <tr>
          <td width="33%" style="background-color:#1a7a45;height:5px;font-size:0;"></td>
          <td width="34%" style="background-color:#f5b800;height:5px;font-size:0;"></td>
          <td width="33%" style="background-color:#063d20;height:5px;font-size:0;"></td>
        </tr>
      </table>
    </td>
  </tr>

  <!-- ▌TÍTULO -->
  <tr>
    <td align="center" class="pad" style="padding:42px 44px 0 44px;background-color:#ffffff;">
      <!-- Ícone foguete nativo -->
      <table role="presentation" cellspacing="0" cellpadding="0" border="0" align="center" style="margin:0 auto 18px auto;">
        <tr>
          <td align="center" style="background-color:#e8f5e9;border-radius:50%;width:64px;height:64px;padding:0;vertical-align:middle;">
            <div style="width:64px;height:64px;line-height:64px;text-align:center;font-size:32px;">
              🚀
            </div>
          </td>
        </tr>
      </table>
      <h1 style="margin:0;font-family:Poppins,Arial,sans-serif;font-size:27px;font-weight:800;color:#063d20;text-align:center;line-height:1.3;letter-spacing:-0.5px;">
        Seu acesso est&#225; liberado!
      </h1>
      <p style="margin:10px 0 0 0;font-family:Poppins,Arial,sans-serif;font-size:15px;font-weight:400;color:#2a6645;text-align:center;line-height:1.6;">
        Tudo pronto para transformar suas aulas de Geografia
      </p>
      <table role="presentation" cellspacing="0" cellpadding="0" border="0" align="center" style="margin:22px auto 0 auto;">
        <tr>
          <td style="background-color:#063d20;width:36px;height:4px;border-radius:4px;font-size:0;"></td>
          <td style="width:6px;"></td>
          <td style="background-color:#1a7a45;width:36px;height:4px;border-radius:4px;font-size:0;"></td>
          <td style="width:6px;"></td>
          <td style="background-color:#f5b800;width:36px;height:4px;border-radius:4px;font-size:0;"></td>
        </tr>
      </table>
    </td>
  </tr>

  <!-- ▌SAUDAÇÃO -->
  <tr>
    <td class="pad" style="padding:28px 44px 0 44px;background-color:#ffffff;">
      <p style="margin:0;font-family:Poppins,Arial,sans-serif;font-size:15px;font-weight:400;color:#2d4a3e;line-height:1.8;">
        Ol&#225;, <strong style="font-weight:700;color:#063d20;">${name}</strong>!
      </p>
      <p style="margin:12px 0 0 0;font-family:Poppins,Arial,sans-serif;font-size:15px;font-weight:400;color:#3d5a4a;line-height:1.8;">
        ${planDetail}
      </p>
    </td>
  </tr>

  <!-- ▌CAIXA DADOS DE ACESSO -->
  <tr>
    <td class="pad" style="padding:28px 44px 0 44px;">

      <!-- Cabeçalho com ícone cadeado -->
      <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color:#063d20;border-radius:18px 18px 0 0;">
        <tr>
          <td style="padding:18px 26px;">
            <table role="presentation" cellspacing="0" cellpadding="0" border="0">
              <tr>
                <td valign="middle" style="padding-right:12px;font-size:20px;line-height:22px;">
                  🔐
                </td>
                <td valign="middle">
                  <span style="font-family:Poppins,Arial,sans-serif;font-size:12px;font-weight:700;color:#f5b800;letter-spacing:3px;text-transform:uppercase;">Seus Dados de Acesso</span>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>

      <!-- Linhas de dados -->
      <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="border:2px solid #063d20;border-top:none;border-radius:0 0 18px 18px;overflow:hidden;">

        <!-- ROW: Plano -->
        <tr>
          <td width="36%" style="background-color:#f0faf4;padding:20px 22px 20px 26px;border-right:2px solid #b2dfcb;border-bottom:2px solid #b2dfcb;vertical-align:middle;">
            <span style="font-family:Poppins,Arial,sans-serif;font-size:11px;font-weight:700;color:#5a8a6a;text-transform:uppercase;letter-spacing:1.5px;">Plano</span>
          </td>
          <td style="background-color:#ffffff;padding:20px 26px;border-bottom:2px solid #b2dfcb;vertical-align:middle;">
            <table role="presentation" cellspacing="0" cellpadding="0" border="0">
              <tr>
                <td style="background-color:#063d20;border-radius:8px;padding:7px 20px;">
                  <span style="font-family:Poppins,Arial,sans-serif;font-size:14px;font-weight:700;color:#f5b800;letter-spacing:1.5px;">${isPremium ? 'PREMIUM' : 'BÁSICO'}</span>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- ROW: Email — agora em retângulo destacado -->
        <tr>
          <td width="36%" style="background-color:#f7fcf9;padding:22px 22px 22px 26px;border-right:2px solid #b2dfcb;border-bottom:2px solid #b2dfcb;vertical-align:middle;">
            <div style="font-size:18px;line-height:20px;margin-bottom:7px;">✉️</div>
            <span style="font-family:Poppins,Arial,sans-serif;font-size:11px;font-weight:700;color:#5a8a6a;text-transform:uppercase;letter-spacing:1.5px;">E-mail</span>
          </td>
          <td style="background-color:#ffffff;padding:18px 22px;border-bottom:2px solid #b2dfcb;vertical-align:middle;">
            <!-- RETÂNGULO DESTAQUE para o e-mail -->
            <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
              <tr>
                <td style="background-color:#063d20;border-radius:10px;padding:14px 18px;">
                  <span style="font-family:'Courier New',Courier,monospace;font-size:13px;font-weight:700;color:#7effc0;word-break:break-all;line-height:1.6;display:block;">${email}</span>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- ROW: Senha -->
        <tr>
          <td colspan="2" style="background-color:#063d20;padding:0;">
            <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
              <tr>
                <td width="36%" style="padding:26px 22px 26px 26px;border-right:2px solid #1a7a45;vertical-align:middle;">
                  <div style="font-size:22px;line-height:24px;margin-bottom:8px;">🔑</div>
                  <span style="font-family:Poppins,Arial,sans-serif;font-size:11px;font-weight:700;color:#8dcfa8;text-transform:uppercase;letter-spacing:1.5px;">Senha Gerada</span>
                  <br>
                  <span style="font-family:Poppins,Arial,sans-serif;font-size:11px;font-weight:400;color:#5aaa7a;">Acesso inicial</span>
                </td>
                <td style="padding:22px 26px;vertical-align:middle;" align="center">
                  <table role="presentation" cellspacing="0" cellpadding="0" border="0" align="center">
                    <tr>
                      <td style="background-color:#f5b800;border-radius:14px;padding:18px 44px;text-align:center;">
                        <span style="font-family:'Courier New',Courier,monospace;font-size:36px;font-weight:700;color:#063d20;letter-spacing:10px;">${password}</span>
                      </td>
                    </tr>
                  </table>
                  <p style="margin:10px 0 0 0;font-family:Poppins,Arial,sans-serif;font-size:11px;font-weight:400;color:#8dcfa8;text-align:center;">Copie e cole no campo de senha</p>
                </td>
              </tr>
            </table>
          </td>
        </tr>

      </table>
    </td>
  </tr>

  <!-- ▌INSTRUÇÕES -->
  <tr>
    <td class="pad" style="padding:24px 44px 0 44px;">
      <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color:#f0faf4;border-radius:18px;border:1px solid #b2dfcb;">
        <tr>
          <td style="padding:26px 28px;">
            <!-- Título com ícone lista -->
            <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin-bottom:20px;">
              <tr>
                <td valign="middle" style="padding-right:10px;font-size:20px;line-height:22px;" width="32">
                  📋
                </td>
                <td valign="middle">
                  <span style="font-family:Poppins,Arial,sans-serif;font-size:12px;font-weight:700;color:#063d20;text-transform:uppercase;letter-spacing:2px;">Como Acessar em 3 Passos</span>
                </td>
              </tr>
            </table>
            <!-- Passo 1 -->
            <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin-bottom:16px;">
              <tr>
                <td width="38" valign="top">
                  <table role="presentation" cellspacing="0" cellpadding="0" border="0">
                    <tr>
                      <td style="background-color:#063d20;border-radius:50%;width:30px;height:30px;text-align:center;vertical-align:middle;">
                        <span style="font-family:Poppins,Arial,sans-serif;font-size:14px;font-weight:700;color:#f5b800;line-height:30px;display:block;">1</span>
                      </td>
                    </tr>
                  </table>
                </td>
                <td style="padding-left:14px;font-family:Poppins,Arial,sans-serif;font-size:14px;font-weight:400;color:#2d4a3e;line-height:1.7;">
                  Clique no bot&#227;o verde <strong style="font-weight:700;">ACESSAR &#193;REA DE MEMBROS</strong> abaixo
                </td>
              </tr>
            </table>
            <!-- Passo 2 -->
            <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin-bottom:16px;">
              <tr>
                <td width="38" valign="top">
                  <table role="presentation" cellspacing="0" cellpadding="0" border="0">
                    <tr>
                      <td style="background-color:#1a7a45;border-radius:50%;width:30px;height:30px;text-align:center;vertical-align:middle;">
                        <span style="font-family:Poppins,Arial,sans-serif;font-size:14px;font-weight:700;color:#ffffff;line-height:30px;display:block;">2</span>
                      </td>
                    </tr>
                  </table>
                </td>
                <td style="padding-left:14px;font-family:Poppins,Arial,sans-serif;font-size:14px;font-weight:400;color:#2d4a3e;line-height:1.7;">
                  Informe seu <strong style="font-weight:700;">E-mail</strong> e a <strong style="font-weight:700;">Senha Gerada</strong> indicados acima
                </td>
              </tr>
            </table>
            <!-- Passo 3 -->
            <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
              <tr>
                <td width="38" valign="top">
                  <table role="presentation" cellspacing="0" cellpadding="0" border="0">
                    <tr>
                      <td style="background-color:#f5b800;border-radius:50%;width:30px;height:30px;text-align:center;vertical-align:middle;">
                        <span style="font-family:Poppins,Arial,sans-serif;font-size:14px;font-weight:700;color:#063d20;line-height:30px;display:block;">3</span>
                      </td>
                    </tr>
                  </table>
                </td>
                <td style="padding-left:14px;font-family:Poppins,Arial,sans-serif;font-size:14px;font-weight:400;color:#2d4a3e;line-height:1.7;">
                  Fa&#231;a o download de todas as din&#226;micas e prepare aulas <strong style="font-weight:700;">inesquec&#237;veis!</strong>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </td>
  </tr>

  <!-- ▌AVISO -->
  <tr>
    <td class="pad" style="padding:16px 44px 0 44px;">
      <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color:#fffbea;border-radius:12px;border:1px solid #f5b800;">
        <tr>
          <td style="padding:16px 22px;">
            <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
              <tr>
                <td width="32" valign="top" style="padding-top:2px;">
                  <div style="font-size:20px;line-height:22px;">⚠️</div>
                </td>
                <td style="padding-left:12px;font-family:Poppins,Arial,sans-serif;font-size:13px;font-weight:400;color:#7a5800;line-height:1.7;">
                  <strong style="font-weight:700;">Aten&#231;&#227;o:</strong> Guarde seus dados de acesso em local seguro. Recomendamos acessar o painel agora mesmo para iniciar o download dos seus recursos pedag&#243;gicos.
                  ${!isPremium ? "<br><br><strong style=\"font-weight:700;\">Dica:</strong> Se você desejar ter acesso aos Bônus Exclusivos e ao Certificado de Conclusão, você poderá realizar o upgrade para o Plano Premium diretamente no painel de membros!" : ""}
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </td>
  </tr>

  <!-- ▌BOTÃO CTA -->
  <tr>
    <td align="center" class="pad" style="padding:34px 44px 18px 44px;">
      <table role="presentation" cellspacing="0" cellpadding="0" border="0">
        <tr>
          <td style="border-radius:16px;background-color:#1a7a45;">
            <a href="https://geodinamicas.netlify.app/login" target="_blank" style="font-family:Poppins,Arial,sans-serif;font-size:16px;font-weight:700;color:#ffffff;text-decoration:none;display:inline-block;padding:20px 52px;border-radius:16px;letter-spacing:0.5px;">
              ACESSAR &#193;REA DE MEMBROS
            </a>
          </td>
        </tr>
      </table>
      <p style="margin:12px 0 0 0;font-family:Poppins,Arial,sans-serif;font-size:12px;font-weight:400;color:#5a8a6a;text-align:center;">
        Clique acima para entrar na sua &#225;rea exclusiva
      </p>
    </td>
  </tr>

  <!-- ▌SUPORTE WHATSAPP -->
  <tr>
    <td class="pad" style="padding:0 44px 40px 44px;">
      <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color:#063d20;border-radius:20px;">
        <tr>
          <td align="center" style="padding:30px 28px;">
            <img src="https://i.ibb.co/pBRJXzqT/image.png" alt="WhatsApp" width="44" height="44" style="display:block;margin:0 auto 14px auto;" />
            <p style="margin:0 0 4px 0;font-family:Poppins,Arial,sans-serif;font-size:11px;font-weight:700;color:#8dcfa8;text-transform:uppercase;letter-spacing:3px;">Suporte e D&#250;vidas</p>
            <p style="margin:0 0 18px 0;font-family:Poppins,Arial,sans-serif;font-size:14px;font-weight:400;color:#c8e6c9;line-height:1.7;">
              Fale com nossa equipe via WhatsApp &#8212; respondemos rapidamente!
            </p>
            <table role="presentation" cellspacing="0" cellpadding="0" border="0" align="center">
              <tr>
                <td style="background-color:#25D366;border-radius:60px;padding:14px 36px;">
                  <a href="https://wa.me/553799056159" target="_blank" style="font-family:Poppins,Arial,sans-serif;font-size:20px;font-weight:700;color:#ffffff;text-decoration:none;letter-spacing:2px;">
                    (37) 9905-6159
                  </a>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </td>
  </tr>

  <!-- ▌STRIPE FINAL -->
  <tr>
    <td style="padding:0;font-size:0;line-height:0;">
      <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
        <tr>
          <td width="25%" style="background-color:#063d20;height:7px;font-size:0;"></td>
          <td width="25%" style="background-color:#1a7a45;height:7px;font-size:0;"></td>
          <td width="25%" style="background-color:#f5b800;height:7px;font-size:0;"></td>
          <td width="25%" style="background-color:#1a7a45;height:7px;font-size:0;"></td>
        </tr>
      </table>
    </td>
  </tr>

  <!-- ▌FOOTER -->
  <tr>
    <td align="center" style="padding:22px 30px;background-color:#041f10;">
      <p style="margin:0 0 6px 0;font-family:Poppins,Arial,sans-serif;font-size:13px;font-weight:700;color:#f5b800;line-height:1.6;">
        GeoDin&#226;micas 650+ &copy; 2026
      </p>
      <p style="margin:0;font-family:Poppins,Arial,sans-serif;font-size:11px;font-weight:400;color:#4a7a5a;line-height:1.8;">
        Este e-mail &#233; autom&#225;tico. Por favor, n&#227;o responda diretamente.<br>
        Suporte via WhatsApp: <strong style="font-weight:700;color:#8dcfa8;">(37) 9905-6159</strong>
      </p>
    </td>
  </tr>

</table>

</td></tr>
</table>

</body>
</html>
      `;

      // Chamada HTTP para a API do Resend
      const resendResponse = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${resendApiKey}`,
        },
        body: JSON.stringify({
          from: "GeoDinâmicas 650+ <suporte@geodinamicas.hyzencompra.shop>",
          to: [email],
          subject: emailSubject,
          html: emailHtml,
        }),
      });

      const resendData = await resendResponse.json();
      if (!resendResponse.ok) {
        console.error("Erro retornado pelo Resend API:", resendData);
      } else {
        console.log("E-mail enviado com sucesso via Resend:", resendData);
      }
    } else {
      console.warn("Chave RESEND_API_KEY não configurada no Supabase. O e-mail de acesso não foi enviado.");
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: isNewUser ? "Membro cadastrado e acesso enviado" : "Acesso reenviado"
      }), 
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );

  } catch (err) {
    console.error("Erro no processamento do webhook:", err);
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  }
});
