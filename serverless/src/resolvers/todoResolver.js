const todoService = require("../services/todoService");

const resolvers = {
  Query: {
    // Retorna a lista de itens, podendo filtrar por nome, id, prioridade e concluído
    todoList: (_, { filter, orderBy, order }) => {
      return todoService.getTodoList(filter, orderBy, order);
    },
  },
  Mutation: {
    // Adiciona item, retorna objeto detalhado
    addItem: (_, { values }) => {
      return todoService.addItem(values);
    },

    // Edita item, retorna objeto detalhado
    updateItem: (_, { values }) => {
      return todoService.updateItem(values);
    },

    // Remove item pelo id, retorna objeto detalhado
    deleteItem: (_, { id }) => {
      return todoService.deleteItem(id);
    },

    // Marca todos os itens como concluídos
    completeAll: () => {
      return todoService.completeAll();
    },

    // Remove todos os itens
    clearAll: () => {
      return todoService.clearAll();
    },
  },
};

module.exports = resolvers;
