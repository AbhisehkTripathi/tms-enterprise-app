import { useState } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { getAuth, clearAuth } from "@/libs/auth";

interface LayoutProps {
  children?: React.ReactNode;
  view?: "grid" | "tile";
  onViewChange?: (v: "grid" | "tile") => void;
}

const menuItems = [
  { label: "Dashboard", path: "/" },
  { label: "Shipments", path: "/shipments", sub: [{ label: "List", path: "/shipments" }] },
  { label: "Reports", path: "/reports" },
];

export function Layout({ children, view = "grid", onViewChange }: LayoutProps): React.ReactElement {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const auth = getAuth();
  const navigate = useNavigate();

  const handleLogout = (): void => {
    clearAuth();
    navigate("/login");
  };

  return (
    <div className="min-h-screen flex bg-surface">
      {/* Hamburger + sidebar */}
      <button
        type="button"
        onClick={() => setSidebarOpen((o) => !o)}
        className="fixed top-4 left-4 z-20 p-2 rounded-lg bg-surface-elevated border border-border lg:hidden"
        aria-label="Toggle menu"
      >
        <span className="block w-5 h-0.5 bg-primary-text mb-1" />
        <span className="block w-5 h-0.5 bg-primary-text mb-1" />
        <span className="block w-5 h-0.5 bg-primary-text" />
      </button>
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-10 w-56 bg-[hsl(var(--color-sidebar))] border-r border-[hsl(var(--color-sidebar-border))] text-primary transform transition-transform lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <nav className="p-4 pt-16 lg:pt-4 space-y-1">
          {menuItems.map((item) => (
            <div key={item.path}>
              <Link
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className="block px-3 py-2 rounded hover:bg-muted text-primary-text"
              >
                {item.label}
              </Link>
              {item.sub?.map((sub) => (
                <Link
                  key={sub.path}
                  to={sub.path}
                  onClick={() => setSidebarOpen(false)}
                  className="block px-6 py-1.5 text-sm text-muted-foreground hover:bg-muted hover:text-primary-text rounded"
                >
                  {sub.label}
                </Link>
              ))}
            </div>
          ))}
        </nav>
      </aside>
      <main className="flex-1 flex flex-col min-w-0">
        {/* Horizontal menu bar */}
        <header className="sticky top-0 z-10 flex items-center justify-between gap-4 px-4 py-3 bg-surface-elevated border-b border-border">
          <div className="flex items-center gap-4">
            <Link to="/" className="font-semibold text-primary-text">TMS</Link>
            <nav className="hidden sm:flex gap-2">
              <Link to="/" className="px-3 py-1.5 rounded hover:bg-muted text-sm">Home</Link>
              <Link to="/shipments" className="px-3 py-1.5 rounded hover:bg-muted text-sm">Shipments</Link>
              <Link to="/reports" className="px-3 py-1.5 rounded hover:bg-muted text-sm">Reports</Link>
            </nav>
          </div>
          <div className="flex items-center gap-2">
            {onViewChange && (
              <>
                <button
                  type="button"
                  onClick={() => onViewChange("grid")}
                  className={`px-2 py-1 rounded text-sm ${view === "grid" ? "bg-muted" : "hover:bg-muted"}`}
                >
                  Grid
                </button>
                <button
                  type="button"
                  onClick={() => onViewChange("tile")}
                  className={`px-2 py-1 rounded text-sm ${view === "tile" ? "bg-muted" : "hover:bg-muted"}`}
                >
                  Tile
                </button>
              </>
            )}
            {auth && (
              <>
                <span className="text-sm text-muted-foreground">{auth.role}</span>
                <button type="button" onClick={handleLogout} className="text-sm text-accent hover:underline font-medium">
                  Logout
                </button>
              </>
            )}
          </div>
        </header>
        <div className="flex-1 p-4 overflow-auto">
          {children ?? <Outlet />}
        </div>
      </main>
    </div>
  );
}
