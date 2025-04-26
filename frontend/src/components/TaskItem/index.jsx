import React, { useState } from "react";
import {
  PriorityLabel,
  Actions,
  Item,
  Text,
  Checkbox,
  EditInput,
} from "./styles";
import {
  Button,
  Dialog,
  DialogActions,
  DialogTitle,
  IconButton,
  Menu,
  MenuItem,
} from "@mui/material";
import { Delete } from "@mui/icons-material";
import { PRIORITY_LEVELS } from "../../constants/PriorityConstant";
import { useTodo } from "../../context/TodoContext";
import { motion } from "framer-motion";
import { useNotification } from "../../context/NotificationContext";

const TaskItem = ({ id, name, priority, completed }) => {
  const { deleteItem, updateItem, refetch } = useTodo();
  const notification = useNotification();
  const [editingName, setEditingName] = useState(false);
  const [editName, setEditName] = useState(name);
  const [anchorEl, setAnchorEl] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);

  // Função para deletar o item
  const onDelete = async () => {
    await deleteItem({ variables: { id } });
    notification("Tarefa deletada com sucesso!", "success");
    refetch();
  };

  // Função para alternar o estado de conclusão do item
  const onToggleComplete = async () => {
    await updateItem({
      variables: {
        values: {
          id,
          name,
          priority: priority || "",
          completed: !completed,
        },
      },
    });
    refetch();
  };

  // Função para salvar a edição do nome
  const saveEditName = async () => {
    if (editName.trim() && editName !== name) {
      try {
        await updateItem({
          variables: {
            values: {
              id,
              name: editName,
              priority,
              completed,
            },
          },
        });
        notification("Tarefa atualizada com sucesso!", "success");
        refetch();
      } catch (error) {
        notification(error?.message || "Erro ao atualizar tarefa.", "error");
      }
    }
    setEditingName(false);
  };

  // Função para lidar com a edição do nome
  // Se a tecla for "Enter", salva a edição; se for "Esc", cancela a edição
  const handleNameKeyDown = (e) => {
    if (e.key === "Enter") {
      saveEditName();
    } else if (e.key === "Escape") {
      setEditName(name);
      setEditingName(false);
    }
  };

  // Função para abrir o menu de prioridade
  const handlePriorityClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  // Função para fechar o menu de prioridade
  const handlePriorityClose = () => {
    setAnchorEl(null);
  };

  // Função para lidar com a seleção de prioridade
  // Atualiza o item com a nova prioridade e fecha o menu
  const handlePrioritySelect = async (newPriority) => {
    setAnchorEl(null);
    if (newPriority !== priority) {
      await updateItem({
        variables: {
          values: {
            id,
            name,
            priority: newPriority,
            completed,
          },
        },
      });
      refetch();
    }
  };

  return (
    <Item
      key={id}
      as={motion.div}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -50 }}
    >
      <div style={{ display: "flex", alignItems: "center" }}>
        <Checkbox
          type="checkbox"
          checked={completed}
          onChange={onToggleComplete}
        />
        {editingName ? (
          <EditInput
            value={editName}
            autoFocus
            onChange={(e) => setEditName(e.target.value)}
            onBlur={saveEditName}
            onKeyDown={handleNameKeyDown}
            size="small"
            style={{ marginRight: 8, width: "auto" }}
          />
        ) : (
          <Text
            $completed={completed}
            onClick={() => setEditingName(true)}
            style={{ cursor: "pointer" }}
          >
            {name}
          </Text>
        )}
      </div>
      <Actions>
        <>
          <PriorityLabel
            style={{
              backgroundColor: PRIORITY_LEVELS[priority]?.color || "#ccc",
              cursor: "pointer",
            }}
            onClick={handlePriorityClick}
          >
            {PRIORITY_LEVELS[priority]?.title || "Sem prioridade"}
          </PriorityLabel>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handlePriorityClose}
          >
            {Object.keys(PRIORITY_LEVELS).map((key) => (
              <MenuItem
                key={key}
                selected={priority === key}
                onClick={() => handlePrioritySelect(key)}
                style={{
                  fontWeight: priority === key ? "bold" : "normal",
                  background:
                    priority === key ? PRIORITY_LEVELS[key].color : undefined,
                  color: priority === key ? "#fff" : undefined,
                }}
              >
                {PRIORITY_LEVELS[key].title}
              </MenuItem>
            ))}
            <MenuItem
              selected={!priority}
              onClick={() => handlePrioritySelect("")}
            >
              Sem prioridade
            </MenuItem>
          </Menu>
        </>
        <IconButton
          size="small"
          color="888"
          onClick={() => setConfirmOpen(true)}
        >
          <Delete fontSize="small" />
        </IconButton>

        <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)}>
          <DialogTitle>Deseja realmente excluir esta tarefa?</DialogTitle>
          <DialogActions>
            <Button onClick={() => setConfirmOpen(false)} color="primary">
              Cancelar
            </Button>
            <Button onClick={onDelete} color="error" autoFocus>
              Excluir
            </Button>
          </DialogActions>
        </Dialog>
      </Actions>
    </Item>
  );
};

export default TaskItem;
