import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Activity, Gauge, Calendar, CarFront, PlusCircle, Loader2, Fuel, ShieldCheck, TrendingUp, AlertCircle, Wrench, Edit, Info } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { getUserVehicles } from '../../services/db';

export default function Dashboard() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchVehicles() {
      if (currentUser) {
        try {
          const data = await getUserVehicles(currentUser.uid);
          setVehicles(data);
        } catch (error) {
          console.error("Erro ao carregar veículos", error);
        } finally {
          setLoading(false);
        }
      }
    }
    fetchVehicles();
  }, [currentUser]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-slate-400 dark:text-zinc-500">
        <Loader2 className="animate-spin mb-4 text-red-500" size={40} />
        <p className="font-medium tracking-wide">Sincronizando garagem...</p>
      </div>
    );
  }

  if (vehicles.length === 0) {
    return (
      <div className="space-y-8 max-w-4xl mx-auto mt-4">
        <div>
          <h2 className="text-3xl font-bold text-slate-900 dark:text-zinc-100 tracking-tight transition-colors">Olá, Piloto.</h2>
          <p className="text-slate-500 dark:text-zinc-400 mt-1 text-lg transition-colors">Sua garagem está vazia no momento.</p>
        </div>
        
        <div className="flex flex-col items-center justify-center p-12 md:p-20 bg-white dark:bg-zinc-900/50 dark:backdrop-blur-xl border border-slate-200 dark:border-white/10 rounded-[2rem] text-center shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none relative overflow-hidden transition-all duration-500">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-red-500/5 blur-[80px] rounded-full pointer-events-none"></div>
          <div className="p-6 bg-slate-50 dark:bg-white/5 rounded-full mb-6 border border-slate-100 dark:border-white/5 relative z-10">
            <CarFront size={48} className="text-slate-400 dark:text-zinc-500" />
          </div>
          <h3 className="text-2xl font-bold text-slate-900 dark:text-zinc-100 mb-3 relative z-10 transition-colors">Nenhum veículo encontrado</h3>
          <p className="text-slate-500 dark:text-zinc-400 max-w-md mx-auto mb-10 leading-relaxed relative z-10 transition-colors">
            Adicione seu primeiro carro para começar a monitorar o histórico inalterável e as manutenções preditivas da sua frota.
          </p>
          <button onClick={() => navigate('/manage')} className="px-8 py-4 bg-gradient-to-r from-red-600 to-orange-500 hover:from-red-500 hover:to-orange-400 hover:-translate-y-1 text-white font-bold rounded-xl transition-all duration-300 shadow-[0_8px_20px_rgba(239,68,68,0.25)] flex items-center gap-3 relative z-10">
            <PlusCircle size={20} /> Cadastrar Meu Primeiro Carro
          </button>
        </div>
      </div>
    );
  }

  const mainVehicle = vehicles[0];

  return (
    <div className="space-y-8 pb-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-slate-900 dark:text-zinc-100 tracking-tight transition-colors">Painel de Controle</h2>
          <p className="text-slate-500 dark:text-zinc-400 mt-1 text-lg transition-colors">Status e Dossiê do seu veículo principal.</p>
        </div>
        <button onClick={() => navigate('/manage')} className="px-5 py-2.5 bg-slate-100 dark:bg-white/10 hover:bg-slate-200 dark:hover:bg-white/20 text-slate-900 dark:text-white font-bold rounded-xl transition-colors text-sm flex items-center gap-2">
          <PlusCircle size={16} /> Novo Veículo
        </button>
      </div>

      {/* GRID SUPERIOR: Dossiê Completo */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        
        {/* Card Principal: Informações expandidas */}
        <div className="xl:col-span-2 bg-white dark:bg-zinc-900/50 dark:backdrop-blur-xl p-8 md:p-10 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none border border-slate-200 dark:border-white/10 flex flex-col relative overflow-hidden transition-all duration-500">
          <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b from-red-500 to-orange-500"></div>
          
          <div className="flex justify-between items-start">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <span className="inline-flex px-3 py-1 rounded-lg bg-red-50 dark:bg-red-500/10 border border-red-100 dark:border-red-500/20 text-red-600 dark:text-red-400 text-xs font-bold tracking-wider uppercase">
                  Veículo Principal
                </span>
                {mainVehicle.cautelar === 'Aprovado' && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-100 dark:border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold tracking-wider uppercase">
                    <ShieldCheck size={12} /> Cautelar Aprovada
                  </span>
                )}
              </div>
              
              <h3 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-zinc-100 capitalize tracking-tight">
                {mainVehicle.brand} {mainVehicle.model}
              </h3>
              <p className="text-slate-500 dark:text-zinc-400 font-medium mt-2 flex flex-wrap items-center gap-2">
                Ano {mainVehicle.year} • 
                <span className="uppercase bg-slate-100 dark:bg-white/10 px-2 py-0.5 rounded text-sm font-mono text-slate-700 dark:text-zinc-300 border border-slate-200 dark:border-white/5">{mainVehicle.plate}</span> • 
                {mainVehicle.engine && <span>{mainVehicle.engine}</span>}
              </p>

              {/* BOTÃO DE EDITAR VEÍCULO */}
              <button 
                onClick={() => navigate('/manage', { state: { editVehicle: mainVehicle } })}
                className="mt-5 flex items-center gap-2 px-4 py-2.5 bg-slate-50 dark:bg-white/5 hover:bg-slate-100 dark:hover:bg-white/10 border border-slate-200 dark:border-white/10 rounded-xl text-sm font-bold text-slate-600 dark:text-zinc-300 transition-all group w-max"
              >
                <Edit size={16} className="group-hover:text-red-500 transition-colors" />
                Editar Dossiê
              </button>
            </div>
            
            <div className="hidden sm:flex h-16 w-16 bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/10 rounded-2xl items-center justify-center shadow-sm dark:shadow-none">
              <CarFront size={28} className="text-slate-400 dark:text-zinc-500" />
            </div>
          </div>
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
            <div className="bg-slate-50 dark:bg-white/5 p-4 rounded-2xl border border-slate-100 dark:border-white/5 flex items-center gap-3 transition-colors">
              <div className="p-2.5 bg-white dark:bg-white/5 rounded-xl shadow-sm dark:shadow-none"><Gauge className="text-red-500" size={18} /></div>
              <div>
                <span className="block text-[10px] uppercase tracking-wider text-slate-500 dark:text-zinc-500 font-bold">Hodômetro</span>
                <span className="block text-sm font-bold text-slate-900 dark:text-zinc-100">{Number(mainVehicle.currentKm).toLocaleString('pt-BR')} km</span>
              </div>
            </div>

            <div className="bg-slate-50 dark:bg-white/5 p-4 rounded-2xl border border-slate-100 dark:border-white/5 flex items-center gap-3 transition-colors">
              <div className="p-2.5 bg-white dark:bg-white/5 rounded-xl shadow-sm dark:shadow-none"><Activity className="text-emerald-500" size={18} /></div>
              <div>
                <span className="block text-[10px] uppercase tracking-wider text-slate-500 dark:text-zinc-500 font-bold">Câmbio</span>
                <span className="block text-sm font-bold text-slate-900 dark:text-zinc-100">{mainVehicle.transmission || 'Não inf.'}</span>
              </div>
            </div>

            <div className="bg-slate-50 dark:bg-white/5 p-4 rounded-2xl border border-slate-100 dark:border-white/5 flex items-center gap-3 transition-colors">
              <div className="p-2.5 bg-white dark:bg-white/5 rounded-xl shadow-sm dark:shadow-none"><Fuel className="text-blue-500" size={18} /></div>
              <div>
                <span className="block text-[10px] uppercase tracking-wider text-slate-500 dark:text-zinc-500 font-bold">Urbano</span>
                <span className="block text-sm font-bold text-slate-900 dark:text-zinc-100">{mainVehicle.fuelCity ? `${mainVehicle.fuelCity} km/l` : '--'}</span>
              </div>
            </div>

            <div className="bg-slate-50 dark:bg-white/5 p-4 rounded-2xl border border-slate-100 dark:border-white/5 flex items-center gap-3 transition-colors">
              <div className="p-2.5 bg-white dark:bg-white/5 rounded-xl shadow-sm dark:shadow-none"><Fuel className="text-orange-500" size={18} /></div>
              <div>
                <span className="block text-[10px] uppercase tracking-wider text-slate-500 dark:text-zinc-500 font-bold">Rodoviário</span>
                <span className="block text-sm font-bold text-slate-900 dark:text-zinc-100">{mainVehicle.fuelHighway ? `${mainVehicle.fuelHighway} km/l` : '--'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Card Health Score */}
        <div className="bg-slate-900 dark:bg-zinc-900/80 dark:backdrop-blur-xl text-white p-8 rounded-[2rem] shadow-xl border border-slate-800 dark:border-white/10 flex flex-col justify-center items-center relative overflow-hidden transition-all duration-500">
           <div className="absolute -right-20 -top-20 w-64 h-64 bg-gradient-to-br from-red-500/20 to-orange-500/20 blur-[60px] rounded-full"></div>
           <h4 className="text-slate-400 dark:text-zinc-400 text-sm font-bold uppercase tracking-widest mb-2 z-10">Health Score</h4>
           
           <div className="relative flex items-center justify-center w-48 h-48 my-2">
             <svg className="absolute inset-0 w-full h-full transform -rotate-90" viewBox="0 0 200 200">
                <circle cx="100" cy="100" r="90" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-slate-800 dark:text-zinc-800/80" />
                <circle cx="100" cy="100" r="90" stroke="currentColor" strokeWidth="8" fill="transparent" strokeDasharray="565" strokeDashoffset="120" className="text-red-500 drop-shadow-[0_0_15px_rgba(239,68,68,0.3)] transition-all duration-1000 ease-out" />
             </svg>
             <div className="flex flex-col items-center z-10 mt-2">
               <span className="text-6xl font-black font-mono tracking-tighter">{mainVehicle.healthScore || 100}</span>
               <span className="text-xl text-slate-500 dark:text-zinc-500 font-bold -mt-1">/100</span>
             </div>
           </div>
           <p className="text-sm text-slate-400 dark:text-zinc-400 mt-4 text-center max-w-[220px] z-10">
             {mainVehicle.healthScore >= 80 ? 'Estrutura em excelente estado de conservação.' : 'Manutenção preventiva recomendada.'}
           </p>
        </div>
      </div>

      {/* GRID INFERIOR: Widgets de Inteligência */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Widget 1: Valorização (Simulado) */}
        <div className="bg-white dark:bg-zinc-900/40 dark:backdrop-blur-xl p-8 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none border border-slate-200 dark:border-white/10 transition-colors duration-500">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2.5 bg-emerald-50 dark:bg-emerald-500/10 rounded-xl text-emerald-600 dark:text-emerald-400"><TrendingUp size={20} /></div>
            <h3 className="font-bold text-slate-900 dark:text-zinc-100">Estimativa de Revenda</h3>
          </div>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center pb-4 border-b border-slate-100 dark:border-white/5">
              <span className="text-slate-500 dark:text-zinc-400 font-medium">Tabela FIPE (Ref)</span>
              <span className="text-slate-900 dark:text-zinc-100 font-bold">R$ 82.500</span>
            </div>
            <div className="flex justify-between items-center">
              <div>
                <span className="text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1.5">Valor AutoHub <Info size={14}/></span>
                <p className="text-[10px] text-slate-400 dark:text-zinc-500 uppercase tracking-wider mt-0.5">Com histórico validado</p>
              </div>
              <span className="text-2xl font-black text-slate-900 dark:text-zinc-100 text-right">R$ 87.900</span>
            </div>
            
            <div className="mt-4 p-3 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-100 dark:border-emerald-500/20 rounded-xl">
              <p className="text-xs text-emerald-700 dark:text-emerald-400 font-medium text-center">
                Seu histórico inalterável agrega até <span className="font-bold">+6.5%</span> no valor de mercado.
              </p>
            </div>
          </div>
        </div>

        {/* Widget 2: Próximas Manutenções */}
        <div className="lg:col-span-2 bg-white dark:bg-zinc-900/40 dark:backdrop-blur-xl p-8 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none border border-slate-200 dark:border-white/10 transition-colors duration-500">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-orange-50 dark:bg-orange-500/10 rounded-xl text-orange-600 dark:text-orange-400"><Wrench size={20} /></div>
              <h3 className="font-bold text-slate-900 dark:text-zinc-100">Manutenção Preditiva</h3>
            </div>
            <button className="text-sm font-bold text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300">Ver Todas</button>
          </div>

          {/* Lista de alertas preditivos */}
          <div className="space-y-4">
            <div className="flex items-center gap-4 p-4 rounded-xl border border-orange-200 dark:border-orange-500/30 bg-orange-50/50 dark:bg-orange-500/5">
              <div className="w-10 h-10 rounded-full bg-orange-100 dark:bg-orange-500/20 flex items-center justify-center text-orange-600 dark:text-orange-400 shrink-0">
                <AlertCircle size={20} />
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-slate-900 dark:text-zinc-100">Troca de Óleo e Filtro</h4>
                <p className="text-sm text-slate-500 dark:text-zinc-400">Previsto para atingir limite nos próximos <span className="font-bold text-orange-600 dark:text-orange-400">1.200 km</span>.</p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 rounded-xl border border-slate-100 dark:border-white/5 bg-slate-50 dark:bg-white/5">
              <div className="w-10 h-10 rounded-full bg-white dark:bg-white/10 flex items-center justify-center text-slate-400 dark:text-zinc-400 shrink-0 shadow-sm dark:shadow-none">
                <Wrench size={20} />
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-slate-900 dark:text-zinc-100">Correia Dentada</h4>
                <p className="text-sm text-slate-500 dark:text-zinc-400">Verificação agendada para os <span className="font-bold text-slate-700 dark:text-zinc-300">100.000 km</span> (Faltam 15.000 km).</p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}