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
  Tooltip,
} from "@mui/material";
import { Delete } from "@mui/icons-material";
import { PRIORITY_LEVELS } from "../../constants/PriorityConstant";
import { useTodo } from "../../context/TodoContext";
import { motion } from "framer-motion";
import { useNotification } from "../../context/NotificationContext";
import { useTheme } from "styled-components";

const TaskItem = ({ id, name, priority, completed }) => {
  const { deleteItem, updateItem } = useTodo();
  const notification = useNotification();
  const [editingName, setEditingName] = useState(false);
  const [editName, setEditName] = useState(name);
  const [anchorEl, setAnchorEl] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const theme = useTheme();

  // Função para deletar o item
  const onDelete = async () => {
    try {
      const result = await deleteItem({ variables: { id } });
      notification(result?.message || "Tarefa deletada com sucesso!", "success");
    } catch (error) {
      notification(error?.message || "Erro ao deletar tarefa.", "error");
    }
  };

  // Função para alternar o estado de conclusão do item
  const onToggleComplete = async () => {
    try {
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
    } catch (error) {
      notification(error?.message || "Erro ao atualizar tarefa.", "error");
    }
  };

  // Função para salvar a edição do nome
  const saveEditName = async () => {
    if (editName.trim() && editName !== name) {
      try {
        const result = await updateItem({
          variables: {
            values: {
              id,
              name: editName,
              priority,
              completed,
            },
          },
        });
        notification(result?.message || "Tarefa atualizada com sucesso!", "success");
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
      try {
        const result = await updateItem({
          variables: {
            values: {
              id,
              name,
              priority: newPriority,
              completed,
            },
          },
        });
        notification(result?.message || "Tarefa atualizada com sucesso!", "success");
      } catch (error) {
        notification(error?.message || "Erro ao atualizar tarefa.", "error");
      }
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
              backgroundColor:
                PRIORITY_LEVELS[priority]?.color || theme.priorityDefault,
              color: priority ? "#fff" : theme.text,
              cursor: "pointer",
              border: !priority ? `1px solid ${theme.border}` : undefined,
            }}
            onClick={handlePriorityClick}
          >
            {PRIORITY_LEVELS[priority]?.title || "Sem prioridade"}
          </PriorityLabel>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handlePriorityClose}
            slotProps={{
              paper: {
                style: {
                  background: theme.card,
                  color: theme.text,
                },
              },
            }}
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
                  color: priority === key ? "#fff" : theme.text,
                }}
              >
                {PRIORITY_LEVELS[key].title}
              </MenuItem>
            ))}
            <MenuItem
              selected={!priority}
              onClick={() => handlePrioritySelect("")}
              style={{
                color: theme.text,
                background: !priority ? theme.priorityDefault : undefined,
                fontWeight: !priority ? "bold" : "normal",
              }}
            >
              Sem prioridade
            </MenuItem>
          </Menu>
        </>
        <Tooltip title="Excluir">
          <IconButton
            size="small"
            style={{ color: theme.text }}
            onClick={() => setConfirmOpen(true)}
          >
            <Delete fontSize="small" />
          </IconButton>
        </Tooltip>

        <Dialog
          open={confirmOpen}
          onClose={() => setConfirmOpen(false)}
          slotProps={{
            paper: {
              style: {
                background: theme.card,
                color: theme.text,
              },
            },
          }}
        >
          <DialogTitle style={{ color: theme.text }}>
            Deseja realmente excluir esta tarefa?
          </DialogTitle>
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
