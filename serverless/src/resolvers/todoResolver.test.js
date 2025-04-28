const resolvers = require("./todoResolver");
const DATA = require("../datasources/mockData");

/**
 * Testes para o resolver de TODOs.
 * Cada bloco testa um aspecto das queries e mutations do GraphQL.
 */
describe("Todo Resolver", () => {
  beforeEach(() => {
    // Resetar mockData antes de cada teste para garantir isolamento dos testes
    DATA.TODO_LIST.length = 0;
    DATA.TODO_LIST.push(
      { id: 1, name: "Tarefa 1", priority: "HIGH", completed: false },
      { id: 2, name: "Tarefa 2", priority: "LOW", completed: true }
    );
  });

  /**
   * Testes para a query de listagem de tarefas (todoList)
   */
  describe("Query.todoList", () => {
    test("retorna todos os itens", () => {
      // Deve retornar todos os itens cadastrados
      const result = resolvers.Query.todoList(null, {});
      expect(result.length).toBe(2);
    });

    test("filtra por nome", () => {
      // Deve filtrar itens pelo nome informado
      const result = resolvers.Query.todoList(null, { filter: { name: "1" } });
      expect(result).toEqual([expect.objectContaining({ name: "Tarefa 1" })]);
    });

    test("filtra por prioridade", () => {
      // Deve filtrar itens pela prioridade informada
      const result = resolvers.Query.todoList(null, {
        filter: { priority: "LOW" },
      });
      expect(result).toEqual([expect.objectContaining({ name: "Tarefa 2" })]);
    });

    test("filtra por completed", () => {
      // Deve filtrar itens pelo status de conclusão
      const result = resolvers.Query.todoList(null, {
        filter: { completed: true },
      });
      expect(result).toEqual([expect.objectContaining({ name: "Tarefa 2" })]);
    });

    test("filtra por id", () => {
      // Deve filtrar itens pelo id informado
      const result = resolvers.Query.todoList(null, { filter: { id: 1 } });
      expect(result).toEqual([expect.objectContaining({ name: "Tarefa 1" })]);
    });

    test("ordena por prioridade (desc)", () => {
      // Deve ordenar os itens por prioridade decrescente (HIGH > LOW)
      const result = resolvers.Query.todoList(null, {
        orderBy: "priorityLevel",
        order: "desc",
      });
      expect(result[0].priority).toBe("HIGH");
    });

    test("lança erro ao filtrar por prioridade inválida", () => {
      // Deve lançar erro ao tentar filtrar por prioridade inexistente
      expect(() =>
        resolvers.Query.todoList(null, { filter: { priority: "INVALIDA" } })
      ).toThrow(/Prioridade inválida/);
    });

    test("lança erro ao filtrar por completed não booleano", () => {
      // Deve lançar erro ao tentar filtrar por completed não booleano
      expect(() =>
        resolvers.Query.todoList(null, { filter: { completed: "sim" } })
      ).toThrow(/deve ser booleano/);
    });

    test("lança erro ao filtrar por nome não string", () => {
      // Deve lançar erro ao tentar filtrar por nome não string
      expect(() =>
        resolvers.Query.todoList(null, { filter: { name: 123 } })
      ).toThrow(/deve ser uma string/);
    });
  });

  /**
   * Testes para a mutation de adicionar item (addItem)
   */
  describe("Mutation.addItem", () => {
    test("adiciona item válido", () => {
      // Deve adicionar um novo item com sucesso
      const ok = resolvers.Mutation.addItem(null, {
        values: { name: "Nova tarefa", priority: "MEDIUM" },
      });
      expect(ok).toBe(true);
      expect(DATA.TODO_LIST.length).toBe(3);
    });

    test("não adiciona item duplicado", () => {
      // Deve lançar erro ao tentar adicionar item com nome já existente
      expect(() =>
        resolvers.Mutation.addItem(null, {
          values: { name: "Tarefa 1", priority: "LOW" },
        })
      ).toThrow(/Já existe uma tarefa/);
    });

    test("não adiciona item com nome vazio", () => {
      // Deve lançar erro ao tentar adicionar item com nome vazio
      expect(() =>
        resolvers.Mutation.addItem(null, {
          values: { name: "   ", priority: "LOW" },
        })
      ).toThrow(/Nome é obrigatório/);
    });

    test("não adiciona item com prioridade inválida", () => {
      // Deve lançar erro ao tentar adicionar item com prioridade inválida
      expect(() =>
        resolvers.Mutation.addItem(null, {
          values: { name: "Nova tarefa", priority: "INVALIDA" },
        })
      ).toThrow(/Prioridade inválida/);
    });
  });

  /**
   * Testes para a mutation de atualização de item (updateItem)
   */
  describe("Mutation.updateItem", () => {
    test("atualiza item válido", () => {
      // Deve atualizar um item existente com sucesso
      const ok = resolvers.Mutation.updateItem(null, {
        values: {
          id: 1,
          name: "Tarefa 1 editada",
          priority: "LOW",
          completed: true,
        },
      });
      expect(ok).toBe(true);
      expect(DATA.TODO_LIST[0].name).toBe("Tarefa 1 editada");
      expect(DATA.TODO_LIST[0].priority).toBe("LOW");
      expect(DATA.TODO_LIST[0].completed).toBe(true);
    });

    test("não atualiza para nome duplicado", () => {
      // Deve lançar erro ao tentar atualizar para um nome já existente
      expect(() =>
        resolvers.Mutation.updateItem(null, {
          values: {
            id: 2,
            name: "Tarefa 1",
            priority: "LOW",
            completed: false,
          },
        })
      ).toThrow(/Já existe uma tarefa/);
    });

    test("não atualiza item inexistente", () => {
      // Deve lançar erro ao tentar atualizar um item que não existe
      expect(() =>
        resolvers.Mutation.updateItem(null, {
          values: {
            id: 999,
            name: "Qualquer",
            priority: "LOW",
            completed: false,
          },
        })
      ).toThrow(/Item não encontrado/);
    });

    test("não atualiza com nome vazio", () => {
      // Deve lançar erro ao tentar atualizar com nome vazio
      expect(() =>
        resolvers.Mutation.updateItem(null, {
          values: { id: 1, name: "   ", priority: "LOW", completed: false },
        })
      ).toThrow(/Nome é obrigatório/);
    });

    test("não atualiza com prioridade inválida", () => {
      // Deve lançar erro ao tentar atualizar com prioridade inválida
      expect(() =>
        resolvers.Mutation.updateItem(null, {
          values: {
            id: 1,
            name: "Tarefa 1",
            priority: "INVALIDA",
            completed: false,
          },
        })
      ).toThrow(/Prioridade inválida/);
    });

    test("não atualiza com completed não booleano", () => {
      // Deve lançar erro ao tentar atualizar com completed não booleano
      expect(() =>
        resolvers.Mutation.updateItem(null, {
          values: {
            id: 1,
            name: "Tarefa 1",
            priority: "HIGH",
            completed: "sim",
          },
        })
      ).toThrow(/deve ser booleano/);
    });
  });

  /**
   * Testes para a mutation de remoção de item (deleteItem)
   */
  describe("Mutation.deleteItem", () => {
    test("remove item válido", () => {
      // Deve remover um item existente com sucesso
      const ok = resolvers.Mutation.deleteItem(null, { id: 1 });
      expect(ok).toBe(true);
      expect(DATA.TODO_LIST.length).toBe(1);
    });

    test("não remove item inexistente", () => {
      // Deve lançar erro ao tentar remover item que não existe
      expect(() => resolvers.Mutation.deleteItem(null, { id: 999 })).toThrow(
        /Item não encontrado/
      );
    });

    test("não remove sem id", () => {
      // Deve lançar erro ao tentar remover sem informar o id
      expect(() => resolvers.Mutation.deleteItem(null, {})).toThrow(
        /ID é obrigatório/
      );
    });
  });

  /**
   * Testes para a mutation de marcar todos como concluídos (completeAll)
   */
  describe("Mutation.completeAll", () => {
    test("marca todos como concluídos", () => {
      // Deve marcar todos os itens como concluídos
      const ok = resolvers.Mutation.completeAll();
      expect(ok).toBe(true);
      expect(DATA.TODO_LIST.every((item) => item.completed)).toBe(true);
    });
  });

  /**
   * Testes para a mutation de limpar todos os itens (clearAll)
   */
  describe("Mutation.clearAll", () => {
    test("remove todos os itens", () => {
      // Deve remover todos os itens da lista
      const ok = resolvers.Mutation.clearAll();
      expect(ok).toBe(true);
      expect(DATA.TODO_LIST.length).toBe(0);
    });
  });
});
