import { motion } from 'framer-motion';
import { ArrowRight, Activity } from 'lucide-react';
import { Link } from 'react-router-dom';

export function Hero() {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden pt-20 pb-32">
      {/* Background glowing effects */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/20 blur-[120px] rounded-full pointer-events-none" />
      
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-sm font-medium text-primary mb-8 backdrop-blur-sm">
            <Activity className="w-4 h-4 mr-2" />
            Powered by Fhenix CoFHE
          </div>
          
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60">
            The Future of Healthcare AI Doesn't Share Data. <br className="hidden md:block" />
            It Shares Intelligence.
          </h1>
          
          <p className="text-xl text-muted-foreground mb-10 max-w-3xl mx-auto leading-relaxed">
            MediFed enables hospitals to collaboratively train AI models using Confidential Computing. 
            Powered by Fhenix CoFHE, patient data never leaves the hospital—only encrypted intelligence does.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/coordinator"
              className="inline-flex h-12 items-center justify-center rounded-lg bg-primary px-8 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            >
              Watch Live Demo
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
            <a
              href="#architecture"
              className="inline-flex h-12 items-center justify-center rounded-lg border border-border bg-background px-8 text-sm font-medium shadow-sm transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            >
              Explore Architecture
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
