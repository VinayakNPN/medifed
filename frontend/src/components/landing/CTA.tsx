import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export function CTA() {
  return (
    <section className="py-32 bg-background relative overflow-hidden">
      <div className="absolute inset-0 bg-primary/5"></div>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        <h2 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-8">
          The Future of Healthcare AI is Confidential.
        </h2>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/coordinator"
            className="inline-flex h-14 items-center justify-center rounded-lg bg-primary px-8 text-base font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          >
            Launch Live Demo
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
          <a
            href="#architecture"
            className="inline-flex h-14 items-center justify-center rounded-lg border border-border bg-background px-8 text-base font-medium shadow-sm transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          >
            View Architecture
          </a>
        </div>
      </div>
    </section>
  );
}
