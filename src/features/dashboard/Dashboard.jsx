import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Activity, Gauge, CarFront, PlusCircle, Fuel, ShieldCheck, TrendingUp, AlertCircle, Wrench, Edit, Info, CheckCircle2, Download } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { getUserVehicles, getVehicleLogs } from '../../services/db';
import { generateVehicleReport } from '../../utils/pdfGenerator';

export default function Dashboard() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [vehicles, setVehicles] = useState([]);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [greeting, setGreeting] = useState('Olá');

  useEffect(() => {
    // Define a saudação contextual com base no horário local
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) setGreeting('Bom dia');
    else if (hour >= 12 && hour < 18) setGreeting('Boa tarde');
    else setGreeting('Boa noite');

    async function fetchData() {
      if (currentUser) {
        try {
          const data = await getUserVehicles(currentUser.uid);
          setVehicles(data);
          
          // Se houver veículo, busca o prontuário dele
          if (data.length > 0) {
             const logsData = await getVehicleLogs(data[0].id);
             setLogs(logsData);
          }
        } catch (error) {
          console.error("Erro ao carregar dados", error);
        } finally {
          // Pequena pausa intencional para garantir uma transição suave do esqueleto visual
          setTimeout(() => setLoading(false), 600);
        }
      }
    }
    fetchData();
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

  const mainVehicle = vehicles[0];

  // Lógica de Manutenção Preditiva Dinâmica (Movida para antes dos retornos antecipados para respeitar as Regras dos Hooks)
  const predictiveAlerts = useMemo(() => {
    if (!mainVehicle) return [];
    const currentKm = Number(mainVehicle.currentKm) || 0;
    
    // Busca logs de óleo e correia (case-insensitive)
    const oilLogs = logs.filter(l => l.serviceType?.toLowerCase().includes('óleo') || l.serviceType?.toLowerCase().includes('oleo'));
    const beltLogs = logs.filter(l => l.serviceType?.toLowerCase().includes('correia'));

    const getLatestKm = (logArray) => {
      if (logArray.length === 0) return null;
      return Math.max(...logArray.map(l => Number(l.kmAtService) || 0));
    };

    const latestOil = getLatestKm(oilLogs);
    const latestBelt = getLatestKm(beltLogs);

    const alerts = [];

    // Óleo (intervalo sugerido: 10.000km)
    const oilInterval = 10000;
    if (latestOil === null) {
      alerts.push({
        id: 'oil',
        title: 'Troca de Óleo e Filtro',
        message: 'Sem registro no histórico. Verifique o nível e a validade.',
        urgent: true,
        icon: AlertCircle
      });
    } else {
      const nextOilKm = latestOil + oilInterval;
      const remainingOil = nextOilKm - currentKm;
      
      if (remainingOil <= 0) {
        alerts.push({
          id: 'oil',
          title: 'Troca de Óleo Atrasada',
          message: `O limite de ${nextOilKm.toLocaleString('pt-BR')} km foi ultrapassado. Agende a troca!`,
          urgent: true,
          icon: AlertCircle
        });
      } else if (remainingOil <= 2000) {
        alerts.push({
          id: 'oil',
          title: 'Troca de Óleo e Filtro',
          message: `Faltam apenas ${remainingOil.toLocaleString('pt-BR')} km para a próxima troca prevista.`,
          urgent: true,
          icon: AlertCircle
        });
      } else {
        alerts.push({
          id: 'oil',
          title: 'Troca de Óleo em dia',
          message: `Próxima troca prevista para os ${nextOilKm.toLocaleString('pt-BR')} km.`,
          urgent: false,
          icon: CheckCircle2
        });
      }
    }

    // Correia Dentada (intervalo sugerido: 50.000km)
    const beltInterval = 50000;
    if (latestBelt === null) {
       // se o carro passou de 50.000 e nao tem registro, alertar
       if (currentKm >= 50000) {
         alerts.push({
            id: 'belt',
            title: 'Correia Dentada',
            message: 'Atenção: Carro com km elevada sem registro de troca no sistema.',
            urgent: true,
            icon: AlertCircle
         });
       } else {
         const remaining = 50000 - currentKm;
         alerts.push({
            id: 'belt',
            title: 'Correia Dentada',
            message: `Verificação sugerida aos 50.000 km (Faltam ${remaining.toLocaleString('pt-BR')} km).`,
            urgent: false,
            icon: Wrench
         });
       }
    } else {
       const nextBeltKm = latestBelt + beltInterval;
       const remainingBelt = nextBeltKm - currentKm;
       
       if (remainingBelt <= 3000) {
         alerts.push({
            id: 'belt',
            title: 'Revisão da Correia',
            message: `Troca recomendada em breve! Faltam ${remainingBelt > 0 ? remainingBelt.toLocaleString('pt-BR') : 0} km.`,
            urgent: true,
            icon: AlertCircle
         });
       } else {
         alerts.push({
            id: 'belt',
            title: 'Correia Dentada',
            message: `Próxima substituição aos ${nextBeltKm.toLocaleString('pt-BR')} km.`,
            urgent: false,
            icon: CheckCircle2
         });
       }
    }

    return alerts;
  }, [mainVehicle, logs]);

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

              <div className="mt-6 flex flex-wrap items-center gap-3">
                <button 
                  onClick={() => navigate('/manage', { state: { editVehicle: mainVehicle } })}
                  className="flex items-center gap-2 px-4 py-2.5 bg-slate-50 dark:bg-white/5 hover:bg-slate-100 dark:hover:bg-white/10 border border-slate-200 dark:border-white/10 rounded-xl text-sm font-bold text-slate-600 dark:text-zinc-300 transition-all w-max"
                >
                  <Edit size={16} className="text-slate-400 dark:text-zinc-500" />
                  Editar Dados
                </button>

                <button 
                  onClick={() => generateVehicleReport(mainVehicle, logs, predictiveAlerts, autohubValue)}
                  className="flex items-center gap-2 px-4 py-2.5 bg-red-50 dark:bg-red-500/10 hover:bg-red-100 dark:hover:bg-red-500/20 border border-red-200 dark:border-red-500/20 rounded-xl text-sm font-bold text-red-600 dark:text-red-400 transition-all w-max"
                >
                  <Download size={16} />
                  Baixar Dossiê PDF
                </button>
              </div>
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

        {/* Widget Direito: Alertas Preditivos (Agora Dinâmico) */}
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
              Ver Histórico
            </button>
          </div>

          <div className="space-y-4">
            {predictiveAlerts.length > 0 ? (
              predictiveAlerts.map((alert) => (
                <div key={alert.id} className={`flex items-center gap-4 p-4 rounded-2xl border transition-colors group cursor-pointer ${
                  alert.urgent 
                    ? 'border-orange-200 dark:border-orange-500/30 bg-orange-50/50 dark:bg-orange-500/5 hover:bg-orange-50 dark:hover:bg-orange-500/10' 
                    : 'border-slate-100 dark:border-white/5 bg-slate-50 dark:bg-white/5 hover:bg-slate-100 dark:hover:bg-white/10'
                }`}>
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 transition-transform group-hover:scale-110 shadow-sm dark:shadow-none ${
                    alert.urgent
                      ? 'bg-orange-100 dark:bg-orange-500/20 text-orange-600 dark:text-orange-400'
                      : 'bg-white dark:bg-zinc-800 text-slate-500 dark:text-zinc-400 group-hover:text-slate-700 dark:group-hover:text-white'
                  }`}>
                    <alert.icon size={24} className={alert.urgent ? '' : (alert.icon === CheckCircle2 ? 'text-emerald-500' : '')} />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-slate-900 dark:text-zinc-100">{alert.title}</h4>
                    <p className="text-sm text-slate-500 dark:text-zinc-400 mt-0.5">
                      {alert.message}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex items-center justify-center p-8 bg-slate-50 dark:bg-white/5 rounded-2xl border border-slate-100 dark:border-white/5 text-slate-500 dark:text-zinc-400">
                Calculando manutenções preditivas...
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}