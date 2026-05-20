import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { addVehicle, updateVehicle } from '../../services/db';
import { CarFront, Wrench, ArrowLeft, PlusCircle, CheckCircle2, ShieldCheck, Fuel, Save } from 'lucide-react';

export default function VehicleManager() {
  const { currentUser } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  // Verifica se recebemos um veículo para editar vindo do Dashboard
  const vehicleToEdit = location.state?.editVehicle;

  // Se for edição, já abre direto na tela do formulário ('addCar')
  const [activeView, setActiveView] = useState(vehicleToEdit ? 'addCar' : 'menu'); 
  const [loading, setLoading] = useState(false);

  // Estado do formulário
  const [carForm, setCarForm] = useState({ 
    brand: '', model: '', year: '', plate: '', currentKm: '', 
    engine: '', transmission: 'Automático', 
    fuelCity: '', fuelHighway: '', 
    cautelar: 'Aprovado' 
  });
  
  // Se houver veículo para editar, preenche o form automaticamente ao carregar a tela
  useEffect(() => {
    if (vehicleToEdit) {
      setCarForm(vehicleToEdit);
    }
  }, [vehicleToEdit]);

  const handleAddCar = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (vehicleToEdit) {
        // MODO EDIÇÃO: Atualiza o banco de dados
        await updateVehicle(vehicleToEdit.id, carForm);
      } else {
        // MODO CADASTRO: Cria um novo no banco de dados
        await addVehicle(currentUser.uid, carForm);
      }
      
      setActiveView('success');
      
      // Limpa o form após o sucesso
      if (!vehicleToEdit) {
        setCarForm({ brand: '', model: '', year: '', plate: '', currentKm: '', engine: '', transmission: 'Automático', fuelCity: '', fuelHighway: '', cautelar: 'Aprovado' });
      }
    } catch (error) {
      alert("Erro ao salvar veículo.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    if (vehicleToEdit) {
      navigate('/dashboard'); // Volta pro painel se desistir de editar
    } else {
      setActiveView('menu'); // Volta pro menu de escolhas se for cadastro novo
    }
  };

  const handleSuccessBack = () => {
    if (vehicleToEdit) {
      navigate('/dashboard'); // Retorna ao painel para ver as edições
    } else {
      setActiveView('menu');
    }
  };

  return (
    <div className="max-w-5xl mx-auto animate-in fade-in duration-500">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-slate-900 dark:text-zinc-100 tracking-tight transition-colors">Gestão de Frota</h2>
        <p className="text-slate-500 dark:text-zinc-400 mt-1 text-lg transition-colors">Cadastre veículos ou atualize o prontuário.</p>
      </div>

      <div className="relative bg-white dark:bg-zinc-900/40 dark:backdrop-blur-xl rounded-[2rem] shadow-sm dark:shadow-none border border-slate-200 dark:border-white/10 overflow-hidden min-h-[450px] transition-all duration-500">
        
        {activeView === 'menu' && (
          <div className="p-8 md:p-12 grid grid-cols-1 md:grid-cols-2 gap-6 animate-in zoom-in-[0.98] fade-in duration-500">
            <button onClick={() => setActiveView('addCar')} className="group flex flex-col items-center justify-center p-10 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-3xl hover:border-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-all duration-300">
              <div className="p-5 bg-white dark:bg-white/5 rounded-full shadow-sm group-hover:scale-110 group-hover:text-red-500 transition-all duration-300 text-slate-600 dark:text-zinc-400">
                <CarFront size={40} />
              </div>
              <h3 className="mt-5 text-xl font-bold text-slate-900 dark:text-zinc-100">Novo Veículo</h3>
              <p className="text-sm text-slate-500 dark:text-zinc-400 text-center mt-2">Adicione um dossiê completo do seu carro.</p>
            </button>

            <button onClick={() => setActiveView('menu')} className="group flex flex-col items-center justify-center p-10 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-3xl hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-500/10 transition-all duration-300 opacity-60 cursor-not-allowed">
              <div className="p-5 bg-white dark:bg-white/5 rounded-full shadow-sm group-hover:scale-110 transition-all duration-300 text-slate-600 dark:text-zinc-400">
                <Wrench size={40} />
              </div>
              <h3 className="mt-5 text-xl font-bold text-slate-900 dark:text-zinc-100">Registrar Serviço</h3>
              <p className="text-sm text-slate-500 dark:text-zinc-400 text-center mt-2">Selecione um veículo no Histórico para registrar.</p>
            </button>
          </div>
        )}

        {activeView === 'addCar' && (
          <div className="p-8 md:p-10 animate-in slide-in-from-right-8 fade-in duration-500">
            <button onClick={handleCancel} className="flex items-center gap-2 text-slate-500 dark:text-zinc-400 hover:text-red-600 dark:hover:text-red-400 font-medium transition-colors mb-8">
              <ArrowLeft size={18} /> {vehicleToEdit ? 'Cancelar Edição' : 'Voltar ao menu'}
            </button>
            
            <h3 className="text-2xl font-bold text-slate-900 dark:text-zinc-100 mb-8 flex items-center gap-3">
              <div className="p-2 bg-red-50 dark:bg-red-500/20 rounded-lg">
                {vehicleToEdit ? <Save className="text-blue-500" size={24} /> : <CarFront className="text-red-600 dark:text-red-400" size={24} />}
              </div>
              {vehicleToEdit ? 'Editar Dossiê do Veículo' : 'Dossiê do Veículo'}
            </h3>
            
            <form onSubmit={handleAddCar} className="space-y-8">
              {/* Seção 1: Identificação */}
              <div>
                <h4 className="text-sm font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wider mb-4 border-b border-slate-100 dark:border-white/5 pb-2">Identificação Principal</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {[
                    { label: 'Marca', state: 'brand', type: 'text', placeholder: 'Ex: Honda' },
                    { label: 'Modelo', state: 'model', type: 'text', placeholder: 'Ex: Civic LXR' },
                    { label: 'Ano', state: 'year', type: 'number', placeholder: 'Ex: 2015' },
                    { label: 'Placa', state: 'plate', type: 'text', placeholder: 'Ex: ABC-1234' },
                  ].map((field) => (
                    <div key={field.state}>
                      <label className="block text-sm font-bold text-slate-700 dark:text-zinc-300 mb-2">{field.label}</label>
                      <input type={field.type} required value={carForm[field.state]} onChange={e => setCarForm({...carForm, [field.state]: e.target.value})} className="w-full px-4 py-3 bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/10 rounded-xl text-slate-900 dark:text-zinc-100 focus:ring-2 focus:ring-red-500 outline-none transition-all placeholder:text-slate-400 dark:placeholder:text-zinc-600" placeholder={field.placeholder} />
                    </div>
                  ))}
                </div>
              </div>

              {/* Seção 2: Mecânica e Estrutura */}
              <div>
                <h4 className="text-sm font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wider mb-4 border-b border-slate-100 dark:border-white/5 pb-2">Mecânica e Estrutura</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 dark:text-zinc-300 mb-2">Motorização</label>
                    <input type="text" required value={carForm.engine} onChange={e => setCarForm({...carForm, engine: e.target.value})} className="w-full px-4 py-3 bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/10 rounded-xl text-slate-900 dark:text-zinc-100 focus:ring-2 focus:ring-red-500 outline-none transition-all placeholder:text-slate-400" placeholder="Ex: 2.0 16V Flex" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 dark:text-zinc-300 mb-2">Câmbio</label>
                    <select value={carForm.transmission} onChange={e => setCarForm({...carForm, transmission: e.target.value})} className="w-full px-4 py-3 bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/10 rounded-xl text-slate-900 dark:text-zinc-100 focus:ring-2 focus:ring-red-500 outline-none transition-all">
                      <option>Automático</option>
                      <option>Manual</option>
                      <option>CVT</option>
                      <option>Automatizado</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 dark:text-zinc-300 mb-2 flex items-center gap-2"><ShieldCheck size={16} className="text-emerald-500"/> Laudo Cautelar</label>
                    <select value={carForm.cautelar} onChange={e => setCarForm({...carForm, cautelar: e.target.value})} className="w-full px-4 py-3 bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/10 rounded-xl text-slate-900 dark:text-zinc-100 focus:ring-2 focus:ring-red-500 outline-none transition-all">
                      <option>Aprovado</option>
                      <option>Aprovado com Apontamentos</option>
                      <option>Reprovado</option>
                      <option>Não Realizado</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Seção 3: Consumo e Odômetro */}
              <div>
                <h4 className="text-sm font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wider mb-4 border-b border-slate-100 dark:border-white/5 pb-2">Uso e Consumo Médio</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="md:col-span-1">
                    <label className="block text-sm font-bold text-slate-700 dark:text-zinc-300 mb-2">Quilometragem Atual (KM)</label>
                    <input type="number" required value={carForm.currentKm} onChange={e => setCarForm({...carForm, currentKm: e.target.value})} className="w-full px-4 py-3 bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/10 rounded-xl text-slate-900 dark:text-zinc-100 focus:ring-2 focus:ring-red-500 outline-none transition-all placeholder:text-slate-400" placeholder="Ex: 85000" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 dark:text-zinc-300 mb-2 flex items-center gap-2"><Fuel size={16} className="text-orange-500"/> Cidade (Km/L)</label>
                    <input type="number" step="0.1" value={carForm.fuelCity} onChange={e => setCarForm({...carForm, fuelCity: e.target.value})} className="w-full px-4 py-3 bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/10 rounded-xl text-slate-900 dark:text-zinc-100 focus:ring-2 focus:ring-red-500 outline-none transition-all placeholder:text-slate-400" placeholder="Ex: 9.5" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 dark:text-zinc-300 mb-2 flex items-center gap-2"><Fuel size={16} className="text-orange-500"/> Estrada (Km/L)</label>
                    <input type="number" step="0.1" value={carForm.fuelHighway} onChange={e => setCarForm({...carForm, fuelHighway: e.target.value})} className="w-full px-4 py-3 bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/10 rounded-xl text-slate-900 dark:text-zinc-100 focus:ring-2 focus:ring-red-500 outline-none transition-all placeholder:text-slate-400" placeholder="Ex: 13.2" />
                  </div>
                </div>
              </div>
              
              <div className="pt-6 border-t border-slate-100 dark:border-white/5">
                <button type="submit" disabled={loading} className={`w-full md:w-auto px-10 py-4 font-bold rounded-xl transition-all duration-300 flex items-center justify-center gap-2 hover:-translate-y-1 ${vehicleToEdit ? 'bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white shadow-[0_8px_20px_rgba(59,130,246,0.25)]' : 'bg-gradient-to-r from-red-600 to-orange-500 hover:from-red-500 hover:to-orange-400 text-white shadow-[0_8px_20px_rgba(239,68,68,0.25)]'}`}>
                  {loading ? 'Processando...' : vehicleToEdit ? <><Save size={20} /> Salvar Alterações</> : <><PlusCircle size={20} /> Salvar Dossiê na Nuvem</>}
                </button>
              </div>
            </form>
          </div>
        )}

        {activeView === 'success' && (
          <div className="p-16 flex flex-col items-center justify-center text-center animate-in zoom-in-50 fade-in duration-500 h-[450px]">
            <div className="w-24 h-24 bg-emerald-50 dark:bg-emerald-500/20 rounded-full flex items-center justify-center mb-6 border border-emerald-100 dark:border-emerald-500/20">
              <CheckCircle2 size={48} className="text-emerald-500" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-zinc-100">Operação Concluída!</h3>
            <p className="text-slate-500 dark:text-zinc-400 mt-2 max-w-sm">Os dados foram registrados de forma segura e imutável no banco de dados.</p>
            <button onClick={handleSuccessBack} className="mt-8 px-8 py-3 bg-slate-100 dark:bg-white/10 hover:bg-slate-200 dark:hover:bg-white/20 text-slate-900 dark:text-zinc-100 font-bold rounded-xl transition-colors">
              {vehicleToEdit ? 'Voltar ao Painel' : 'Voltar ao Menu'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}