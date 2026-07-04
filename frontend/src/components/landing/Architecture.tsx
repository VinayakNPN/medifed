import { motion } from 'framer-motion';

export function Architecture() {
  return (
    <section id="architecture" className="py-24 bg-background">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">Platform Architecture</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            A secure, scalable, and decentralized infrastructure designed for healthcare AI.
          </p>
        </div>

        <div className="relative w-full rounded-2xl border border-border bg-card shadow-2xl p-8 overflow-hidden min-h-[400px] flex items-center justify-center">
           {/* Decorative Grid Background */}
           <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
           
           <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
              {[
                { name: 'Frontend Dashboard', desc: 'React 19 / Tailwind' },
                { name: 'Hospital Simulator', desc: 'Federated Edge Nodes' },
                { name: 'Fhenix CoFHE', desc: 'Encrypted Computation' },
                { name: 'Explainable AI', desc: 'SHAP / Validation' },
              ].map((comp, idx) => (
                <motion.div 
                  key={idx}
                  whileHover={{ y: -5 }}
                  className="p-6 rounded-xl bg-background border border-primary/20 shadow-sm text-center"
                >
                  <h4 className="font-bold mb-2">{comp.name}</h4>
                  <p className="text-xs text-muted-foreground">{comp.desc}</p>
                </motion.div>
              ))}
           </div>
        </div>
      </div>
    </section>
  );
}
