import { Hero } from '@/components/landing/Hero';
import { Problem } from '@/components/landing/Problem';
import { Workflow } from '@/components/landing/Workflow';
import { FhenixSponsor } from '@/components/landing/FhenixSponsor';
import { Features } from '@/components/landing/Features';
import { Impact } from '@/components/landing/Impact';
import { Architecture } from '@/components/landing/Architecture';
import { Statistics } from '@/components/landing/Statistics';
import { CTA } from '@/components/landing/CTA';
import { Footer } from '@/components/landing/Footer';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/30 selection:text-primary-foreground">
      <Hero />
      <Problem />
      <Workflow />
      <FhenixSponsor />
      <Features />
      <Impact />
      <Architecture />
      <Statistics />
      <CTA />
      <Footer />
    </div>
  );
}
