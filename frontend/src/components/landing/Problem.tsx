import { motion } from 'framer-motion';
import { Database, Lock, ArrowRightLeft, ShieldAlert } from 'lucide-react';

export function Problem() {
  return (
    <section className="py-24 bg-muted/30">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">The Data Silo Problem</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Traditional AI requires centralized data. In healthcare, privacy regulations make this impossible.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Traditional */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="p-8 rounded-2xl border border-destructive/20 bg-destructive/5 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 bg-destructive text-destructive-foreground px-3 py-1 rounded-bl-lg text-xs font-bold uppercase tracking-wider">
              Traditional Approach
            </div>
            <ShieldAlert className="w-12 h-12 text-destructive mb-6" />
            <h3 className="text-2xl font-bold mb-4">Centralized Data</h3>
            <ul className="space-y-4">
              <li className="flex items-start">
                <ArrowRightLeft className="w-5 h-5 text-destructive mr-3 shrink-0 mt-0.5" />
                <span className="text-muted-foreground">Patient records are moved to central servers.</span>
              </li>
              <li className="flex items-start">
                <ArrowRightLeft className="w-5 h-5 text-destructive mr-3 shrink-0 mt-0.5" />
                <span className="text-muted-foreground">High risk of data breaches and HIPAA violations.</span>
              </li>
              <li className="flex items-start">
                <ArrowRightLeft className="w-5 h-5 text-destructive mr-3 shrink-0 mt-0.5" />
                <span className="text-muted-foreground">Hospitals refuse to collaborate.</span>
              </li>
            </ul>
          </motion.div>

          {/* MediFed */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="p-8 rounded-2xl border border-primary/20 bg-primary/5 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 bg-primary text-primary-foreground px-3 py-1 rounded-bl-lg text-xs font-bold uppercase tracking-wider">
              MediFed Solution
            </div>
            <Lock className="w-12 h-12 text-primary mb-6" />
            <h3 className="text-2xl font-bold mb-4">Confidential Federation</h3>
            <ul className="space-y-4">
              <li className="flex items-start">
                <Database className="w-5 h-5 text-primary mr-3 shrink-0 mt-0.5" />
                <span className="text-muted-foreground">Data never leaves the hospital's secure environment.</span>
              </li>
              <li className="flex items-start">
                <Database className="w-5 h-5 text-primary mr-3 shrink-0 mt-0.5" />
                <span className="text-muted-foreground">Only encrypted model parameters are shared.</span>
              </li>
              <li className="flex items-start">
                <Database className="w-5 h-5 text-primary mr-3 shrink-0 mt-0.5" />
                <span className="text-muted-foreground">Global AI models trained without seeing raw data.</span>
              </li>
            </ul>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
