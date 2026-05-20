import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Wrench } from 'lucide-react';

export default function Auth({ initialMode = 'login' }) {
  const [isLogin, setIsLogin] = useState(initialMode === 'login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  // Pegando a nova função do contexto
  const { login, register, loginWithGoogle } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    // ... (Mantenha todo o código do handleSubmit que fizemos antes)
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
      else if (err.code === 'auth/invalid-credential') setError('Credenciais inválidas.');
      else setError(`Falha ao ${isLogin ? 'entrar' : 'criar conta'}. Tente novamente.`);
    } finally {
      setLoading(false);
    }
  };

  // Função exclusiva para o botão do Google
  const handleGoogleLogin = async () => {
    setError('');
    setLoading(true);
    try {
      await loginWithGoogle();
      navigate('/dashboard');
    } catch (err) {
      setError('Falha ao autenticar com o Google. O pop-up foi fechado ou ocorreu um erro.');
    } finally {
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
    <div className="min-h-screen flex items-center justify-center bg-zinc-950 font-sans py-12 px-4 transition-all duration-500">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-zinc-900 via-zinc-950 to-zinc-950"></div>
      
      <div className="w-full max-w-md relative z-10">
        
        {/* Cabeçalho */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-red-600 rounded-xl">
              <Wrench className="text-white" size={32} />
            </div>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-white tracking-wider">
            AUTO<span className="text-red-600">HUB</span>
          </h2>
          <p className="text-zinc-400 mt-2 transition-all">
            {isLogin ? 'Acesso ao Prontuário Veicular' : 'Crie seu Prontuário Veicular'}
          </p>
        </div>

        <div className="bg-white p-8 rounded-2xl shadow-2xl border-t-4 border-red-600 transition-all duration-300">
          
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg text-center font-medium animate-pulse">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* ... (Mantenha os campos de email, senha e confirmPassword iguais) ... */}
            <div>
              <label className="block text-sm font-bold text-zinc-900 mb-2">E-mail</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-600 transition-all text-zinc-900"
                placeholder="seu@email.com"
              />
            </div>
            
            <div>
              <label className="block text-sm font-bold text-zinc-900 mb-2">Senha</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-600 transition-all text-zinc-900"
                placeholder={isLogin ? '••••••••' : 'Mínimo 6 caracteres'}
              />
            </div>

            {!isLogin && (
              <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                <label className="block text-sm font-bold text-zinc-900 mb-2">Confirmar Senha</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-600 transition-all text-zinc-900"
                  placeholder="Repita sua senha"
                />
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 bg-zinc-950 hover:bg-red-600 text-white font-bold rounded-xl transition-colors duration-300 shadow-lg disabled:opacity-70 disabled:cursor-not-allowed uppercase tracking-wide text-sm mt-2"
            >
              {loading 
                ? 'Processando...' 
                : isLogin ? 'Acessar Sistema' : 'Cadastrar'}
            </button>
          </form>

          {/* DIVISOR DE MÉTODOS DE LOGIN */}
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-zinc-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-zinc-500 font-medium">Ou continue com</span>
              </div>
            </div>

            {/* BOTÃO DO GOOGLE */}
            <button
              type="button"
              onClick={handleGoogleLogin}
              disabled={loading}
              className="w-full mt-6 py-3 px-4 bg-white border-2 border-zinc-200 hover:border-red-600 hover:bg-zinc-50 text-zinc-900 font-bold rounded-xl transition-all duration-300 flex items-center justify-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {/* Ícone SVG oficial do Google */}
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              Google
            </button>
          </div>

          <div className="mt-8 text-center border-t border-zinc-100 pt-6">
            <p className="text-sm text-zinc-600">
              {isLogin ? 'Não tem uma conta? ' : 'Já tem uma conta? '}
              <button 
                type="button"
                onClick={toggleMode}
                className="font-bold text-zinc-900 hover:text-red-600 transition-colors"
              >
                {isLogin ? 'Cadastre-se grátis' : 'Faça login aqui'}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}