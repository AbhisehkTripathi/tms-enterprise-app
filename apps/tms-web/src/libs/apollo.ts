import { ApolloClient, InMemoryCache, HttpLink, from } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { getAuth } from "./auth";

const productionApiBase = "https://tms-enterprise-app-node-api.onrender.com";
const graphqlUri =
  import.meta.env.VITE_GRAPHQL_URI ??
  (import.meta.env.PROD ? `${productionApiBase}/api/v1/user` : "http://localhost:3010/api/v1/user");

const authLink = setContext((_, { headers }) => {
  const auth = getAuth();
  return {
    headers: {
      ...headers,
      "x-role": auth?.role ?? "employee",
      "Content-Type": "application/json",
    },
  };
});

export const apolloClient = new ApolloClient({
  link: from([authLink, new HttpLink({ uri: graphqlUri })]),
  cache: new InMemoryCache(),
});
