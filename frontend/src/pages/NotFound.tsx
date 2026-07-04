import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center h-[80vh] text-center space-y-4">
      <h1 className="text-6xl font-extrabold text-primary">404</h1>
      <h2 className="text-2xl font-semibold">Page Not Found</h2>
      <p className="text-muted-foreground max-w-md">
        The page you are looking for doesn't exist or has been moved.
      </p>
      <Link
        to="/"
        className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring bg-primary text-primary-foreground shadow hover:bg-primary/90 h-10 px-8"
      >
        Go Home
      </Link>
    </div>
  );
}
