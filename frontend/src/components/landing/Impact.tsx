import { motion } from 'framer-motion';

const impacts = [
  'Rare Disease Diagnosis',
  'Cancer Detection',
  'Medical Imaging',
  'Drug Discovery',
  'Clinical Trials',
  'Genomics',
  'Personalized Medicine'
];

export function Impact() {
  return (
    <section className="py-24 bg-muted/30">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">Real World Impact</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Transforming medical research across the most critical domains of healthcare.
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-4">
          {impacts.map((impact, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="px-6 py-4 rounded-full border border-primary/20 bg-background shadow-sm hover:bg-primary/5 transition-colors font-medium text-lg text-foreground"
            >
              {impact}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
