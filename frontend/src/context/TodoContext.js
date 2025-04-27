import { useMutation, useQuery } from "@apollo/client";
import { createContext, useContext, useState } from "react";
import {
  ADD_ITEM_MUTATION,
  COMPLETE_ALL_MUTATION,
  DELETE_ITEM_MUTATION,
  GET_TODO_LIST,
  UPDATE_ITEM_MUTATION,
  CLEAR_ALL_MUTATION,
} from "../api/queries";

const TodoContext = createContext();

// O TodoProvider é um componente que fornece o contexto de tarefas para seus filhos
export function TodoProvider({ children }) {
  const [filter, setFilter] = useState({});
  const [orderBy, setOrderBy] = useState("");
  const [order, setOrder] = useState("asc");
  const { data, loading, refetch } = useQuery(GET_TODO_LIST, {
    variables: {
      filter,
      orderBy: orderBy || undefined,
      order: order || undefined,
    },
    fetchPolicy: "network-only",
  });

  // Adicionar um novo item
  const [addItemMutation] = useMutation(ADD_ITEM_MUTATION, { onCompleted: refetch });

  // Atualizar um item existente
  const [updateItemMutation] = useMutation(UPDATE_ITEM_MUTATION, {
    onCompleted: refetch,
  });

  // Deletar um item
  const [deleteItemMutation] = useMutation(DELETE_ITEM_MUTATION, {
    onCompleted: refetch,
  });

  // Completar todos os itens
  const [completeAll] = useMutation(COMPLETE_ALL_MUTATION, {
    onCompleted: refetch,
  });

  // Excluir todos os itens
  const [clearAll] = useMutation(CLEAR_ALL_MUTATION, {
    onCompleted: refetch,
  });

  // Wrappers para lidar com o novo retorno detalhado
  const addItem = async (options) => {
    const res = await addItemMutation(options);
    if (res?.data?.addItem?.success === false) throw new Error(res.data.addItem.message);
    return res?.data?.addItem;
  };

  const updateItem = async (options) => {
    const res = await updateItemMutation(options);
    if (res?.data?.updateItem?.success === false) throw new Error(res.data.updateItem.message);
    return res?.data?.updateItem;
  };

  const deleteItem = async (options) => {
    const res = await deleteItemMutation(options);
    if (res?.data?.deleteItem?.success === false) throw new Error(res.data.deleteItem.message);
    return res?.data?.deleteItem;
  };

  return (
    <TodoContext.Provider
      value={{
        items: data?.todoList || [],
        loading,
        addItem,
        updateItem,
        deleteItem,
        completeAll,
        orderBy,
        setOrderBy,
        order,
        setOrder,
        setFilter,
        refetch,
        clearAll,
      }}
    >
      {children}
    </TodoContext.Provider>
  );
}

export function useTodo() {
  return useContext(TodoContext);
}
