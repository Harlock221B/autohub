import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Wrench, Loader2, Mail, Lock, ArrowLeft } from 'lucide-react';

export default function Auth({ initialMode = 'login' }) {
  const [isLogin, setIsLogin] = useState(initialMode === 'login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login, register, loginWithGoogle } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!isLogin) {
      if (password !== confirmPassword) return setError('As senhas não coincidem.');
      if (password.length < 6) return setError('A senha deve ter pelo menos 6 caracteres.');
    }

    setLoading(true);

    try {
      if (isLogin) {
        await login(email, password);
      } else {
        await register(email, password);
      }
      navigate('/dashboard');
    } catch (err) {
      if (err.code === 'auth/email-already-in-use') setError('Este e-mail já está em uso.');
      else if (err.code === 'auth/invalid-credential') setError('Credenciais inválidas. Verifique o seu e-mail e senha.');
      else setError(`Falha ao ${isLogin ? 'entrar' : 'criar conta'}. Tente novamente.`);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError('');
    setLoading(true);
    try {
      await loginWithGoogle();
      navigate('/dashboard');
    } catch (err) {
      setError('Falha ao autenticar com o Google. O pop-up foi fechado ou ocorreu um erro.');
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setError('');
    setPassword('');
    setConfirmPassword('');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-950 font-sans py-12 px-4 relative overflow-hidden transition-all duration-500">
      
      {/* Botão de Voltar para a Landing Page */}
      <button 
        onClick={() => navigate('/')}
        className="absolute top-6 left-6 md:top-10 md:left-10 flex items-center gap-3 text-zinc-400 hover:text-white transition-colors z-50 group font-medium text-sm outline-none"
      >
        <div className="p-2.5 bg-white/5 border border-white/10 rounded-xl group-hover:bg-white/10 group-hover:-translate-x-1 transition-all">
          <ArrowLeft size={18} />
        </div>
        <span className="hidden sm:block">Página Inicial</span>
      </button>

      {/* Background Decorativo e Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-zinc-800 via-zinc-950 to-zinc-950 pointer-events-none"></div>
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-red-600/10 blur-[100px] rounded-full pointer-events-none"></div>
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-orange-600/10 blur-[100px] rounded-full pointer-events-none"></div>
      
      <div className="w-full max-w-md relative z-10">
        
        {/* Cabeçalho */}
        <div className="text-center mb-10">
          <div className="flex justify-center mb-5 animate-in zoom-in duration-500">
            <div className="p-4 bg-gradient-to-br from-red-600 to-orange-500 rounded-2xl shadow-[0_0_30px_rgba(239,68,68,0.3)]">
              <Wrench className="text-white" size={36} strokeWidth={2.5} />
            </div>
          </div>
          <h2 className="text-4xl font-black text-white tracking-tight">
            AUTO<span className="bg-gradient-to-br from-red-500 to-orange-500 bg-clip-text text-transparent">HUB</span>
          </h2>
          <p className="text-zinc-400 mt-3 text-sm tracking-wide">
            {isLogin ? 'Aceda ao prontuário digital da sua frota' : 'Inicie a gestão inteligente do seu veículo'}
          </p>
        </div>

        {/* Card Principal - Glassmorphism */}
        <div className="bg-zinc-900/60 backdrop-blur-xl p-8 rounded-[2rem] shadow-2xl border border-white/5 transition-all duration-300">
          
          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-xl text-center font-medium animate-in fade-in slide-in-from-top-2">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">E-mail</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-zinc-500">
                  <Mail size={18} />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full pl-11 pr-4 py-3.5 bg-zinc-950/50 border border-white/10 rounded-xl text-zinc-100 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all placeholder:text-zinc-600"
                  placeholder="piloto@exemplo.com"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">Senha</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-zinc-500">
                  <Lock size={18} />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full pl-11 pr-4 py-3.5 bg-zinc-950/50 border border-white/10 rounded-xl text-zinc-100 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all placeholder:text-zinc-600"
                  placeholder={isLogin ? '••••••••' : 'Mínimo 6 caracteres'}
                />
              </div>
            </div>

            {!isLogin && (
              <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">Confirmar Senha</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-zinc-500">
                    <Lock size={18} />
                  </div>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    className="w-full pl-11 pr-4 py-3.5 bg-zinc-950/50 border border-white/10 rounded-xl text-zinc-100 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all placeholder:text-zinc-600"
                    placeholder="Repita a sua senha"
                  />
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-4 py-4 px-4 bg-gradient-to-r from-red-600 to-orange-500 hover:from-red-500 hover:to-orange-400 text-white font-bold rounded-xl transition-all duration-300 shadow-[0_8px_20px_rgba(239,68,68,0.25)] hover:-translate-y-0.5 disabled:opacity-70 disabled:transform-none disabled:cursor-not-allowed uppercase tracking-wider text-sm flex justify-center items-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 size={18} className="animate-spin" /> A Processar...
                </>
              ) : (
                isLogin ? 'Aceder à Garagem' : 'Criar Conta'
              )}
            </button>
          </form>

          {/* Divisor */}
          <div className="mt-8 mb-6 relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/5"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase tracking-widest">
              <span className="px-4 bg-zinc-900 text-zinc-500 font-bold rounded-full">Ou entre com</span>
            </div>
          </div>

          {/* Botão Google - Estilo Dark */}
          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={loading}
            className="w-full py-3.5 px-4 bg-white/5 border border-white/10 hover:bg-white/10 text-zinc-100 font-bold rounded-xl transition-all duration-300 flex items-center justify-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            Google
          </button>
        </div>

        {/* Rodapé Alternar Modo */}
        <div className="mt-8 text-center">
          <p className="text-sm text-zinc-500">
            {isLogin ? 'Novo por aqui? ' : 'Já faz parte da equipa? '}
            <button 
              type="button"
              onClick={toggleMode}
              className="font-bold text-white hover:text-red-500 transition-colors border-b border-transparent hover:border-red-500 pb-0.5"
            >
              {isLogin ? 'Cadastre a sua frota' : 'Aceda ao painel'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}