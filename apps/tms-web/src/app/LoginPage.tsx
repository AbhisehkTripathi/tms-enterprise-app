import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { setAuth } from "@/libs/auth";

type Role = "admin" | "employee";

export function LoginPage(): React.ReactElement {
  const [role, setRole] = useState<Role>("employee");
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: { pathname: string } })?.from?.pathname ?? "/shipments";

  const handleSubmit = (e: React.FormEvent): void => {
    e.preventDefault();
    setAuth({ id: "1", role });
    navigate(from, { replace: true });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface p-4">
      <div className="w-full max-w-sm bg-surface-elevated border border-border rounded-lg shadow-lg p-6">
        <h1 className="text-xl font-semibold text-primary-text mb-4">TMS Sign in</h1>
        <p className="text-sm text-muted-foreground mb-4">Demo: pick a role to continue.</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-primary-text mb-2">Role</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as Role)}
              className="w-full px-3 py-2 border border-border rounded bg-surface"
            >
              <option value="employee">Employee</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <button
            type="submit"
            className="w-full py-2.5 px-4 bg-primary text-primary-foreground rounded-md font-medium shadow-sm transition-colors"
          >
            Continue
          </button>
        </form>
      </div>
    </div>
  );
}
