import { motion } from 'framer-motion';

export default function About() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-3xl mx-auto space-y-6 mt-12"
    >
      <h2 className="text-3xl font-bold tracking-tight">About MediFed</h2>
      <p className="text-muted-foreground text-lg leading-relaxed">
        MediFed enables secure, federated AI model training across hospitals using Fully Homomorphic Encryption powered by the Fhenix network.
      </p>
    </motion.div>
  );
}
