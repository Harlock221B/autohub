import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { addVehicle, updateVehicle, getUserVehicles, addMaintenanceLog } from '../../services/db';
import { 
  CarFront, Wrench, ArrowLeft, PlusCircle, CheckCircle2, 
  ShieldCheck, Fuel, Save, Activity, Hash, Type, Loader2, DollarSign, Calendar, Search, X, FileText, Banknote, PenTool, Gauge
} from 'lucide-react';

export default function VehicleManager() {
  const { currentUser } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const vehicleToEdit = location.state?.editVehicle;
  const [activeView, setActiveView] = useState(vehicleToEdit ? 'addCar' : 'menu'); 
  const [loading, setLoading] = useState(false);
  const [userVehicles, setUserVehicles] = useState([]);

  // ==========================================
  // ESTADOS: FORMULÁRIO DE VEÍCULO
  // ==========================================
  const [carForm, setCarForm] = useState({ 
    brand: '', model: '', manufactureYear: '', modelYear: '', plate: '', currentKm: '', 
    engine: '', transmission: 'Automático', fuelCity: '', fuelHighway: '', 
    cautelar: 'Aprovado', fipeValue: ''
  });

  // ==========================================
  // ESTADOS: FORMULÁRIO DE REGISTRO DE SERVIÇO
  // ==========================================
  const [logForm, setLogForm] = useState({
    vehicleId: '',
    category: 'Manutenção Preventiva', // Preventiva, Corretiva, Acessório, Estética
    serviceType: '', // Ex: Película Térmica, Módulo de Som, Troca de Óleo
    notes: '',
    cost: '',
    kmAtService: '',
    serviceDate: new Date().toISOString().split('T')[0] // Hoje como padrão
  });

  // ==========================================
  // ESTADOS: ASSISTENTE FIPE
  // ==========================================
  const [showFipe, setShowFipe] = useState(false);
  const [fipeBrands, setFipeBrands] = useState([]);
  const [fipeModels, setFipeModels] = useState([]);
  const [fipeYears, setFipeYears] = useState([]);
  const [fipeSelectedBrand, setFipeSelectedBrand] = useState('');
  const [fipeSelectedModel, setFipeSelectedModel] = useState('');
  const [fipeSelectedYear, setFipeSelectedYear] = useState('');
  const [fetchingFipe, setFetchingFipe] = useState(false);
  const [fipeResult, setFipeResult] = useState(null);
  const [fipeError, setFipeError] = useState('');

  // 1. Carrega Veículos do Utilizador (Para o dropdown de Registro de Serviço)
  useEffect(() => {
    async function fetchVehicles() {
      if (currentUser) {
        try {
          const vehicles = await getUserVehicles(currentUser.uid);
          setUserVehicles(vehicles);
          if (vehicles.length > 0) {
            setLogForm(prev => ({ ...prev, vehicleId: vehicles[0].id }));
          }
        } catch (error) {
          console.error("Erro ao carregar veículos:", error);
        }
      }
    }
    fetchVehicles();
  }, [currentUser]);

  // 2. Prepara Edição de Veículo se existir
  useEffect(() => {
    if (vehicleToEdit) {
      setCarForm({
        ...vehicleToEdit,
        manufactureYear: vehicleToEdit.manufactureYear || vehicleToEdit.year || '',
        modelYear: vehicleToEdit.modelYear || vehicleToEdit.year || ''
      });
    }
  }, [vehicleToEdit]);

  // 3. Efeitos do Assistente FIPE
  useEffect(() => {
    if (showFipe && fipeBrands.length === 0) {
      fetch('https://parallelum.com.br/fipe/api/v1/carros/marcas')
        .then(res => res.json())
        .then(data => setFipeBrands(data))
        .catch(() => setFipeError('Serviço FIPE indisponível. Preencha manualmente.'));
    }
  }, [showFipe, fipeBrands.length]);

  useEffect(() => {
    if (fipeSelectedBrand) {
      setFipeModels([]); setFipeYears([]); setFipeSelectedModel(''); setFipeSelectedYear(''); setFipeResult(null);
      fetch(`https://parallelum.com.br/fipe/api/v1/carros/marcas/${fipeSelectedBrand}/modelos`)
        .then(res => res.json())
        .then(data => setFipeModels(data.modelos))
        .catch(console.error);
    }
  }, [fipeSelectedBrand]);

  useEffect(() => {
    if (fipeSelectedModel) {
      setFipeYears([]); setFipeSelectedYear(''); setFipeResult(null);
      fetch(`https://parallelum.com.br/fipe/api/v1/carros/marcas/${fipeSelectedBrand}/modelos/${fipeSelectedModel}/anos`)
        .then(res => res.json())
        .then(data => setFipeYears(data))
        .catch(console.error);
    }
  }, [fipeSelectedModel, fipeSelectedBrand]);

  useEffect(() => {
    if (fipeSelectedYear) {
      setFetchingFipe(true);
      fetch(`https://parallelum.com.br/fipe/api/v1/carros/marcas/${fipeSelectedBrand}/modelos/${fipeSelectedModel}/anos/${fipeSelectedYear}`)
        .then(res => res.json())
        .then(data => { setFipeResult(data); setFetchingFipe(false); })
        .catch(() => { setFipeError('Erro ao obter valor final.'); setFetchingFipe(false); });
    }
  }, [fipeSelectedYear, fipeSelectedModel, fipeSelectedBrand]);

  const applyFipeData = () => {
    if (fipeResult) {
      const cleanYear = fipeResult.AnoModelo.toString().substring(0, 4);
      setCarForm(prev => ({ ...prev, brand: fipeResult.Marca, model: fipeResult.Modelo, modelYear: cleanYear, fipeValue: fipeResult.Valor }));
      setShowFipe(false);
    }
  };

  // ==========================================
  // FUNÇÕES DE SUBMISSÃO (SUBMIT)
  // ==========================================
  const handleAddCar = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (vehicleToEdit) await updateVehicle(vehicleToEdit.id, carForm);
      else await addVehicle(currentUser.uid, carForm);
      setActiveView('successCar');
    } catch (error) { alert("Erro ao salvar veículo."); } finally { setLoading(false); }
  };

  const handleAddLog = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Extrair o ID do veículo do form para enviar a função
      const { vehicleId, ...logData } = logForm;
      if (!vehicleId) return alert("Selecione um veículo válido.");
      
      await addMaintenanceLog(vehicleId, logData);
      setActiveView('successLog');
    } catch (error) { 
      alert("Erro ao registrar o serviço no prontuário."); 
    } finally { 
      setLoading(false); 
    }
  };

  const handleCancel = () => {
    if (vehicleToEdit) navigate('/dashboard'); else setActiveView('menu'); 
  };

  return (
    <div className="max-w-5xl mx-auto pb-10">
      <div className="mb-8 animate-in fade-in slide-in-from-top-4 duration-500">
        <h2 className="text-3xl font-bold text-slate-900 dark:text-zinc-100 tracking-tight">Gestão de Frota</h2>
        <p className="text-slate-500 dark:text-zinc-400 mt-1 text-lg">
          {activeView === 'addLog' ? 'Grave modificações e manutenções no prontuário.' : 'Cadastre ou atualize as especificações do seu veículo.'}
        </p>
      </div>

      <div className="relative bg-white dark:bg-zinc-900/60 dark:backdrop-blur-xl rounded-[2rem] shadow-lg dark:shadow-none border border-slate-200 dark:border-white/10 overflow-hidden min-h-[500px] transition-all duration-500">
        
        {/* ==========================================
            VIEW 1: MENU DE ESCOLHA INICIAL
        ========================================== */}
        {activeView === 'menu' && (
          <div className="p-8 md:p-12 grid grid-cols-1 md:grid-cols-2 gap-6 absolute inset-0 w-full h-full animate-in zoom-in-95 fade-in duration-500">
            <button onClick={() => setActiveView('addCar')} className="group relative flex flex-col items-center justify-center p-10 bg-slate-50 dark:bg-zinc-950/50 border border-slate-200 dark:border-white/5 rounded-3xl hover:border-red-500/50 transition-all duration-500 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-b from-red-500/0 via-red-500/0 to-red-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="p-5 bg-white dark:bg-zinc-900 rounded-full shadow-sm group-hover:scale-110 group-hover:text-red-500 transition-all duration-500 text-slate-400 dark:text-zinc-500 relative z-10">
                <CarFront size={48} strokeWidth={1.5} />
              </div>
              <h3 className="mt-6 text-2xl font-bold text-slate-900 dark:text-zinc-100 relative z-10 group-hover:text-red-500 transition-colors">Novo Veículo</h3>
              <p className="text-sm text-slate-500 dark:text-zinc-400 text-center mt-2 relative z-10 max-w-xs">
                Inicie um dossiê completo para o seu automóvel.
              </p>
            </button>

            <button 
              onClick={() => {
                if(userVehicles.length === 0) return alert('Cadastre um veículo primeiro!');
                setActiveView('addLog');
              }} 
              className="group relative flex flex-col items-center justify-center p-10 bg-slate-50 dark:bg-zinc-950/50 border border-slate-200 dark:border-white/5 rounded-3xl hover:border-orange-500/50 transition-all duration-500 overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-b from-orange-500/0 via-orange-500/0 to-orange-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="p-5 bg-white dark:bg-zinc-900 rounded-full shadow-sm group-hover:scale-110 group-hover:text-orange-500 transition-all duration-500 text-slate-400 dark:text-zinc-500 relative z-10">
                <Wrench size={48} strokeWidth={1.5} />
              </div>
              <h3 className="mt-6 text-2xl font-bold text-slate-900 dark:text-zinc-100 relative z-10 group-hover:text-orange-500 transition-colors">Registrar Serviço</h3>
              <p className="text-sm text-slate-500 dark:text-zinc-400 text-center mt-2 relative z-10 max-w-xs">
                Adicione manutenções, acessórios (módulo, película) e custos ao histórico.
              </p>
            </button>
          </div>
        )}

        {/* ==========================================
            VIEW 2: FORMULÁRIO DE REGISTRAR SERVIÇO (NOVO!)
        ========================================== */}
        {activeView === 'addLog' && (
          <div className="p-8 md:p-10 animate-in slide-in-from-right-16 fade-in duration-500 fill-mode-both">
            <button onClick={handleCancel} className="flex items-center gap-2 text-slate-500 dark:text-zinc-400 hover:text-orange-600 font-bold text-sm tracking-wide transition-colors mb-8 group">
              <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> VOLTAR AO MENU
            </button>

            <div className="flex items-center gap-4 mb-8">
              <div className="p-3 bg-gradient-to-br from-orange-500/10 to-red-500/10 border border-orange-500/20 rounded-xl">
                <Wrench className="text-orange-500" size={28} />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-zinc-100">Registrar Modificação / Manutenção</h3>
                <p className="text-sm text-slate-500 dark:text-zinc-400">Este registo será guardado de forma permanente no prontuário.</p>
              </div>
            </div>

            <form onSubmit={handleAddLog} className="space-y-6">
              
              <div className="p-6 bg-slate-50 dark:bg-zinc-950/50 rounded-2xl border border-slate-100 dark:border-white/5 space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  
                  {/* Seletor de Veículo */}
                  <div className="relative group">
                    <label className="block text-xs font-bold text-slate-700 dark:text-zinc-400 mb-2 uppercase tracking-wide">Veículo Afetado</label>
                    <select 
                      required 
                      value={logForm.vehicleId} 
                      onChange={e => setLogForm({...logForm, vehicleId: e.target.value})} 
                      className="w-full px-4 py-3 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-white/10 rounded-xl text-slate-900 dark:text-zinc-100 focus:ring-1 focus:ring-orange-500 outline-none shadow-sm"
                    >
                      {userVehicles.map(v => (
                        <option key={v.id} value={v.id}>{v.brand} {v.model} ({v.plate})</option>
                      ))}
                    </select>
                  </div>
                  
                  {/* Categoria do Serviço */}
                  <div className="relative group">
                    <label className="block text-xs font-bold text-slate-700 dark:text-zinc-400 mb-2 uppercase tracking-wide">Categoria</label>
                    <select 
                      value={logForm.category} 
                      onChange={e => setLogForm({...logForm, category: e.target.value})} 
                      className="w-full px-4 py-3 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-white/10 rounded-xl text-slate-900 dark:text-zinc-100 focus:ring-1 focus:ring-orange-500 outline-none shadow-sm"
                    >
                      <option>Manutenção Preventiva</option>
                      <option>Manutenção Corretiva</option>
                      <option>Acessório / Modificação</option>
                      <option>Estética / Limpeza</option>
                      <option>Documentação / Impostos</option>
                    </select>
                  </div>
                </div>

                <div className="relative group">
                  <label className="block text-xs font-bold text-slate-700 dark:text-zinc-400 mb-2 uppercase tracking-wide flex items-center gap-1.5"><PenTool size={14}/> Serviço ou Item (Resumo)</label>
                  <input type="text" required value={logForm.serviceType} onChange={e => setLogForm({...logForm, serviceType: e.target.value})} className="w-full px-4 py-3 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-white/10 rounded-xl text-slate-900 dark:text-zinc-100 focus:ring-1 focus:ring-orange-500 outline-none shadow-sm placeholder:text-slate-400 dark:placeholder:text-zinc-600" placeholder="Ex: Instalação de Módulo de Som / Película Escura" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-5 border-t border-slate-200/50 dark:border-white/5 pt-5">
                  <div className="relative group">
                    <label className="block text-xs font-bold text-emerald-600 dark:text-emerald-500 mb-2 uppercase tracking-wide flex items-center gap-1.5"><Banknote size={14} /> Valor Total (R$)</label>
                    <input type="text" value={logForm.cost} onChange={e => setLogForm({...logForm, cost: e.target.value})} className="w-full px-4 py-3 bg-emerald-50/30 dark:bg-emerald-900/10 border border-emerald-200 dark:border-emerald-500/20 rounded-xl text-emerald-700 dark:text-emerald-400 font-bold focus:ring-1 focus:ring-emerald-500 outline-none shadow-sm placeholder:text-emerald-300 dark:placeholder:text-emerald-700" placeholder="Ex: 850,00" />
                  </div>

                  <div className="relative group">
                    <label className="block text-xs font-bold text-slate-700 dark:text-zinc-400 mb-2 uppercase tracking-wide flex items-center gap-1.5"><Gauge size={14} /> KM Atual</label>
                    <input type="number" required value={logForm.kmAtService} onChange={e => setLogForm({...logForm, kmAtService: e.target.value})} className="w-full px-4 py-3 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-white/10 rounded-xl text-slate-900 dark:text-zinc-100 focus:ring-1 focus:ring-orange-500 outline-none shadow-sm" placeholder="Ex: 45000" />
                  </div>

                  <div className="relative group">
                    <label className="block text-xs font-bold text-slate-700 dark:text-zinc-400 mb-2 uppercase tracking-wide flex items-center gap-1.5"><Calendar size={14} /> Data do Serviço</label>
                    <input type="date" required value={logForm.serviceDate} onChange={e => setLogForm({...logForm, serviceDate: e.target.value})} className="w-full px-4 py-3 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-white/10 rounded-xl text-slate-900 dark:text-zinc-100 focus:ring-1 focus:ring-orange-500 outline-none shadow-sm [color-scheme:light] dark:[color-scheme:dark]" />
                  </div>
                </div>

                <div className="relative group">
                  <label className="block text-xs font-bold text-slate-700 dark:text-zinc-400 mb-2 uppercase tracking-wide flex items-center gap-1.5"><FileText size={14}/> Detalhes Adicionais (Opcional)</label>
                  <textarea rows="3" value={logForm.notes} onChange={e => setLogForm({...logForm, notes: e.target.value})} className="w-full px-4 py-3 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-white/10 rounded-xl text-slate-900 dark:text-zinc-100 focus:ring-1 focus:ring-orange-500 outline-none shadow-sm placeholder:text-slate-400 dark:placeholder:text-zinc-600 resize-none custom-scrollbar" placeholder="Onde foi feito? Qual a marca da peça? Existe garantia?"></textarea>
                </div>
              </div>

              <div className="pt-2">
                <button type="submit" disabled={loading} className="w-full md:w-auto px-12 py-4 font-bold rounded-xl transition-all duration-300 flex items-center justify-center gap-3 uppercase tracking-wider text-sm bg-gradient-to-r from-orange-500 to-red-600 text-white hover:-translate-y-1 shadow-[0_8px_20px_rgba(249,115,22,0.25)] disabled:opacity-70 disabled:transform-none">
                  {loading ? <><Loader2 size={18} className="animate-spin" /> A REGISTRAR...</> : <><Save size={18} /> GRAVAR NO PRONTUÁRIO</>}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ==========================================
            VIEW 3: FORMULÁRIO DE VEÍCULO (EXISTENTE)
        ========================================== */}
        {activeView === 'addCar' && (
          <div className="p-8 md:p-10 animate-in slide-in-from-right-16 fade-in duration-500 fill-mode-both">
            {/* O formulário addCar que lhe entreguei na resposta anterior mantém-se idêntico e intacto aqui */}
            <div className="flex justify-between items-center mb-8">
              <button onClick={handleCancel} className="flex items-center gap-2 text-slate-500 dark:text-zinc-400 hover:text-red-600 font-bold text-sm tracking-wide transition-colors group">
                <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> 
                {vehicleToEdit ? 'CANCELAR EDIÇÃO' : 'VOLTAR AO MENU'}
              </button>
              
              {!showFipe && (
                <button type="button" onClick={() => setShowFipe(true)} className="flex items-center gap-2 px-4 py-2 bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-500/20 rounded-xl text-xs font-bold uppercase tracking-wide hover:bg-blue-100 dark:hover:bg-blue-500/20 transition-colors">
                  <Search size={14} /> Preencher via Tabela FIPE
                </button>
              )}
            </div>
            
            <form onSubmit={handleAddCar} className="space-y-8">
              {showFipe && (
                <div className="p-6 bg-blue-50/50 dark:bg-blue-900/10 rounded-2xl border border-blue-100 dark:border-blue-500/20 animate-in fade-in zoom-in-95 duration-300">
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="text-sm font-bold text-blue-800 dark:text-blue-400 flex items-center gap-2"><Search size={16} /> Assistente FIPE</h4>
                    <button type="button" onClick={() => setShowFipe(false)} className="p-1.5 bg-blue-100 dark:bg-blue-800/30 text-blue-600 dark:text-blue-300 rounded-full hover:bg-blue-200 transition-colors"><X size={16} /></button>
                  </div>
                  {fipeError ? (
                    <div className="p-4 bg-red-50 text-red-600 text-sm rounded-xl mb-4 border border-red-100">{fipeError}</div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-5">
                      <select value={fipeSelectedBrand} onChange={e => setFipeSelectedBrand(e.target.value)} className="px-4 py-2.5 bg-white dark:bg-zinc-900 border border-blue-200 dark:border-blue-500/30 rounded-xl text-slate-900 dark:text-zinc-100 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 shadow-sm"><option value="">1. Selecione a Marca...</option>{fipeBrands.map(b => <option key={b.codigo} value={b.codigo}>{b.nome}</option>)}</select>
                      <select value={fipeSelectedModel} onChange={e => setFipeSelectedModel(e.target.value)} disabled={!fipeSelectedBrand} className="px-4 py-2.5 bg-white dark:bg-zinc-900 border border-blue-200 dark:border-blue-500/30 rounded-xl text-slate-900 dark:text-zinc-100 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 shadow-sm disabled:opacity-50"><option value="">2. Selecione o Modelo...</option>{fipeModels.map(m => <option key={m.codigo} value={m.codigo}>{m.nome}</option>)}</select>
                      <select value={fipeSelectedYear} onChange={e => setFipeSelectedYear(e.target.value)} disabled={!fipeSelectedModel} className="px-4 py-2.5 bg-white dark:bg-zinc-900 border border-blue-200 dark:border-blue-500/30 rounded-xl text-slate-900 dark:text-zinc-100 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 shadow-sm disabled:opacity-50"><option value="">3. Selecione o Ano...</option>{fipeYears.map(y => <option key={y.codigo} value={y.codigo}>{y.nome}</option>)}</select>
                    </div>
                  )}
                  {fetchingFipe && <p className="text-sm text-blue-600 dark:text-blue-400 flex items-center gap-2"><Loader2 size={16} className="animate-spin" /> A consultar base de dados...</p>}
                  {fipeResult && !fetchingFipe && (
                    <div className="flex flex-col md:flex-row items-center justify-between p-4 bg-white dark:bg-zinc-900 rounded-xl border border-emerald-200 dark:border-emerald-500/30">
                      <div><p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Valor Oficial Encontrado</p><p className="text-xl font-black text-emerald-600 dark:text-emerald-400">{fipeResult.Valor}</p></div>
                      <button type="button" onClick={applyFipeData} className="mt-4 md:mt-0 px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm rounded-xl transition-colors shadow-lg shadow-blue-500/30">Utilizar estes dados</button>
                    </div>
                  )}
                </div>
              )}

              <div className="p-6 bg-slate-50 dark:bg-zinc-950/50 rounded-2xl border border-slate-100 dark:border-white/5">
                <h4 className="text-xs font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-widest mb-5 flex items-center gap-2"><Type size={14} /> 1. Identificação Principal</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
                  <div className="relative group"><label className="block text-xs font-bold text-slate-700 dark:text-zinc-400 mb-2 uppercase tracking-wide">Marca</label><input type="text" required value={carForm.brand} onChange={e => setCarForm({...carForm, brand: e.target.value})} className="w-full px-4 py-3 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-white/10 rounded-xl text-slate-900 dark:text-zinc-100 focus:ring-1 focus:ring-red-500 outline-none shadow-sm placeholder:text-slate-400" placeholder="Ex: Honda, Toyota..." /></div>
                  <div className="relative group"><label className="block text-xs font-bold text-slate-700 dark:text-zinc-400 mb-2 uppercase tracking-wide">Modelo / Versão Completa</label><input type="text" required value={carForm.model} onChange={e => setCarForm({...carForm, model: e.target.value})} className="w-full px-4 py-3 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-white/10 rounded-xl text-slate-900 dark:text-zinc-100 focus:ring-1 focus:ring-red-500 outline-none shadow-sm placeholder:text-slate-400" placeholder="Ex: Civic LXR 2.0 Flex" /></div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                  <div className="relative group"><label className="block text-xs font-bold text-slate-700 dark:text-zinc-400 mb-2 uppercase tracking-wide">Ano Fabrico</label><div className="relative"><div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400"><Calendar size={16} /></div><input type="number" required value={carForm.manufactureYear} onChange={e => setCarForm({...carForm, manufactureYear: e.target.value})} className="w-full pl-10 pr-4 py-3 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-white/10 rounded-xl text-slate-900 dark:text-zinc-100 focus:ring-1 focus:ring-red-500 outline-none shadow-sm" placeholder="Ex: 2015" /></div></div>
                  <div className="relative group"><label className="block text-xs font-bold text-slate-700 dark:text-zinc-400 mb-2 uppercase tracking-wide">Ano Modelo</label><div className="relative"><div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400"><Calendar size={16} /></div><input type="number" required value={carForm.modelYear} onChange={e => setCarForm({...carForm, modelYear: e.target.value})} className="w-full pl-10 pr-4 py-3 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-white/10 rounded-xl text-slate-900 dark:text-zinc-100 focus:ring-1 focus:ring-red-500 outline-none shadow-sm" placeholder="Ex: 2016" /></div></div>
                  <div className="relative group"><label className="block text-xs font-bold text-slate-700 dark:text-zinc-400 mb-2 uppercase tracking-wide">Placa</label><div className="relative"><div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400"><Hash size={16} /></div><input type="text" required value={carForm.plate} onChange={e => setCarForm({...carForm, plate: e.target.value.toUpperCase()})} className="w-full pl-10 pr-4 py-3 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-white/10 rounded-xl text-slate-900 dark:text-zinc-100 uppercase focus:ring-1 focus:ring-red-500 outline-none shadow-sm" placeholder="ABC-1234" /></div></div>
                  <div className="relative group"><label className="block text-xs font-bold text-emerald-600 dark:text-emerald-500 mb-2 uppercase tracking-wide">Valor do Veículo</label><div className="relative"><div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-emerald-500"><DollarSign size={16} /></div><input type="text" value={carForm.fipeValue} onChange={e => setCarForm({...carForm, fipeValue: e.target.value})} className="w-full pl-10 pr-4 py-3 bg-emerald-50/30 dark:bg-emerald-900/10 border border-emerald-200 dark:border-emerald-500/20 rounded-xl text-emerald-700 dark:text-emerald-400 font-bold focus:ring-1 focus:ring-emerald-500 outline-none shadow-sm" placeholder="R$ 0,00" /></div></div>
                </div>
              </div>

              <div className="p-6 bg-slate-50 dark:bg-zinc-950/50 rounded-2xl border border-slate-100 dark:border-white/5">
                <h4 className="text-xs font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-widest mb-5 flex items-center gap-2"><Wrench size={14} /> 2. Mecânica e Condição</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  <div className="relative group"><label className="block text-xs font-bold text-slate-700 dark:text-zinc-400 mb-2 uppercase tracking-wide">Motorização</label><input type="text" required value={carForm.engine} onChange={e => setCarForm({...carForm, engine: e.target.value})} className="w-full px-4 py-3 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-white/10 rounded-xl text-slate-900 dark:text-zinc-100 focus:ring-1 focus:ring-red-500 shadow-sm" placeholder="Ex: 2.0 16V Flex" /></div>
                  <div><label className="block text-xs font-bold text-slate-700 dark:text-zinc-400 mb-2 uppercase tracking-wide flex items-center gap-1.5"><Activity size={14}/> Câmbio</label><select value={carForm.transmission} onChange={e => setCarForm({...carForm, transmission: e.target.value})} className="w-full px-4 py-3 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-white/10 rounded-xl text-slate-900 dark:text-zinc-100 focus:ring-1 focus:ring-red-500 shadow-sm"><option>Automático</option><option>Manual</option><option>CVT</option><option>Automatizado</option></select></div>
                  <div><label className="block text-xs font-bold text-slate-700 dark:text-zinc-400 mb-2 uppercase tracking-wide flex items-center gap-1.5"><ShieldCheck size={14} className="text-emerald-500"/> Laudo Cautelar</label><select value={carForm.cautelar} onChange={e => setCarForm({...carForm, cautelar: e.target.value})} className="w-full px-4 py-3 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-white/10 rounded-xl text-slate-900 dark:text-zinc-100 focus:ring-1 focus:ring-emerald-500 shadow-sm"><option>Aprovado</option><option>Aprovado com Apontamentos</option><option>Reprovado</option><option>Não Realizado</option></select></div>
                </div>
              </div>

              <div className="p-6 bg-slate-50 dark:bg-zinc-950/50 rounded-2xl border border-slate-100 dark:border-white/5">
                <h4 className="text-xs font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-widest mb-5 flex items-center gap-2"><Fuel size={14} /> 3. Uso e Consumo</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  <div className="md:col-span-1"><label className="block text-xs font-bold text-slate-700 dark:text-zinc-400 mb-2 uppercase tracking-wide">Hodômetro Atual (KM)</label><input type="number" required value={carForm.currentKm} onChange={e => setCarForm({...carForm, currentKm: e.target.value})} className="w-full px-4 py-3 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-white/10 rounded-xl text-slate-900 dark:text-zinc-100 focus:ring-1 focus:ring-red-500 shadow-sm" placeholder="Ex: 85000" /></div>
                  <div><label className="block text-xs font-bold text-slate-700 dark:text-zinc-400 mb-2 uppercase tracking-wide flex items-center gap-1.5"><Fuel size={14} className="text-blue-500"/> Cidade (Km/L)</label><input type="number" step="0.1" value={carForm.fuelCity} onChange={e => setCarForm({...carForm, fuelCity: e.target.value})} className="w-full px-4 py-3 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-white/10 rounded-xl text-slate-900 dark:text-zinc-100 focus:ring-1 focus:ring-blue-500 shadow-sm" placeholder="Ex: 9.5" /></div>
                  <div><label className="block text-xs font-bold text-slate-700 dark:text-zinc-400 mb-2 uppercase tracking-wide flex items-center gap-1.5"><Fuel size={14} className="text-orange-500"/> Estrada (Km/L)</label><input type="number" step="0.1" value={carForm.fuelHighway} onChange={e => setCarForm({...carForm, fuelHighway: e.target.value})} className="w-full px-4 py-3 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-white/10 rounded-xl text-slate-900 dark:text-zinc-100 focus:ring-1 focus:ring-orange-500 shadow-sm" placeholder="Ex: 13.2" /></div>
                </div>
              </div>
              
              <div className="pt-4">
                <button type="submit" disabled={loading} className="w-full md:w-auto px-12 py-4 font-bold rounded-xl transition-all duration-300 flex items-center justify-center gap-3 uppercase tracking-wider text-sm bg-gradient-to-r from-red-600 to-orange-500 text-white hover:-translate-y-1 shadow-[0_8px_20px_rgba(239,68,68,0.25)] disabled:opacity-70 disabled:transform-none">
                  {loading ? <><Loader2 size={18} className="animate-spin" /> A GUARDAR...</> : vehicleToEdit ? <><Save size={18} /> CONFIRMAR ALTERAÇÕES</> : <><PlusCircle size={18} /> REGISTAR VEÍCULO</>}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ==========================================
            VIEW 4: MENSAGENS DE SUCESSO
        ========================================== */}
        {activeView === 'successCar' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8 bg-white/50 dark:bg-zinc-900/50 backdrop-blur-md z-10 animate-in fade-in duration-500">
            <div className="w-24 h-24 bg-emerald-50 dark:bg-emerald-500/10 rounded-full flex items-center justify-center mb-6 border border-emerald-100 dark:border-emerald-500/20 shadow-lg"><CheckCircle2 size={48} className="text-emerald-500" /></div>
            <h3 className="text-3xl font-black text-slate-900 dark:text-zinc-100">Operação Concluída!</h3>
            <p className="text-slate-500 dark:text-zinc-400 mt-2 max-w-sm">Os dados foram integrados de forma segura e permanente no seu painel.</p>
            <button onClick={() => navigate('/dashboard')} className="mt-10 px-8 py-3.5 bg-slate-100 dark:bg-white/10 hover:bg-slate-200 font-bold rounded-xl transition-all">Voltar ao Painel</button>
          </div>
        )}

        {activeView === 'successLog' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8 bg-white/50 dark:bg-zinc-900/50 backdrop-blur-md z-10 animate-in fade-in duration-500">
            <div className="w-24 h-24 bg-emerald-50 dark:bg-emerald-500/10 rounded-full flex items-center justify-center mb-6 border border-emerald-100 dark:border-emerald-500/20 shadow-lg"><CheckCircle2 size={48} className="text-emerald-500" /></div>
            <h3 className="text-3xl font-black text-slate-900 dark:text-zinc-100">Serviço Guardado!</h3>
            <p className="text-slate-500 dark:text-zinc-400 mt-2 max-w-sm">A sua adição/manutenção foi registrada com sucesso no histórico inalterável do veículo.</p>
            <button onClick={() => navigate('/history')} className="mt-10 px-8 py-3.5 bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold rounded-xl transition-all hover:scale-105 shadow-lg shadow-orange-500/30">
              Ver Histórico Completo
            </button>
          </div>
        )}

      </div>
    </div>
  );
}