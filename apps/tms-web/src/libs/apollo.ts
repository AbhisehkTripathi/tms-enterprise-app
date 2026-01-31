import { ApolloClient, InMemoryCache, HttpLink, from } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { getAuth } from "./auth";

const graphqlUri =
  import.meta.env.VITE_GRAPHQL_URI ?? "http://localhost:4000/api/v1/user";

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
