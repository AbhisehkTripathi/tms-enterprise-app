import { Link } from "react-router-dom";

export function HomePage(): React.ReactElement {
  return (
    <div className="max-w-2xl mx-auto py-8">
      <h1 className="text-2xl font-semibold text-primary mb-4">Transportation Management System</h1>
      <p className="text-muted-foreground mb-6">
        View and manage shipments. Use the menu to switch between grid and tile views.
      </p>
      <Link
        to="/shipments"
        className="inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Go to Shipments
      </Link>
    </div>
  );
}
