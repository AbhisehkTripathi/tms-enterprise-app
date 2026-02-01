import { Link } from "react-router-dom";
import { isAuthenticated } from "@/libs/auth";

export function HomePage(): React.ReactElement {
  const authenticated = isAuthenticated();

  return (
    <div className="max-w-2xl mx-auto py-8">
      <h1 className="text-2xl font-semibold text-primary-text mb-4">Transportation Management System</h1>
      <p className="text-muted-foreground mb-6">
        View and manage shipments. Use the menu to switch between grid and tile views. Sign in as admin or employee to access shipments and reports.
      </p>
      <div className="flex gap-3">
        {authenticated ? (
          <Link
            to="/shipments"
            className="inline-block px-5 py-2.5 bg-primary text-primary-foreground rounded-md font-medium shadow-sm transition-colors"
          >
            Go to Shipments
          </Link>
        ) : (
          <Link
            to="/login"
            className="inline-block px-5 py-2.5 bg-primary text-primary-foreground rounded-md font-medium shadow-sm transition-colors"
          >
            Sign in (Admin or Employee)
          </Link>
        )}
        {authenticated && (
          <Link
            to="/reports"
            className="inline-block px-5 py-2.5 border border-border bg-surface-elevated rounded-md font-medium text-primary-text hover:bg-muted transition-colors"
          >
            Reports
          </Link>
        )}
      </div>
    </div>
  );
}
