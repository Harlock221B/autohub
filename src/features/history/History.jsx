import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FileText, Wrench, Calendar, Info, Gauge, ShieldCheck, 
  PlusCircle, Banknote, Sparkles, FileBadge, AlertTriangle
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { getUserVehicles, getVehicleLogs } from '../../services/db';

export default function History() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [vehicle, setVehicle] = useState(null);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      if (currentUser) {
        try {
          const vehiclesData = await getUserVehicles(currentUser.uid);
          if (vehiclesData.length > 0) {
            setVehicle(vehiclesData[0]);
            const logsData = await getVehicleLogs(vehiclesData[0].id);
            setLogs(logsData);
          }
        } catch (error) {
          console.error("Erro ao carregar dados", error);
        } finally {
          setTimeout(() => setLoading(false), 500);
        }
      }
    }
    fetchData();
  }, [currentUser]);

  // Função auxiliar para definir cores e ícones consoante a Categoria
  const getCategoryStyle = (category) => {
    switch (category) {
      case 'Manutenção Preventiva':
        return { icon: Wrench, color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-500/10' };
      case 'Manutenção Corretiva':
        return { icon: AlertTriangle, color: 'text-red-500', bg: 'bg-red-50 dark:bg-red-500/10' };
      case 'Acessório / Modificação':
        return { icon: PlusCircle, color: 'text-purple-500', bg: 'bg-purple-50 dark:bg-purple-500/10' };
      case 'Estética / Limpeza':
        return { icon: Sparkles, color: 'text-emerald-500', bg: 'bg-emerald-50 dark:bg-emerald-500/10' };
      case 'Documentação / Impostos':
        return { icon: FileBadge, color: 'text-amber-500', bg: 'bg-amber-50 dark:bg-amber-500/10' };
      default:
        return { icon: Wrench, color: 'text-slate-500', bg: 'bg-slate-50 dark:bg-white/5' };
    }
  };

  // SKELETON LOADING
  if (loading) {
    return (
      <div className="space-y-8 max-w-5xl mx-auto animate-pulse pb-10">
        <div className="space-y-3">
          <div className="h-8 w-64 bg-slate-200 dark:bg-zinc-800 rounded-lg"></div>
          <div className="h-5 w-48 bg-slate-100 dark:bg-zinc-800/50 rounded-lg"></div>
        </div>
        <div className="bg-slate-100 dark:bg-zinc-900/50 rounded-[2rem] h-[500px] p-8">
          <div className="border-l-2 border-slate-200 dark:border-zinc-800 ml-4 space-y-10 py-4 h-full">
            {[1, 2, 3].map((i) => (
              <div key={i} className="relative pl-8 flex items-center">
                <div className="absolute -left-[11px] w-5 h-5 rounded-full bg-slate-200 dark:bg-zinc-700 border-4 border-slate-100 dark:border-zinc-900"></div>
                <div className="w-full h-24 bg-slate-200 dark:bg-zinc-800/50 rounded-2xl"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ESTADO: SEM VEÍCULO
  if (!vehicle) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] text-center animate-in fade-in zoom-in-95 duration-500">
        <div className="relative group mb-8">
          <div className="absolute inset-0 bg-red-500/10 blur-3xl rounded-full transition-all group-hover:bg-red-500/20"></div>
          <div className="p-8 bg-slate-50 dark:bg-zinc-900 rounded-full border border-slate-200 dark:border-white/5 relative z-10">
            <Info size={48} className="text-slate-400 dark:text-zinc-500" />
          </div>
        </div>
        <h3 className="text-3xl font-black text-slate-900 dark:text-zinc-100 mb-3 tracking-tight">Sem histórico disponível</h3>
        <p className="text-slate-500 dark:text-zinc-400 max-w-md mx-auto mb-10 text-lg">
          Cadastre o seu primeiro veículo para desbloquear o prontuário digital inalterável.
        </p>
        <button 
          onClick={() => navigate('/manage')} 
          className="px-8 py-4 bg-gradient-to-r from-red-600 to-orange-500 hover:from-red-500 hover:to-orange-400 text-white font-bold rounded-xl transition-all duration-300 shadow-[0_8px_20px_rgba(239,68,68,0.25)] hover:-translate-y-1 flex items-center gap-3"
        >
          <PlusCircle size={20} /> Cadastrar Veículo Agora
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-10 max-w-5xl mx-auto">
      
      {/* Cabeçalho */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 animate-in fade-in slide-in-from-top-4 duration-500">
        <div>
          <h2 className="text-3xl font-bold text-slate-900 dark:text-zinc-100 tracking-tight">Prontuário do Veículo</h2>
          <p className="text-slate-500 dark:text-zinc-400 mt-1 text-lg flex items-center gap-2">
            Histórico auditável do <strong className="text-slate-900 dark:text-white capitalize">{vehicle.brand} {vehicle.model}</strong>.
            {vehicle.cautelar === 'Aprovado' && (
              <ShieldCheck size={16} className="text-emerald-500 ml-1" title="Cautelar Aprovada" />
            )}
          </p>
        </div>
        <button 
          onClick={() => navigate('/manage', { state: { view: 'addLog' } })} 
          className="px-5 py-2.5 bg-slate-100 dark:bg-white/10 hover:bg-slate-200 dark:hover:bg-white/20 text-slate-900 dark:text-white font-bold rounded-xl transition-all duration-300 active:scale-95 flex items-center gap-2 text-sm"
        >
          <PlusCircle size={16} /> Adicionar Serviço
        </button>
      </div>

      <div className="bg-white dark:bg-zinc-900/60 dark:backdrop-blur-xl rounded-[2rem] shadow-sm hover:shadow-md dark:shadow-none border border-slate-200 dark:border-white/10 p-6 md:p-10 transition-all duration-500">
        
        {/* ESTADO: SEM REGISTROS */}
        {logs.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 animate-in fade-in duration-700">
            <div className="p-6 bg-slate-50 dark:bg-zinc-950 rounded-full mb-6 border border-slate-100 dark:border-white/5">
              <FileText size={40} className="text-slate-300 dark:text-zinc-600" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-zinc-100 mb-2">Prontuário em Branco</h3>
            <p className="text-slate-500 dark:text-zinc-400 text-center max-w-sm">
              Nenhum serviço, acessório ou manutenção foi registado para o seu {vehicle.model} ainda.
            </p>
          </div>
        ) : (
          
          /* LINHA DO TEMPO (TIMELINE) */
          <div className="relative border-l-2 border-slate-200 dark:border-white/10 ml-4 md:ml-8 space-y-12 py-4">
            
            {logs.map((log, index) => {
              const delayClass = `delay-[${index * 150}ms]`; 
              const style = getCategoryStyle(log.category);
              const Icon = style.icon;

              // Tenta formatar a data que o utilizador escolheu, senão usa a data de criação
              let displayDate = 'Data Indisponível';
              if (log.serviceDate) {
                displayDate = new Date(log.serviceDate + 'T12:00:00').toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' });
              } else if (log.createdAt) {
                displayDate = new Date(log.createdAt.seconds * 1000).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' });
              }

              return (
                <div key={log.id || index} className={`relative pl-8 md:pl-12 group animate-in slide-in-from-bottom-8 fade-in duration-700 fill-mode-both ${delayClass}`}>
                  
                  {/* Ponto da Linha do Tempo */}
                  <div className="absolute -left-[21px] top-4 md:top-6 bg-white dark:bg-zinc-900 p-1.5 rounded-full border-4 border-slate-100 dark:border-zinc-800 transition-colors duration-300 group-hover:border-red-100 dark:group-hover:border-red-500/30 z-10">
                    <div className="w-3.5 h-3.5 bg-slate-300 dark:bg-zinc-600 rounded-full shadow-sm transition-colors duration-300 group-hover:bg-red-500 group-hover:shadow-[0_0_12px_rgba(239,68,68,0.8)]"></div>
                  </div>

                  {/* Card do Histórico */}
                  <div className="bg-slate-50 dark:bg-white/5 p-6 md:p-8 rounded-3xl border border-slate-100 dark:border-white/5 hover:border-red-500/30 hover:bg-white dark:hover:bg-white/10 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_10px_30px_rgba(0,0,0,0.05)] dark:hover:shadow-[0_10px_30px_rgba(0,0,0,0.2)] overflow-hidden relative">
                    
                    {/* Brilho de fundo por categoria */}
                    <div className={`absolute top-0 right-0 w-32 h-32 ${style.bg} blur-[50px] -z-10 rounded-full opacity-50`}></div>

                    <div className="flex flex-col lg:flex-row lg:items-start justify-between mb-5 gap-4">
                      <div>
                        {/* Categoria Tag */}
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 mb-3 rounded-lg ${style.bg} ${style.color} text-[10px] font-bold tracking-wider uppercase border border-transparent`}>
                          <Icon size={12} /> {log.category || 'Serviço'}
                        </span>
                        
                        <h4 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-zinc-100">
                          {log.serviceType}
                        </h4>
                      </div>
                      
                      <div className="flex flex-col gap-2 items-start lg:items-end">
                        {/* Badge de Quilometragem */}
                        <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white dark:bg-zinc-950 border border-slate-200 dark:border-white/10 text-slate-700 dark:text-zinc-300 text-sm font-bold tracking-wider shadow-sm">
                          <Gauge size={14} className="text-red-500" />
                          {Number(log.kmAtService).toLocaleString('pt-BR')} KM
                        </span>

                        {/* Badge de Custo (Se houver valor) */}
                        {log.cost && (
                          <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 text-emerald-700 dark:text-emerald-400 text-sm font-bold tracking-wider shadow-sm">
                            <Banknote size={14} />
                            R$ {log.cost}
                          </span>
                        )}
                      </div>
                    </div>
                    
                    {/* Anotações/Descrição */}
                    <div className="bg-white dark:bg-zinc-950/50 p-4 md:p-5 rounded-2xl border border-slate-100 dark:border-transparent mb-5 text-slate-600 dark:text-zinc-300 leading-relaxed font-medium">
                      {log.notes ? log.notes : <span className="text-slate-400 italic">Sem observações detalhadas.</span>}
                    </div>
                    
                    {/* Rodapé do Card (Metadados) */}
                    <div className="flex flex-wrap items-center gap-4 text-xs font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wider">
                      <div className="flex items-center gap-1.5">
                        <Calendar size={14} />
                        <span>{displayDate}</span>
                      </div>
                    </div>

                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}