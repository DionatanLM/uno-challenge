import { gql } from "@apollo/client";

// Busca lista de itens com filtros opcionais
export const GET_TODO_LIST = gql`
  query todoList($filter: ItemFilter, $orderBy: String, $order: String) {
    todoList(filter: $filter, orderBy: $orderBy, order: $order) {
      id
      name
      priority
      completed
    }
  }
`;

// Adiciona um novo item (prioridade opcional)
export const ADD_ITEM_MUTATION = gql`
  mutation addItem($values: ItemInput) {
    addItem(values: $values)
  }
`;

// Atualiza um item (nome, prioridade ou concluído)
export const UPDATE_ITEM_MUTATION = gql`
  mutation updateItem($values: ItemInput) {
    updateItem(values: $values)
  }
`;

// Remove um item pelo id
export const DELETE_ITEM_MUTATION = gql`
  mutation deleteItem($id: Int!) {
    deleteItem(id: $id)
  }
`;

// Marca todos como concluído
export const COMPLETE_ALL_MUTATION = gql`
  mutation completeAll {
    completeAll
  }
`;

// Limpa todos os itens
export const CLEAR_ALL_MUTATION = gql`
  mutation clearAll {
    clearAll
  }
`;
