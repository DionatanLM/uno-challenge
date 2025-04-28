const { ApolloServer } = require("@apollo/server");
const { startStandaloneServer } = require("@apollo/server/standalone");
const typeDefs = require("./src/schema");
const resolvers = require("./src/resolvers/todoResolver");

/**
 * Cria e retorna uma instância do ApolloServer.
 */
function createApolloServer() {
  return new ApolloServer({
    typeDefs,
    resolvers,
  });
}

/**
 * Inicializa o servidor GraphQL na porta definida.
 */
async function startServer() {
  const server = createApolloServer();
  const { url } = await startStandaloneServer(server, {
    listen: { port: 4000 },
  });
  console.log(`🚀  Server ready at: ${url}`);
}

startServer();
