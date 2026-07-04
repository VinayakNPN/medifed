import { motion } from 'framer-motion';

const stats = [
  { value: '50+', label: 'Hospitals Connected' },
  { value: '99.9%', label: 'Training Accuracy' },
  { value: '10M+', label: 'Encrypted Operations' },
  { value: 'Zero', label: 'Data Breaches' },
];

export function Statistics() {
  return (
    <section className="py-24 bg-primary text-primary-foreground">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
          {stats.map((stat, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
            >
              <div className="text-5xl font-extrabold mb-2">{stat.value}</div>
              <div className="text-primary-foreground/80 font-medium tracking-wide uppercase text-sm">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
