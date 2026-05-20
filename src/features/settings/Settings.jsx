import { User, Mail, Shield, Bell } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

export default function Settings() {
  const { currentUser } = useAuth();
  const displayName = currentUser?.displayName || 'Gabriel Ferreira';

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-4xl mx-auto">
      <div>
        <h2 className="text-3xl font-bold text-slate-900 dark:text-zinc-100 tracking-tight transition-colors">Configurações</h2>
        <p className="text-slate-500 dark:text-zinc-400 mt-1 text-lg transition-colors">Gerencie sua conta e preferências do sistema.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Menu Lateral das Configs */}
        <div className="space-y-2">
          <button className="w-full flex items-center gap-3 px-4 py-3 bg-white dark:bg-zinc-900/50 border border-slate-200 dark:border-white/10 rounded-xl text-slate-900 dark:text-zinc-100 font-bold shadow-sm dark:shadow-none transition-colors">
            <User size={20} className="text-red-500" /> Meu Perfil
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-3 text-slate-500 dark:text-zinc-400 hover:bg-slate-50 dark:hover:bg-white/5 rounded-xl font-medium transition-colors">
            <Shield size={20} /> Segurança
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-3 text-slate-500 dark:text-zinc-400 hover:bg-slate-50 dark:hover:bg-white/5 rounded-xl font-medium transition-colors">
            <Bell size={20} /> Notificações
          </button>
        </div>

        {/* Área Principal de Configurações */}
        <div className="md:col-span-2 space-y-6">
          
          <div className="bg-white dark:bg-zinc-900/40 dark:backdrop-blur-xl p-8 rounded-[2rem] shadow-sm dark:shadow-none border border-slate-200 dark:border-white/10 transition-colors duration-500">
            <h3 className="text-xl font-bold text-slate-900 dark:text-zinc-100 mb-6 border-b border-slate-100 dark:border-white/5 pb-4">Dados da Conta</h3>
            
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 bg-slate-100 dark:bg-zinc-800 border-2 border-slate-200 dark:border-white/10 rounded-full flex items-center justify-center text-2xl font-bold text-slate-400 dark:text-zinc-500">
                  {displayName.charAt(0)}
                </div>
                <div>
                  <button className="px-5 py-2.5 bg-slate-900 dark:bg-white/10 hover:bg-slate-800 dark:hover:bg-white/20 text-white dark:text-zinc-100 text-sm font-bold rounded-xl transition-colors">
                    Alterar Foto
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-5">
                <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-zinc-300 mb-2">Nome Completo</label>
                  <input 
                    type="text" disabled value={displayName}
                    className="w-full px-4 py-3.5 bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/10 rounded-xl text-slate-500 dark:text-zinc-500 cursor-not-allowed" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-zinc-300 mb-2">E-mail de Acesso</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Mail size={18} className="text-slate-400 dark:text-zinc-500" />
                    </div>
                    <input 
                      type="email" disabled value={currentUser?.email || ''}
                      className="w-full pl-11 pr-4 py-3.5 bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/10 rounded-xl text-slate-500 dark:text-zinc-500 cursor-not-allowed" 
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-zinc-900/40 dark:backdrop-blur-xl p-8 rounded-[2rem] shadow-sm dark:shadow-none border border-slate-200 dark:border-white/10 transition-colors duration-500">
            <h3 className="text-xl font-bold text-slate-900 dark:text-zinc-100 mb-2">Plano Atual</h3>
            <p className="text-slate-500 dark:text-zinc-400 mb-6">Você está no plano de uso pessoal gratuito.</p>
            
            <div className="p-6 bg-slate-900 dark:bg-black/40 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 border border-transparent dark:border-white/5">
              <div>
                <h4 className="text-white font-bold text-lg">AutoHub Free</h4>
                <p className="text-slate-400 text-sm mt-1">Gestão de 1 veículo e prontuário básico.</p>
              </div>
              <button className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-red-600 to-orange-500 hover:from-red-500 hover:to-orange-400 text-white font-bold rounded-xl transition-all duration-300 shadow-[0_0_20px_rgba(239,68,68,0.3)] hover:-translate-y-1">
                Fazer Upgrade
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}