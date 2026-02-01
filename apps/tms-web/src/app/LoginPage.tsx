import { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useQuery } from "@apollo/client/react";
import { gql } from "graphql-tag";
import { setAuth } from "@/libs/auth";

const GET_USERS = gql`
  query GetUsers {
    getUsers {
      id
      name
      email
      role
    }
  }
`;

type Role = "admin" | "employee";

interface SeededUser {
  id: number;
  name: string;
  email: string;
  role: Role;
}

const DEMO_PASSWORD = "demo";

export function LoginPage(): React.ReactElement {
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: { pathname: string } })?.from?.pathname ?? "/shipments";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const { data } = useQuery<{ getUsers: SeededUser[] }>(GET_USERS, {
    fetchPolicy: "cache-first",
  });

  const users = data?.getUsers ?? [];

  const handleSubmit = (e: React.FormEvent): void => {
    e.preventDefault();
    setError(null);
    const trimmed = email.trim().toLowerCase();
    if (!trimmed) {
      setError("Enter your email.");
      return;
    }
    const user = users.find((u) => u.email.toLowerCase() === trimmed);
    if (!user) {
      setError("No account found for this email.");
      return;
    }
    if (password !== DEMO_PASSWORD) {
      setError("Invalid password. Use \"demo\" for demo accounts.");
      return;
    }
    setAuth({ id: String(user.id), role: user.role });
    navigate(from, { replace: true });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface p-4">
      <div className="w-full max-w-sm bg-surface-elevated border border-border rounded-lg shadow-lg p-6">
        <h1 className="text-xl font-semibold text-primary-text mb-2">TMS Sign in</h1>
        <p className="text-sm text-muted-foreground mb-4">
          Sign in with your email and password.
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="login-email" className="block text-sm font-medium text-primary-text mb-1">
              Email
            </label>
            <input
              id="login-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full px-3 py-2 border border-border rounded bg-surface text-primary-text placeholder:text-muted-foreground"
              autoComplete="email"
            />
          </div>
          <div>
            <label htmlFor="login-password" className="block text-sm font-medium text-primary-text mb-1">
              Password
            </label>
            <input
              id="login-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Use &quot;demo&quot; for demo accounts"
              className="w-full px-3 py-2 border border-border rounded bg-surface text-primary-text placeholder:text-muted-foreground"
              autoComplete="current-password"
            />
          </div>
          {error && (
            <p className="text-sm text-red-600" role="alert">
              {error}
            </p>
          )}
          <button
            type="submit"
            className="w-full py-2.5 px-4 bg-primary text-primary-foreground rounded-md font-medium shadow-sm transition-colors"
          >
            Sign in
          </button>
        </form>
        <p className="mt-4 text-center text-sm text-muted-foreground">
          <Link to="/login/demo" className="text-accent hover:underline">
            Use demo account
          </Link>
        </p>
      </div>
    </div>
  );
}
