import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, TrendingUp, Award, Activity } from 'lucide-react';
import { api } from '@/api/services';

interface Contribution {
  hospital: string;
  accuracy_gain: string;
  privacy_budget: string;
  trust_score: string;
  contribution: string;
}

export function ContributionLeaderboard() {
  const [data, setData] = useState<Contribution[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.getContributions();
        setData(res.data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
    const interval = setInterval(fetchData, 15000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="flex h-40 items-center justify-center border border-slate-800 rounded-xl bg-card">
        <Activity className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="border border-slate-800 rounded-xl bg-card overflow-hidden">
      <div className="p-4 border-b border-slate-800 bg-slate-900/50 flex items-center justify-between">
        <div className="flex items-center">
          <Award className="w-5 h-5 text-amber-400 mr-2" />
          <h3 className="font-bold text-white tracking-tight">AI Contribution Analyzer</h3>
        </div>
        <span className="px-2 py-0.5 rounded text-xs font-mono bg-primary/20 text-primary border border-primary/30">
          ZERO-KNOWLEDGE
        </span>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-muted-foreground uppercase bg-slate-900/30">
            <tr>
              <th className="px-4 py-3 font-semibold">Hospital Node</th>
              <th className="px-4 py-3 font-semibold text-center">Accuracy Gain</th>
              <th className="px-4 py-3 font-semibold text-center">Privacy (\u03b5)</th>
              <th className="px-4 py-3 font-semibold text-center">Trust Score</th>
              <th className="px-4 py-3 font-semibold text-right">Contribution</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {data.map((row, idx) => (
              <motion.tr 
                key={idx}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="hover:bg-slate-800/30 transition-colors"
              >
                <td className="px-4 py-4 font-medium text-white flex items-center">
                  <div className={`w-2 h-2 rounded-full mr-2 ${row.contribution.includes('High') ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                  {row.hospital}
                </td>
                <td className="px-4 py-4 text-center">
                  <span className={`flex items-center justify-center font-mono ${row.accuracy_gain.startsWith('+') ? 'text-emerald-400' : 'text-red-400'}`}>
                    {row.accuracy_gain.startsWith('+') && <TrendingUp className="w-3 h-3 mr-1" />}
                    {row.accuracy_gain}
                  </span>
                </td>
                <td className="px-4 py-4 text-center font-mono text-slate-300">
                  <span className="bg-slate-800 px-2 py-1 rounded">{row.privacy_budget}</span>
                </td>
                <td className="px-4 py-4 text-center">
                  <div className="flex items-center justify-center">
                    <ShieldCheck className="w-3 h-3 mr-1 text-primary" />
                    <span className="font-mono">{row.trust_score}</span>
                  </div>
                </td>
                <td className="px-4 py-4 text-right font-bold text-white">
                  {row.contribution}
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
