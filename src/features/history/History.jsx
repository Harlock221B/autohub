import { useState, useEffect } from 'react';
import { FileText, Wrench, Calendar, Loader2, Info } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { getUserVehicles, getVehicleLogs } from '../../services/db';

export default function History() {
  const { currentUser } = useAuth();
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
          setLoading(false);
        }
      }
    }
    fetchData();
  }, [currentUser]);

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="animate-spin text-red-500" size={40} /></div>;

  if (!vehicle) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center animate-in fade-in">
        <Info size={48} className="text-slate-300 dark:text-zinc-600 mb-4" />
        <h3 className="text-2xl font-bold text-slate-900 dark:text-zinc-100 mb-2">Sem histórico disponível</h3>
        <p className="text-slate-500 dark:text-zinc-400">Cadastre um veículo na aba "Gerenciar Frota" para ver o histórico.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-5xl mx-auto">
      <div>
        <h2 className="text-3xl font-bold text-slate-900 dark:text-zinc-100 tracking-tight">Histórico de Manutenção</h2>
        <p className="text-slate-500 dark:text-zinc-400 mt-1 text-lg">
          Prontuário auditável do <span className="font-bold text-slate-900 dark:text-white capitalize">{vehicle.brand} {vehicle.model}</span>.
        </p>
      </div>

      <div className="bg-white dark:bg-zinc-900/40 dark:backdrop-blur-xl rounded-[2rem] shadow-sm dark:shadow-none border border-slate-200 dark:border-white/10 p-8 transition-colors duration-500">
        {logs.length === 0 ? (
          <div className="text-center py-12">
            <FileText size={48} className="text-slate-300 dark:text-zinc-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-slate-900 dark:text-zinc-100 mb-2">Prontuário em Branco</h3>
            <p className="text-slate-500 dark:text-zinc-400">Nenhum serviço foi registrado para este veículo ainda.</p>
          </div>
        ) : (
          <div className="relative border-l-2 border-slate-100 dark:border-white/10 ml-4 space-y-10 py-4">
            {logs.map((log, index) => (
              <div key={log.id || index} className="relative pl-8">
                <div className="absolute -left-[17px] top-1 bg-white dark:bg-zinc-900 p-1 rounded-full border-2 border-slate-200 dark:border-white/10">
                  <div className="w-4 h-4 bg-red-500 rounded-full shadow-sm"></div>
                </div>

                <div className="bg-slate-50 dark:bg-white/5 p-6 rounded-2xl border border-slate-100 dark:border-white/5 hover:border-slate-300 dark:hover:border-white/20 transition-colors">
                  <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 gap-4">
                    <h4 className="text-xl font-bold text-slate-900 dark:text-zinc-100 flex items-center gap-2">
                      <Wrench className="text-slate-400 dark:text-zinc-500" size={20} />
                      {log.serviceType}
                    </h4>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white dark:bg-white/10 border border-slate-200 dark:border-transparent text-slate-700 dark:text-zinc-300 text-sm font-bold tracking-wider">
                      {Number(log.kmAtService).toLocaleString('pt-BR')} KM
                    </span>
                  </div>
                  <p className="text-slate-600 dark:text-zinc-400 leading-relaxed mb-4">{log.notes}</p>
                  <div className="flex items-center gap-2 text-sm text-slate-400 dark:text-zinc-500">
                    <Calendar size={16} />
                    <span>Registrado em: {log.createdAt ? new Date(log.createdAt.seconds * 1000).toLocaleDateString('pt-BR') : 'Data não disponível'}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}