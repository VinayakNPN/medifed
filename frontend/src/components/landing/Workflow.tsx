import { motion } from 'framer-motion';

export function Workflow() {
  return (
    <section className="py-24 bg-background">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">How MediFed Works</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            A seamless integration of local training and fully homomorphic encryption.
          </p>
        </div>

        <div className="relative flex flex-col items-center justify-center p-8 rounded-3xl border border-border bg-card shadow-2xl overflow-hidden min-h-[500px]">
          {/* Animated SVG Workflow representation */}
          <svg className="absolute inset-0 w-full h-full opacity-30" xmlns="http://www.w3.org/2000/svg">
            <path className="animate-pulse" d="M100,100 C200,100 300,300 500,300" stroke="hsl(var(--primary))" strokeWidth="2" fill="none" />
            <path className="animate-pulse delay-75" d="M100,300 C200,300 300,300 500,300" stroke="hsl(var(--primary))" strokeWidth="2" fill="none" />
            <path className="animate-pulse delay-150" d="M100,500 C200,500 300,300 500,300" stroke="hsl(var(--primary))" strokeWidth="2" fill="none" />
          </svg>
          
          <div className="z-10 grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-4xl text-center">
            {/* Step 1 */}
            <motion.div whileHover={{ scale: 1.05 }} className="p-6 rounded-xl bg-background border border-border">
              <div className="w-12 h-12 rounded-full bg-primary/20 text-primary flex items-center justify-center mx-auto mb-4 font-bold text-xl">1</div>
              <h3 className="font-semibold text-lg mb-2">Local Training</h3>
              <p className="text-sm text-muted-foreground">Hospitals train local models on proprietary data securely.</p>
            </motion.div>
            
            {/* Step 2 */}
            <motion.div whileHover={{ scale: 1.05 }} className="p-6 rounded-xl bg-primary/10 border border-primary/30 relative">
              <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center mx-auto mb-4 font-bold text-xl">2</div>
              <h3 className="font-semibold text-lg mb-2">Fhenix FHE Layer</h3>
              <p className="text-sm text-muted-foreground">Encrypted updates are aggregated on the Fhenix network.</p>
            </motion.div>
            
            {/* Step 3 */}
            <motion.div whileHover={{ scale: 1.05 }} className="p-6 rounded-xl bg-background border border-border">
              <div className="w-12 h-12 rounded-full bg-primary/20 text-primary flex items-center justify-center mx-auto mb-4 font-bold text-xl">3</div>
              <h3 className="font-semibold text-lg mb-2">Global Model</h3>
              <p className="text-sm text-muted-foreground">A superior global model is distributed back for inference.</p>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
