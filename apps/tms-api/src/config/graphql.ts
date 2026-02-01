import type { GraphQLSchema } from "graphql";
import { buildSchema } from "type-graphql";
import type express from "express";
import { graphqlHTTP } from "express-graphql";
import { UsersResolver } from "@services/user.service";
import { ShipmentResolver } from "@services/shipment.resolver";
import { RoleResolver } from "@services/role.resolver";
import { CategoryResolver } from "@services/category.resolver";
import { StorageResolver } from "@services/storage.resolver";
import { authChecker } from "@config/auth";
import type { GraphQLContext } from "@config/auth";

const resolvers = [
  UsersResolver,
  ShipmentResolver,
  RoleResolver,
  CategoryResolver,
  StorageResolver,
] as const;

let schemaCache: GraphQLSchema | null = null;

/**
 * Builds the GraphQL schema (cached) for type-graphql with auth and all resolvers.
 */
export async function getGraphQLSchema(): Promise<GraphQLSchema> {
  if (schemaCache) return schemaCache;
  schemaCache = await buildSchema({
    resolvers: [...resolvers],
    emitSchemaFile: true,
    authChecker,
  });
  return schemaCache;
}

/**
 * Normalizes x-role header to "admin" | "employee" (case-insensitive); defaults to "employee".
 */
function normalizeRole(header: unknown): "admin" | "employee" {
  const raw = typeof header === "string" ? header.trim().toLowerCase() : "";
  return raw === "admin" ? "admin" : "employee";
}

/**
 * Builds GraphQL context from the Express request (role and userId from headers).
 */
export function getGraphQLContext(req: express.Request): GraphQLContext {
  return {
    userId: req.headers["x-user-id"] as string | undefined,
    role: normalizeRole(req.headers["x-role"]),
  };
}

/**
 * Returns the express-graphql handler for the GraphQL endpoint.
 * Mount at POST /api/v1/user (and GET for GraphiQL in development).
 * Note: express-graphql uses the context value as-is (it does not call a function),
 * so we pass the context object built from the request.
 */
export function createGraphQLHandler(): express.RequestHandler {
  return graphqlHTTP(async (req, _res, _params) => {
    const r = req as express.Request;
    return {
      schema: await getGraphQLSchema(),
      context: getGraphQLContext(r),
      graphiql: process.env.NODE_ENV === "development",
    };
  });
}
