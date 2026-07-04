import { motion } from 'framer-motion';
import { Network, ShieldCheck } from 'lucide-react';

export function FhenixSponsor() {
  return (
    <section className="py-24 bg-muted/50 overflow-hidden relative">
      <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-primary/10 blur-[100px] rounded-full pointer-events-none" />
      
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm font-semibold text-primary mb-8 shadow-sm">
          <ShieldCheck className="w-4 h-4 mr-2" />
          The Core Innovation
        </div>
        
        <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-8">
          Powered by <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary/60">Fhenix</span>
        </h2>
        
        <p className="text-xl text-muted-foreground mb-12 max-w-3xl mx-auto">
          Confidential Federated Intelligence is only possible through Fhenix CoFHE. 
          Instead of processing plaintext data, the network aggregates fully homomorphically encrypted model updates securely on-chain.
        </p>

        <div className="flex flex-col items-center justify-center p-8 bg-card border border-border rounded-2xl shadow-lg relative overflow-hidden">
          <Network className="w-16 h-16 text-primary mb-6 opacity-80" />
          <h3 className="text-2xl font-bold mb-4">Confidential Computing Layer</h3>
          <p className="text-muted-foreground max-w-xl">
            Securely compute across distributed encrypted datasets. Validate model weights with absolute zero-knowledge proofs.
          </p>
          
          {/* Animated data packets */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <motion.div 
              animate={{ x: [0, 800], opacity: [0, 1, 0] }} 
              transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
              className="absolute top-1/4 left-0 w-8 h-8 rounded-full bg-primary/20 blur-md"
            />
            <motion.div 
              animate={{ x: [800, 0], opacity: [0, 1, 0] }} 
              transition={{ repeat: Infinity, duration: 4, ease: "linear", delay: 1 }}
              className="absolute bottom-1/4 right-0 w-6 h-6 rounded-full bg-primary/20 blur-md"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
