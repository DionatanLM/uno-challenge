import { CircularProgress, Divider } from "@mui/material";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { useTodo } from "../../context/TodoContext";

import { Add } from "@mui/icons-material";
import TaskActionsBar from "../../components/TaskActionsBar";
import TaskItem from "../../components/TaskItem";
import TaskItemCreate from "../../components/TaskItemCreate";
import {
  Button,
  Container,
  EmptyList,
  EmptyListDescription,
  TaskList,
  Title,
} from "./styles";

export default function ListTasks() {
  const [showAdd, setShowAdd] = useState(false);
  const [filter, setFilter] = useState({ name: "", priority: "" });

  // Contexto personalizado que encapsula a lógica de gerenciamento de tarefas
  const { items, loading, addItem, refetch } = useTodo();

  if (loading) return <div>Carregando...</div>;

  const handleAddTask = async ({ name, priority }) => {
    await addItem({ variables: { values: { name, priority } } });
    refetch();
  };

  return (
    <Container>
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
        }}
      >
        <Title>TODO List</Title>

        <Button onClick={() => setShowAdd((v) => !v)}>
          <Add fontSize="small" color="888" />
        </Button>
      </div>

      <TaskActionsBar filter={filter} setFilter={setFilter} />

      {loading ? (
        <CircularProgress />
      ) : (
        <TaskList>
          {showAdd && (
            <TaskItemCreate
              onAdd={handleAddTask}
              onCancel={() => setShowAdd(false)}
            />
          )}
          <Divider />
          <AnimatePresence>
            {items.length > 0 ? (
              items.map((task) => (
                <TaskItem
                  id={task.id}
                  key={task.id}
                  name={task.name}
                  priority={task.priority}
                  completed={task.completed}
                />
              ))
            ) : (
              <motion.div
                key="empty"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.2 }}
              >
                <EmptyList>Nenhum item encontrado.</EmptyList>
                <EmptyListDescription>
                  Você pode adicionar uma nova tarefa clicando no botão de
                  adicionar.
                </EmptyListDescription>
              </motion.div>
            )}
          </AnimatePresence>
        </TaskList>
      )}
    </Container>
  );
}
