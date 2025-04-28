const DATA = require("../datasources/mockData");
const generateRandomId = require("../utils/generateRandomId");
const Joi = require("joi");
const TODO_LIST = DATA.TODO_LIST;

// Schemas de validação com Joi
const itemInputSchema = Joi.object({
  id: Joi.number().integer().min(1),
  name: Joi.string().trim().min(1).required(),
  priority: Joi.string().valid("LOW", "MEDIUM", "HIGH", "").allow(""),
  completed: Joi.boolean(),
});

const itemUpdateSchema = Joi.object({
  id: Joi.number().integer().min(1).required(),
  name: Joi.string().trim().min(1).required(),
  priority: Joi.string().valid("LOW", "MEDIUM", "HIGH", "").allow(""),
  completed: Joi.boolean(),
});

const deleteItemSchema = Joi.number().integer().min(1).required();

const filterSchema = Joi.object({
  id: Joi.number().integer().min(1),
  name: Joi.string().allow(""),
  priority: Joi.string().valid("LOW", "MEDIUM", "HIGH", "").allow(""),
  completed: Joi.boolean(),
}).unknown(false);

/**
 * Retorna a lista de itens, podendo filtrar por nome, id, prioridade e concluído, e ordenar.
 * @param {Object} filter - Filtros opcionais (name, id, priority, completed).
 * @param {string} orderBy - Campo para ordenação (ex: 'name', 'priorityLevel', 'completed').
 * @param {string} order - Direção da ordenação ('asc' ou 'desc').
 * @returns {Array} Lista de itens filtrados e ordenados.
 * @throws {Error} Caso algum filtro seja inválido.
 */
function getTodoList(filter, orderBy, order) {
  let result = Array.isArray(TODO_LIST) ? [...TODO_LIST] : [];
  try {
    if (filter) {
      // Validação do filtro com Joi
      const { error } = filterSchema.validate(filter);
      if (error) throw new Error(error.details[0].message);

      // Filtra por nome
      if (filter.name !== undefined) {
        result = result.filter((item) =>
          item.name?.toLowerCase().includes(filter.name.toLowerCase())
        );
      }

      // Filtra por id
      if (filter.id !== undefined && filter.id !== null) {
        result = result.filter((item) => item.id === filter.id);
      }

      // Filtra por prioridade
      if (filter.priority !== undefined) {
        const normalizedPriority = filter.priority.toUpperCase();
        result = result.filter(
          (item) => (item.priority || "").toUpperCase() === normalizedPriority
        );
      }

      // Filtra por concluído
      if (filter.completed !== undefined && filter.completed !== null) {
        result = result.filter((item) => !!item.completed === filter.completed);
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
  } catch (err) {
    throw new Error(`Erro ao buscar lista: ${err.message}`);
  }
}

/**
 * Adiciona um novo item à lista.
 * Valida nome vazio e duplicado. Prioridade e completed são opcionais.
 * @param {Object} param0 - Objeto com propriedades name, priority, completed.
 * @param {string} param0.name - Nome da tarefa (obrigatório).
 * @param {string} [param0.priority] - Prioridade da tarefa (opcional).
 * @param {boolean} [param0.completed] - Status de conclusão (opcional).
 * @returns {Object} Objeto com sucesso, mensagem e item criado.
 * @throws {Error} Caso nome seja inválido, duplicado ou prioridade inválida.
 */
function addItem({ name, priority, completed }) {
  try {
    // Validação com Joi
    const { error } = itemInputSchema.validate({ name, priority, completed });
    if (error) throw new Error(error.details[0].message);

    const normalizedName = name.trim();
    const exists = TODO_LIST.some(
      (item) => item.name.trim().toLowerCase() === normalizedName.toLowerCase()
    );
    if (exists) {
      throw new Error("Já existe uma tarefa com esse nome.");
    }
    let normalizedPriority = "";
    if (priority !== undefined) {
      normalizedPriority = priority.trim().toUpperCase();
    }
    const newItem = {
      id: generateRandomId(),
      name: normalizedName,
      priority: normalizedPriority,
      completed: completed !== undefined ? !!completed : false,
    };
    TODO_LIST.push(newItem);
    return {
      success: true,
      message: "Tarefa adicionada com sucesso.",
      item: newItem,
    };
  } catch (err) {
    throw new Error(`Erro ao adicionar item: ${err.message}`);
  }
}

/**
 * Edita um item existente, podendo atualizar nome, prioridade e completed.
 * @param {Object} param0 - Objeto com propriedades id, name, priority, completed.
 * @param {number} param0.id - ID do item a ser editado (obrigatório).
 * @param {string} param0.name - Novo nome da tarefa (obrigatório).
 * @param {string} [param0.priority] - Nova prioridade (opcional).
 * @param {boolean} [param0.completed] - Novo status de conclusão (opcional).
 * @returns {Object} Objeto com sucesso, mensagem e item atualizado.
 * @throws {Error} Caso id não exista, nome seja inválido/duplicado ou prioridade inválida.
 */
function updateItem({ id, name, priority, completed }) {
  try {
    // Validação com Joi
    const { error } = itemUpdateSchema.validate({
      id,
      name,
      priority,
      completed,
    });
    if (error) throw new Error(error.details[0].message);

    const idx = TODO_LIST.findIndex((item) => item.id === id);
    if (idx === -1) throw new Error("Item não encontrado.");
    const normalizedName = name.trim();
    const exists = TODO_LIST.some(
      (item) =>
        item.id !== id &&
        item.name.trim().toLowerCase() === normalizedName.toLowerCase()
    );
    if (exists) {
      throw new Error("Já existe uma tarefa com esse nome.");
    }
    TODO_LIST[idx].name = normalizedName;
    if (priority !== undefined) {
      const normalizedPriority = priority.trim().toUpperCase();
      TODO_LIST[idx].priority = normalizedPriority;
    }
    if (completed !== undefined) {
      TODO_LIST[idx].completed = completed;
    }
    return {
      success: true,
      message: "Tarefa atualizada com sucesso.",
      item: { ...TODO_LIST[idx] },
    };
  } catch (err) {
    throw new Error(`Erro ao atualizar item: ${err.message}`);
  }
}

/**
 * Remove um item da lista pelo id.
 * @param {number} id - ID do item a ser removido.
 * @returns {Object} Objeto com sucesso, mensagem e item removido.
 * @throws {Error} Caso id não exista ou não seja informado.
 */
function deleteItem(id) {
  try {
    // Validação com Joi
    const { error } = deleteItemSchema.validate(id);
    if (error)
      throw new Error("ID é obrigatório e deve ser um número inteiro válido.");

    const idx = TODO_LIST.findIndex((item) => item.id === id);
    if (idx === -1) throw new Error("Item não encontrado.");
    const removed = TODO_LIST[idx];
    TODO_LIST.splice(idx, 1);
    return {
      success: true,
      message: "Tarefa removida com sucesso.",
      item: removed,
    };
  } catch (err) {
    throw new Error(`Erro ao remover item: ${err.message}`);
  }
}

/**
 * Marca todos os itens da lista como concluídos.
 * @returns {boolean} True se todos foram marcados com sucesso.
 * @throws {Error} Caso ocorra algum erro ao marcar.
 */
function completeAll() {
  try {
    TODO_LIST.forEach((item) => (item.completed = true));
    return true;
  } catch (err) {
    throw new Error(`Erro ao marcar todos como concluídos: ${err.message}`);
  }
}

/**
 * Remove todos os itens da lista.
 * @returns {boolean} True se todos foram removidos com sucesso.
 * @throws {Error} Caso ocorra algum erro ao limpar.
 */
function clearAll() {
  try {
    DATA.TODO_LIST.length = 0;
    return true;
  } catch (err) {
    throw new Error(`Erro ao limpar todos os itens: ${err.message}`);
  }
}

module.exports = {
  getTodoList,
  addItem,
  updateItem,
  deleteItem,
  completeAll,
  clearAll,
};
