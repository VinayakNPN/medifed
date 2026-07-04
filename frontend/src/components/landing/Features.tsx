import { motion } from 'framer-motion';
import { Brain, Lock, Network, ShieldCheck, Activity, EyeOff } from 'lucide-react';

const features = [
  {
    title: 'Confidential Federated Intelligence',
    description: 'Collaborative AI model training across diverse institutions without exposing raw patient data.',
    icon: Brain,
  },
  {
    title: 'Explainable AI',
    description: 'Provide clear, interpretable rationale for clinical predictions utilizing encrypted SHAP values.',
    icon: Activity,
  },
  {
    title: 'Privacy by Design',
    description: 'Guaranteed compliance with HIPAA, GDPR, and global healthcare privacy regulations.',
    icon: Lock,
  },
  {
    title: 'Blockchain Audit Trail',
    description: 'Immutable ledger of all model updates, aggregations, and access requests.',
    icon: Network,
  },
  {
    title: 'Differential Privacy',
    description: 'Strict privacy budgets (epsilon tracking) to prevent model inversion attacks.',
    icon: EyeOff,
  },
  {
    title: 'Secure Collaboration',
    description: 'Cryptographically secure environment for hospitals and researchers to work together.',
    icon: ShieldCheck,
  },
];

export function Features() {
  return (
    <section className="py-24 bg-background">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">Enterprise Grade Capabilities</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Built for scale, security, and absolute privacy.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, idx) => (
            <motion.div
              key={idx}
              whileHover={{ y: -5 }}
              className="p-6 rounded-2xl border border-border bg-card shadow-sm hover:shadow-md transition-all group cursor-default"
            >
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
                <feature.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
              <p className="text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
