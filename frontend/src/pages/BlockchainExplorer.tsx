import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { api } from '@/api/services';
import { ShieldCheck, Network, Database, Link as LinkIcon, ExternalLink, Terminal } from 'lucide-react';

export default function BlockchainExplorer() {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await api.getBlockchainEvents();
        setEvents(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchEvents();
    const interval = setInterval(fetchEvents, 15000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <div className="w-12 h-12 border-4 border-purple-500/20 border-t-purple-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6 max-w-6xl mx-auto"
    >
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-white flex items-center">
            <Terminal className="w-8 h-8 mr-3 text-purple-500" />
            fhEVM Immutable Ledger
          </h2>
          <p className="text-slate-400 mt-1">
            Cryptographic proof of federated aggregation. Every update is verified via Fhenix smart contracts.
          </p>
        </div>
        <div className="flex items-center gap-2 text-sm text-purple-400 bg-purple-500/10 px-3 py-1.5 rounded-full border border-purple-500/20 font-mono">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-500"></span>
          </span>
          TESTNET CONNECTED
        </div>
      </div>

      <div className="rounded-xl border border-slate-800 bg-slate-900/60 backdrop-blur-md shadow-2xl overflow-hidden relative">
        {events.length === 0 ? (
          <div className="p-16 flex flex-col items-center justify-center text-slate-600 text-center">
            <ShieldCheck className="w-16 h-16 mb-4 opacity-20" />
            <p className="font-mono text-sm tracking-widest">AWAITING ON-CHAIN EVENTS</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-800/50">
            <AnimatePresence>
              {events.map((event, idx) => (
                <motion.div 
                  key={idx} 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="p-6 hover:bg-slate-800/40 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-6 group"
                >
                  
                  {/* Header / Summary */}
                  <div className="flex items-center gap-4">
                    <div className="bg-purple-500/10 p-4 rounded-xl border border-purple-500/20 shrink-0 group-hover:border-purple-500/50 transition-colors shadow-[0_0_15px_rgba(168,85,247,0.1)]">
                      <Network className="w-6 h-6 text-purple-400" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-white flex items-center tracking-tight">
                        Global Model Aggregation
                        <span className="ml-3 px-2 py-0.5 text-[10px] rounded bg-emerald-500/10 text-emerald-400 font-mono border border-emerald-500/20 tracking-wider">
                          {event.status.toUpperCase()}
                        </span>
                      </h3>
                      <p className="text-sm text-slate-500 mt-1 font-mono">
                        ROUND {event.round} <span className="mx-2 opacity-50">|</span> V{event.version} <span className="mx-2 opacity-50">|</span> {new Date(event.timestamp).toLocaleString()}
                      </p>
                    </div>
                  </div>

                  {/* Details Grid */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-sm flex-1 md:ml-12 border-t md:border-t-0 md:border-l border-slate-800 pt-4 md:pt-0 md:pl-12">
                    <div>
                      <div className="text-slate-500 text-[10px] uppercase tracking-widest mb-1 font-bold">Participants</div>
                      <div className="font-mono text-white flex items-center">
                        <Database className="w-3 h-3 mr-2 text-slate-400" /> {event.participants} Nodes
                      </div>
                    </div>
                    <div className="col-span-2 md:col-span-3 overflow-hidden">
                      <div className="text-slate-500 text-[10px] uppercase tracking-widest mb-1 font-bold">Model Checksum Hash</div>
                      <div className="font-mono text-emerald-400 truncate text-xs bg-slate-950 p-1.5 rounded border border-slate-800">
                        {event.model_hash}
                      </div>
                    </div>
                  </div>

                  {/* Fhenix Tx */}
                  <div className="shrink-0 pt-4 md:pt-0">
                    <a 
                      href={`https://explorer.fhenix.zone/tx/${event.tx_ref}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center text-sm font-bold tracking-wider text-purple-400 hover:text-white bg-purple-500/10 hover:bg-purple-500/20 px-4 py-2.5 rounded-lg transition-all border border-purple-500/30 hover:border-purple-500 hover:shadow-[0_0_15px_rgba(168,85,247,0.4)]"
                    >
                      <LinkIcon className="w-4 h-4 mr-2" />
                      <span>VIEW TX</span>
                      <ExternalLink className="w-3 h-3 ml-2 opacity-50" />
                    </a>
                  </div>

                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </motion.div>
  );
}
