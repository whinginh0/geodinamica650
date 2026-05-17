import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Mail, Lock, ArrowRight, ShieldCheck, AlertCircle } from 'lucide-react';
import { supabase } from '../supabaseClient';

interface LoginPageProps {
  onLogin: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setLoading(true);

    try {
      // Chamar RPC seguro no Supabase para verificar e-mail e senha de 6 dígitos
      const { data, error } = await supabase.rpc('verify_member_login', {
        email_input: email.trim(),
        password_input: password.trim()
      });

      if (error) {
        throw new Error(error.message);
      }

      if (data && data.length > 0) {
        // Armazenar sessão no localStorage
        localStorage.setItem('member_session', JSON.stringify(data[0]));
        onLogin();
      } else {
        setErrorMessage('E-mail ou senha provisória de 6 dígitos incorretos.');
      }
    } catch (err: any) {
      console.error('Erro de login no Supabase:', err);
      setErrorMessage('Erro de conexão ou e-mail/senha incorretos. Tente novamente.');
    } finally {
      setLoading(false);
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
          {errorMessage && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-2xl flex items-center gap-3 text-sm font-bold"
            >
              <AlertCircle size={20} className="shrink-0 text-red-500" />
              <span>{errorMessage}</span>
            </motion.div>
          )}

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
                disabled={loading}
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
                placeholder="Sua senha de 6 dígitos"
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue transition-all font-medium"
                required
                disabled={loading}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-brand-green text-white py-4 rounded-2xl font-black text-lg shadow-xl shadow-green-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 mt-4 disabled:opacity-75 disabled:pointer-events-none"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                VALIDANDO ACESSO...
              </span>
            ) : (
              <>
                ACESSAR AGORA <ArrowRight size={20} />
              </>
            )}
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

