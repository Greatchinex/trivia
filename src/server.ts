import "reflect-metadata";
import { ApolloServer } from "apollo-server-express";
import { graphqlUploadExpress } from "graphql-upload";
import express from "express";
import { buildSchema } from "type-graphql";
import http from "http";
import dotenv from "dotenv";

// All Resolvers
import resolvers from "./graphql/resolver";
// DB
import "./config/db";

dotenv.config();

(async () => {
  try {
    const app = express();
    app.use(express.json());
    const port: any = process.env.PORT;

    const schema = await buildSchema({
      resolvers,
      // Incase u want 2 view schema in usual graphql format (creates the schema.gql file)
      emitSchemaFile: true,
      // disable class validator automatic validation
      validate: false
    });

    const apolloServer = new ApolloServer({
      schema,
      introspection: true,
      uploads: false,
      context: ({ req, res, connection }) => {
        if (connection) {
          return connection.context;
        } else {
          return {
            req,
            res
          };
        }
      }
    });

    app.use(graphqlUploadExpress());
    apolloServer.applyMiddleware({ app, path: "/graphql" });

    const graphQLServer = http.createServer(app);
    apolloServer.installSubscriptionHandlers(graphQLServer);

    graphQLServer.listen(port, () => {
      console.log(`Server is Listening on Port ${port}`);
      console.log(
        `Subscriptions ready at ws://localhost:${port}${apolloServer.subscriptionsPath}`
      );
    });
  } catch (err) {
    throw err;
  }
})();
