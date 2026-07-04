export function Footer() {
  return (
    <footer className="bg-background border-t border-border py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center">
        <div className="mb-4 md:mb-0">
          <span className="text-xl font-bold tracking-tight">MediFed</span>
          <p className="text-sm text-muted-foreground mt-1">
            Built for Fhenix Hackathon 2026.
          </p>
        </div>
        
        <div className="flex items-center space-x-6 text-sm text-muted-foreground">
          <a href="#" className="hover:text-foreground transition-colors">GitHub</a>
          <a href="#" className="hover:text-foreground transition-colors">Documentation</a>
          <a href="#" className="hover:text-foreground transition-colors">Fhenix Network</a>
        </div>
      </div>
    </footer>
  );
}
