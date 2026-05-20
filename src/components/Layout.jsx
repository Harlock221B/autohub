import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { LayoutDashboard, CarFront, FileText, Settings, LogOut, Menu, X, Sun, Moon, ChevronRight } from 'lucide-react';

export default function Layout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  // Efeito para detectar rolagem e adicionar sombra no header mobile
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    // Adiciona o listener no elemento principal de rolagem
    const mainElement = document.getElementById('main-scroll-area');
    if (mainElement) {
      mainElement.addEventListener('scroll', handleScroll);
      return () => mainElement.removeEventListener('scroll', handleScroll);
    }
  }, []);

  const menuItems = [
    { name: 'Painel Geral', icon: LayoutDashboard, path: '/dashboard' },
    { name: 'Gerenciar Frota', icon: CarFront, path: '/manage' },
    { name: 'Histórico', icon: FileText, path: '/history' },
    { name: 'Configurações', icon: Settings, path: '/settings' },
  ];

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error("Erro ao sair:", error);
    }
  };

  const userInitial = currentUser?.email ? currentUser.email.charAt(0).toUpperCase() : 'P';
  const userName = currentUser?.displayName || 'Piloto';

  return (
    <div className="flex h-screen overflow-hidden font-sans bg-slate-50 dark:bg-zinc-950 text-slate-900 dark:text-zinc-100 transition-colors duration-500">
      
      {/* Overlay Mobile */}
      <div 
        className={`fixed inset-0 z-40 bg-zinc-950/80 backdrop-blur-sm transition-all duration-500 lg:hidden ${sidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} 
        onClick={() => setSidebarOpen(false)} 
      />

      {/* Sidebar - Efeito Glassmorphism */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-[280px] bg-zinc-950/95 backdrop-blur-2xl text-zinc-100 border-r border-white/5 transform transition-transform duration-500 cubic-bezier(0.4, 0, 0.2, 1) lg:static lg:translate-x-0 flex flex-col shadow-2xl ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        
        {/* Logo Text */}
        <div className="flex items-center justify-between h-24 px-8 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-red-500/5 to-transparent opacity-50"></div>
          <h1 className="text-3xl font-black tracking-tighter text-white relative z-10 hover:scale-105 transition-transform cursor-default">
            AUTO<span className="bg-gradient-to-br from-red-500 to-orange-500 bg-clip-text text-transparent">HUB</span>
          </h1>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden p-2 rounded-full bg-white/5 text-zinc-400 hover:bg-white/10 hover:text-white transition-all relative z-10 active:scale-95">
            <X size={20} />
          </button>
        </div>

        {/* Navegação */}
        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto custom-scrollbar">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <button 
                key={item.name} 
                onClick={() => {
                  navigate(item.path);
                  setSidebarOpen(false);
                }}
                className={`flex w-full items-center justify-between px-4 py-3.5 rounded-2xl transition-all duration-300 font-medium group relative overflow-hidden ${
                  isActive 
                    ? 'text-white shadow-[0_2px_15px_rgba(239,68,68,0.15)] border border-red-500/30' 
                    : 'text-zinc-400 hover:bg-white/5 hover:text-zinc-100 border border-transparent'
                }`}
              >
                {/* Background gradient for active item */}
                <div className={`absolute inset-0 bg-gradient-to-r from-red-600/20 to-orange-500/10 transition-opacity duration-300 ${isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-10'}`}></div>
                
                {/* Indicador lateral vermelho */}
                <div className={`absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-red-500 to-orange-500 rounded-r-full transition-all duration-300 ${isActive ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-full'}`}></div>

                <div className="flex items-center gap-4 relative z-10">
                  <item.icon 
                    size={20} 
                    className={`transition-colors duration-300 ${isActive ? 'text-red-500 drop-shadow-[0_0_8px_rgba(239,68,68,0.5)]' : 'text-zinc-500 group-hover:text-zinc-300'}`} 
                  />
                  <span className="tracking-wide">{item.name}</span>
                </div>
                
                {isActive && <ChevronRight size={16} className="text-red-500 relative z-10 opacity-70" />}
              </button>
            );
          })}
        </nav>

        {/* Área Inferior: Tema e Usuário */}
        <div className="p-6 mt-auto border-t border-white/5 bg-gradient-to-b from-transparent to-black/40">
          
          <button 
            onClick={toggleTheme}
            className="flex items-center justify-between w-full px-4 py-3 mb-6 rounded-xl bg-white/5 border border-white/5 text-zinc-300 hover:bg-white/10 hover:border-white/10 transition-all duration-300 font-medium group active:scale-[0.98]"
          >
            <div className="flex items-center gap-3">
              <div className="p-1.5 rounded-lg bg-black/20 group-hover:bg-black/40 transition-colors">
                {theme === 'dark' ? (
                  <Sun size={16} className="text-orange-500 group-hover:rotate-90 transition-transform duration-700" /> 
                ) : (
                  <Moon size={16} className="text-blue-400 group-hover:-rotate-12 transition-transform duration-500" />
                )}
              </div>
              <span className="text-sm">{theme === 'dark' ? 'Modo Claro' : 'Modo Escuro'}</span>
            </div>
            <div className={`w-10 h-5 rounded-full p-1 transition-colors duration-500 ${theme === 'dark' ? 'bg-orange-500/20' : 'bg-blue-500/20'} flex items-center`}>
              <div className={`w-3.5 h-3.5 rounded-full transition-all duration-500 shadow-sm ${theme === 'dark' ? 'bg-orange-500 translate-x-4.5' : 'bg-blue-500 translate-x-0'}`}></div>
            </div>
          </button>

          <div className="flex items-center gap-4 mb-6 px-2">
            <div className="w-11 h-11 rounded-full bg-gradient-to-br from-red-500 to-orange-500 p-[2px] shadow-lg">
              <div className="w-full h-full bg-zinc-950 rounded-full flex items-center justify-center text-white font-bold text-sm">
                {userInitial}
              </div>
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="text-sm font-bold text-zinc-100 truncate tracking-wide">
                {userName}
              </p>
              <p className="text-xs text-zinc-500 truncate">
                {currentUser?.email}
              </p>
            </div>
          </div>
          
          <button 
            onClick={handleLogout}
            className="flex items-center justify-center gap-2 w-full px-4 py-3 rounded-xl bg-zinc-900/50 text-zinc-400 hover:bg-red-500/10 hover:text-red-400 border border-white/5 hover:border-red-500/30 transition-all duration-300 text-xs font-bold tracking-widest uppercase active:scale-95 group"
          >
            <LogOut size={16} className="group-hover:-translate-x-1 transition-transform" />
            Encerrar Sessão
          </button>
        </div>
      </aside>

      {/* Área de Conteúdo Central */}
      <main className="flex-1 flex flex-col h-full relative z-10 w-full overflow-hidden">
        
        {/* Header Mobile Otimizado */}
        <header className={`flex items-center justify-between h-20 px-6 bg-slate-50/90 dark:bg-zinc-950/90 backdrop-blur-xl border-b border-transparent lg:hidden z-30 sticky top-0 transition-all duration-300 ${scrolled ? 'shadow-md border-slate-200 dark:border-white/5' : ''}`}>
          <button onClick={() => setSidebarOpen(true)} className="p-2.5 -ml-2 rounded-xl bg-white dark:bg-white/5 text-slate-600 dark:text-zinc-300 hover:bg-slate-100 dark:hover:bg-white/10 hover:text-red-500 transition-all active:scale-95 shadow-sm dark:shadow-none border border-slate-100 dark:border-white/5">
            <Menu size={20} />
          </button>
          
          <span className="text-xl font-black tracking-tighter text-slate-900 dark:text-white absolute left-1/2 -translate-x-1/2">
            AUTO<span className="bg-gradient-to-br from-red-500 to-orange-500 bg-clip-text text-transparent">HUB</span>
          </span>
          
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-red-500 to-orange-500 p-[2px]">
            <div className="w-full h-full bg-slate-50 dark:bg-zinc-950 rounded-full flex items-center justify-center text-slate-900 dark:text-white font-bold text-xs">
              {userInitial}
            </div>
          </div>
        </header>

        {/* Container de Rolagem do Conteúdo */}
        <div id="main-scroll-area" className="flex-1 overflow-x-hidden overflow-y-auto p-4 sm:p-8 lg:p-12 w-full custom-scrollbar scroll-smooth">
          <div key={location.pathname} className="max-w-6xl mx-auto w-full animate-in slide-in-from-bottom-8 fade-in duration-700 ease-out fill-mode-both">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}