import type { AuthChecker } from "type-graphql";

export type GraphQLContext = {
  userId?: string;
  role?: "admin" | "employee";
};

export const authChecker: AuthChecker<GraphQLContext, "admin" | "employee"> = (
  { context },
  roles
) => {
  if (!context.role) return false;
  return roles.length === 0 || roles.includes(context.role);
};
