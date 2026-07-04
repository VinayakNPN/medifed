import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, CartesianGrid } from 'recharts';
import { api } from '@/api/services';
import { Activity, ShieldCheck, Clock, CheckCircle2, Lock, Terminal, Shield } from 'lucide-react';

export default function Prediction() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handlePredict = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.makePrediction({ age: 45, bp: 120, glucose: 95, bmi: 24.5 });
      if (res.data.error) {
        alert(res.data.error);
        setResult(null);
      } else {
        setResult(res.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-white flex items-center">
            <Lock className="w-8 h-8 mr-3 text-primary" />
            Confidential Inference Engine
          </h2>
          <p className="text-slate-400 mt-1">
            Run encrypted predictions using the latest global model version. Zero data leakage.
          </p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-12">
        {/* INPUT FORM */}
        <div className="md:col-span-4 rounded-xl border border-slate-800 bg-slate-900/60 backdrop-blur-md shadow p-6 h-fit">
          <div className="flex items-center mb-6 border-b border-slate-800 pb-4">
            <Terminal className="w-5 h-5 mr-2 text-primary" />
            <h3 className="font-bold text-lg text-white">Input Vector</h3>
          </div>
          
          <form onSubmit={handlePredict} className="space-y-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Patient Age</label>
                <input type="number" defaultValue={45} className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white font-mono focus:border-primary focus:ring-1 focus:ring-primary transition-colors outline-none" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Blood Pressure</label>
                <input type="number" defaultValue={120} className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white font-mono focus:border-primary focus:ring-1 focus:ring-primary transition-colors outline-none" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Glucose Level</label>
                <input type="number" defaultValue={95} className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white font-mono focus:border-primary focus:ring-1 focus:ring-primary transition-colors outline-none" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">BMI</label>
                <input type="number" defaultValue={24.5} step="0.1" className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white font-mono focus:border-primary focus:ring-1 focus:ring-primary transition-colors outline-none" />
              </div>
            </div>
            
            <button 
              type="submit"
              disabled={loading}
              className="w-full mt-6 bg-primary/20 text-primary border border-primary/50 hover:bg-primary hover:text-primary-foreground h-12 px-4 py-2 rounded-md font-bold tracking-wider transition-all flex items-center justify-center hover:shadow-[0_0_20px_rgba(6,182,212,0.4)]"
            >
              {loading ? (
                <><Activity className="w-5 h-5 mr-2 animate-spin" /> FHE COMPUTING...</>
              ) : (
                <><ShieldCheck className="w-5 h-5 mr-2" /> EXECUTE PREDICTION</>
              )}
            </button>
          </form>
        </div>

        {/* RESULTS & EXPLAINABILITY */}
        <div className="md:col-span-8 rounded-xl border border-slate-800 bg-slate-900/60 backdrop-blur-md shadow p-6 min-h-[500px] flex flex-col relative overflow-hidden">
          {!result && !loading && (
            <div className="flex-1 flex flex-col items-center justify-center text-slate-600">
              <Shield className="w-16 h-16 mb-4 opacity-20" />
              <p className="font-mono text-sm tracking-widest">AWAITING INPUT VECTOR</p>
            </div>
          )}

          {loading && (
             <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-950/80 backdrop-blur-sm z-10">
               <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin mb-4" />
               <p className="text-primary font-mono animate-pulse">EVALUATING CIPHERTEXT...</p>
             </div>
          )}
          
          <AnimatePresence>
            {result && !loading && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex-1 flex flex-col space-y-8"
              >
                {/* Result Header */}
                <div className="flex items-center justify-between p-6 bg-slate-950 rounded-xl border border-slate-800 shadow-inner">
                  <div>
                    <div className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Inference Outcome</div>
                    <div className={`text-5xl font-black tracking-tight ${result.prediction === 'High Risk' ? 'text-red-500' : 'text-emerald-500 drop-shadow-[0_0_15px_rgba(16,185,129,0.5)]'}`}>
                      {result.prediction.toUpperCase()}
                    </div>
                  </div>
                  <div className="text-right space-y-2 border-l border-slate-800 pl-6">
                    <div className="text-xs text-slate-400 flex items-center justify-end font-mono">
                      <CheckCircle2 className="w-3 h-3 mr-2 text-emerald-500" /> MODEL V{result.model_version}
                    </div>
                    <div className="text-xs text-slate-400 flex items-center justify-end font-mono">
                      <Clock className="w-3 h-3 mr-2 text-primary" /> {result.inference_time_ms}MS EXECUTION
                    </div>
                  </div>
                </div>

                {/* Confidence Bar */}
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="font-bold text-slate-300 uppercase tracking-wider text-xs">Prediction Confidence</span>
                    <span className="font-mono text-primary font-bold">{result.confidence.toFixed(1)}%</span>
                  </div>
                  <div className="h-3 w-full bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${result.confidence}%` }}
                      transition={{ duration: 1.5, ease: "easeOut" }}
                      className={`h-full ${result.confidence > 90 ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.8)]' : 'bg-amber-500'}`}
                    />
                  </div>
                </div>

                {/* SHAP Chart */}
                <div className="flex-1 min-h-[250px] flex flex-col mt-4">
                  <div className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4 flex items-center">
                    <Activity className="w-4 h-4 mr-2 text-primary" /> SHAP Feature Importance (Explainability)
                  </div>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart layout="vertical" data={result.shap_values} margin={{ top: 0, right: 30, left: 40, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="hsl(220 30% 20%)" className="opacity-50" />
                      <XAxis type="number" stroke="hsl(215 20% 65%)" className="text-xs font-mono opacity-50" />
                      <YAxis dataKey="name" type="category" stroke="hsl(215 20% 65%)" className="text-xs font-mono font-bold" width={100} />
                      <Tooltip 
                        contentStyle={{ backgroundColor: 'hsl(240 10% 6%)', borderColor: 'hsl(220 30% 15%)', color: 'white' }}
                        cursor={{ fill: 'hsl(220 30% 15%)', opacity: 0.4 }}
                      />
                      <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                        {result.shap_values.map((entry: any, index: number) => (
                          <Cell key={`cell-${index}`} fill="hsl(190 90% 50%)" />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}
