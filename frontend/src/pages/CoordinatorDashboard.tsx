import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { api } from '@/api/services';
import { Activity, Users, Clock, Server, Network } from 'lucide-react';
import { ContributionLeaderboard } from '@/components/dashboard/ContributionLeaderboard';

export default function CoordinatorDashboard() {
  const [stats, setStats] = useState<any>(null);
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const [statsRes, historyRes] = await Promise.all([
          api.getCoordinatorStatus(),
          api.getCoordinatorHistory()
        ]);
        setStats(statsRes.data);
        
        // Format history for Recharts
        const formattedHistory = historyRes.data.map((item: any) => ({
          name: `Round ${item.round}`,
          accuracy: Number((item.accuracy * 100).toFixed(2)),
          version: `v${item.version}`,
        }));
        setHistory(formattedHistory.length > 0 ? formattedHistory : [{ name: 'Round 1', accuracy: 80.0 }]);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    
    fetchDashboard();
    const interval = setInterval(fetchDashboard, 10000);
    return () => clearInterval(interval);
  }, []);

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
            <Network className="w-8 h-8 mr-3 text-primary" />
            Global Mission Control
          </h2>
          <p className="text-slate-400 mt-1">
            Live overview of the federated learning network, model convergence, and FHE telemetry.
          </p>
        </div>
        <div className="flex items-center gap-2 text-sm text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-full border border-emerald-500/20">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          System Online
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 backdrop-blur-md shadow p-6 hover:border-primary/50 transition-colors group">
          <div className="flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="tracking-tight text-sm font-medium text-slate-400 group-hover:text-primary transition-colors">Training Rounds</h3>
            <Activity className="h-4 w-4 text-slate-500 group-hover:text-primary" />
          </div>
          <div className="text-3xl font-mono font-bold text-white">{stats?.completed_rounds || 0}</div>
          <p className="text-xs text-slate-500">Successfully aggregated</p>
        </div>
        
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 backdrop-blur-md shadow p-6 relative overflow-hidden group">
          <div className="absolute inset-0 bg-emerald-500/5 group-hover:bg-emerald-500/10 transition-colors" />
          <div className="relative flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="tracking-tight text-sm font-medium text-slate-400">Global Accuracy</h3>
            <Activity className="h-4 w-4 text-emerald-500" />
          </div>
          <div className="relative text-3xl font-mono font-bold text-emerald-400 drop-shadow-[0_0_15px_rgba(16,185,129,0.8)]">{(stats?.current_global_accuracy * 100).toFixed(1)}%</div>
          <p className="relative text-xs text-emerald-500/50">Latest model version</p>
        </div>
        
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 backdrop-blur-md shadow p-6 hover:border-primary/50 transition-colors group">
          <div className="flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="tracking-tight text-sm font-medium text-slate-400">Participating Hospitals</h3>
            <Users className="h-4 w-4 text-slate-500 group-hover:text-primary" />
          </div>
          <div className="text-3xl font-mono font-bold text-white">{stats?.hospitals_count || 0}</div>
          <p className="text-xs text-slate-500">Active edge nodes</p>
        </div>
        
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 backdrop-blur-md shadow p-6 hover:border-primary/50 transition-colors group">
          <div className="flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="tracking-tight text-sm font-medium text-slate-400">Last Publication</h3>
            <Clock className="h-4 w-4 text-slate-500 group-hover:text-primary" />
          </div>
          <div className="text-2xl font-mono font-bold text-white mt-1">
            {stats?.latest_publication ? new Date(stats.latest_publication).toLocaleTimeString() : 'N/A'}
          </div>
          <p className="text-xs text-slate-500">Time of last fhEVM unseal</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 backdrop-blur-md shadow md:col-span-4 p-6 min-h-[400px] flex flex-col">
          <h3 className="tracking-tight text-sm font-bold text-white mb-6 uppercase tracking-wider flex items-center">
            <Activity className="w-4 h-4 mr-2 text-primary" /> Global Model Convergence
          </h3>
          <div className="flex-1 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={history} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorAccuracy" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(190, 90%, 50%)" stopOpacity={0.5}/>
                    <stop offset="95%" stopColor="hsl(190, 90%, 50%)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(220 30% 20%)" className="opacity-50" />
                <XAxis dataKey="name" stroke="hsl(215 20% 65%)" className="text-xs font-mono" />
                <YAxis domain={['auto', 'auto']} stroke="hsl(215 20% 65%)" className="text-xs font-mono" tickFormatter={(v) => `${v}%`} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'hsl(240 10% 6%)', borderColor: 'hsl(220 30% 15%)', color: 'white' }}
                  itemStyle={{ color: 'hsl(190 90% 50%)', fontWeight: 'bold' }}
                />
                <Area type="monotone" dataKey="accuracy" stroke="hsl(190 90% 50%)" strokeWidth={3} fillOpacity={1} fill="url(#colorAccuracy)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 backdrop-blur-md shadow md:col-span-3 p-6 min-h-[400px] flex flex-col">
          <div className="flex items-center mb-6">
            <Server className="w-4 h-4 mr-2 text-primary" />
            <h3 className="tracking-tight text-sm font-bold text-white uppercase tracking-wider">System Telemetry</h3>
          </div>
          <div className="flex-1 overflow-y-auto space-y-4 pr-2">
            {history.slice().reverse().map((h, idx) => (
              <motion.div 
                key={idx} 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="flex items-start border-b border-slate-800/50 pb-4 last:border-0"
              >
                <div className="w-2 h-2 mt-1.5 rounded-full bg-emerald-500 mr-3 shrink-0 shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                <div>
                  <p className="text-sm font-bold text-white">Global Model Updated (v{h.version})</p>
                  <p className="text-xs text-slate-400 mt-1">Accuracy reached <span className="text-emerald-400 font-mono">{h.accuracy}%</span> after successful FHE aggregation.</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* AI Contribution Leaderboard */}
      <ContributionLeaderboard />

    </motion.div>
  );
}
