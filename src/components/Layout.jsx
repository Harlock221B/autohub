import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { LayoutDashboard, CarFront, FileText, Settings, LogOut, Menu, X, Sun, Moon } from 'lucide-react';

export default function Layout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

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

  return (
    <div className="flex h-screen overflow-hidden font-sans text-slate-900 dark:text-zinc-100 transition-colors duration-500">
      
      {/* Overlay Mobile */}
      <div 
        className={`fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition-opacity duration-500 lg:hidden ${sidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} 
        onClick={() => setSidebarOpen(false)} 
      />

      {/* Sidebar FIXA NO DARK MODE para dar contraste */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-72 bg-zinc-950 text-zinc-100 border-r border-white/5 transform transition-transform duration-500 cubic-bezier(0.4, 0, 0.2, 1) lg:static lg:translate-x-0 flex flex-col shadow-2xl ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        
        {/* Logo Text */}
        <div className="flex items-center justify-between h-24 px-8">
          <h1 className="text-3xl font-black tracking-tighter text-white">
            AUTO<span className="bg-gradient-to-br from-red-500 to-orange-500 bg-clip-text text-transparent">HUB</span>
          </h1>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden p-2 rounded-full bg-white/5 text-zinc-400 hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Navegação - Sempre com visual escuro */}
        <nav className="flex-1 px-5 py-6 space-y-2 overflow-y-auto">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <button 
                key={item.name} 
                onClick={() => {
                  navigate(item.path);
                  setSidebarOpen(false);
                }}
                className={`flex w-full items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-300 font-medium group ${
                  isActive 
                    ? 'bg-gradient-to-r from-red-600/20 to-orange-500/10 text-white shadow-[0_2px_10px_rgba(239,68,68,0.1)] border border-red-500/30' 
                    : 'text-zinc-400 hover:bg-white/5 hover:text-zinc-100 border border-transparent'
                }`}
              >
                <item.icon 
                  size={20} 
                  className={`transition-colors duration-300 ${isActive ? 'text-red-500' : 'text-zinc-500 group-hover:text-zinc-300'}`} 
                />
                <span className="tracking-wide">{item.name}</span>
              </button>
            );
          })}
        </nav>

        {/* Área Inferior: Tema e Usuário (Sempre Escuro) */}
        <div className="p-6 mt-auto border-t border-white/5 bg-black/20">
          
          <button 
            onClick={toggleTheme}
            className="flex items-center justify-between w-full px-4 py-3 mb-6 rounded-xl bg-white/5 border border-transparent text-zinc-400 hover:bg-white/10 transition-all duration-300 font-medium group"
          >
            <div className="flex items-center gap-3">
              {theme === 'dark' ? (
                <Sun size={18} className="text-orange-500 group-hover:rotate-45 transition-transform duration-500" /> 
              ) : (
                <Moon size={18} className="text-blue-400 group-hover:-rotate-12 transition-transform duration-500" />
              )}
              <span>{theme === 'dark' ? 'Modo Claro Ativo' : 'Modo Escuro Ativo'}</span>
            </div>
          </button>

          <div className="flex items-center gap-4 mb-5 px-2">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-red-500 to-orange-500 p-[2px] shadow-sm">
              <div className="w-full h-full bg-zinc-950 rounded-full flex items-center justify-center text-white font-bold text-sm">
                {userInitial}
              </div>
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="text-sm font-bold text-zinc-100 truncate">
                {currentUser?.displayName || 'Piloto'}
              </p>
              <p className="text-xs text-zinc-500 truncate">
                {currentUser?.email}
              </p>
            </div>
          </div>
          
          <button 
            onClick={handleLogout}
            className="flex items-center justify-center gap-2 w-full px-4 py-3 rounded-xl bg-white/5 text-zinc-400 hover:bg-red-500/10 hover:text-red-400 border border-transparent hover:border-red-500/30 transition-all duration-300 text-sm font-bold tracking-wider uppercase"
          >
            <LogOut size={16} />
            Sair
          </button>
        </div>
      </aside>

      {/* Área de Conteúdo Central (Esta muda entre claro e escuro) */}
      <main className="flex-1 flex flex-col h-full relative z-10">
        <header className="flex items-center justify-between h-20 px-6 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-xl border-b border-slate-200 dark:border-white/5 lg:hidden z-30 sticky top-0 transition-colors duration-500">
          <button onClick={() => setSidebarOpen(true)} className="p-2 -ml-2 rounded-xl bg-slate-50 dark:bg-white/5 text-slate-600 dark:text-zinc-300 hover:bg-slate-100 transition-colors">
            <Menu size={20} />
          </button>
          <span className="text-xl font-black tracking-tighter text-slate-900 dark:text-white">
            AUTO<span className="bg-gradient-to-br from-red-500 to-orange-500 bg-clip-text text-transparent">HUB</span>
          </span>
          <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-zinc-800" />
        </header>

        <div className="flex-1 overflow-auto p-4 sm:p-8 lg:p-12 w-full">
          <div key={location.pathname} className="max-w-6xl mx-auto animate-in slide-in-from-bottom-4 fade-in duration-700 ease-out fill-mode-both">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}