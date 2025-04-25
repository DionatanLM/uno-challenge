const { ApolloServer } = require("@apollo/server");
const { startStandaloneServer } = require("@apollo/server/standalone");
const { TODO_LIST } = require("./makeData");

// Gera um número inteiro para utilizar de id
function getRandomInt() {
  return Math.floor(Math.random() * 999);
}

const typeDefs = `#graphql
  type Item {
    id: Int
    name: String
    priority: String,
    completed: Boolean
  }

  input ItemInput {
    id: Int
    name: String
    priority: String,
    completed: Boolean
  }

  input ItemFilter {
    id: Int
    name: String
    priority: String,
    completed: Boolean
  }

  type Query {
     todoList(
      filter: ItemFilter,
      orderBy: String,
      order: String
    ): [Item]
  }

  type Mutation {
    addItem(values: ItemInput): Boolean
    updateItem(values: ItemInput): Boolean
    deleteItem(id: Int!): Boolean
    completeAll: Boolean
    clearAll: Boolean
  }
`;

const resolvers = {
  Query: {
    // Retorna a lista de itens, podendo filtrar por nome, id, prioridade e concluído
    todoList: (_, { filter, orderBy, order }) => {
      let result = TODO_LIST;
      if (filter) {
        // Filtra por nome
        if (filter.name) {
          result = result.filter((item) =>
            item.name.toLowerCase().includes(filter.name.toLowerCase())
          );
        }

        // Filtra por id
        if (filter.id !== undefined && filter.id !== null) {
          result = result.filter((item) => item.id === filter.id);
        }

        // Filtra por prioridade
        if (filter.priority) {
          result = result.filter(
            (item) =>
              (item.priority || "").toUpperCase() ===
              filter.priority.toUpperCase()
          );
        }

        // Filtra por concluído
        if (filter.completed !== undefined && filter.completed !== null) {
          result = result.filter(
            (item) => !!item.completed === filter.completed
          );
        }
      }

      // Ordenação
      if (orderBy) {
        result = result.slice().sort((a, b) => {
          // Ordenação por prioridade (baixa, média, alta)
          if (orderBy === "priorityLevel") {
            const priorityOrder = { LOW: 1, MEDIUM: 2, HIGH: 3, "": 0 };
            const aVal = priorityOrder[a.priority?.toUpperCase() || ""] || 0;
            const bVal = priorityOrder[b.priority?.toUpperCase() || ""] || 0;
            return order === "desc" ? bVal - aVal : aVal - bVal;
          }
          // Ordenação por completas/incompletas
          if (orderBy === "completed") {
            if (order === "asc") {
              return a.completed === b.completed ? 0 : a.completed ? 1 : -1;
            } else {
              return a.completed === b.completed ? 0 : a.completed ? -1 : 1;
            }
          }
          // Ordenação padrão (id, name, etc)
          if (a[orderBy] < b[orderBy]) return order === "desc" ? 1 : -1;
          if (a[orderBy] > b[orderBy]) return order === "desc" ? -1 : 1;
          return 0;
        });
      }

      return result;
    },
  },
  Mutation: {
    // Adiciona item, valida nome vazio e duplicado (prioridade e completed são opcionais)
    addItem: (_, { values: { name, priority, completed } }) => {
      if (!name || !name.trim()) return false;
      const exists = TODO_LIST.some(
        (item) => item.name.trim().toLowerCase() === name.trim().toLowerCase()
      );
      if (exists) {
        throw new Error("Já existe uma tarefa com esse nome.");
      }
      TODO_LIST.push({
        id: getRandomInt(),
        name: name.trim(),
        priority: priority ? priority.toUpperCase() : "",
        completed: completed !== undefined ? !!completed : false,
      });
      return true;
    },

    // Edita item, pode atualizar nome, prioridade e completed
    updateItem: (_, { values: { id, name, priority, completed } }) => {
      if (!name || !name.trim()) return false;
      const idx = TODO_LIST.findIndex((item) => item.id === id);
      if (idx === -1) return false;
      const exists = TODO_LIST.some(
        (item) =>
          item.id !== id &&
          item.name.trim().toLowerCase() === name.trim().toLowerCase()
      );
      if (exists) {
        throw new Error("Já existe uma tarefa com esse nome.");
      }
      TODO_LIST[idx].name = name.trim();
      TODO_LIST[idx].priority = priority ? priority.toUpperCase() : "";
      if (completed !== undefined) TODO_LIST[idx].completed = !!completed;
      return true;
    },

    // Remove item pelo id
    deleteItem: (_, { id }) => {
      const idx = TODO_LIST.findIndex((item) => item.id === id);
      if (idx === -1) return false;
      TODO_LIST.splice(idx, 1);
      return true;
    },

    // Marca todos os itens como concluídos
    completeAll: () => {
      TODO_LIST.forEach((item) => (item.completed = true));
      return true;
    },

    // Remove todos os itens
    clearAll: () => {
      TODO_LIST = [];
      return true;
    },
  },
};

// Configuração para subir o backend
const startServer = async () => {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
  });

  const { url } = await startStandaloneServer(server, {
    listen: { port: 4000 },
  });

  console.log(`🚀  Server ready at: ${url}`);
};

startServer();
