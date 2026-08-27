import { useState } from 'react';
import { User, Mail, Shield, Bell, Key, LogOut, CheckCircle2, ChevronRight, Smartphone } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Settings() {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const displayName = currentUser?.displayName || 'Piloto';
  const [activeTab, setActiveTab] = useState('profile');

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error("Erro ao sair", error);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-5xl mx-auto pb-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-slate-900 dark:text-zinc-100 tracking-tight transition-colors">Configurações</h2>
          <p className="text-slate-500 dark:text-zinc-400 mt-1 text-lg transition-colors">Gerencie sua conta, segurança e preferências do sistema.</p>
        </div>
        <button onClick={handleLogout} className="px-5 py-2.5 bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-500/20 font-bold rounded-xl transition-colors flex items-center gap-2 text-sm w-max">
          <LogOut size={16} /> Encerrar Sessão
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        
        {/* Menu Lateral das Configs */}
        <div className="md:col-span-1 space-y-2">
          <button 
            onClick={() => setActiveTab('profile')}
            className={`w-full flex items-center justify-between px-4 py-3.5 rounded-xl font-bold transition-all duration-300 ${activeTab === 'profile' ? 'bg-white dark:bg-zinc-900/80 shadow-sm border border-slate-200 dark:border-white/10 text-slate-900 dark:text-zinc-100' : 'text-slate-500 dark:text-zinc-400 hover:bg-slate-50 dark:hover:bg-white/5 border border-transparent'}`}
          >
            <div className="flex items-center gap-3"><User size={20} className={activeTab === 'profile' ? 'text-red-500' : ''} /> Meu Perfil</div>
            {activeTab === 'profile' && <ChevronRight size={16} className="text-slate-400" />}
          </button>
          
          <button 
            onClick={() => setActiveTab('security')}
            className={`w-full flex items-center justify-between px-4 py-3.5 rounded-xl font-bold transition-all duration-300 ${activeTab === 'security' ? 'bg-white dark:bg-zinc-900/80 shadow-sm border border-slate-200 dark:border-white/10 text-slate-900 dark:text-zinc-100' : 'text-slate-500 dark:text-zinc-400 hover:bg-slate-50 dark:hover:bg-white/5 border border-transparent'}`}
          >
            <div className="flex items-center gap-3"><Shield size={20} className={activeTab === 'security' ? 'text-red-500' : ''} /> Segurança</div>
            {activeTab === 'security' && <ChevronRight size={16} className="text-slate-400" />}
          </button>

          <button 
            onClick={() => setActiveTab('notifications')}
            className={`w-full flex items-center justify-between px-4 py-3.5 rounded-xl font-bold transition-all duration-300 ${activeTab === 'notifications' ? 'bg-white dark:bg-zinc-900/80 shadow-sm border border-slate-200 dark:border-white/10 text-slate-900 dark:text-zinc-100' : 'text-slate-500 dark:text-zinc-400 hover:bg-slate-50 dark:hover:bg-white/5 border border-transparent'}`}
          >
            <div className="flex items-center gap-3"><Bell size={20} className={activeTab === 'notifications' ? 'text-red-500' : ''} /> Notificações</div>
            {activeTab === 'notifications' && <ChevronRight size={16} className="text-slate-400" />}
          </button>
        </div>

        {/* Área Principal de Configurações */}
        <div className="md:col-span-3 space-y-6">
          
          {/* ABA: PERFIL */}
          {activeTab === 'profile' && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-500 fill-mode-both space-y-6">
              <div className="bg-white dark:bg-zinc-900/60 dark:backdrop-blur-xl p-8 rounded-[2rem] shadow-sm dark:shadow-none border border-slate-200 dark:border-white/10 transition-colors duration-500">
                <h3 className="text-xl font-bold text-slate-900 dark:text-zinc-100 mb-6 border-b border-slate-100 dark:border-white/5 pb-4">Dados da Conta</h3>
                
                <div className="space-y-8">
                  <div className="flex flex-col sm:flex-row items-center gap-6">
                    <div className="w-24 h-24 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-zinc-800 dark:to-zinc-900 border-4 border-white dark:border-zinc-950 rounded-full flex items-center justify-center text-3xl font-black text-slate-400 dark:text-zinc-500 shadow-md">
                      {displayName.charAt(0).toUpperCase()}
                    </div>
                    <div className="text-center sm:text-left">
                      <h4 className="text-lg font-bold text-slate-900 dark:text-zinc-100">{displayName}</h4>
                      <p className="text-sm text-slate-500 dark:text-zinc-400 mb-4">{currentUser?.email}</p>
                      <button className="px-5 py-2 bg-slate-900 dark:bg-white/10 hover:bg-slate-800 dark:hover:bg-white/20 text-white dark:text-zinc-100 text-sm font-bold rounded-xl transition-all shadow-md dark:shadow-none hover:-translate-y-0.5">
                        Alterar Foto
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="block text-xs font-bold text-slate-700 dark:text-zinc-400 uppercase tracking-wide">Nome Completo</label>
                      <input 
                        type="text" disabled value={displayName}
                        className="w-full px-4 py-3.5 bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/10 rounded-xl text-slate-500 dark:text-zinc-500 cursor-not-allowed shadow-inner" 
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="block text-xs font-bold text-slate-700 dark:text-zinc-400 uppercase tracking-wide">E-mail de Acesso</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                          <Mail size={18} className="text-slate-400 dark:text-zinc-500" />
                        </div>
                        <input 
                          type="email" disabled value={currentUser?.email || ''}
                          className="w-full pl-11 pr-4 py-3.5 bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/10 rounded-xl text-slate-500 dark:text-zinc-500 cursor-not-allowed shadow-inner" 
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-zinc-900/60 dark:backdrop-blur-xl p-8 rounded-[2rem] shadow-sm dark:shadow-none border border-slate-200 dark:border-white/10 transition-colors duration-500">
                <h3 className="text-xl font-bold text-slate-900 dark:text-zinc-100 mb-2">Plano Atual</h3>
                <p className="text-slate-500 dark:text-zinc-400 mb-6">Você está no plano de uso pessoal gratuito.</p>
                
                <div className="p-6 bg-slate-900 dark:bg-black/40 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-6 border border-transparent dark:border-white/5 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/20 blur-[50px] rounded-full pointer-events-none"></div>
                  <div className="relative z-10">
                    <h4 className="text-white font-bold text-xl flex items-center gap-2">AutoHub Free <span className="px-2 py-0.5 bg-white/10 text-xs rounded-full">Atual</span></h4>
                    <p className="text-slate-400 text-sm mt-1">Gestão de 1 veículo e prontuário básico.</p>
                  </div>
                  <button className="w-full sm:w-auto px-6 py-3.5 bg-gradient-to-r from-red-600 to-orange-500 hover:from-red-500 hover:to-orange-400 text-white font-bold rounded-xl transition-all duration-300 shadow-[0_8px_20px_rgba(239,68,68,0.3)] hover:-translate-y-1 relative z-10 whitespace-nowrap">
                    Fazer Upgrade
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ABA: SEGURANÇA */}
          {activeTab === 'security' && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-500 fill-mode-both space-y-6">
              <div className="bg-white dark:bg-zinc-900/60 dark:backdrop-blur-xl p-8 rounded-[2rem] shadow-sm dark:shadow-none border border-slate-200 dark:border-white/10 transition-colors duration-500">
                <h3 className="text-xl font-bold text-slate-900 dark:text-zinc-100 mb-6 border-b border-slate-100 dark:border-white/5 pb-4">Segurança da Conta</h3>
                
                <div className="space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between p-5 rounded-2xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-zinc-950/50">
                    <div className="flex items-start gap-4 mb-4 sm:mb-0">
                      <div className="p-3 bg-white dark:bg-zinc-900 rounded-xl border border-slate-100 dark:border-white/5 shadow-sm"><Key size={20} className="text-slate-600 dark:text-zinc-400" /></div>
                      <div>
                        <h4 className="font-bold text-slate-900 dark:text-zinc-100">Palavra-passe</h4>
                        <p className="text-sm text-slate-500 dark:text-zinc-400">Última alteração: há 2 meses</p>
                      </div>
                    </div>
                    <button className="px-5 py-2 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-white/5 text-slate-900 dark:text-zinc-100 font-bold rounded-xl transition-colors shadow-sm">
                      Alterar Senha
                    </button>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between p-5 rounded-2xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-zinc-950/50">
                    <div className="flex items-start gap-4 mb-4 sm:mb-0">
                      <div className="p-3 bg-white dark:bg-zinc-900 rounded-xl border border-slate-100 dark:border-white/5 shadow-sm"><Smartphone size={20} className="text-slate-600 dark:text-zinc-400" /></div>
                      <div>
                        <h4 className="font-bold text-slate-900 dark:text-zinc-100">Autenticação em 2 Passos (2FA)</h4>
                        <p className="text-sm text-slate-500 dark:text-zinc-400 flex items-center gap-1.5 mt-0.5">
                          <CheckCircle2 size={14} className="text-emerald-500" /> Ativado
                        </p>
                      </div>
                    </div>
                    <button className="px-5 py-2 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-white/5 text-slate-900 dark:text-zinc-100 font-bold rounded-xl transition-colors shadow-sm">
                      Gerenciar
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ABA: NOTIFICAÇÕES */}
          {activeTab === 'notifications' && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-500 fill-mode-both space-y-6">
              <div className="bg-white dark:bg-zinc-900/60 dark:backdrop-blur-xl p-8 rounded-[2rem] shadow-sm dark:shadow-none border border-slate-200 dark:border-white/10 transition-colors duration-500">
                <h3 className="text-xl font-bold text-slate-900 dark:text-zinc-100 mb-6 border-b border-slate-100 dark:border-white/5 pb-4">Preferências de Alertas</h3>
                
                <div className="space-y-6">
                  <div className="flex items-center justify-between p-4 rounded-xl hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
                    <div>
                      <h4 className="font-bold text-slate-900 dark:text-zinc-100">Alertas de Manutenção</h4>
                      <p className="text-sm text-slate-500 dark:text-zinc-400">Avisos sobre óleo, correia e revisões preditivas.</p>
                    </div>
                    <div className="relative inline-block w-12 mr-2 align-middle select-none transition duration-200 ease-in">
                      <input type="checkbox" name="toggle" id="toggle1" className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 border-slate-200 dark:border-zinc-700 appearance-none cursor-pointer transition-transform duration-300 checked:translate-x-6 checked:border-red-500" defaultChecked />
                      <label htmlFor="toggle1" className="toggle-label block overflow-hidden h-6 rounded-full bg-slate-200 dark:bg-zinc-800 cursor-pointer transition-colors duration-300 peer-checked:bg-red-500"></label>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-4 rounded-xl hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
                    <div>
                      <h4 className="font-bold text-slate-900 dark:text-zinc-100">Atualizações da FIPE</h4>
                      <p className="text-sm text-slate-500 dark:text-zinc-400">E-mail mensal com a valorização do seu veículo.</p>
                    </div>
                    <div className="relative inline-block w-12 mr-2 align-middle select-none transition duration-200 ease-in">
                      <input type="checkbox" name="toggle" id="toggle2" className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 border-slate-200 dark:border-zinc-700 appearance-none cursor-pointer transition-transform duration-300 checked:translate-x-6 checked:border-red-500" defaultChecked />
                      <label htmlFor="toggle2" className="toggle-label block overflow-hidden h-6 rounded-full bg-slate-200 dark:bg-zinc-800 cursor-pointer transition-colors duration-300 peer-checked:bg-red-500"></label>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-4 rounded-xl hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
                    <div>
                      <h4 className="font-bold text-slate-900 dark:text-zinc-100">Novidades AutoHub</h4>
                      <p className="text-sm text-slate-500 dark:text-zinc-400">Receba novos recursos e dicas de uso.</p>
                    </div>
                    <div className="relative inline-block w-12 mr-2 align-middle select-none transition duration-200 ease-in">
                      <input type="checkbox" name="toggle" id="toggle3" className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 border-slate-200 dark:border-zinc-700 appearance-none cursor-pointer transition-transform duration-300 checked:translate-x-6 checked:border-red-500" />
                      <label htmlFor="toggle3" className="toggle-label block overflow-hidden h-6 rounded-full bg-slate-200 dark:bg-zinc-800 cursor-pointer transition-colors duration-300 peer-checked:bg-red-500"></label>
                    </div>
                  </div>
                  
                  {/* Style inline para os toggles customizados se necessário, ou usar as classes Tailwind se funcionarem. Adicionando estilo CSS puro para fallback */}
                  <style>{`
                    .toggle-checkbox:checked { right: 0; border-color: #ef4444; }
                    .toggle-checkbox:checked + .toggle-label { background-color: #ef4444; }
                  `}</style>

                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}