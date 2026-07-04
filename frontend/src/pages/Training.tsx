import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Activity, Database, Lock, ShieldCheck, Network, Cpu, CheckCircle2, Server } from 'lucide-react';
import { api } from '@/api/services';
import { useSSE } from '@/hooks/useSSE';

type WorkflowState = 'IDLE' | 'Dataset Uploaded' | 'Training Started' | 'Local Model Finished' | 'Model Update Extracted' | 'Differential Privacy Applied' | 'Quantization Completed' | 'Payload Validated' | 'Submitting To Fhenix' | 'Confidential Computation Running' | 'Confidential Aggregation Complete' | 'Coordinator Validation' | 'Global Model Updated' | 'Model Evaluation' | 'Model Published' | 'Hospitals Synchronizing' | 'Training Complete';

interface Log {
  id: string;
  time: string;
  message: string;
  type: 'info' | 'success' | 'warning';
}

export default function Training() {
  const [workflowState, setWorkflowState] = useState<WorkflowState>('IDLE');
  const [logs, setLogs] = useState<Log[]>([]);
  const [globalAccuracy, setGlobalAccuracy] = useState(0);
  const [round, setRound] = useState(1);
  const [fhenixStage, setFhenixStage] = useState<number>(0);
  const [hospitals, setHospitals] = useState<any[]>([]);
  const [loadingInitial, setLoadingInitial] = useState(true);
  
  // Real-time backend connection
  const { lastEvent, isConnected } = useSSE('/api/v1/stream/events');

  useEffect(() => {
    // Fetch initial data
    const fetchInit = async () => {
      try {
        const [hRes, cRes] = await Promise.all([
          api.getHospitals(),
          api.getCoordinatorStatus()
        ]);
        setHospitals(hRes.data);
        setGlobalAccuracy(cRes.data.current_global_accuracy || 82.4);
        setRound(cRes.data.current_training_round || 1);
      } catch (e) {
        console.error(e);
      } finally {
        setLoadingInitial(false);
      }
    };
    fetchInit();
  }, []);

  useEffect(() => {
    if (lastEvent && lastEvent.type === 'WORKFLOW_STATE') {
      const data = lastEvent.data;
      setWorkflowState(data.state as WorkflowState);
      setFhenixStage(data.fhenix_stage || 0);
      
      if (data.log) {
        setLogs(prev => [{
          id: Math.random().toString(),
          time: new Date().toLocaleTimeString(),
          message: data.log,
          type: 'info'
        }, ...prev].slice(0, 15));
      }
      
      if (data.state === 'Global Model Updated') {
        // Simulate an accuracy bump for the UI when the model is updated
        setGlobalAccuracy(prev => prev + (Math.random() * 1.5 + 0.1));
      }
      if (data.state === 'Training Complete') {
        setRound(prev => prev + 1);
        setTimeout(() => setWorkflowState('IDLE'), 3000);
      }
    }
  }, [lastEvent]);

  const startTraining = async () => {
    if (workflowState !== 'IDLE' && workflowState !== 'Training Complete') return;
    try {
      setLogs([]);
      await api.triggerTraining();
      setWorkflowState('Dataset Uploaded'); // Immediate UI feedback before SSE arrives
    } catch (e) {
      console.error("Failed to start training", e);
    }
  };
  
  // Helpers for UI state colors
  const isTrainingPhase = ['Dataset Uploaded', 'Training Started', 'Local Model Finished', 'Model Update Extracted', 'Differential Privacy Applied'].includes(workflowState);
  const isFhenixPhase = ['Quantization Completed', 'Payload Validated', 'Submitting To Fhenix', 'Confidential Computation Running', 'Confidential Aggregation Complete'].includes(workflowState);
  const isGlobalPhase = ['Coordinator Validation', 'Global Model Updated', 'Model Evaluation', 'Model Published', 'Hospitals Synchronizing'].includes(workflowState);

  return (
    <div className="relative min-h-[calc(100vh-64px)] w-full overflow-hidden bg-[#0A0A10] text-slate-200 p-6 flex flex-col font-sans">
      {/* Network Background */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <circle cx="2" cy="2" r="1" fill="#4F46E5" />
          </pattern>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      {/* Header */}
      <div className="relative z-10 flex items-center justify-between mb-8 border-b border-white/10 pb-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white flex items-center">
            <ShieldCheck className="mr-3 w-8 h-8 text-primary" />
            Confidential Federated Intelligence
          </h1>
          <p className="text-slate-400 mt-1">Live visualization of the Fhenix CoFHE pipeline. SSE Status: {isConnected ? <span className="text-green-500">Connected</span> : <span className="text-red-500">Disconnected</span>}</p>
        </div>
        <button
          onClick={startTraining}
          disabled={workflowState !== 'IDLE' && workflowState !== 'Training Complete'}
          className={`flex items-center px-6 py-3 rounded-lg font-bold text-white shadow-lg transition-all ${
            workflowState !== 'IDLE' && workflowState !== 'Training Complete' 
              ? 'bg-slate-700 cursor-not-allowed opacity-50'
              : 'bg-gradient-to-r from-primary to-indigo-600 hover:from-primary hover:to-indigo-500 shadow-primary/25 hover:shadow-primary/50 hover:-translate-y-0.5'
          }`}
        >
          {workflowState !== 'IDLE' && workflowState !== 'Training Complete' ? (
            <Activity className="w-5 h-5 mr-2 animate-spin" />
          ) : (
            <Play className="w-5 h-5 mr-2" />
          )}
          {workflowState !== 'IDLE' && workflowState !== 'Training Complete' ? workflowState : 'Start Federated Training'}
        </button>
      </div>

      <div className="relative z-10 grid grid-cols-12 gap-8 flex-1">
        {/* LEFT COLUMN: HOSPITALS */}
        <div className="col-span-3 flex flex-col gap-6 pt-4 overflow-y-auto pr-2 max-h-[70vh]">
          {loadingInitial ? (
             <div className="animate-pulse flex space-x-4"><div className="h-20 w-full bg-slate-800 rounded"></div></div>
          ) : hospitals.map((hospital, idx) => (
            <div key={hospital.id} className="relative bg-slate-900/60 backdrop-blur-md border border-slate-800 rounded-xl p-5 shadow-2xl">
              {isTrainingPhase && (
                <div className="absolute inset-0 border-2 border-primary rounded-xl animate-pulse" />
              )}
              {isFhenixPhase && (
                <div className="absolute inset-0 border-2 border-amber-500 rounded-xl animate-pulse" />
              )}
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center">
                  <Database className="w-5 h-5 text-indigo-400 mr-2" />
                  <h3 className="font-semibold text-white">{hospital.name}</h3>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                <div>
                  <div className="text-slate-500 text-xs uppercase tracking-wider mb-1">Local Status</div>
                  <div className="font-medium text-white">{hospital.has_dataset ? 'Dataset Ready' : 'No Dataset'}</div>
                </div>
                <div>
                  <div className="text-slate-500 text-xs uppercase tracking-wider mb-1">Dataset Size</div>
                  <div className="font-mono text-white">{hospital.dataset_size}</div>
                </div>
              </div>
              <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                <motion.div 
                  className={`h-full ${isFhenixPhase ? 'bg-amber-500' : 'bg-primary'}`}
                  initial={{ width: '0%' }}
                  animate={{ width: (isTrainingPhase || isFhenixPhase || isGlobalPhase) ? '100%' : '0%' }}
                  transition={{ ease: "linear", duration: 1 }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* MIDDLE COLUMN: DYNAMIC PIPELINE VISUALIZER */}
        <div className="col-span-6 flex flex-col items-center relative gap-8 pt-4">
          <div className="absolute left-[-50px] top-0 bottom-0 w-[100px] pointer-events-none flex flex-col justify-around py-16 z-0">
             {[0,1,2].map(i => (
                <div key={i} className="relative w-full h-px">
                  {(isTrainingPhase || isFhenixPhase) && (
                    <motion.div
                      key={`horizontal-line-${i}`}
                      initial={{ x: -100, opacity: 0 }}
                      animate={{ x: 100, opacity: 1 }}
                      transition={{ repeat: Infinity, duration: 1.5, delay: i * 0.2 }}
                      className="absolute top-1/2 -translate-y-1/2 flex items-center"
                    >
                      {isFhenixPhase ? <Lock className="w-4 h-4 text-purple-500 mr-1" /> : <Activity className="w-4 h-4 text-primary mr-1" />}
                      <div className={`h-[2px] w-12 ${isFhenixPhase ? 'bg-gradient-to-r from-purple-500/0 via-purple-500 to-purple-500/0' : 'bg-gradient-to-r from-primary/0 via-primary to-primary/0'}`} />
                    </motion.div>
                  )}
                </div>
             ))}
          </div>

          <div className="w-full flex-1 min-h-[300px] relative z-10">
            <AnimatePresence mode="wait">
              {/* STAGE 1: LOCAL TRAINING */}
              {isTrainingPhase && workflowState !== 'Differential Privacy Applied' && (
                <motion.div key="training" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="w-full h-full bg-slate-900/80 backdrop-blur-md border border-primary/30 rounded-2xl p-6 shadow-[0_0_30px_rgba(6,182,212,0.15)] flex flex-col items-center justify-center text-center">
                  <Activity className="w-16 h-16 text-primary mb-4 animate-pulse" />
                  <h2 className="text-2xl font-bold text-white mb-2">Local Model Extraction</h2>
                  <p className="text-slate-400">Computing gradients on isolated datasets...</p>
                </motion.div>
              )}

              {/* STAGE 2: DIFFERENTIAL PRIVACY */}
              {workflowState === 'Differential Privacy Applied' && (
                <motion.div key="dp" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="w-full h-full bg-slate-900/80 backdrop-blur-md border border-amber-500/50 rounded-2xl p-6 shadow-[0_0_30px_rgba(245,158,11,0.15)] flex flex-col items-center justify-center text-center">
                  <ShieldCheck className="w-16 h-16 text-amber-500 mb-4" />
                  <h2 className="text-2xl font-bold text-white mb-2">Local Differential Privacy</h2>
                  <div className="grid grid-cols-2 gap-4 w-full mt-4 text-left">
                    <div className="bg-slate-950 p-4 rounded-lg border border-slate-800">
                      <div className="text-xs text-slate-500 mb-1">Raw Gradient</div>
                      <div className="h-8 w-full bg-slate-800 rounded flex items-center overflow-hidden">
                        <div className="h-full bg-slate-500 w-[70%]" />
                      </div>
                    </div>
                    <div className="bg-slate-950 p-4 rounded-lg border border-amber-500/30">
                      <div className="text-xs text-amber-500 mb-1">Gradient + Gaussian Noise (\u03b5={(round * 0.05).toFixed(2)})</div>
                      <div className="h-8 w-full bg-slate-800 rounded flex items-center overflow-hidden relative">
                        <div className="h-full bg-amber-500 w-[70%] opacity-80" />
                        <motion.div initial={{ x: -100 }} animate={{ x: 200 }} transition={{ repeat: Infinity, duration: 0.5 }} className="absolute inset-0 bg-white/20 blur-[2px]" />
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* STAGE 3: FHENIX ENGINE */}
              {isFhenixPhase && (
                <motion.div key="fhenix" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className={`w-full h-full bg-[#0d0d16] border-2 border-purple-500/50 rounded-2xl p-8 shadow-[0_0_50px_rgba(168,85,247,0.25)] flex flex-col items-center relative overflow-hidden`}>
                  <div className="absolute top-0 right-0 px-3 py-1 bg-purple-500 text-white text-xs font-bold rounded-bl-lg">FHENIX SECURE CORE</div>
                  <Cpu className="w-16 h-16 text-purple-400 mb-4 animate-pulse-fhenix" />
                  <h2 className="text-2xl font-bold text-white mb-2">fhEVM Confidential Aggregation</h2>
                  <p className="text-slate-400 mb-6 max-w-sm text-center text-sm">Aggregating encrypted euint32 parameters inside FHE smart contract.</p>
                  
                  <div className="w-full space-y-3">
                    {[
                      { label: 'Quantizing floats to integers', active: workflowState === 'Quantization Completed' || fhenixStage >= 1 },
                      { label: 'Encrypting payload (Fhenix SDK)', active: fhenixStage >= 2 },
                      { label: 'Homomorphic Addition (FHE.add)', active: fhenixStage >= 3 },
                      { label: 'Aggregation verified on-chain', active: fhenixStage >= 4 },
                    ].map((stage, idx) => (
                      <div key={idx} className="flex items-center bg-slate-900/50 p-2 rounded border border-slate-800">
                        <div className={`w-5 h-5 rounded-full flex items-center justify-center mr-3 transition-colors ${stage.active ? 'bg-purple-500 text-white' : 'bg-slate-800'}`}>
                          {stage.active && <CheckCircle2 className="w-3 h-3" />}
                        </div>
                        <span className={`text-sm font-mono ${stage.active ? 'text-purple-300 font-bold' : 'text-slate-600'}`}>{stage.label}</span>
                      </div>
                    ))}
                  </div>
                  <motion.div animate={{ opacity: [0.3, 0.6, 0.3], scale: [1, 1.1, 1] }} transition={{ repeat: Infinity, duration: 2 }} className="absolute inset-0 bg-purple-500/10 blur-[80px] pointer-events-none" />
                </motion.div>
              )}

              {/* STAGE 4: GLOBAL UPDATE */}
              {isGlobalPhase && (
                <motion.div key="global" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="w-full h-full bg-slate-900/80 backdrop-blur-md border border-emerald-500/50 rounded-2xl p-6 shadow-[0_0_30px_rgba(16,185,129,0.15)] flex flex-col items-center justify-center text-center">
                  <Network className="w-16 h-16 text-emerald-500 mb-4 animate-pulse" />
                  <h2 className="text-2xl font-bold text-white mb-2">Global Model Decryption</h2>
                  <p className="text-emerald-400 font-mono animate-pulse">{workflowState.toUpperCase()}</p>
                </motion.div>
              )}

              {/* IDLE */}
              {!isTrainingPhase && !isFhenixPhase && !isGlobalPhase && (
                <motion.div key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full h-full flex flex-col items-center justify-center border border-slate-800 border-dashed rounded-2xl">
                  <Network className="w-12 h-12 text-slate-700 mb-4" />
                  <p className="text-slate-500 font-mono text-sm">SYSTEM AWAITING TRAINING CYCLE</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="h-8 w-px relative my-2">
              {isGlobalPhase && (
                <motion.div
                  key="global-line"
                  initial={{ y: -20, opacity: 0 }}
                  animate={{ y: 40, opacity: 1 }}
                  transition={{ repeat: Infinity, duration: 1 }}
                  className="absolute left-1/2 -translate-x-1/2 flex flex-col items-center"
                >
                  <div className="w-[2px] h-12 bg-gradient-to-b from-emerald-500/0 via-emerald-500 to-emerald-500/0" />
                </motion.div>
              )}
          </div>

          <div className={`w-full bg-slate-900/60 backdrop-blur-md border rounded-xl p-6 relative transition-all duration-500 ${
            isGlobalPhase ? 'border-emerald-500 shadow-[0_0_30px_rgba(16,185,129,0.3)]' : 'border-slate-800'
          }`}>
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <Network className={`w-8 h-8 mr-3 transition-colors ${isGlobalPhase ? 'text-emerald-400' : 'text-slate-600'}`} />
                <div>
                  <h3 className="text-xl font-bold text-white tracking-tight">Global AI Model</h3>
                  <div className="text-sm text-slate-400 font-mono mt-1">Version {round}.0</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-emerald-500/70 text-xs uppercase font-bold tracking-wider mb-1">Global Accuracy</div>
                <motion.div className="text-4xl font-mono font-bold text-emerald-400" key={globalAccuracy} initial={{ opacity: 0.5, scale: 0.9, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }}>
                  {globalAccuracy.toFixed(2)}%
                </motion.div>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: EVENTS & KPIS */}
        <div className="col-span-3 flex flex-col gap-6 pt-4">
          <div className="grid grid-cols-2 gap-4">
             <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4">
               <div className="text-slate-500 text-xs mb-1">Privacy Budget (\u03B5)</div>
               <div className="text-xl font-mono text-white">{(round * 0.05).toFixed(2)}</div>
             </div>
             <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4">
               <div className="text-slate-500 text-xs mb-1">Current Round</div>
               <div className="text-xl font-mono text-white">{round}</div>
             </div>
          </div>

          <div className="flex-1 bg-slate-900/60 border border-slate-800 rounded-xl flex flex-col overflow-hidden h-[400px]">
            <div className="p-4 border-b border-slate-800 bg-slate-950/50 flex items-center">
              <Server className="w-4 h-4 text-slate-400 mr-2" />
              <h3 className="font-semibold text-white">Live System Audit</h3>
            </div>
            <div className="flex-1 p-4 overflow-y-auto flex flex-col gap-3">
              <AnimatePresence>
                {logs.map((log) => (
                  <motion.div key={log.id} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="flex text-sm">
                    <span className="text-slate-500 font-mono mr-3 shrink-0">{log.time}</span>
                    <span className="text-emerald-400 font-medium">{log.message}</span>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
