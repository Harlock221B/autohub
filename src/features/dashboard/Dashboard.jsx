import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Activity, Gauge, CarFront, PlusCircle, Fuel, ShieldCheck, TrendingUp, AlertCircle, Wrench, Edit, Info } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { getUserVehicles } from '../../services/db';

export default function Dashboard() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [greeting, setGreeting] = useState('Olá');

  useEffect(() => {
    // Define a saudação contextual com base no horário local
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) setGreeting('Bom dia');
    else if (hour >= 12 && hour < 18) setGreeting('Boa tarde');
    else setGreeting('Boa noite');

    async function fetchVehicles() {
      if (currentUser) {
        try {
          const data = await getUserVehicles(currentUser.uid);
          setVehicles(data);
        } catch (error) {
          console.error("Erro ao carregar veículos", error);
        } finally {
          // Pequena pausa intencional para garantir uma transição suave do esqueleto visual
          setTimeout(() => setLoading(false), 600);
        }
      }
    }
    fetchVehicles();
  }, [currentUser]);

  // Extração do primeiro nome do usuário
  const userName = currentUser?.displayName ? currentUser.displayName.split(' ')[0] : 'Piloto';

  // Auxiliares para cálculo e formatação monetária da FIPE
  const parseFipeToNumber = (fipeStr) => {
    if (!fipeStr) return 0;
    const cleanStr = fipeStr.replace('R$', '').replace(/\./g, '').replace(',', '.').trim();
    return parseFloat(cleanStr) || 0;
  };

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);
  };

  // SKELETON LOADING (Evita piscadas bruscas de tela)
  if (loading) {
    return (
      <div className="space-y-8 pb-10 animate-pulse">
        <div className="space-y-3">
          <div className="h-8 w-48 bg-slate-200 dark:bg-zinc-800 rounded-lg"></div>
          <div className="h-5 w-64 bg-slate-100 dark:bg-zinc-800/50 rounded-lg"></div>
        </div>
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className="xl:col-span-2 h-80 bg-slate-100 dark:bg-zinc-900/50 rounded-[2rem]"></div>
          <div className="h-80 bg-slate-100 dark:bg-zinc-900/50 rounded-[2rem]"></div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
          <div className="h-64 bg-slate-100 dark:bg-zinc-900/50 rounded-[2rem]"></div>
          <div className="lg:col-span-2 h-64 bg-slate-100 dark:bg-zinc-900/50 rounded-[2rem]"></div>
        </div>
      </div>
    );
  }

  // GARAGEM VAZIA (Sem veículos cadastrados)
  if (vehicles.length === 0) {
    return (
      <div className="space-y-8 max-w-4xl mx-auto mt-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div>
          <h2 className="text-3xl font-bold text-slate-900 dark:text-zinc-100 tracking-tight">
            {greeting}, {userName}.
          </h2>
          <p className="text-slate-500 dark:text-zinc-400 mt-1 text-lg">Sua garagem está vazia no momento.</p>
        </div>
        
        <div className="flex flex-col items-center justify-center p-12 md:p-20 bg-white dark:bg-zinc-900/50 dark:backdrop-blur-xl border border-slate-200 dark:border-white/10 rounded-[2rem] text-center shadow-lg dark:shadow-none relative overflow-hidden group">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-72 h-72 bg-gradient-to-b from-red-500/10 to-transparent blur-[80px] rounded-full pointer-events-none transition-all duration-700 group-hover:bg-red-500/20 group-hover:scale-110"></div>
          
          <div className="p-6 bg-slate-50 dark:bg-white/5 rounded-full mb-6 border border-slate-100 dark:border-white/5 relative z-10 transform transition-transform duration-500 group-hover:-translate-y-2">
            <CarFront size={56} strokeWidth={1.5} className="text-slate-400 dark:text-zinc-500" />
          </div>
          
          <h3 className="text-2xl font-bold text-slate-900 dark:text-zinc-100 mb-3 relative z-10">
            Nenhum veículo encontrado
          </h3>
          <p className="text-slate-500 dark:text-zinc-400 max-w-md mx-auto mb-10 leading-relaxed relative z-10">
            Adicione seu primeiro carro para começar a monitorar o histórico inalterável e as manutenções preditivas da sua frota.
          </p>
          
          <button 
            onClick={() => navigate('/manage')} 
            className="px-8 py-4 bg-gradient-to-r from-red-600 to-orange-500 hover:from-red-500 hover:to-orange-400 hover:-translate-y-1 hover:shadow-[0_12px_25px_rgba(239,68,68,0.35)] text-white font-bold rounded-xl transition-all duration-300 shadow-[0_8px_20px_rgba(239,68,68,0.25)] flex items-center gap-3 relative z-10"
          >
            <PlusCircle size={20} /> Cadastrar Meu Primeiro Carro
          </button>
        </div>
      </div>
    );
  }

  const mainVehicle = vehicles[0];
  const fipeNumber = parseFipeToNumber(mainVehicle.fipeValue);
  const autohubValue = fipeNumber > 0 ? fipeNumber * 1.065 : 0; // Valorização de 6.5% baseada no histórico

  // Formatação elegante dos anos (Fabricação / Modelo) com fallback de segurança
  const renderVehicleYears = () => {
    if (mainVehicle.manufactureYear && mainVehicle.modelYear) {
      if (mainVehicle.manufactureYear === mainVehicle.modelYear) {
        return mainVehicle.modelYear;
      }
      return `${mainVehicle.manufactureYear}/${mainVehicle.modelYear}`;
    }
    return mainVehicle.manufactureYear || mainVehicle.modelYear || mainVehicle.year || 'N/A';
  };

  return (
    <div className="space-y-8 pb-10">
      
      {/* Linha Superior: Saudação */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 animate-in fade-in slide-in-from-top-4 duration-500">
        <div>
          <h2 className="text-3xl font-bold text-slate-900 dark:text-zinc-100 tracking-tight">
            {greeting}, {userName}.
          </h2>
          <p className="text-slate-500 dark:text-zinc-400 mt-1 text-lg">
            Aqui está o status do seu veículo principal.
          </p>
        </div>
        <button 
          onClick={() => navigate('/manage')} 
          className="px-5 py-2.5 bg-slate-100 dark:bg-white/10 hover:bg-slate-200 dark:hover:bg-white/20 text-slate-900 dark:text-white font-bold rounded-xl transition-all duration-300 hover:scale-[1.02] active:scale-95 flex items-center gap-2 text-sm"
        >
          <PlusCircle size={16} /> Novo Veículo
        </button>
      </div>

      {/* GRID SUPERIOR: Resumo Técnico do Carro */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        
        {/* Card Grande: Detalhes do Automóvel */}
        <div className="xl:col-span-2 bg-white dark:bg-zinc-900/50 dark:backdrop-blur-xl p-8 md:p-10 rounded-[2rem] shadow-sm border border-slate-200 dark:border-white/10 flex flex-col relative overflow-hidden transition-all duration-500 group animate-in fade-in slide-in-from-left-4 delay-100 fill-mode-both">
          <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b from-red-500 to-orange-500 opacity-80 group-hover:opacity-100 transition-opacity"></div>
          
          <div className="flex justify-between items-start">
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-4">
                <span className="inline-flex px-3 py-1 rounded-lg bg-red-50 dark:bg-red-500/10 border border-red-100 dark:border-red-500/20 text-red-600 dark:text-red-400 text-xs font-bold tracking-wider uppercase">
                  Veículo Principal
                </span>
                {mainVehicle.cautelar === 'Aprovado' && (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-100 dark:border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-bold tracking-wider uppercase">
                    <ShieldCheck size={14} /> Cautelar Aprovada
                  </span>
                )}
              </div>
              
              <h3 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-zinc-100 capitalize tracking-tight group-hover:text-red-500 transition-colors duration-300">
                {mainVehicle.brand} {mainVehicle.model}
              </h3>
              <div className="text-slate-500 dark:text-zinc-400 font-medium mt-2 flex flex-wrap items-center gap-2">
                <span>Ano {renderVehicleYears()}</span> • 
                <span className="uppercase bg-slate-100 dark:bg-white/10 px-2.5 py-0.5 rounded-md text-sm font-mono text-slate-700 dark:text-zinc-300 border border-slate-200 dark:border-white/5 tracking-wider">
                  {mainVehicle.plate}
                </span> • 
                {mainVehicle.engine && <span>{mainVehicle.engine}</span>}
              </div>

              <button 
                onClick={() => navigate('/manage', { state: { editVehicle: mainVehicle } })}
                className="mt-6 flex items-center gap-2 px-4 py-2.5 bg-slate-50 dark:bg-white/5 hover:bg-slate-100 dark:hover:bg-white/10 border border-slate-200 dark:border-white/10 rounded-xl text-sm font-bold text-slate-600 dark:text-zinc-300 transition-all hover:pr-5 w-max"
              >
                <Edit size={16} className="text-slate-400 dark:text-zinc-500" />
                Editar Dossiê
              </button>
            </div>
            
            <div className="hidden sm:flex h-16 w-16 bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/10 rounded-2xl items-center justify-center shadow-sm dark:shadow-none transition-transform duration-500 group-hover:rotate-6">
              <CarFront size={28} className="text-slate-400 dark:text-zinc-500" />
            </div>
          </div>
          
          {/* Subgrid Interna de Atributos */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
            <div className="bg-slate-50 dark:bg-white/5 hover:bg-slate-100 dark:hover:bg-white/10 p-4 rounded-2xl border border-slate-100 dark:border-white/5 flex items-center gap-3 transition-colors cursor-default">
              <div className="p-2.5 bg-white dark:bg-zinc-900 rounded-xl shadow-sm"><Gauge className="text-red-500" size={18} /></div>
              <div>
                <span className="block text-[10px] uppercase tracking-wider text-slate-500 dark:text-zinc-500 font-bold">Hodômetro</span>
                <span className="block text-sm font-bold text-slate-900 dark:text-zinc-100">{Number(mainVehicle.currentKm).toLocaleString('pt-BR')} km</span>
              </div>
            </div>

            <div className="bg-slate-50 dark:bg-white/5 hover:bg-slate-100 dark:hover:bg-white/10 p-4 rounded-2xl border border-slate-100 dark:border-white/5 flex items-center gap-3 transition-colors cursor-default">
              <div className="p-2.5 bg-white dark:bg-zinc-900 rounded-xl shadow-sm"><Activity className="text-emerald-500" size={18} /></div>
              <div>
                <span className="block text-[10px] uppercase tracking-wider text-slate-500 dark:text-zinc-500 font-bold">Câmbio</span>
                <span className="block text-sm font-bold text-slate-900 dark:text-zinc-100">{mainVehicle.transmission || 'Não inf.'}</span>
              </div>
            </div>

            <div className="bg-slate-50 dark:bg-white/5 hover:bg-slate-100 dark:hover:bg-white/10 p-4 rounded-2xl border border-slate-100 dark:border-white/5 flex items-center gap-3 transition-colors cursor-default">
              <div className="p-2.5 bg-white dark:bg-zinc-900 rounded-xl shadow-sm"><Fuel className="text-blue-500" size={18} /></div>
              <div>
                <span className="block text-[10px] uppercase tracking-wider text-slate-500 dark:text-zinc-500 font-bold">Urbano</span>
                <span className="block text-sm font-bold text-slate-900 dark:text-zinc-100">{mainVehicle.fuelCity ? `${mainVehicle.fuelCity} km/l` : '--'}</span>
              </div>
            </div>

            <div className="bg-slate-50 dark:bg-white/5 hover:bg-slate-100 dark:hover:bg-white/10 p-4 rounded-2xl border border-slate-100 dark:border-white/5 flex items-center gap-3 transition-colors cursor-default">
              <div className="p-2.5 bg-white dark:bg-zinc-900 rounded-xl shadow-sm"><Fuel className="text-orange-500" size={18} /></div>
              <div>
                <span className="block text-[10px] uppercase tracking-wider text-slate-500 dark:text-zinc-500 font-bold">Rodoviário</span>
                <span className="block text-sm font-bold text-slate-900 dark:text-zinc-100">{mainVehicle.fuelHighway ? `${mainVehicle.fuelHighway} km/l` : '--'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Card Radial: Health Score */}
        <div className="bg-slate-900 dark:bg-zinc-900/80 dark:backdrop-blur-xl text-white p-8 rounded-[2rem] shadow-xl border border-slate-800 dark:border-white/10 flex flex-col justify-center items-center relative overflow-hidden animate-in fade-in slide-in-from-right-4 delay-200 fill-mode-both hover:scale-[1.02] transition-transform duration-500">
           <div className="absolute -right-20 -top-20 w-64 h-64 bg-gradient-to-br from-red-500/20 to-orange-500/20 blur-[60px] rounded-full"></div>
           <h4 className="text-slate-400 dark:text-zinc-400 text-sm font-bold uppercase tracking-widest mb-2 z-10">Health Score</h4>
           
           <div className="relative flex items-center justify-center w-48 h-48 my-2">
             <svg className="absolute inset-0 w-full h-full transform -rotate-90" viewBox="0 0 200 200">
                <circle cx="100" cy="100" r="90" stroke="currentColor" strokeWidth="6" fill="transparent" className="text-slate-800 dark:text-zinc-800/80" />
                <circle 
                  cx="100" cy="100" r="90" 
                  stroke="currentColor" 
                  strokeWidth="8" 
                  strokeLinecap="round"
                  fill="transparent" 
                  strokeDasharray="565" 
                  strokeDashoffset={565 - (565 * (mainVehicle.healthScore || 100)) / 100} 
                  className="text-red-500 drop-shadow-[0_0_15px_rgba(239,68,68,0.4)] transition-all duration-1500 ease-out" 
                />
             </svg>
             <div className="flex flex-col items-center z-10 mt-2">
               <span className="text-6xl font-black font-mono tracking-tighter">
                 {mainVehicle.healthScore || 100}
               </span>
               <span className="text-xl text-slate-500 dark:text-zinc-500 font-bold -mt-1">/100</span>
             </div>
           </div>
           <p className="text-sm text-slate-400 dark:text-zinc-400 mt-4 text-center max-w-[220px] z-10">
             {(mainVehicle.healthScore || 100) >= 80 
               ? 'Estrutura em excelente estado de conservação.' 
               : 'Atenção: Manutenção preventiva recomendada.'}
           </p>
        </div>
      </div>

      {/* GRID INFERIOR: Widgets Financeiros e Preditivos */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Widget Esquerdo: Valorização Dinâmica FIPE */}
        <div className="bg-white dark:bg-zinc-900/40 dark:backdrop-blur-xl p-8 rounded-[2rem] shadow-sm hover:shadow-md dark:shadow-none border border-slate-200 dark:border-white/10 transition-all duration-500 animate-in fade-in slide-in-from-bottom-4 delay-300 fill-mode-both hover:-translate-y-1">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2.5 bg-emerald-50 dark:bg-emerald-500/10 rounded-xl text-emerald-600 dark:text-emerald-400"><TrendingUp size={20} /></div>
            <h3 className="font-bold text-slate-900 dark:text-zinc-100">Estimativa de Revenda</h3>
          </div>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center pb-4 border-b border-slate-100 dark:border-white/5">
              <span className="text-slate-500 dark:text-zinc-400 font-medium">Tabela FIPE Oficial</span>
              <span className="text-slate-900 dark:text-zinc-100 font-bold">
                {mainVehicle.fipeValue || 'Não informada'}
              </span>
            </div>
            <div className="flex justify-between items-center pt-2">
              <div>
                <span className="text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1.5">
                  Valor AutoHub <Info size={14} className="cursor-pointer hover:text-emerald-500"/>
                </span>
                <p className="text-[10px] text-slate-400 dark:text-zinc-500 uppercase tracking-wider mt-0.5">Com histórico validado</p>
              </div>
              <span className="text-2xl font-black text-slate-900 dark:text-zinc-100 text-right">
                {autohubValue ? formatCurrency(autohubValue) : '--'}
              </span>
            </div>
            
            <div className="mt-5 p-4 bg-gradient-to-r from-emerald-50 to-transparent dark:from-emerald-500/10 dark:to-transparent border-l-4 border-emerald-500 rounded-r-xl">
              <p className="text-xs text-emerald-800 dark:text-emerald-300 font-medium">
                Seu histórico inalterável agrega até <strong className="font-black text-emerald-600 dark:text-emerald-400">+6.5%</strong> no valor de mercado.
              </p>
            </div>
          </div>
        </div>

        {/* Widget Direito: Alertas Preditivos */}
        <div className="lg:col-span-2 bg-white dark:bg-zinc-900/40 dark:backdrop-blur-xl p-8 rounded-[2rem] shadow-sm hover:shadow-md dark:shadow-none border border-slate-200 dark:border-white/10 transition-all duration-500 animate-in fade-in slide-in-from-bottom-4 delay-400 fill-mode-both hover:-translate-y-1">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-orange-50 dark:bg-orange-500/10 rounded-xl text-orange-600 dark:text-orange-400"><Wrench size={20} /></div>
              <h3 className="font-bold text-slate-900 dark:text-zinc-100">Manutenção Preditiva</h3>
            </div>
            <button 
              onClick={() => navigate('/history')}
              className="text-sm font-bold text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 transition-colors"
            >
              Ver Histórico Completo
            </button>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-4 p-4 rounded-2xl border border-orange-200 dark:border-orange-500/30 bg-orange-50/50 dark:bg-orange-500/5 transition-colors hover:bg-orange-50 dark:hover:bg-orange-500/10 group cursor-pointer">
              <div className="w-12 h-12 rounded-full bg-orange-100 dark:bg-orange-500/20 flex items-center justify-center text-orange-600 dark:text-orange-400 shrink-0 group-hover:scale-110 transition-transform">
                <AlertCircle size={24} />
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-slate-900 dark:text-zinc-100">Troca de Óleo e Filtro</h4>
                <p className="text-sm text-slate-500 dark:text-zinc-400 mt-0.5">
                  Previsto para atingir limite nos próximos <span className="font-bold text-orange-600 dark:text-orange-400">1.200 km</span>.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 rounded-2xl border border-slate-100 dark:border-white/5 bg-slate-50 dark:bg-white/5 hover:bg-slate-100 dark:hover:bg-white/10 transition-colors group cursor-pointer">
              <div className="w-12 h-12 rounded-full bg-white dark:bg-zinc-800 flex items-center justify-center text-slate-400 dark:text-zinc-400 shrink-0 shadow-sm dark:shadow-none group-hover:scale-110 transition-transform group-hover:text-slate-600 dark:group-hover:text-white">
                <Wrench size={24} />
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-slate-900 dark:text-zinc-100">Correia Dentada</h4>
                <p className="text-sm text-slate-500 dark:text-zinc-400 mt-0.5">
                  Verificação agendada para os <span className="font-bold text-slate-700 dark:text-zinc-300">100.000 km</span> (Faltam 15.000 km).
                </p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}