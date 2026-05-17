import React from 'react';
import { motion } from 'motion/react';
import { Check, ArrowRight, ShieldCheck, Clock, Zap, Star, Gift } from 'lucide-react';

const CTAButton = ({ children, className = "", primary = true, onClick }: { children: React.ReactNode, className?: string, primary?: boolean, onClick?: () => void }) => (
  <motion.button
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    onClick={onClick}
    className={`px-8 py-4 rounded-full font-black text-lg shadow-xl transition-all cursor-pointer ${primary
      ? "bg-brand-green text-white shadow-green-500/20"
      : "bg-brand-yellow text-blue-900 shadow-yellow-500/20"
      } ${className}`}
  >
    {children}
  </motion.button>
);

export const BackRedirectPage = () => {
  const [timeLeft, setTimeLeft] = React.useState({ minutes: 0, seconds: 59 });

  React.useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.minutes === 0 && prev.seconds === 0) return prev;
        const totalSeconds = prev.minutes * 60 + prev.seconds - 1;
        return {
          minutes: Math.floor(totalSeconds / 60),
          seconds: totalSeconds % 60
        };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 font-sans selection:bg-brand-blue selection:text-white overflow-x-hidden">
      {/* Header Banner Fixed */}
      <div className="fixed top-0 left-0 w-full z-50 bg-red-600 text-white py-3 px-4 text-center font-black text-[10px] md:text-sm uppercase tracking-widest flex items-center justify-center gap-4 shadow-xl">
        <Zap size={16} className="text-brand-yellow animate-pulse" />
        OFERTA ÚNICA: VOCÊ TEM APENAS {timeLeft.minutes}:{String(timeLeft.seconds).padStart(2, '0')} PARA APROVEITAR!
        <Zap size={16} className="text-brand-yellow animate-pulse" />
      </div>

      <main className="container mx-auto px-6 pt-24 pb-12 md:pt-32 md:pb-20 max-w-6xl">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-block bg-brand-yellow text-blue-900 px-6 py-2 rounded-full font-black text-xs md:text-sm uppercase tracking-[0.2em] mb-6 shadow-lg"
          >
            LIBERAMOS O DESCONTO MÁXIMO
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-7xl font-black text-slate-900 leading-tight mb-6"
          >
            ESPERE! NÃO VÁ <span className="text-red-600 italic">AINDA...</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg md:text-2xl text-slate-500 font-medium max-w-3xl mx-auto"
          >
            Sabemos que você quer transformar suas aulas. Por isso, liberamos uma <span className="text-brand-blue font-black">oferta relâmpago</span> válida apenas agora.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 max-w-5xl mx-auto items-center">
          {/* Básico Card */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-xl border border-slate-100 flex flex-col relative overflow-hidden group"
          >
            <div className="absolute top-0 left-0 w-full h-2 bg-slate-200"></div>
            <div className="mb-8">
              <h3 className="text-lg md:text-xl font-black text-slate-400 uppercase tracking-widest mb-4">PLANO BÁSICO</h3>
              <p className="text-slate-400 font-bold text-[10px] uppercase mb-1">Pagamento Único</p>
              <div className="flex items-start gap-1">
                <span className="text-lg md:text-xl font-black text-slate-900 mt-2">R$</span>
                <span className="text-7xl md:text-8xl font-black text-slate-900 tracking-tighter leading-none">7</span>
                <div className="flex flex-col items-start mt-3">
                  <span className="text-xl md:text-2xl font-black text-slate-900 leading-none">,90</span>
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">ÚNICA VEZ</span>
                </div>
              </div>
            </div>

            <ul className="space-y-4 mb-8 flex-1">
              {[
                "Mais de 650 Dinâmicas Interativas em PDF",
                "Acesso Vitalício",
                "Área de Membros Exclusiva",
                "Materiais em PDF Prontos para Imprimir e Aplicar",
                "Conteúdos Organizados e Alinhados à BNCC",
                "Garantia Incondicional de 7 Dias",
                "Suporte Especializado"
              ].map((f, i) => (
                <li key={i} className="flex items-center gap-3 text-slate-600 font-bold text-sm">
                  <Check size={18} className="text-brand-green" strokeWidth={3} />
                  {f}
                </li>
              ))}
            </ul>

            <div className="flex items-center justify-center mb-6">
              <img src="https://i.ibb.co/p6fDZsTv/LOGO.png" alt="Garantia e Segurança" className="h-14 md:h-16 object-contain" />
            </div>

            <CTAButton 
              primary={false} 
              className="w-full bg-slate-900 text-white hover:bg-slate-800"
              onClick={() => window.location.href = 'https://ggcheckout.app/checkout/v5/WBAu8C4BpW2gCcwyc1Kx'}
            >
              QUERO O BÁSICO
            </CTAButton>
          </motion.div>

          {/* Premium Card */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-[3rem] p-8 md:p-12 shadow-2xl border-[6px] border-brand-blue flex flex-col relative overflow-hidden scale-105 z-10"
          >
            <div className="absolute top-0 left-0 w-full bg-brand-blue text-white py-2 text-center font-black text-[10px] uppercase tracking-[0.2em]">
              O MAIS ESCOLHIDO
            </div>
            
            <div className="mb-8 mt-4 flex flex-col items-center">
              <h3 className="text-2xl md:text-4xl font-black mb-4 text-brand-blue uppercase tracking-widest text-center">PLANO PREMIUM</h3>
              <p className="text-slate-300 line-through font-bold text-sm md:text-base mb-1">De R$ 27,90 por</p>
              <div className="flex items-start gap-1">
                <span className="text-xl md:text-2xl font-black text-brand-blue mt-2 md:mt-3">R$</span>
                <span className="text-8xl md:text-9xl font-black text-brand-blue tracking-tighter leading-none">15</span>
                <div className="flex flex-col items-start mt-3 md:mt-5">
                  <span className="text-2xl md:text-3xl font-black text-brand-blue leading-none">,90</span>
                  <span className="text-[12px] md:text-[14px] font-black text-brand-green uppercase tracking-tighter animate-pulse">VITALÍCIO</span>
                </div>
              </div>
            </div>

            {/* Product Mockup Image */}
            <div className="my-1 relative flex items-center justify-center h-40 md:h-48">
              <img src="https://i.ibb.co/NndnrgrG/image-Photoroom.png" alt="Premium Pack" className="w-48 h-48 md:w-60 md:h-60 object-contain drop-shadow-2xl z-20" />
            </div>

            <ul className="space-y-4 mb-8 flex-1">
              {[
                "Tudo do Plano Básico",
                "Acesso Vitalício + Atualizações Mensais",
                "Suporte Premium",
                "Certificado de Conclusão",
                "100 Avaliações de Geografia Bônus",
                "Guia Professor de Elite Bônus",
                "Planos de Aula Alinhados à BNCC Bônus",
                "Planejamento Anual Bônus",
                "Mapas Premium em Alta Qualidade Bônus"
              ].map((f, i) => (
                <li key={i} className="flex items-center gap-3 text-slate-900 font-black text-sm">
                  <div className="w-5 h-5 rounded-full bg-brand-green flex items-center justify-center">
                    {f.includes("Bônus") ? (
                      <Gift size={12} className="text-white" strokeWidth={3} />
                    ) : (
                      <Check size={12} className="text-white" strokeWidth={4} />
                    )}
                  </div>
                  {f}
                </li>
              ))}
            </ul>

            <div className="flex items-center justify-center mb-6">
              <img src="https://i.ibb.co/p6fDZsTv/LOGO.png" alt="Garantia e Segurança" className="h-14 md:h-16 object-contain" />
            </div>

            <CTAButton 
              className="w-full flex items-center justify-center gap-2 animate-bounce"
              onClick={() => window.location.href = 'https://ggcheckout.app/checkout/v5/AxvtCYnUuU6DCqhaJqjS'}
            >
              QUERO O PREMIUM <ArrowRight size={20} />
            </CTAButton>
          </motion.div>
        </div>

        {/* Security / Guarantee */}
        <div className="mt-24 flex flex-col md:flex-row items-center justify-center gap-12 border-t border-slate-200 pt-16">
          <div className="flex items-center gap-4 text-left max-w-sm">
            <div className="w-16 h-16 bg-brand-green/10 rounded-2xl flex items-center justify-center text-brand-green shrink-0">
              <ShieldCheck size={32} />
            </div>
            <div>
              <h4 className="font-black text-slate-900 text-lg uppercase leading-none mb-2">Compra 100% Segura</h4>
              <p className="text-slate-500 font-medium text-sm">Seu acesso é liberado imediatamente após o pagamento.</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4 text-left max-w-sm">
            <div className="w-16 h-16 bg-brand-yellow/10 rounded-2xl flex items-center justify-center text-brand-yellow shrink-0">
              <Clock size={32} />
            </div>
            <div>
              <h4 className="font-black text-slate-900 text-lg uppercase leading-none mb-2">7 Dias de Garantia</h4>
              <p className="text-slate-500 font-medium text-sm">Satisfação garantida ou seu dinheiro de volta sem perguntas.</p>
            </div>
          </div>
        </div>

        <div className="mt-16 text-center text-slate-400 font-bold text-xs uppercase tracking-widest flex flex-col items-center gap-8">
          <div>
            MILHARES DE PROFESSORES JÁ TRANSFORMARAM SUAS AULAS
          </div>
          <img src="https://i.ibb.co/m5GppDf3/image.png" alt="Geografia na Prática" className="h-20 md:h-24 object-contain" />
        </div>
      </main>

      {/* WhatsApp Floating Button */}
      <motion.a
        href="https://wa.me/553799056159"
        target="_blank"
        rel="noopener noreferrer"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        whileHover={{ scale: 1.1 }}
        className="fixed bottom-6 right-6 z-50 cursor-pointer group flex items-center justify-center"
      >
        <motion.div
          animate={{ scale: [1, 1.4, 1], opacity: [0.4, 0, 0.4] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="absolute inset-0 bg-[#25D366] rounded-full -z-10"
        />
        <img src="https://i.ibb.co/pBRJXzqT/image.png" alt="WhatsApp" className="w-16 h-16 md:w-20 md:h-20 object-contain" />
        <div className="absolute right-full mr-4 top-1/2 -translate-y-1/2 bg-slate-900 text-white px-4 py-2 rounded-xl text-sm font-bold shadow-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
          Dúvidas? Fale conosco
        </div>
      </motion.a>
    </div>
  );
};
