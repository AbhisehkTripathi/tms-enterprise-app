import express from "express";
import { buildSchema } from "type-graphql";
import { graphqlHTTP } from "express-graphql";
import { UsersResolver } from "@services/user.service";
import { ShipmentResolver } from "@services/shipment.resolver";
import { authChecker } from "@config/auth";
import type { GraphQLContext } from "@config/auth";

const route = express.Router();

const getSchema = async () => {
  return buildSchema({
    resolvers: [UsersResolver, ShipmentResolver],
    emitSchemaFile: true,
    authChecker,
  });
};

route.use(
  "/",
  graphqlHTTP(async (req, _res, _params) => {
    const r = req as express.Request;
    return {
      schema: await getSchema(),
      context: (): GraphQLContext => ({
        userId: r.headers["x-user-id"] as string | undefined,
        role: (r.headers["x-role"] as "admin" | "employee") || "employee",
      }),
      graphiql: process.env.NODE_ENV === "development",
    };
  })
);

export default route;
   

