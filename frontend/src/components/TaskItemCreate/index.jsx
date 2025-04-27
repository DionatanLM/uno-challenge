import React, { useState, useRef, useCallback } from "react";
import { IconButton, Menu, MenuItem, Tooltip } from "@mui/material";
import { PRIORITY_LEVELS } from "../../constants/PriorityConstant";
import { motion } from "framer-motion";
import {
  Actions,
  Item,
  Checkbox,
  EditInput,
  PriorityLabel,
} from "../TaskItem/styles";
import { Add } from "@mui/icons-material";
import { useNotification } from "../../context/NotificationContext";
import { useTheme } from "styled-components";

const TaskItemCreate = ({ onAdd, onCancel }) => {
  const [name, setName] = useState("");
  const [priority, setPriority] = useState("");
  const [anchorEl, setAnchorEl] = useState(null);
  const notify = useNotification();
  const inputRef = useRef();
  const theme = useTheme();

  // Adiciona a tarefa
  const handleAdd = useCallback(async () => {
    try {
      await onAdd({ name, priority });
      notify("Tarefa adicionada com sucesso!", "success");
      resetInputs();
      onCancel();
    } catch (error) {
      notify(error?.message || "Erro ao adicionar tarefa.", "error");
    }
  }, [name, priority, onAdd, onCancel, notify]);

  // Enter adiciona, Esc cancela.
  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleAdd();
    if (e.key === "Escape") onCancel();
  };

  // Seleciona a prioridade
  const handlePrioritySelect = (key) => {
    setPriority(key);
    setAnchorEl(null);
  };

  // Reseta os inputs para o estado inicial
  const resetInputs = () => {
    setName("");
    setPriority("");
  };

  return (
    <Item
      as={motion.div}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -50 }}
      style={{ marginBottom: 12 }}
    >
      <div style={{ display: "flex", alignItems: "center" }}>
        <Checkbox disabled />
        <EditInput
          ref={inputRef}
          value={name}
          autoFocus
          placeholder="Nome da tarefa"
          onChange={(e) => setName(e.target.value)}
          onKeyDown={handleKeyDown}
          style={{ marginRight: 8, width: "auto" }}
        />
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
            onClick={(e) => setAnchorEl(e.currentTarget)}
          >
            {PRIORITY_LEVELS[priority]?.title || "Sem prioridade"}
          </PriorityLabel>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={() => setAnchorEl(null)}
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
              onClick={() => {
                setPriority("");
                setAnchorEl(null);
              }}
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
        <Tooltip title="Adicionar">
          <IconButton
            size="small"
            color="primary"
            onClick={handleAdd}
            disabled={!name.trim()}
            aria-label="Adicionar"
          >
            <Add fontSize="small" />
          </IconButton>
        </Tooltip>
        <Tooltip title="Cancelar">
          <IconButton
            size="small"
            color="error"
            onClick={onCancel}
            aria-label="Cancelar"
          >
            ✖
          </IconButton>
        </Tooltip>
      </Actions>
    </Item>
  );
};

export default TaskItemCreate;
