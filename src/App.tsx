import React from 'react';
import {
  CheckCircle2,
  Users,
  Star,
  Map,
  Clock,
  Frown,
  BookOpen,
  Zap,
  Printer,
  RefreshCw,
  Gift,
  ChevronDown,
  ChevronUp,
  Instagram,
  Facebook,
  Mail,
  ArrowRight,
  ShieldCheck,
  Check,
  AlertTriangle,
  MessageCircle
} from 'lucide-react';
import { motion, AnimatePresence, useInView, animate, useMotionValue, useTransform } from 'motion/react';
import { Routes, Route, useNavigate, Navigate } from 'react-router-dom';
import MembersArea from './area-de-membros/MembersArea';
import { LoginPage } from './area-de-membros/LoginPage';
import { Dashboard } from './area-de-membros/Dashboard';
import { CustomCursor } from './components/CustomCursor';
import { BackRedirectPage } from './BackRedirectPage';

const scrollToSection = (id: string) => {
  const element = document.getElementById(id);
  if (element) {
    const offset = 80;
    const elementPosition = element.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.pageYOffset - offset;

    animate(window.scrollY, offsetPosition, {
      type: "spring",
      stiffness: 40,
      damping: 20,
      mass: 1,
      onUpdate: (latest) => window.scrollTo(0, latest)
    });
  }
};

// Common Components
const CTAButton = ({ children, className = "", primary = true, onClick }: { children: React.ReactNode, className?: string, primary?: boolean, onClick?: () => void }) => (
  <motion.button
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    onClick={onClick}
    className={`px-8 py-5 rounded-full font-bold text-lg shadow-xl shadow-blue-500/20 transition-all cursor-pointer ${primary
      ? "bg-brand-green text-white"
      : "bg-brand-yellow text-blue-900"
      } ${className}`}
  >
    {children}
  </motion.button>
);

const SectionTitle = ({ children, subtitle, light = false }: { children: React.ReactNode, subtitle?: string, light?: boolean }) => (
  <div className="flex flex-col items-center text-center mb-12 md:mb-16 px-4">
    <h2 className={`text-2xl md:text-5xl font-bold mb-4 md:mb-6 max-w-4xl tracking-tight leading-tight ${light ? 'text-white' : 'text-slate-900'}`}>
      {children}
    </h2>
    {subtitle && <p className={`text-base md:text-xl max-w-2xl font-medium ${light ? 'text-blue-100' : 'text-slate-500'}`}>{subtitle}</p>}
    <div className={`h-1.5 w-16 md:w-24 rounded-full mt-6 md:mt-8 ${light ? 'bg-brand-yellow' : 'bg-brand-blue'}`}></div>
  </div>
);

const CountUp = ({ to, duration = 2, decimals = 0 }: { to: number; duration?: number; decimals?: number }) => {
  const nodeRef = React.useRef(null);
  const isInView = useInView(nodeRef, { once: true });
  const [count, setCount] = React.useState(0);

  React.useEffect(() => {
    if (isInView) {
      let startTime: number;
      const animation = (timestamp: number) => {
        if (!startTime) startTime = timestamp;
        const progress = Math.min((timestamp - startTime) / (duration * 1000), 1);
        setCount(progress * to);
        if (progress < 1) {
          requestAnimationFrame(animation);
        }
      };
      requestAnimationFrame(animation);
    }
  }, [isInView, to, duration]);

  return <span ref={nodeRef}>{count.toFixed(decimals).replace('.', ',')}</span>;
};
const UpsellPopup = ({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) => (
  <AnimatePresence>
    {isOpen && (
      <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-slate-900/60 backdrop-blur-[5px]"
          onClick={onClose}
        ></motion.div>
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
          <h3 className="text-xl md:text-2xl font-black text-slate-900 mb-3 leading-tight uppercase">
            ESPERE! NÃO VÁ <span className="text-brand-green italic">AINDA...</span>
          </h3>
          <p className="text-slate-500 font-bold text-xs md:text-sm mb-6 leading-relaxed px-2">
            Você acaba de ganhar uma oportunidade única. O <span className="text-brand-blue font-black underline">Plano Premium</span> com acesso vitalício pode ser seu por apenas:
          </p>

          <div className="flex items-start justify-center gap-0.5 mb-6">
            <span className="text-lg md:text-xl font-black text-brand-green mt-2 md:mt-2.5">R$</span>
            <span className="text-6xl md:text-7xl font-black text-brand-green tracking-tighter leading-none">17</span>
            <div className="flex flex-col items-start mt-2 md:mt-3">
              <span className="text-xl md:text-2xl font-black text-brand-green leading-none">,90</span>
              <span className="text-[8px] font-black text-brand-blue uppercase tracking-tighter">ÚNICA VEZ</span>
            </div>
          </div>

          <CTAButton
            className="w-full py-4 text-lg md:text-xl shadow-xl shadow-green-500/30 mb-4 flex items-center justify-center gap-2 animate-bounce"
            onClick={() => window.location.href = 'https://ggcheckout.app/checkout/v5/E12J9a4icrD2hfnZdHqR'}
          >
            QUERO O PREMIUM <ArrowRight size={20} />
          </CTAButton>

          <button
            onClick={() => window.location.href = 'https://ggcheckout.app/checkout/v5/XyTY2BmVuFBdAsbTFQSK'}
            className="text-slate-400 font-bold text-[10px] md:text-xs underline underline-offset-4 hover:text-slate-600 transition-colors"
          >
            Não, quero continuar no Plano Básico.
          </button>
        </motion.div>
      </div>
    )}
  </AnimatePresence>
);
const TopBanner = () => {
  const [timeLeft, setTimeLeft] = React.useState({ minutes: 14, seconds: 59 });

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
    <div className="fixed top-0 left-0 w-full z-[100] bg-gradient-to-r from-green-700 via-brand-green to-green-700 text-white py-2 px-4 shadow-xl flex flex-wrap items-center justify-center gap-2 md:gap-6 text-[10px] md:text-sm font-black uppercase tracking-wider border-b border-white/10">
      <div className="flex items-center gap-2">
        <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-red-500 rounded-full animate-pulse"></div>
        <span className="hidden sm:inline">Últimas vagas com desconto! Aproveite o material completo:</span>
        <span className="sm:hidden">Oferta Expira em:</span>
      </div>
      <div className="flex items-center gap-2 md:gap-3 bg-black/20 px-3 py-1 rounded-full border border-white/10 backdrop-blur-sm">
        <Clock size={14} className="text-brand-yellow" />
        <span className="font-mono text-brand-yellow min-w-[50px] md:min-w-[60px] text-center text-sm md:text-lg">
          {String(timeLeft.minutes).padStart(2, '0')}:{String(timeLeft.seconds).padStart(2, '0')}
        </span>
      </div>
      <button
        onClick={() => scrollToSection('pricing')}
        className="bg-brand-yellow text-blue-900 px-3 py-1 rounded-full text-[9px] md:text-xs font-black hover:bg-yellow-400 transition-colors"
      >
        GARANTIR VAGA
      </button>
    </div>
  );
};

const Navbar = ({ onAccessMembersArea }: { onAccessMembersArea?: () => void }) => {
  const [scrolled, setScrolled] = React.useState(false);

  React.useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 100);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className="fixed top-[44px] md:top-[52px] left-0 w-full z-50 px-2 md:px-4 pointer-events-none mt-4 md:mt-8">
      <div className="container mx-auto max-w-[340px] md:max-w-2xl">
        <div className="bg-[#00c800] rounded-full px-4 md:px-5 py-2 flex items-center justify-between shadow-2xl border border-white/20 pointer-events-auto">
          {/* Logo */}
          <div className="flex items-center h-8 md:h-8">
            <img src="https://i.ibb.co/m5GppDf3/image.png" alt="Logo" className="h-14 md:h-20 object-contain transition-all duration-300 scale-[1.7] md:scale-[1.4] origin-left" />
          </div>

          {/* Links */}
          <div className="hidden md:flex items-center gap-6">
            <button onClick={() => scrollToSection('demonstration')} className="text-[9px] font-black uppercase tracking-widest text-white transition-colors relative group">
              Conteúdo
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-white transition-all duration-300 group-hover:w-full"></span>
            </button>
            <button onClick={() => scrollToSection('pricing')} className="text-[9px] font-black uppercase tracking-widest text-white transition-colors relative group">
              Planos
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-white transition-all duration-300 group-hover:w-full"></span>
            </button>
            <button onClick={() => scrollToSection('faq')} className="text-[9px] font-black uppercase tracking-widest text-white transition-colors relative group">
              Dúvidas
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-white transition-all duration-300 group-hover:w-full"></span>
            </button>
            {onAccessMembersArea && (
              <button
                onClick={onAccessMembersArea}
                className="text-[9px] font-black uppercase tracking-widest text-brand-yellow hover:text-white transition-colors relative group flex items-center gap-1.5"
              >
                <Users size={12} />
                Área do Aluno
              </button>
            )}
          </div>

          {/* CTA */}
          <button
            onClick={() => scrollToSection('pricing')}
            className="bg-brand-yellow text-blue-900 px-3 md:px-4 py-1.5 md:py-2 rounded-full text-[9px] md:text-[10px] font-black flex items-center gap-1.5 md:gap-2 shadow-lg hover:bg-yellow-400 transition-all pointer-events-auto"
          >
            QUERO AGORA <ArrowRight size={12} className="md:w-3.5 md:h-3.5" />
          </button>
        </div>
      </div>
    </nav>
  );
};

// 1. Hero / Oferta Principal
const Hero = () => (
  <section className="relative pt-44 md:pt-52 pb-24 md:pb-32 overflow-hidden bg-brand-gradient text-white">
    <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
      <div className="absolute top-20 left-10 w-64 h-64 bg-white rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-brand-yellow rounded-full blur-3xl"></div>
    </div>

    <div className="container mx-auto px-6 relative z-10">
      <div className="flex flex-col items-center gap-12 text-center max-w-5xl mx-auto">
        <div className="space-y-4 flex flex-col items-center">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="inline-flex items-center gap-2 bg-brand-yellow/20 border border-brand-yellow/30 px-4 py-1.5 rounded-full text-brand-yellow text-xs md:text-sm font-black tracking-widest uppercase mb-2"
          >
            <ShieldCheck size={16} />
            100% Alinhado à BNCC
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-4xl md:text-7xl font-black leading-tight md:leading-[1.0] text-white"
          >
            Mais de <span className="relative inline-block px-1">
              <span className="relative z-10 bg-gradient-to-b from-yellow-400 to-yellow-600 bg-clip-text text-transparent">650+ Dinâmicas</span>
              <motion.span
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ delay: 0.6, duration: 0.8 }}
                className="absolute bottom-1 md:bottom-2 left-0 h-1 md:h-3 bg-brand-green -z-0 rounded-sm"
              ></motion.span>
            </span> <br className="hidden md:block" />
            interativas para suas <br className="hidden md:block" />
            aulas de Geografia
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-base md:text-xl text-blue-100 max-w-2xl mx-auto font-medium px-4 md:px-0"
          >
            Engaje seus alunos do <span className="font-black text-brand-yellow">Fundamental</span> ao <span className="font-black text-brand-yellow">Médio</span> com atividades prontas, didáticas e prontas para imprimir ou projetar.
          </motion.p>
        </div>

        {/* CTA removido conforme solicitado */}

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
          className="w-full max-w-[320px] relative px-2"
        >
          {/* Floating Globes (Using the provided planet image) */}
          <motion.div
            animate={{ y: [0, -15, 0], rotate: [0, 20, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -top-8 -left-16 z-20 drop-shadow-[0_0_15px_rgba(0,123,255,0.3)]"
          >
            <img src="https://i.ibb.co/Cp70DWgL/image.png" alt="Planet" className="w-20 h-20 object-contain" />
          </motion.div>
          <motion.div
            animate={{ y: [0, 15, 0], rotate: [0, -20, 0] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            className="absolute top-1/2 -right-12 z-20 drop-shadow-[0_0_15px_rgba(255,204,0,0.3)]"
          >
            <img src="https://i.ibb.co/Cp70DWgL/image.png" alt="Planet" className="w-14 h-14 object-contain" />
          </motion.div>

          {/* Smartphone VSL Mockup */}
          <div className="relative z-10 rounded-[3rem] overflow-hidden shadow-[0_0_60px_rgba(0,93,255,0.4)] border-[10px] border-slate-900 aspect-[9/16] bg-black group cursor-pointer">
            {/* Imagem removida conforme solicitado - Fundo Preto */}
            <div className="absolute inset-0 bg-black"></div>

            {/* Play Button Overlay */}
            <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/10 transition-colors">
              <motion.div
                whileHover={{ scale: 1.1 }}
                className="w-24 h-24 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center border border-white/20"
              >
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center pl-1 shadow-[0_0_30px_rgba(255,255,255,0.5)]">
                  <ArrowRight size={32} className="text-blue-600" />
                </div>
              </motion.div>
            </div>

            {/* Play Badge */}
            <div className="absolute top-8 left-8 bg-brand-yellow text-blue-950 px-5 py-1.5 rounded-full font-black text-xs tracking-[0.2em] shadow-lg flex items-center gap-2">
              <div className="w-2 h-2 bg-red-600 rounded-full animate-pulse"></div>
              PLAY
            </div>
          </div>

          {/* Decorative Elements */}
          <div className="absolute -inset-4 bg-brand-blue/20 blur-[100px] -z-10 rounded-full"></div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="flex flex-col items-center gap-6 w-full"
        >
          <CTAButton
            onClick={() => scrollToSection('pricing')}
            className="w-full max-w-sm md:w-auto flex items-center justify-center gap-2 text-xl md:text-2xl py-6 md:px-12"
          >
            Quero agora <ArrowRight size={24} />
          </CTAButton>
          <div className="flex items-center gap-2 text-blue-50 font-semibold text-sm md:text-base">
            <Check size={20} className="text-brand-yellow" strokeWidth={3} />
            Acesso imediato após a compra
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="grid grid-cols-3 gap-2 md:gap-4 max-w-lg w-full pt-12 border-t border-white/10"
        >
          <div className="flex flex-col items-center">
            <div className="text-3xl md:text-5xl font-black text-brand-yellow">
              <CountUp to={650} />+
            </div>
            <div className="text-[10px] md:text-xs text-blue-200 uppercase tracking-widest font-black mt-2">Atividades</div>
          </div>
          <div className="flex flex-col items-center">
            <div className="text-3xl md:text-5xl font-black text-brand-yellow">
              <CountUp to={12} />k+
            </div>
            <div className="text-[10px] md:text-xs text-blue-200 uppercase tracking-widest font-black mt-2">Professores</div>
          </div>
          <div className="flex flex-col items-center">
            <div className="text-3xl md:text-5xl font-black text-brand-yellow flex items-center gap-2">
              <CountUp to={4.9} decimals={1} />
              <Star size={24} fill="currentColor" className="text-brand-yellow translate-y-[-2px]" />
            </div>
            <div className="text-[10px] md:text-xs text-blue-200 uppercase tracking-widest font-black mt-2">Avaliação</div>
          </div>
        </motion.div>
      </div>
    </div>
  </section>
);

// 2. Seção de Dor (Problema)
const PainPoints = () => (
  <section className="py-24 bg-white">
    <div className="container mx-auto px-6">
      <SectionTitle subtitle="A rotina do professor de Geografia não precisa ser exaustiva.">
        Você já passou por isso?
      </SectionTitle>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
        {[
          {
            icon: Clock,
            title: "Falta de tempo",
            desc: "Passa as noites planejando aulas e não tem tempo para você ou sua família."
          },
          {
            icon: Frown,
            title: "Alunos desmotivados",
            desc: "Dificuldade em prender a atenção de jovens que preferem telas a livros."
          },
          {
            icon: AlertTriangle,
            title: "Pressão da BNCC",
            desc: "Insegurança em estar ensinando exatamente o que as novas normas exigem."
          }
        ].map((item, index) => (
          <motion.div
            key={index}
            whileHover={{ y: -10 }}
            className="flex flex-col items-center p-10 rounded-3xl bg-red-500/10 border border-red-100 text-center shadow-sm backdrop-blur-sm"
          >
            <div className="w-20 h-20 bg-gradient-to-br from-red-700 to-red-400 text-white rounded-2xl flex items-center justify-center mb-8 shadow-lg shadow-red-900/20">
              <item.icon size={36} />
            </div>
            <h3 className="text-2xl font-bold mb-4">{item.title}</h3>
            <p className="text-slate-500 font-medium leading-relaxed">{item.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

// 3. Seção de Benefícios
const Benefits = () => (
  <section className="py-24 bg-slate-50">
    <div className="container mx-auto px-6 text-center">
      <SectionTitle subtitle="Material criado de professor para professor.">
        O que você recebe
      </SectionTitle>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
        {[
          { icon: Zap, title: "Engajamento real", desc: "Métodos que despertam o interesse imediato dos alunos." },
          { icon: Map, title: "Geografia visual", desc: "Mapas, infográficos e ilustrações em alta definição." },
          { icon: Users, title: "Individual ou Grupo", desc: "Dinâmicas versáteis para qualquer tamanho de turma." },
          { icon: CheckCircle2, title: "Alinhamento BNCC", desc: "Fichas catalogadas com as habilidades específicas." },
          { icon: Printer, title: "Pronto para imprimir", desc: "Economize seu tempo com arquivos já formatados." },
          { icon: RefreshCw, title: "Atualizações", desc: "Novos recursos adicionados periodicamente." }
        ].map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="flex flex-col items-center p-10 rounded-3xl bg-brand-green/10 backdrop-blur-sm shadow-xl shadow-slate-200/50 border border-brand-green/10"
          >
            <div className="w-16 h-16 bg-gradient-to-br from-blue-700 to-blue-400 text-white rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-blue-900/20">
              <item.icon size={28} />
            </div>
            <h4 className="text-xl font-bold mb-4">{item.title}</h4>
            <p className="text-slate-500 font-medium leading-relaxed text-sm">{item.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

// 4. Seção de Demonstração
const Demonstration = () => (
  <section id="demonstration" className="py-24 bg-white overflow-hidden">
    <div className="container mx-auto px-6">
      <div className="flex flex-col items-center text-center max-w-4xl mx-auto mb-16">
        <motion.span
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-brand-green text-sm md:text-lg uppercase tracking-[0.3em] font-black block mb-4"
        >
          Demonstração
        </motion.span>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="text-4xl md:text-6xl font-black leading-tight mb-8 text-slate-900"
        >
          Veja na prática <span className="text-brand-green">como funciona</span>
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="text-lg md:text-xl text-slate-500 max-w-3xl mx-auto font-medium"
        >
          Um material visual, didático e pronto para aplicar em sala — dinâmicas que prendem a atenção e facilitam sua aula.
        </motion.p>
      </div>

      <div className="flex justify-center">
        <div className="relative w-fit">
          {/* Floating Globes - Tightly aligned */}
          <motion.div
            animate={{ y: [0, -10, 0], rotate: [0, 15, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-1/2 -translate-y-1/2 -left-10 md:-left-16 z-20 drop-shadow-[0_0_15px_rgba(0,123,255,0.3)] pointer-events-none"
          >
            <img src="https://i.ibb.co/Cp70DWgL/image.png" alt="Planet" className="w-16 h-16 md:w-28 md:h-28 object-contain" />
          </motion.div>
          <motion.div
            animate={{ y: [0, 10, 0], rotate: [0, -15, 0] }}
            transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
            className="absolute top-1/4 -right-8 md:-right-12 z-20 drop-shadow-[0_0_15px_rgba(255,204,0,0.3)] pointer-events-none"
          >
            <img src="https://i.ibb.co/Cp70DWgL/image.png" alt="Planet" className="w-12 h-12 md:w-20 md:h-20 object-contain" />
          </motion.div>

          {/* iPhone Mockup Frame */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ type: "spring", stiffness: 100, damping: 20 }}
            className="relative w-[280px] md:w-[350px] aspect-[9/19.5] bg-slate-950 rounded-[3rem] p-2 md:p-3 shadow-[0_0_80px_rgba(0,0,0,0.15)] border-[8px] md:border-[10px] border-slate-900 z-10"
          >
            {/* Top Notch */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-7 bg-slate-900 rounded-b-3xl z-20"></div>

            {/* Screen Content */}
            <div className="w-full h-full bg-black rounded-[2.2rem] overflow-hidden relative group cursor-pointer border border-white/5">
              {/* Play Button Overlay */}
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 group-hover:bg-black/20 transition-colors z-10">
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  className="w-20 h-20 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center border border-white/20 mb-4"
                >
                  <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center pl-1 shadow-[0_0_30px_rgba(255,255,255,0.4)]">
                    <ArrowRight size={28} className="text-blue-600" />
                  </div>
                </motion.div>
                <motion.div
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="bg-brand-yellow rounded-full px-6 py-2.5 flex items-center gap-2 shadow-2xl shadow-yellow-500/50"
                >
                  <div className="w-2.5 h-2.5 bg-orange-600 rounded-full animate-pulse"></div>
                  <span className="text-blue-900 font-black text-xs md:text-sm tracking-[0.2em]">PLAY</span>
                </motion.div>
              </div>

              {/* Background Decorative Gradient for Screen */}
              <div className="absolute inset-0 bg-gradient-to-b from-blue-900/20 to-black"></div>
            </div>
          </motion.div>

          {/* Decorative Background Elements */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand-blue/5 rounded-full blur-[120px] -z-0"></div>
        </div>
      </div>
    </div>
  </section>
);

// 5. Seção de Bônus
const Bonus = () => (
  <section className="py-24 bg-brand-blue text-white overflow-hidden">
    <div className="container mx-auto px-6 relative z-10 text-center">
      <SectionTitle light subtitle="Aumente ainda mais o valor do seu material sem custo adicional.">
        <span className="bg-brand-yellow px-8 py-2 md:py-3 rounded-[1.5rem] md:rounded-[2rem] inline-block shadow-xl shadow-brand-yellow/40 text-slate-900">
          Bônus Exclusivos
        </span>
      </SectionTitle>

      <div className="flex flex-wrap justify-center gap-8 max-w-7xl mx-auto mt-12 px-4">
        {[
          {
            title: "100 Avaliações de Geografia",
            value: "R$ 47,00",
            desc: "Avaliações diagnósticas prontas, provas organizadas por bimestre e critérios de correção estruturados.",
            image: "https://i.ibb.co/tTZm6yKn/image.png"
          },
          {
            title: "Guia Professor de Elite",
            value: "R$ 37,00",
            desc: "Metodologias ativas explicadas passo a passo para engajar qualquer turma do fundamental ao médio.",
            image: "https://i.ibb.co/7xdxvPMH/image.png"
          },
          {
            title: "Planos de Aula BNCC",
            value: "R$ 57,00",
            desc: "Planejamento completo para o ano todo, 100% alinhado às competências da BNCC.",
            image: "https://i.ibb.co/XrRfKLyT/image.png"
          },
          {
            title: "Planejamento Anual",
            value: "R$ 27,00",
            desc: "Calendário letivo estruturado por datas e temas, pronto para adaptar à sua escola.",
            image: "https://i.ibb.co/FqdKRJ7x/image.png"
          },
          {
            title: "Mapas Premium em Alta",
            value: "R$ 39,00",
            desc: "Coleção exclusiva de mapas temáticos em alta definição para imprimir ou projetar.",
            image: "https://i.ibb.co/nqpFrq77/image.png"
          }
        ].map((bonus, index) => (
          <div key={index} className="flex flex-col w-full md:w-[calc(48%)] lg:w-[calc(31%)] bg-white/5 backdrop-blur-xl rounded-[2.5rem] overflow-hidden border border-white/10 group text-left shadow-2xl hover:border-brand-yellow/30 transition-all duration-500">
            <div className="relative h-56 overflow-hidden">
              <img
                src={bonus.image}
                alt={bonus.title}
                className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 to-transparent"></div>
              <div className="absolute top-6 right-6 bg-brand-yellow text-blue-950 px-5 py-1.5 rounded-full font-black text-xs uppercase tracking-widest shadow-[0_0_20px_rgba(251,191,36,0.4)]">
                GRÁTIS
              </div>
            </div>
            <div className="p-8 flex flex-col flex-1 bg-slate-950/20">
              <h3 className="text-2xl font-black mb-4 text-white leading-tight group-hover:text-brand-yellow transition-colors">{bonus.title}</h3>
              <p className="text-blue-100/60 font-medium mb-10 text-sm leading-relaxed">{bonus.desc}</p>
              <div className="mt-auto pt-8 border-t border-white/10">
                <div className="text-xs text-white/40 uppercase tracking-widest font-bold mb-1">
                  VALOR REAL: <span className="line-through">{bonus.value}</span>
                </div>
                <div className="text-[13px] md:text-[15px] text-brand-yellow font-black flex items-center gap-1.5 whitespace-nowrap">
                  <Check size={18} className="shrink-0" />
                  HOJE VOCÊ RECEBE POR: R$ 0,00
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

// 5.5 Seção de Escassez
const Scarcity = () => {
  const [timeLeft, setTimeLeft] = React.useState({ minutes: 14, seconds: 59 });

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
    <section className="py-12 bg-white text-slate-900 overflow-hidden relative border-y border-slate-100">
      <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-brand-blue/20 via-transparent to-transparent"></div>
      </div>

      <div className="container mx-auto px-6 relative z-10 flex flex-col items-center text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="inline-flex items-center gap-2 bg-red-50 text-red-600 px-5 py-1.5 rounded-full text-[10px] md:text-xs font-black uppercase tracking-widest mb-6 border border-red-100"
        >
          <div className="w-1.5 h-1.5 bg-red-600 rounded-full animate-pulse"></div>
          Oportunidade Única
        </motion.div>

        <h2 className="text-2xl md:text-4xl font-black mb-8 leading-tight max-w-3xl">
          Essa oferta expira em poucos minutos e <span className="text-brand-blue">não voltará mais.</span>
        </h2>

        <div className="flex items-center gap-3 md:gap-6">
          <div className="flex flex-col items-center">
            <div className="w-20 h-24 md:w-28 md:h-32 bg-gradient-to-b from-brand-blue to-blue-800 border-2 border-blue-900 shadow-2xl rounded-xl md:rounded-[1.5rem] flex items-center justify-center text-4xl md:text-6xl font-black text-white">
              {String(timeLeft.minutes).padStart(2, '0')}
            </div>
            <span className="mt-3 text-[10px] md:text-xs font-black uppercase tracking-widest text-slate-500">Minutos</span>
          </div>

          <div className="text-3xl md:text-5xl font-black text-brand-blue mb-6 md:mb-8">:</div>

          <div className="flex flex-col items-center">
            <div className="w-20 h-24 md:w-28 md:h-32 bg-gradient-to-b from-brand-blue to-blue-800 border-2 border-blue-900 shadow-2xl rounded-xl md:rounded-[1.5rem] flex items-center justify-center text-4xl md:text-6xl font-black text-white">
              {String(timeLeft.seconds).padStart(2, '0')}
            </div>
            <span className="mt-3 text-[10px] md:text-xs font-black uppercase tracking-widest text-slate-500">Segundos</span>
          </div>
        </div>

        <p className="mt-10 text-base md:text-lg text-slate-500 font-medium max-w-xl mx-auto">
          Garanta o acesso completo com todos os bônus inclusos antes que o cronômetro chegue a zero.
        </p>
      </div>
    </section>
  );
};

// 6. Seção de Planos / Oferta
const Pricing = () => (
  <section id="pricing" className="py-24 bg-slate-50">
    <div className="container mx-auto px-6 flex flex-col items-center">
      <SectionTitle subtitle="Ganhe mais tempo livre e reconhecimento profissional.">
        Escolha seu plano
      </SectionTitle>

      <div className="flex flex-col md:flex-row items-center justify-center gap-10 w-full max-w-5xl pt-8">
        {/* Essential Card */}
        <div className="bg-white rounded-[2.5rem] md:rounded-[3rem] p-6 md:p-8 border border-slate-200 shadow-2xl w-full max-w-[90%] md:max-w-md flex flex-col items-center text-center relative transition-all hover:scale-[1.02]">
          <h3 className="text-lg md:text-xl font-black mb-4 text-slate-400 uppercase tracking-widest">PLANO BÁSICO</h3>
          <p className="text-slate-400 font-bold text-[9px] md:text-[10px] uppercase mb-1">Pagamento Único</p>
          <div className="flex items-start gap-1 mb-4">
            <span className="text-lg md:text-xl font-black text-slate-900 mt-2">R$</span>
            <span className="text-7xl md:text-8xl font-black text-slate-900 tracking-tighter leading-none">10</span>
            <span className="text-xl md:text-2xl font-black text-slate-900 mt-3">,00</span>
          </div>

          <ul className="space-y-2.5 md:space-y-3 mb-6 w-full text-left px-2">
            {[
              "Mais de 650 Dinâmicas Interativas em PDF",
              "Acesso Vitalício",
              "Área de Membros Exclusiva",
              "Materiais em PDF Prontos para Imprimir e Aplicar",
              "Conteúdos Organizados e Alinhados à BNCC",
              "Garantia Incondicional de 7 Dias",
              "Suporte Especializado"
            ].map((f, i) => (
              <li key={i} className="flex items-center gap-3 text-slate-600 font-bold text-[13px] md:text-sm">
                <div className="w-4 h-4 md:w-5 md:h-5 rounded-full bg-slate-100 flex items-center justify-center">
                  <Check size={10} className="text-slate-400" strokeWidth={4} />
                </div>
                {f}
              </li>
            ))}
          </ul>

          <div className="flex items-center justify-center mb-4">
            <img src="https://i.ibb.co/p6fDZsTv/LOGO.png" alt="Garantia e Segurança" className="h-16 md:h-20 object-contain opacity-100" />
          </div>

          <CTAButton
            className="w-full py-4 uppercase tracking-widest text-xs md:text-sm"
            primary={false}
            onClick={() => (window as any).showUpsellPopup()}
          >
            Escolher Básico
          </CTAButton>
        </div>

        {/* Premium Card */}
        <div className="bg-white rounded-[2.5rem] md:rounded-[3rem] border-[4px] md:border-[6px] border-brand-blue shadow-2xl relative w-full max-w-[95%] md:max-w-md flex flex-col items-center text-center md:scale-105 z-10 overflow-hidden transition-all hover:scale-[1.07]">
          <div className="w-full bg-brand-blue text-white py-2 font-black text-[9px] md:text-[10px] uppercase tracking-widest shadow-inner px-2">
            O PLANO FAVORITO DOS PROFESSORES
          </div>
          <div className="p-6 md:p-8 flex flex-col items-center w-full">
            <h3 className="text-xl md:text-2xl font-black mb-4 text-brand-blue uppercase tracking-widest">PLANO PREMIUM</h3>
            <p className="text-slate-300 line-through font-bold text-[10px] md:text-xs mb-1">De R$ 97,00 por</p>
            <div className="flex items-start gap-1 mb-2">
              <span className="text-lg md:text-xl font-black text-brand-blue mt-2">R$</span>
              <span className="text-7xl md:text-8xl font-black text-brand-blue tracking-tighter leading-none">27,90</span>
              <div className="flex flex-col items-start mt-3">
                <span className="text-xl md:text-2xl font-black text-brand-blue leading-none">,90</span>
                <span className="text-[9px] md:text-[10px] font-black text-brand-green uppercase tracking-tighter animate-pulse">HOJE!</span>
              </div>
            </div>

            {/* Product Mockup Image */}
            <div className="my-1 relative flex items-center justify-center h-40 md:h-48">
              <img src="https://i.ibb.co/NndnrgrG/image-Photoroom.png" alt="Premium Pack" className="w-48 h-48 md:w-60 md:h-60 object-contain drop-shadow-2xl z-20" />
            </div>

            <ul className="space-y-2.5 md:space-y-3 mb-6 w-full text-left px-2">
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
                <li key={i} className="flex items-center gap-3 text-slate-900 font-black text-[13px] md:text-sm">
                  <div className="w-4 h-4 md:w-5 md:h-5 rounded-full bg-brand-green flex items-center justify-center shadow-lg shadow-brand-green/20">
                    {f.includes("Bônus") ? (
                      <Gift size={10} className="text-white" strokeWidth={3} />
                    ) : (
                      <Check size={10} className="text-white" strokeWidth={4} />
                    )}
                  </div>
                  {f}
                </li>
              ))}
            </ul>

            <div className="flex items-center justify-center mb-4">
              <img src="https://i.ibb.co/p6fDZsTv/LOGO.png" alt="Garantia e Segurança" className="h-16 md:h-20 object-contain opacity-100" />
            </div>

            <CTAButton 
              className="w-full py-5 uppercase tracking-widest text-xs md:text-sm flex items-center justify-center gap-2 shadow-2xl shadow-blue-500/40"
              onClick={() => window.location.href = 'https://ggcheckout.app/checkout/v5/fcUxroaI27hBPCowg2KW'}
            >
              QUERO O PREMIUM <ArrowRight size={16} />
            </CTAButton>
          </div>
        </div>
      </div>

      <div className="mt-20 md:mt-32 flex flex-col items-center gap-4 md:gap-6 w-full max-w-2xl text-center bg-white p-6 md:p-14 rounded-[2.5rem] md:rounded-[3rem] shadow-2xl border border-slate-100 relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-48 bg-brand-green/5 rounded-full blur-3xl -z-0"></div>

        <div className="relative w-full h-28 md:h-32 flex items-center justify-center">
          <motion.img
            initial={{ scale: 0.8, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            src="https://i.ibb.co/4R948XhP/image.png"
            alt="Garantia"
            className="w-64 h-64 md:w-[28rem] md:h-[28rem] object-contain absolute z-10"
          />
        </div>

        <div className="space-y-3 md:space-y-4 relative z-10 mt-2 md:mt-10 px-4">
          <span className="text-brand-green text-xs md:text-base font-black uppercase tracking-[0.3em] block">GARANTIA INCONDICIONAL</span>
          <h4 className="text-2xl md:text-5xl font-black text-slate-900 leading-tight">Sua Satisfação é Prioridade</h4>
          <p className="text-base md:text-xl text-slate-500 font-medium leading-relaxed max-w-2xl mx-auto">
            Se em até 7 dias você não amar a experiência, <span className="text-brand-green font-bold underline underline-offset-4 md:underline-offset-8 decoration-brand-yellow decoration-2 md:decoration-4">devolvemos 100% do seu dinheiro</span>. Sem perguntas, sem burocracia.
          </p>
        </div>
      </div>
    </div>
  </section>
);

// 7. Prova Social
const Testimonials = () => (
  <section className="py-24 bg-white">
    <div className="container mx-auto px-6 flex flex-col items-center">
      <SectionTitle subtitle="Damos voz aos nossos mais de 12 mil professores ativos.">
        Quem usa, recomenda
      </SectionTitle>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto mt-8">
        {[
          { name: "Maria Silva", role: "Professora - SP", text: "Meus alunos finalmente param de olhar o celular para prestar atenção nos mapas. Material incrível!" },
          { name: "Roberto Souza", role: "Coordenador - RJ", text: "É raro ver um material tão bem ilustrado no Brasil. Meus professores ganharam muito tempo." },
          { name: "Ana Paula", role: "Professora - MG", text: "As avaliações prontas são um salva-vidas. O conteúdo está 100% batendo com o que a BNCC pede." }
        ].map((t, index) => (
          <div key={index} className="flex flex-col items-center text-center p-10 rounded-[2.5rem] bg-slate-50 border border-slate-100">
            <div className="flex gap-1 mb-6">
              {[...Array(5)].map((_, i) => <Star key={i} size={20} fill="#ffcc00" className="text-brand-yellow" />)}
            </div>
            <p className="text-slate-600 font-medium italic text-lg leading-relaxed mb-8">"{t.text}"</p>
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-slate-200 rounded-full mb-4 overflow-hidden">
                <img
                  src={
                    index === 0 ? "https://i.ibb.co/272rRPzn/image.png" :
                      index === 1 ? "https://i.ibb.co/Vc2PCdTH/image.png" :
                        index === 2 ? "https://i.ibb.co/rY5tSJd/image.png" :
                          `https://i.pravatar.cc/150?u=${index}`
                  }
                  alt={t.name}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="font-black text-slate-900">{t.name}</div>
              <div className="text-xs font-bold text-brand-blue uppercase tracking-widest mt-1">{t.role}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

// 8. Autoridade
const Authority = () => (
  <section className="py-24 bg-slate-50">
    <div className="container mx-auto px-6 flex flex-col items-center">
      <div className="flex flex-col items-center gap-12 text-center max-w-2xl mx-auto">
        <div className="relative">
          <div className="w-48 md:w-64 h-48 md:h-64 rounded-full border-8 border-white shadow-2xl overflow-hidden transition-all duration-500">
            <img src="https://i.ibb.co/2RLpm7B/image.png" alt="Joice Almeida" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
          </div>
          <div className="absolute -bottom-2 -right-2 bg-brand-yellow p-4 rounded-full shadow-lg">
            <Star size={24} fill="currentColor" className="text-blue-900" />
          </div>
        </div>

        <div className="space-y-6">
          <h2 className="text-xl md:text-2xl font-black text-brand-blue uppercase tracking-[0.3em]">Quem está por trás</h2>
          <h3 className="text-4xl md:text-5xl font-black leading-tight text-slate-900">Joice Almeida</h3>
          <p className="text-lg md:text-xl text-slate-500 font-medium leading-relaxed">
            Com mais de 15 anos de atuação direta em salas de aula e formação pela UFMG, minha missão é facilitar a vida de quem ensina.
          </p>
          <p className="text-base text-slate-500 leading-relaxed max-w-xl mx-auto">
            Trabalho com recursos que já impactaram mais de 12 mil educadores, focando sempre em transformar a Geografia em algo vivo e apaixonante para os alunos.
          </p>

          <div className="flex flex-row gap-2 md:gap-8 justify-center pt-8">
            <div className="text-center px-2 md:px-8">
              <div className="text-3xl md:text-4xl font-black text-brand-blue">
                <CountUp to={15} />+
              </div>
              <div className="text-[10px] md:text-xs font-black text-slate-400 uppercase tracking-widest mt-2">ANOS</div>
            </div>
            <div className="text-center px-2 md:px-8 border-x border-slate-200 py-0 md:py-0">
              <div className="text-3xl md:text-4xl font-black text-brand-blue">
                <CountUp to={500} />+
              </div>
              <div className="text-[10px] md:text-xs font-black text-slate-400 uppercase tracking-widest mt-2">RECURSOS</div>
            </div>
            <div className="text-center px-2 md:px-8">
              <div className="text-3xl md:text-4xl font-black text-brand-blue">
                <CountUp to={12} />k+
              </div>
              <div className="text-[10px] md:text-xs font-black text-slate-400 uppercase tracking-widest mt-2">ALUNOS</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
);

// 9. FAQ
const FAQ = () => {
  const [openIndex, setOpenIndex] = React.useState<number | null>(0);

  const faqs = [
    { q: "Como recebo o material?", a: "Imediatamente no seu e-mail após a confirmação do pagamento. Você terá acesso a uma área de membros exclusiva onde poderá baixar todos os recursos." },
    { q: "Quais séries são atendidas?", a: "Fundamental II (6º ao 9º ano) e todo o Ensino Médio. As atividades são categorizadas por nível de dificuldade e série, facilitando sua busca." },
    { q: "Posso imprimir várias vezes?", a: "Sim! Os arquivos estão em PDF de alta qualidade. Você pode baixar e imprimir para todas as suas turmas, quantas vezes precisar, para sempre." },
    { q: "As atividades seguem a BNCC?", a: "100%! Cada recurso indica as competências e habilidades específicas da BNCC trabalhadas, poupando seu tempo de planejamento." },
    { q: "E se eu tiver dúvidas?", a: "Temos um suporte exclusivo via WhatsApp para alunos. Você nunca estará sozinho na aplicação dos materiais." }
  ];

  return (
    <section id="faq" className="py-24 bg-white relative overflow-hidden">
      <div className="container mx-auto px-6 max-w-4xl flex flex-col items-center">
        <div className="text-center mb-16">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-brand-blue text-sm md:text-base font-black uppercase tracking-[0.3em] block mb-4"
          >
            Dúvidas Frequentes
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl font-black text-slate-900 leading-tight"
          >
            Perguntas <span className="text-brand-green">Respondidas</span>
          </motion.h2>
        </div>

        <div className="space-y-4 w-full">
          {faqs.map((faq, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className={`rounded-[2rem] border-2 transition-all duration-500 ${openIndex === i
                ? 'border-brand-green bg-brand-green/5 shadow-xl shadow-brand-green/5'
                : 'border-slate-100 bg-white hover:border-brand-blue/30'
                }`}
            >
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full flex items-center justify-between p-6 md:p-8 text-left group"
              >
                <span className={`text-lg md:text-xl font-bold transition-colors ${openIndex === i ? 'text-brand-green' : 'text-slate-900 group-hover:text-brand-blue'}`}>
                  {faq.q}
                </span>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500 ${openIndex === i
                  ? 'bg-brand-green text-white rotate-180'
                  : 'bg-brand-blue/10 text-brand-blue group-hover:bg-brand-blue group-hover:text-white'
                  }`}>
                  <ChevronDown size={22} />
                </div>
              </button>
              <AnimatePresence>
                {openIndex === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.4, ease: "easeInOut" }}
                    className="overflow-hidden"
                  >
                    <div className="px-8 pb-8 text-slate-500 font-medium leading-relaxed border-t border-brand-green/10 pt-4">
                      {faq.a}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

// 10. CTA Final
const FinalCTA = () => {
  const scrollToPricing = () => {
    const element = document.getElementById('pricing');
    if (element) {
      const offset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      animate(window.scrollY, offsetPosition, {
        type: "spring",
        stiffness: 30,
        damping: 20,
        mass: 1,
        onUpdate: (latest) => window.scrollTo(0, latest)
      });
    }
  };

  return (
    <section className="py-24 bg-brand-gradient text-white text-center relative overflow-hidden">
      <div className="container mx-auto px-6 relative z-10 flex flex-col items-center">
        <h2 className="text-3xl md:text-5xl font-black mb-4 max-w-4xl leading-tight">
          Pronto para mudar sua rotina educacional?
        </h2>
        <p className="text-lg md:text-xl text-blue-100 mb-10 max-w-3xl mx-auto font-medium">
          Junte-se agora a milhares de professores que já descomplicaram suas vidas com o GeoDinâmicas 650+.
        </p>
        <div className="flex flex-col items-center gap-8 w-full max-w-md mx-auto">
          <CTAButton
            onClick={scrollToPricing}
            className="w-full text-2xl py-6 shadow-2xl shadow-blue-900/50"
          >
            Quero o Acesso Agora
          </CTAButton>
          <div className="flex items-center gap-4 text-sm font-black uppercase tracking-widest opacity-80">
            <span className="flex items-center gap-2 underline underline-offset-4 decoration-brand-green tracking-tighter">
              <ShieldCheck size={18} className="text-brand-green" /> 7 dias de garantia
            </span>
            <span className="opacity-30">|</span>
            <span className="flex items-center gap-2 underline underline-offset-4 decoration-brand-green tracking-tighter">
              <Zap size={18} className="text-brand-green" /> acesso imediato
            </span>
          </div>
        </div>

        {/* Logo and Copyright - Integrated */}
        <div className="mt-12 flex flex-col items-center gap-4">
          <img src="https://i.ibb.co/m5GppDf3/image.png" alt="Logo" className="h-16 md:h-24 object-contain" />
          <p className="text-xs md:text-sm font-bold text-white/50">
            Todos os direitos reservados GeoDinâmicas 650+
          </p>
        </div>
      </div>
    </section>
  );
};



// 12. Botão WhatsApp Flutuante
const WhatsAppButton = () => (
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
    ></motion.div>
    <img src="https://i.ibb.co/pBRJXzqT/image.png" alt="WhatsApp" className="w-16 h-16 md:w-20 md:h-20 object-contain" />

    <div className="absolute right-full mr-4 top-1/2 -translate-y-1/2 bg-slate-900 text-white px-4 py-2 rounded-xl text-sm font-bold shadow-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
      Dúvidas? Fale conosco
    </div>
  </motion.a>
);



const useAntiClone = () => {
  React.useEffect(() => {
    // 1. Previne clique direito (context menu)
    const handleContextMenu = (e: Event) => e.preventDefault();
    document.addEventListener('contextmenu', handleContextMenu);

    // 2. Previne atalhos de teclado (F12, Ctrl+U, Ctrl+Shift+I, etc)
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.key === 'F12' ||
        (e.ctrlKey && e.shiftKey && ['I', 'J', 'C'].includes(e.key.toUpperCase())) ||
        (e.ctrlKey && ['U', 'S', 'P', 'C'].includes(e.key.toUpperCase()))
      ) {
        e.preventDefault();
      }
    };
    document.addEventListener('keydown', handleKeyDown);

    // 3. Previne seleção de texto (exceto em inputs)
    const handleSelectStart = (e: Event) => {
      const target = e.target as HTMLElement;
      if (target && !['INPUT', 'TEXTAREA'].includes(target.tagName)) {
        e.preventDefault();
      }
    };
    document.addEventListener('selectstart', handleSelectStart);

    // 4. Previne arrastar elementos (imagens)
    const handleDragStart = (e: Event) => {
      const target = e.target as HTMLElement;
      if (target && !['INPUT', 'TEXTAREA'].includes(target.tagName)) {
        e.preventDefault();
      }
    };
    document.addEventListener('dragstart', handleDragStart);

    // 5. Desabilita seleção via CSS
    document.body.style.userSelect = 'none';
    document.body.style.webkitUserSelect = 'none';

    // 6. Deteccao de protocolo local (anti HTTrack e SaveWebZip)
    if (window.location.protocol === 'file:' || window.location.protocol === 'data:') {
      document.body.innerHTML = '<div style="display:flex;align-items:center;justify-content:center;height:100vh;background:#111;color:red;font-family:sans-serif;text-align:center;"><h1>Acesso Negado.<br>Este site possui proteções ativas contra cópias.</h1></div>';
      window.location.href = 'about:blank';
    }

    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('selectstart', handleSelectStart);
      document.removeEventListener('dragstart', handleDragStart);
      document.body.style.userSelect = '';
      document.body.style.webkitUserSelect = '';
    };
  }, []);
};

export default function App() {
  useAntiClone(); // Ativa as proteções no site inteiro

  const [showUpsell, setShowUpsell] = React.useState(false);
  const [isLoggedIn, setIsLoggedIn] = React.useState(false);
  const navigate = useNavigate();

  // Expor função globalmente para simplificar o acesso de componentes profundos
  React.useEffect(() => {
    (window as any).showUpsellPopup = () => setShowUpsell(true);
    (window as any).goToMembersArea = () => navigate('/login');
  }, [navigate]);

  const handleLogin = () => {
    setIsLoggedIn(true);
    navigate('/principal');
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    navigate('/login');
  };

  return (
    <>
      <CustomCursor />
      <Routes>
        {/* Landing Page Route */}
        <Route path="/" element={
          <div className="min-h-screen bg-white">
            <TopBanner />
            <Navbar onAccessMembersArea={() => navigate('/login')} />
            <Hero />
            <PainPoints />
            <Benefits />
            <Demonstration />
            <Bonus />
            <Scarcity />
            <Pricing />
            <Testimonials />
            <Authority />
            <FAQ />
            <FinalCTA />
            <WhatsAppButton />
            <UpsellPopup isOpen={showUpsell} onClose={() => setShowUpsell(false)} />
          </div>
        } />

        {/* Members Area Routes */}
        <Route path="/login" element={
          isLoggedIn ? <Navigate to="/principal" /> : <LoginPage onLogin={handleLogin} />
        } />

        {/* Protected Dashboard Routes */}
        <Route path="/principal" element={
          isLoggedIn ? <Dashboard onLogout={handleLogout} activeTab="principal" /> : <Navigate to="/login" />
        } />
        <Route path="/dinamicas" element={
          isLoggedIn ? <Dashboard onLogout={handleLogout} activeTab="dinamicas" /> : <Navigate to="/login" />
        } />
        <Route path="/certificado" element={
          isLoggedIn ? <Dashboard onLogout={handleLogout} activeTab="certificado" /> : <Navigate to="/login" />
        } />
        <Route path="/bonus" element={
          isLoggedIn ? <Dashboard onLogout={handleLogout} activeTab="bonus" /> : <Navigate to="/login" />
        } />
        <Route path="/adicionais" element={
          isLoggedIn ? <Dashboard onLogout={handleLogout} activeTab="adicionais" /> : <Navigate to="/login" />
        } />

        <Route path="/oferta-especial" element={<BackRedirectPage />} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </>
  );
}
