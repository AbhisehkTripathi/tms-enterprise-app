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

export function LoginDemoPage(): React.ReactElement {
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: { pathname: string } })?.from?.pathname ?? "/shipments";

  const { data, loading, error } = useQuery<{ getUsers: SeededUser[] }>(GET_USERS, {
    fetchPolicy: "cache-first",
  });

  const users = data?.getUsers ?? [];
  const admins = users.filter((u) => u.role === "admin");
  const employees = users.filter((u) => u.role === "employee");

  const handleSelectUser = (user: SeededUser): void => {
    setAuth({ id: String(user.id), role: user.role });
    navigate(from, { replace: true });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface p-4">
      <div className="w-full max-w-md bg-surface-elevated border border-border rounded-lg shadow-lg p-6">
        <h1 className="text-xl font-semibold text-primary-text mb-2">Demo login</h1>
        <p className="text-sm text-muted-foreground mb-4">
          Seeded data: {admins.length} admin(s), {employees.length} employee(s). Select a user to sign in.
        </p>
        <p className="mb-4 text-sm text-muted-foreground">
          <Link to="/login" className="text-accent hover:underline">
            ← Back to sign in
          </Link>
        </p>
        {loading && <p className="text-muted-foreground text-sm">Loading users…</p>}
        {error && (
          <p className="text-red-600 text-sm mb-4">
            {error.message}. Ensure the GraphQL server is running.
          </p>
        )}
        {!loading && !error && users.length > 0 && (
          <div className="space-y-4">
            {admins.length > 0 && (
              <div>
                <h2 className="text-sm font-medium text-primary-text mb-2">
                  Admin ({admins.length})
                </h2>
                <ul className="space-y-1">
                  {admins.map((u) => (
                    <li key={u.id}>
                      <button
                        type="button"
                        onClick={() => handleSelectUser(u)}
                        className="w-full text-left px-3 py-2 rounded border border-border bg-surface hover:bg-muted text-primary-text text-sm"
                      >
                        {u.name} — {u.email}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {employees.length > 0 && (
              <div>
                <h2 className="text-sm font-medium text-primary-text mb-2">
                  Employee ({employees.length})
                </h2>
                <ul className="space-y-1">
                  {employees.map((u) => (
                    <li key={u.id}>
                      <button
                        type="button"
                        onClick={() => handleSelectUser(u)}
                        className="w-full text-left px-3 py-2 rounded border border-border bg-surface hover:bg-muted text-primary-text text-sm"
                      >
                        {u.name} — {u.email}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
        {!loading && !error && users.length === 0 && (
          <p className="text-muted-foreground text-sm">No seeded users. Start the API to seed.</p>
        )}
      </div>
    </div>
  );
}
