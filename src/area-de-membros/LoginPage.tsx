import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Mail, Lock, ArrowRight, ShieldCheck } from 'lucide-react';

interface LoginPageProps {
  onLogin: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulating login
    if (email && password) {
      onLogin();
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-brand-blue/10 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-brand-green/10 rounded-full blur-[120px]"></div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white rounded-[2.5rem] shadow-2xl border border-slate-100 p-8 md:p-12 relative z-10"
      >
        <div className="flex flex-col items-center mb-8">
          <div className="p-4 mb-2">
            <img src="https://i.ibb.co/m5GppDf3/image.png" alt="Logo" className="h-24 md:h-32 object-contain scale-110" />
          </div>
          <h1 className="text-3xl font-black text-slate-900 mb-2">Área de Membros</h1>
          <p className="text-slate-500 font-medium text-center">Entre com seu e-mail e senha para acessar os materiais exclusivos.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 ml-2">E-mail</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@email.com"
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue transition-all font-medium"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 ml-2">Senha</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue transition-all font-medium"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-brand-green text-white py-4 rounded-2xl font-black text-lg shadow-xl shadow-green-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 mt-4"
          >
            ACESSAR AGORA <ArrowRight size={20} />
          </button>
        </form>

        <div className="mt-12 pt-8 border-t border-slate-100 flex flex-col items-center">
          <div className="flex items-center gap-2 text-slate-400 font-bold text-xs uppercase tracking-widest mb-4">
            <ShieldCheck size={16} />
            Acesso 100% Seguro
          </div>
          <p className="text-slate-400 text-[10px] text-center px-4">
            Seu acesso é individual e intransferível. Caso tenha problemas, entre em contato com o suporte.
          </p>
        </div>
      </motion.div>
    </div>
  );
};
