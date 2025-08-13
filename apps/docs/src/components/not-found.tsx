import { Link } from "react-router-dom";

export function NotFound() {
  return (
    <main className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
      <div
        className="mb-8"
        role="alert"
        aria-labelledby="error-title"
        aria-describedby="error-description"
      >
        <h1
          id="error-title"
          className="text-[120px] sm:text-[160px] md:text-[200px] font-bold text-foreground mb-4"
        >
          404
        </h1>
        <p
          id="error-description"
          className="text-lg sm:text-xl text-muted-foreground max-w-md mx-auto"
        >
          The page you’re looking for can’t be found.
        </p>
      </div>

      <Link
        to="/"
        className="no-underline inline-flex items-center px-6 py-3 rounded-md text-base font-medium text-primary-foreground bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ring transition-colors"
      >
        Take me home
      </Link>
    </main>
  );
}
