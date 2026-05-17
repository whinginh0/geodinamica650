import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  LayoutDashboard,
  BookOpen,
  Award,
  Gift,
  PlusCircle,
  LogOut,
  Download,
  ExternalLink,
  ChevronRight,
  Star,
  Zap,
  CheckCircle2,
  FileText,
  X,
  Eye,
  Menu,
  Lock
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Certificate } from './Certificate';
import confetti from 'canvas-confetti';

const PDFModal = ({ isOpen, onClose, title, pdfUrl }: { isOpen: boolean, onClose: () => void, title: string, pdfUrl: string }) => (
  <AnimatePresence>
    {isOpen && (
      <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 md:p-8">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm"
          onClick={onClose}
        ></motion.div>
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="relative bg-white rounded-[2rem] w-full max-w-5xl h-full flex flex-col overflow-hidden shadow-2xl"
        >
          <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-white sticky top-0 z-10">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-brand-blue/10 rounded-xl flex items-center justify-center text-brand-blue">
                <FileText size={20} />
              </div>
              <h3 className="text-xl font-black text-slate-900">{title}</h3>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400 hover:text-slate-600"
            >
              <X size={24} />
            </button>
          </div>
          <div className="flex-1 bg-slate-100 p-4 overflow-hidden">
            <iframe
              src={`${pdfUrl}#toolbar=0`}
              className="w-full h-full rounded-xl border-none shadow-inner"
              title={title}
            />
          </div>
          <div className="p-4 bg-slate-50 flex justify-end gap-4">
            <button
              onClick={onClose}
              className="px-6 py-2 rounded-xl font-bold text-slate-500 hover:text-slate-700 transition-colors"
            >
              Fechar
            </button>
            <button className="bg-brand-blue text-white px-8 py-2 rounded-xl font-black flex items-center gap-2 shadow-lg shadow-blue-500/20">
              <Download size={18} /> DOWNLOAD PDF
            </button>
          </div>
        </motion.div>
      </div>
    )}
  </AnimatePresence>
);

interface DashboardProps {
  onLogout: () => void;
  activeTab: string;
}

export const Dashboard: React.FC<DashboardProps> = ({ onLogout, activeTab }) => {
  const navigate = useNavigate();
  const [userName] = useState(() => {
    const session = localStorage.getItem('member_session');
    if (session) {
      try {
        const parsed = JSON.parse(session);
        return parsed.name || 'Professor(a)';
      } catch (e) {
        return 'Professor(a)';
      }
    }
    return 'Professor(a)';
  });
  const [userPlan] = useState(() => {
    const session = localStorage.getItem('member_session');
    if (session) {
      try {
        const parsed = JSON.parse(session);
        return parsed.plan || 'basic';
      } catch (e) {
        return 'basic';
      }
    }
    return 'basic';
  });

  const [completedItems, setCompletedItems] = useState<string[]>(() => {
    const session = localStorage.getItem('member_session');
    if (session) {
      try {
        const parsed = JSON.parse(session);
        const email = parsed.email || 'guest';
        const saved = localStorage.getItem(`progress_${email}`);
        return saved ? JSON.parse(saved) : [];
      } catch (e) {
        return [];
      }
    }
    return [];
  });

  React.useEffect(() => {
    const session = localStorage.getItem('member_session');
    if (session) {
      try {
        const parsed = JSON.parse(session);
        const email = parsed.email || 'guest';
        localStorage.setItem(`progress_${email}`, JSON.stringify(completedItems));
      } catch (e) {
        console.error("Erro ao salvar progresso:", e);
      }
    }
  }, [completedItems]);

  const [isPdfModalOpen, setIsPdfModalOpen] = useState(false);
  const [selectedPdf, setSelectedPdf] = useState({ title: '', url: '' });
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isPromoModalOpen, setIsPromoModalOpen] = useState(() => {
    return !localStorage.getItem('promo_seen');
  });

  const closePromo = () => {
    setIsPromoModalOpen(false);
    localStorage.setItem('promo_seen', 'true');
  };

  const tabs = [
    { id: 'principal', label: 'Principal', icon: LayoutDashboard },
    { id: 'dinamicas', label: 'Dinâmicas', icon: BookOpen },
    { id: 'certificado', label: 'Certificado', icon: Award, locked: userPlan === 'basic' },
    { id: 'bonus', label: 'Bônus', icon: Gift, locked: userPlan === 'basic' },
    { id: 'adicionais', label: 'Adicionais', icon: PlusCircle },
  ];

  const dinamicasItems: string[] = ["GeoDinâmicas 650+ – Atividades Interativas de Geografia"];

  const bonusItems: string[] = [
    "100 Avaliações de Geografia – Diagnósticas, Bimestrais e Práticas (Alinhadas à BNCC)",
    "Guia Professor de Elite – Metodologias Ativas para Aulas de Geografia (Alinhado à BNCC)",
    "Planos de Aula BNCC – Planejamento Completo de Geografia para o Ano Letivo",
    "Planejamento Anual de Geografia – Calendário Letivo Estruturado e Alinhado à BNCC",
    "Mapas Premium em Alta – Coleção Completa de Mapas de Geografia (Alta Definição)"
  ];

  const allRequiredItems = [...dinamicasItems, ...bonusItems];
  const progressPercent = allRequiredItems.length > 0
    ? Math.round((completedItems.length / allRequiredItems.length) * 100)
    : 0;

  const toggleComplete = (title: string) => {
    if (completedItems.includes(title)) {
      setCompletedItems(prev => prev.filter(item => item !== title));
    } else {
      setCompletedItems(prev => [...prev, title]);

      // Celebration!
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#005dff', '#00ce0a', '#ffcc00']
      });
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'principal':
        return (
          <div className="space-y-8">
            <AnimatePresence>
              {isPromoModalOpen && (
                <div className="fixed inset-0 w-screen h-screen z-[300] flex items-center justify-center p-4">
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-slate-900/60 backdrop-blur-[5px]"
                    onClick={closePromo}
                  />
                  <motion.div
                    initial={{ scale: 0.9, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.9, opacity: 0, y: 20 }}
                    className="relative bg-white rounded-[2rem] md:rounded-[2.5rem] p-6 md:p-8 max-w-md w-full shadow-[0_0_80px_rgba(0,0,0,0.3)] text-center overflow-hidden border-[4px] border-brand-yellow"
                  >
                    <div className="absolute top-0 left-0 w-full h-1.5 bg-brand-yellow"></div>
                    <div className="inline-block bg-brand-yellow text-blue-900 px-4 py-1 rounded-full font-black text-[9px] md:text-[10px] uppercase tracking-widest mb-4">
                      OFERTA ÚNICA E EXCLUSIVA
                    </div>

                    <h2 className="text-xl md:text-2xl font-black text-slate-900 mb-3 leading-tight uppercase">Turbine Suas Aulas!</h2>
                    <p className="text-slate-500 font-bold text-xs md:text-sm mb-6 leading-relaxed px-2">
                      Sabia que você pode adicionar materiais extras exclusivos como o <span className="text-brand-blue font-black">Pack Gospel</span> e <span className="text-brand-blue font-bold">Educação Inclusiva</span> à sua biblioteca?
                    </p>

                    <div className="flex flex-col gap-3">
                      <button
                        onClick={() => {
                          closePromo();
                          navigate('/dinamicas');
                        }}
                        className="w-full bg-brand-blue text-white py-4 rounded-2xl font-black shadow-xl shadow-blue-500/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3"
                      >
                        ACESSAR DINÂMICAS <ChevronRight size={18} />
                      </button>
                      <button
                        onClick={() => {
                          closePromo();
                          navigate('/adicionais');
                        }}
                        className="text-slate-400 font-bold text-[10px] md:text-xs underline underline-offset-4 hover:text-slate-600 transition-colors"
                      >
                        Não, quero ver os adicionais depois.
                      </button>
                    </div>
                  </motion.div>
                </div>
              )}
            </AnimatePresence>
            <div className="bg-brand-gradient rounded-[2.5rem] p-8 md:p-12 text-white relative overflow-hidden">
              <div className="relative z-10">
                <h2 className="text-3xl md:text-5xl font-black mb-4">Bem-vindo(a), {userName.split(' ')[0]}!</h2>
                <p className="text-blue-100 text-lg max-w-xl font-medium">
                  Você está a um passo de transformar suas aulas de geografia. Acesse o material completo abaixo.
                </p>
                <div className="flex flex-wrap gap-4 mt-8">
                  <div className="bg-white/10 backdrop-blur-md px-6 py-3 rounded-2xl border border-white/20 flex items-center gap-3">
                    <CheckCircle2 size={20} className="text-brand-yellow" />
                    <span className="font-bold">650+ Atividades</span>
                  </div>
                  <div className="bg-white/10 backdrop-blur-md px-6 py-3 rounded-2xl border border-white/20 flex items-center gap-3">
                    <Zap size={20} className="text-brand-yellow" />
                    <span className="font-bold">Acesso Vitalício</span>
                  </div>
                </div>
              </div>
              <div className="absolute right-0 bottom-0 opacity-20 pointer-events-none translate-x-10 translate-y-10">
                <img src="https://i.ibb.co/Cp70DWgL/image.png" alt="Planet" className="w-80 h-80" />
              </div>
            </div>

            {/* Simplified CTA - Adicionais */}
            <div className="bg-white p-6 rounded-[2rem] shadow-md border border-slate-100 flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4 text-center md:text-left">
                <div className="w-12 h-12 bg-brand-yellow/10 text-brand-yellow rounded-xl flex items-center justify-center shrink-0">
                  <Star size={24} />
                </div>
                <div>
                  <h3 className="font-black text-slate-900">Produtos Complementares</h3>
                  <p className="text-slate-500 text-sm font-medium">Explore materiais extras para potencializar suas aulas.</p>
                </div>
              </div>
              <button
                onClick={() => navigate('/adicionais')}
                className="bg-brand-blue text-white px-8 py-3 rounded-xl font-black text-xs uppercase tracking-wider hover:scale-105 transition-all shadow-lg shadow-blue-500/20 whitespace-nowrap"
              >
                Ver Adicionais
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-8 rounded-[2rem] shadow-xl border border-slate-100 flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-blue-50 text-brand-blue rounded-2xl flex items-center justify-center mb-6">
                  <BookOpen size={32} />
                </div>
                <h3 className="text-xl font-black mb-2">Suas Dinâmicas</h3>
                <p className="text-slate-500 font-medium text-sm mb-6">Acesse o banco de dados completo com 650+ atividades.</p>
                <button onClick={() => navigate('/dinamicas')} className="w-full bg-slate-50 text-slate-900 py-3 rounded-xl font-black hover:bg-slate-100 transition-all flex items-center justify-center gap-2">
                  ACESSAR AGORA <ChevronRight size={18} />
                </button>
              </div>

              <div className="bg-white p-8 rounded-[2rem] shadow-xl border border-slate-100 flex flex-col items-center text-center relative overflow-hidden">
                {userPlan === 'basic' && (
                  <div className="absolute top-4 right-4 text-slate-400">
                    <Lock size={18} />
                  </div>
                )}
                <div className="w-16 h-16 bg-yellow-50 text-brand-yellow rounded-2xl flex items-center justify-center mb-6">
                  <Award size={32} />
                </div>
                <h3 className="text-xl font-black mb-2">Certificado</h3>
                <p className="text-slate-500 font-medium text-sm mb-6">Emita seu certificado de conclusão.</p>
                <button 
                  onClick={() => {
                    if (userPlan === 'basic') return;
                    navigate('/certificado');
                  }} 
                  className={`w-full py-3 rounded-xl font-black transition-all flex items-center justify-center gap-2 ${
                    userPlan === 'basic' 
                      ? 'bg-slate-100 text-slate-400 cursor-not-allowed' 
                      : 'bg-slate-50 text-slate-900 hover:bg-slate-100'
                  }`}
                  disabled={userPlan === 'basic'}
                >
                  {userPlan === 'basic' ? (
                    <>BLOQUEADO <Lock size={16} /></>
                  ) : (
                    <>EMITIR AGORA <ChevronRight size={18} /></>
                  )}
                </button>
              </div>

              <div className="bg-white p-8 rounded-[2rem] shadow-xl border border-slate-100 flex flex-col items-center text-center relative overflow-hidden">
                {userPlan === 'basic' && (
                  <div className="absolute top-4 right-4 text-slate-400">
                    <Lock size={18} />
                  </div>
                )}
                <div className="w-16 h-16 bg-green-50 text-brand-green rounded-2xl flex items-center justify-center mb-6">
                  <Gift size={32} />
                </div>
                <h3 className="text-xl font-black mb-2">Seus Bônus</h3>
                <p className="text-slate-500 font-medium text-sm mb-6">Materiais extras, guias e planejamentos anuais.</p>
                <button 
                  onClick={() => {
                    if (userPlan === 'basic') return;
                    navigate('/bonus');
                  }} 
                  className={`w-full py-3 rounded-xl font-black transition-all flex items-center justify-center gap-2 ${
                    userPlan === 'basic' 
                      ? 'bg-slate-100 text-slate-400 cursor-not-allowed' 
                      : 'bg-slate-50 text-slate-900 hover:bg-slate-100'
                  }`}
                  disabled={userPlan === 'basic'}
                >
                  {userPlan === 'basic' ? (
                    <>BLOQUEADO <Lock size={16} /></>
                  ) : (
                    <>VER BÔNUS <ChevronRight size={18} /></>
                  )}
                </button>
              </div>
            </div>
          </div>
        );
      case 'dinamicas':
        return (
          <div className="space-y-8">
            <div className="flex flex-col md:flex-row items-end justify-between gap-4">
              <div>
                <h2 className="text-3xl font-black text-slate-900 mb-2">Banco de Dinâmicas</h2>
                <p className="text-slate-500 font-medium">Todos os PDFs organizados por tema e nível de ensino.</p>
              </div>
              <div className="flex bg-white p-1.5 rounded-2xl border border-slate-200 shadow-sm">
                <button className="px-6 py-2 bg-brand-blue text-white rounded-xl font-black text-xs uppercase tracking-widest">Todos</button>
                <button className="px-6 py-2 text-slate-400 rounded-xl font-black text-xs uppercase tracking-widest hover:text-slate-600">Fundamental</button>
                <button className="px-6 py-2 text-slate-400 rounded-xl font-black text-xs uppercase tracking-widest hover:text-slate-600">Médio</button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  title: "GeoDinâmicas 650+ – Atividades Interativas de Geografia",
                  items: "650+ Atividades",
                  color: "blue",
                  url: "/GeoDinamicas_650plus.pdf",
                  banner: "https://i.ibb.co/99Lj2WM1/image.png"
                },
              ].map((item: any, i) => (

                <div key={i} className="bg-white rounded-[2rem] overflow-hidden shadow-lg border border-slate-100 group hover:border-brand-blue/30 transition-all flex flex-col h-full">
                  {/* Card Banner */}
                  <div className="relative h-40 overflow-hidden">
                    <img src={item.banner} alt={item.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent" />
                    <div className={`absolute top-3 right-3 w-10 h-10 bg-white/90 rounded-xl flex items-center justify-center`}>
                      <FileText className={`text-brand-${item.color}`} size={20} />
                    </div>
                  </div>
                  <div className="p-5 flex flex-col flex-1">
                    <h3 className="text-base font-black mb-2 flex-1">{item.title}</h3>
                    <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-50">
                      <div className="flex flex-col">
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{item.items}</span>
                        {completedItems.includes(item.title) && (
                          <span className="text-[10px] font-black text-brand-green flex items-center gap-1">
                            <CheckCircle2 size={10} /> CONCLUÍDO
                          </span>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => toggleComplete(item.title)}
                          className={`p-2.5 rounded-xl transition-all border ${completedItems.includes(item.title)
                              ? 'bg-brand-green/10 border-brand-green text-brand-green'
                              : 'bg-slate-50 border-slate-100 text-slate-400 hover:text-brand-green hover:border-brand-green'
                            }`}
                        >
                          <CheckCircle2 size={18} />
                        </button>
                        <button
                          onClick={() => {
                            setSelectedPdf({ title: item.title, url: item.url });
                            setIsPdfModalOpen(true);
                          }}
                          className="bg-slate-50 text-slate-600 p-2.5 rounded-xl hover:bg-brand-blue hover:text-white transition-all flex items-center gap-2 text-xs font-bold"
                        >
                          <Eye size={16} /> ABRIR
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      case 'certificado':
        if (userPlan === 'basic') {
          return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-6 bg-white rounded-[2.5rem] shadow-xl border border-slate-100 max-w-3xl mx-auto overflow-hidden relative">
              <div className="absolute top-[-10%] left-[-10%] w-[30%] h-[30%] bg-brand-yellow/5 rounded-full blur-3xl pointer-events-none"></div>
              <div className="w-20 h-20 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mb-6 relative">
                <Award size={40} />
                <div className="absolute -top-1 -right-1 bg-brand-yellow text-slate-900 w-8 h-8 rounded-full flex items-center justify-center border-4 border-white">
                  <Lock size={14} />
                </div>
              </div>
              <h2 className="text-3xl font-black text-slate-900 mb-4 uppercase">Certificado Bloqueado</h2>
              <p className="text-slate-500 font-bold max-w-lg mb-8 leading-relaxed">
                O certificado de conclusão é exclusivo para alunos do <span className="text-brand-green font-black">Plano Premium</span>. 
                No seu plano <span className="text-brand-blue font-black">Básico</span>, esta opção não está disponível.
              </p>
              
              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 mb-10 max-w-md w-full flex items-center gap-4 text-left">
                <div className="w-12 h-12 bg-brand-yellow/10 rounded-xl flex items-center justify-center text-brand-yellow shrink-0">
                  <Star size={24} />
                </div>
                <div>
                  <h4 className="font-black text-slate-900 text-sm">Por que o Premium?</h4>
                  <p className="text-slate-500 text-xs font-bold leading-normal mt-1">O Certificado Premium é reconhecido nacionalmente, válido para progressão de carreira e atividades complementares.</p>
                </div>
              </div>
              
              <button
                onClick={() => window.open('https://wa.me/553799056159?text=Quero+fazer+o+upgrade+para+o+Plano+Premium+para+liberar+o+certificado', '_blank')}
                className="bg-brand-green text-white px-10 py-4 rounded-2xl font-black shadow-lg shadow-green-500/20 hover:scale-[1.03] transition-all flex items-center gap-2"
              >
                FAZER UPGRADE PARA PREMIUM <Zap size={18} className="text-brand-yellow" />
              </button>
            </div>
          );
        }
        if (userPlan === 'premium' && progressPercent < 100) {
          return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-6">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="w-24 h-24 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mb-8 relative"
              >
                <Star size={48} />
                <div className="absolute -top-1 -right-1 bg-brand-blue text-white w-10 h-10 rounded-full flex items-center justify-center border-4 border-white">
                  <Zap size={20} />
                </div>
              </motion.div>

              <h2 className="text-3xl font-black text-slate-900 mb-4">Certificado Bloqueado</h2>
              <p className="text-slate-500 font-medium max-w-md mx-auto mb-10">
                Você precisa concluir todos os conteúdos de Dinâmicas e Bônus para emitir seu certificado de conclusão.
              </p>

              <div className="w-full max-w-md bg-white p-8 rounded-[2rem] shadow-xl border border-slate-100">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm font-black text-slate-900 uppercase tracking-widest">Seu Progresso</span>
                  <span className="text-2xl font-black text-brand-blue">{progressPercent}%</span>
                </div>
                <div className="w-full h-4 bg-slate-100 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progressPercent}%` }}
                    className="h-full bg-brand-gradient"
                  />
                </div>
                <p className="mt-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  Faltam {allRequiredItems.length - completedItems.length} materiais para concluir
                </p>
              </div>

              <button
                onClick={() => navigate('/dinamicas')}
                className="mt-12 bg-brand-blue text-white px-10 py-4 rounded-2xl font-black shadow-lg shadow-blue-500/20 hover:scale-105 transition-all"
              >
                CONTINUAR ESTUDANDO
              </button>
            </div>
          );
        }
        return <Certificate userName={userName} completionDate={new Date().toLocaleDateString('pt-BR')} />;
      case 'bonus':
        if (userPlan === 'basic') {
          return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-6 bg-white rounded-[2.5rem] shadow-xl border border-slate-100 max-w-3xl mx-auto overflow-hidden relative">
              <div className="absolute top-[-10%] left-[-10%] w-[30%] h-[30%] bg-brand-green/5 rounded-full blur-3xl pointer-events-none"></div>
              <div className="w-20 h-20 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mb-6 relative">
                <Gift size={40} />
                <div className="absolute -top-1 -right-1 bg-brand-yellow text-slate-900 w-8 h-8 rounded-full flex items-center justify-center border-4 border-white">
                  <Lock size={14} />
                </div>
              </div>
              <h2 className="text-3xl font-black text-slate-900 mb-4 uppercase">Bônus Exclusivos Bloqueados</h2>
              <p className="text-slate-500 font-bold max-w-lg mb-8 leading-relaxed">
                Ops! O seu plano atual é o <span className="text-brand-blue font-black">Básico</span>, que inclui apenas a dinâmica principal. 
                Faça o upgrade agora para o <span className="text-brand-green font-black">Plano Premium</span> e libere imediatamente:
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left max-w-xl mb-10">
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex items-center gap-3">
                  <CheckCircle2 size={18} className="text-brand-green shrink-0" />
                  <span className="text-xs font-bold text-slate-700">100 Avaliações Alinhadas à BNCC</span>
                </div>
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex items-center gap-3">
                  <CheckCircle2 size={18} className="text-brand-green shrink-0" />
                  <span className="text-xs font-bold text-slate-700">Guia Professor de Elite (Metodologias)</span>
                </div>
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex items-center gap-3">
                  <CheckCircle2 size={18} className="text-brand-green shrink-0" />
                  <span className="text-xs font-bold text-slate-700">Planos de Aula BNCC Completos</span>
                </div>
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex items-center gap-3">
                  <CheckCircle2 size={18} className="text-brand-green shrink-0" />
                  <span className="text-xs font-bold text-slate-700">Certificado de Conclusão Incluso</span>
                </div>
              </div>
              
              <button
                onClick={() => window.open('https://wa.me/553799056159?text=Quero+fazer+o+upgrade+para+o+Plano+Premium', '_blank')}
                className="bg-brand-green text-white px-10 py-4 rounded-2xl font-black shadow-lg shadow-green-500/20 hover:scale-[1.03] transition-all flex items-center gap-2"
              >
                FAZER UPGRADE PARA PREMIUM <Zap size={18} className="text-brand-yellow" />
              </button>
            </div>
          );
        }
        return (
          <div className="space-y-8">
            <div>
              <h2 className="text-3xl font-black text-slate-900 mb-2">Seus Bônus Exclusivos</h2>
              <p className="text-slate-500 font-medium">Materiais extras liberados para você.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  title: "100 Avaliações de Geografia – Diagnósticas, Bimestrais e Práticas (Alinhadas à BNCC)",
                  desc: "Avaliações prontas para imprimir, organizadas por nível e tema.",
                  color: "blue",
                  url: "/100_Avaliacoes_Geografia_BNCC_nova_capa (1).pdf",
                  banner: "https://i.ibb.co/tTZm6yKn/image.png"
                },
                {
                  title: "Guia Professor de Elite – Metodologias Ativas para Aulas de Geografia (Alinhado à BNCC)",
                  desc: "Domine as metodologias ativas e engaje seus alunos como nunca.",
                  color: "green",
                  url: "/Guia_Professor_Elite_Metodologias_Ativas_Geografia (1).pdf",
                  banner: "https://i.ibb.co/7xdxvPMH/image.png"
                },
                {
                  title: "Planos de Aula BNCC – Planejamento Completo de Geografia para o Ano Letivo",
                  desc: "Planejamento completo para o ano todo, 100% alinhado às competências da BNCC.",
                  color: "yellow",
                  url: "/Planos_de_Aula_BNCC_Geografia.pdf",
                  banner: "https://i.ibb.co/XrRfKLyT/image.png"
                },
                {
                  title: "Planejamento Anual de Geografia – Calendário Letivo Estruturado e Alinhado à BNCC",
                  desc: "Calendário letivo estruturado por datas e temas, pronto para adaptar à sua escola.",
                  color: "blue",
                  url: "/Planejamento_Anual_Geografia_BNCC.pdf",
                  banner: "https://i.ibb.co/FqdKRJ7x/image.png"
                },
                {
                  title: "Mapas Premium em Alta – Coleção Completa de Mapas de Geografia (Alta Definição)",
                  desc: "Coleção exclusiva de mapas temáticos em alta definição para imprimir ou projetar.",
                  color: "yellow",
                  url: "/Mapas_Premium_em_Alta_GeoDinamicas.pdf",
                  banner: "https://i.ibb.co/nqpFrq77/image.png"
                },
              ].map((bonus: any, i) => (
                <div key={i} className="bg-white rounded-[2rem] overflow-hidden shadow-lg border border-slate-100 group hover:border-brand-green/30 transition-all flex flex-col h-full">
                  {/* Card Banner */}
                  <div className="relative h-40 overflow-hidden">
                    <img src={bonus.banner} alt={bonus.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent" />
                    <div className="absolute top-3 right-3 bg-brand-yellow/90 text-slate-900 px-2 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest">LIBERADO</div>
                    <div className={`absolute top-3 left-3 w-10 h-10 bg-white/90 rounded-xl flex items-center justify-center`}>
                      <Gift className={`text-brand-${bonus.color}`} size={20} />
                    </div>
                  </div>
                  <div className="p-5 flex flex-col flex-1">
                    <h3 className="text-base font-black mb-1 flex-1">{bonus.title}</h3>
                    <p className="text-slate-500 font-medium text-xs mb-4">{bonus.desc}</p>
                    <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-50">
                      <div className="flex flex-col">
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">PDF</span>
                        {completedItems.includes(bonus.title) && (
                          <span className="text-[10px] font-black text-brand-green flex items-center gap-1">
                            <CheckCircle2 size={10} /> CONCLUÍDO
                          </span>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => toggleComplete(bonus.title)}
                          className={`p-2.5 rounded-xl transition-all border ${completedItems.includes(bonus.title)
                              ? 'bg-brand-green/10 border-brand-green text-brand-green'
                              : 'bg-slate-50 border-slate-100 text-slate-400 hover:text-brand-green hover:border-brand-green'
                            }`}
                        >
                          <CheckCircle2 size={18} />
                        </button>
                        <button
                          onClick={() => {
                            setSelectedPdf({ title: bonus.title, url: bonus.url });
                            setIsPdfModalOpen(true);
                          }}
                          className="bg-slate-50 text-slate-600 p-2.5 rounded-xl hover:bg-brand-blue hover:text-white transition-all flex items-center gap-2 text-xs font-bold"
                        >
                          <Eye size={16} /> ABRIR
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      case 'adicionais':
        return (
          <div className="space-y-8">
            <div>
              <h2 className="text-3xl font-black text-slate-900 mb-2">Produtos Complementares</h2>
              <p className="text-slate-500 font-medium">Expanda seu material com pacotes adicionais exclusivos.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[].map((item: any, i) => (
                <div key={i} className="bg-white rounded-[2rem] overflow-hidden shadow-xl border border-slate-100 group hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 flex flex-col h-full">
                  <div className="relative h-48 overflow-hidden">
                    <img src={item.banner} alt={item.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                    <div className={`absolute inset-0 bg-gradient-to-t ${item.gradient} opacity-50`} />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent" />
                    <div className="absolute top-3 left-3 bg-brand-yellow text-slate-900 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg">
                      {item.badge}
                    </div>
                    <div className="absolute bottom-3 left-4">
                      <h3 className="text-white font-black text-lg leading-tight drop-shadow-lg">{item.title}</h3>
                    </div>
                  </div>
                  <div className="p-5 flex flex-col flex-1">
                    <p className="text-slate-500 font-medium text-sm mb-4 flex-1">{item.desc}</p>
                    <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                      <div className="text-brand-green font-black text-2xl">{item.price}</div>
                      <button
                        onClick={() => window.open(item.url, '_blank')}
                        className="bg-brand-blue text-white px-5 py-2.5 rounded-xl font-black text-xs uppercase tracking-wider hover:scale-105 transition-all shadow-lg shadow-blue-500/20 flex items-center gap-2"
                      >
                        COMPRAR <ExternalLink size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              <div className="bg-gradient-to-br from-slate-100 to-slate-50 rounded-[2rem] border-2 border-dashed border-slate-200 flex flex-col items-center justify-center p-8 text-center min-h-[300px] group hover:border-brand-blue/40 transition-all">
                <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mb-4 shadow-md">
                  <PlusCircle size={28} className="text-slate-300" />
                </div>
                <p className="text-slate-400 font-bold text-sm">Mais produtos em breve</p>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
      {/* Sidebar - Desktop */}
      <aside className="hidden md:flex flex-col w-72 bg-white border-r border-slate-200 p-8 fixed h-screen no-print">
        <div className="mb-12 flex justify-center">
          <img src="https://i.ibb.co/m5GppDf3/image.png" alt="Logo" className="h-16 md:h-20 object-contain scale-125" />
        </div>

        <nav className="flex-1 space-y-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                if (tab.locked) return;
                navigate(`/${tab.id}`);
              }}
              className={`w-full flex items-center justify-between px-6 py-4 rounded-2xl font-black text-sm uppercase tracking-wider transition-all ${
                tab.locked
                  ? 'text-slate-400 cursor-not-allowed'
                  : activeTab === tab.id
                    ? 'bg-brand-blue text-white shadow-lg shadow-blue-500/20 translate-x-2'
                    : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'
              }`}
              disabled={tab.locked}
            >
              <div className="flex items-center gap-4">
                <tab.icon size={20} />
                <span>{tab.label}</span>
              </div>
              {tab.locked && (
                <Lock size={16} className="text-slate-400 shrink-0" />
              )}
            </button>
          ))}
        </nav>

        <button
          onClick={onLogout}
          className="flex items-center gap-4 px-6 py-4 rounded-2xl font-black text-sm uppercase tracking-wider text-red-400 hover:text-red-500 hover:bg-red-50 transition-all mt-auto"
        >
          <LogOut size={20} />
          Sair
        </button>
      </aside>

      {/* Mobile Header */}
      <header className="md:hidden bg-white/80 backdrop-blur-md border-b border-slate-200 p-4 sticky top-0 z-[100] no-print">
        <div className="flex items-center justify-between">
          <img src="https://i.ibb.co/m5GppDf3/image.png" alt="Logo" className="h-20 w-auto object-contain scale-110 origin-left" />

          <div className="flex items-center gap-3">
            {/* Mobile Menu Toggle */}
            <div className="relative">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${isMobileMenuOpen ? 'bg-slate-900 rotate-90' : 'bg-brand-blue shadow-lg shadow-blue-500/20'
                  } text-white`}
              >
                {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>

              <AnimatePresence>
                {isMobileMenuOpen && (
                  <>
                    {/* Overlay to close menu */}
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="fixed inset-0 bg-slate-900/20 backdrop-blur-[2px] z-[-1]"
                    />

                    <motion.div
                      initial={{ opacity: 0, scale: 0.9, y: -20 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.9, y: -20 }}
                      className="absolute top-14 right-0 flex flex-col items-end gap-2 min-w-[200px]"
                    >
                      {tabs.map((tab, idx) => (
                        <motion.button
                          key={tab.id}
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: idx * 0.05 }}
                          onClick={() => {
                            if (tab.locked) return;
                            navigate(`/${tab.id}`);
                            setIsMobileMenuOpen(false);
                          }}
                          className={`w-full flex items-center justify-between gap-4 px-5 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl transition-all ${
                            tab.locked
                              ? 'bg-white text-slate-600 border border-slate-100 cursor-not-allowed'
                              : activeTab === tab.id
                                ? 'bg-brand-blue text-white'
                                : 'bg-white text-slate-600 border border-slate-100'
                          }`}
                          disabled={tab.locked}
                        >
                          <span className="flex items-center gap-2">
                            {tab.label}
                            {tab.locked && <Lock size={12} className="text-slate-400" />}
                          </span>
                          <tab.icon size={14} />
                        </motion.button>
                      ))}
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>

            <button onClick={onLogout} className="w-10 h-10 rounded-full flex items-center justify-center bg-red-50 text-red-400 hover:bg-red-100 transition-colors">
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 md:ml-72 p-6 md:p-12">
        <div className="max-w-6xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {renderContent()}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      <div className="no-print">
        <PDFModal
          isOpen={isPdfModalOpen}
          onClose={() => setIsPdfModalOpen(false)}
          title={selectedPdf.title}
          pdfUrl={selectedPdf.url}
        />
      </div>

      {/* WhatsApp Floating Button */}
      <motion.a
        href="https://wa.me/553799056159"
        target="_blank"
        rel="noopener noreferrer"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        whileHover={{ scale: 1.1 }}
        className="fixed bottom-6 right-6 z-50 cursor-pointer group flex items-center justify-center no-print"
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
