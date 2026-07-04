import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { api } from '@/api/services';
import { UploadCloud, Activity, Database, CheckCircle, Shield, Server, Terminal, Lock } from 'lucide-react';

export default function HospitalDashboard() {
  const [hospitals, setHospitals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploadingId, setUploadingId] = useState<number | null>(null);
  const [trainingId, setTrainingId] = useState<number | null>(null);

  const fetchHospitals = async () => {
    try {
      const res = await api.getHospitals();
      setHospitals(res.data);
    } catch (err) {
      console.error('Failed to fetch hospitals:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHospitals();
    const interval = setInterval(fetchHospitals, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleUpload = async (id: number, e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    setUploadingId(id);
    try {
      await api.uploadDataset(id, e.target.files[0]);
      await fetchHospitals();
    } catch (err) {
      console.error('Failed to upload dataset:', err);
    } finally {
      setUploadingId(null);
      e.target.value = '';
    }
  };

  const handleTrain = async (id: number) => {
    setTrainingId(id);
    try {
      await api.trainHospital(id);
    } catch (err) {
      console.error('Training failed:', err);
    } finally {
      setTrainingId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-white flex items-center">
            <Server className="w-8 h-8 mr-3 text-primary" />
            Edge Compute Nodes
          </h2>
          <p className="text-slate-400 mt-1">
            Manage local hospital datasets. Raw data never leaves these isolated execution environments.
          </p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence>
          {hospitals.map((h, idx) => (
            <motion.div 
              key={h.id} 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.1 }}
              className="rounded-xl border border-slate-800 bg-slate-900/60 backdrop-blur-md shadow p-6 flex flex-col space-y-4 hover:border-primary/50 hover:shadow-[0_0_20px_rgba(6,182,212,0.1)] transition-all duration-300 group"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-lg text-white group-hover:text-primary transition-colors">{h.name}</h3>
                  <p className="text-sm text-slate-500 font-mono mt-1 flex items-center">
                    <Terminal className="w-3 h-3 mr-1" /> Node ID: {h.id}
                  </p>
                </div>
                <div className={`px-2 py-1 rounded-full text-xs font-bold font-mono border ${h.has_dataset ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' : 'bg-amber-500/10 text-amber-400 border-amber-500/30'}`}>
                  {h.has_dataset ? 'DATASET LOADED' : 'AWAITING DATA'}
                </div>
              </div>

              <div className="space-y-2 text-sm bg-slate-950 p-4 rounded-lg border border-slate-800/50 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-16 h-16 bg-primary/5 rounded-bl-full pointer-events-none" />
                <div className="flex justify-between items-center text-slate-300">
                  <span className="text-slate-500 flex items-center gap-2">
                    <Database className="w-4 h-4 text-indigo-400" /> Dataset Size
                  </span>
                  <span className="font-mono font-bold text-white">{h.dataset_size}</span>
                </div>
                <div className="flex justify-between items-center text-slate-300">
                  <span className="text-slate-500 flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-400" /> Features
                  </span>
                  <span className="font-mono text-white">{h.features_count}</span>
                </div>
                <div className="flex justify-between items-center text-slate-300 border-t border-slate-800 pt-2 mt-2">
                  <span className="text-slate-500 flex items-center gap-2">
                    <Shield className="w-4 h-4 text-primary" /> Privacy Protocol
                  </span>
                  <span className="font-mono text-primary font-bold flex items-center">
                    <Lock className="w-3 h-3 mr-1" /> LDP Active
                  </span>
                </div>
              </div>

              <div className="pt-4 grid grid-cols-2 gap-3 mt-auto">
                <div>
                  <input 
                    type="file" 
                    id={`file-${h.id}`} 
                    className="hidden" 
                    accept=".csv"
                    onChange={(e) => handleUpload(h.id, e)}
                    disabled={uploadingId === h.id}
                  />
                  <label 
                    htmlFor={`file-${h.id}`}
                    className="flex items-center justify-center space-x-2 w-full bg-slate-800 text-slate-200 hover:bg-slate-700 py-2.5 rounded-md cursor-pointer text-sm font-medium transition-colors border border-slate-700 hover:border-slate-600"
                  >
                    <UploadCloud className={`w-4 h-4 ${uploadingId === h.id ? 'animate-bounce text-primary' : ''}`} />
                    <span>{uploadingId === h.id ? 'UPLOADING...' : 'MOUNT DATA'}</span>
                  </label>
                </div>
                <button 
                  onClick={() => handleTrain(h.id)}
                  disabled={!h.has_dataset || trainingId === h.id}
                  className="flex items-center justify-center space-x-2 w-full bg-primary/90 text-primary-foreground hover:bg-primary py-2.5 rounded-md disabled:opacity-30 disabled:hover:bg-primary/90 disabled:cursor-not-allowed text-sm font-bold transition-all shadow-[0_0_10px_rgba(6,182,212,0.2)] hover:shadow-[0_0_15px_rgba(6,182,212,0.4)]"
                >
                  <Activity className={`w-4 h-4 ${trainingId === h.id ? 'animate-spin' : ''}`} />
                  <span>{trainingId === h.id ? 'COMPUTING...' : 'TRAIN LOCAL'}</span>
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
