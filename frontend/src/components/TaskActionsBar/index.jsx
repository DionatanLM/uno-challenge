import { DeleteSweep, DoneAll, Search, Sort } from "@mui/icons-material";
import {
  Dialog,
  DialogActions,
  DialogTitle,
  IconButton,
  Menu,
  MenuItem,
  Button as MuiButton,
  Tooltip,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useTheme } from "styled-components";
import { PRIORITY_LEVELS } from "../../constants/PriorityConstant";
import { useTodo } from "../../context/TodoContext";
import { useDebounce } from "../../hooks/useDebounce";
import { FilterContainer, Input, Select } from "../../pages/ListTasks/styles";

export default function TaskActionsBar({ filter, setFilter }) {
  const [openRemoveAll, setOpenRemoveAll] = useState(false);
  const [openCompleteAll, setOpenCompleteAll] = useState(false);
  const [orderMenuAnchor, setOrderMenuAnchor] = useState(null);

  const {
    orderBy,
    setOrderBy,
    order,
    setOrder,
    clearAll,
    refetch,
    completeAll,
    setFilter: setGlobalFilter,
  } = useTodo();
  const debouncedName = useDebounce(filter.name, 400);
  const theme = useTheme();

  useEffect(() => {
    setGlobalFilter({
      name: debouncedName,
      priority: filter.priority || undefined,
    });
  }, [debouncedName, filter.priority, setGlobalFilter]);

  // Função para abrir o Dialog de remover todos os itens
  const handleRemoveAll = async () => {
    setOpenRemoveAll(true);
  };

  // Função para remover todos os itens da lista
  const confirmRemoveAll = async () => {
    await clearAll();
    refetch();
    setOpenRemoveAll(false);
  };

  // Função para abrir o Dialog de completar todos os itens
  const handleCompleteAll = async () => {
    setOpenCompleteAll(true);
  };

  // Função para completar todos os itens da lista
  const confirmCompleteAll = async () => {
    await completeAll();
    refetch();
    setOpenCompleteAll(false);
  };

  return (
    <>
      <FilterContainer>
        <Input
          startAdornment={
            <Search
              fontSize="small"
              style={{
                color: theme.itemCompleted,
              }}
            />
          }
          placeholder="Pesquise pelo nome..."
          value={filter.name}
          onChange={(e) => setFilter({ ...filter, name: e.target.value })}
          fullWidth
        />
        <Select
          value={filter.priority}
          onChange={(e) => setFilter({ ...filter, priority: e.target.value })}
          size="small"
          displayEmpty
          placeholder="Prioridade"
          inputProps={{ "aria-label": "Prioridade" }}
        >
          <MenuItem disabled>
            <em>Prioridade</em>
          </MenuItem>
          <MenuItem value="">Todos</MenuItem>
          {Object.keys(PRIORITY_LEVELS).map((key) => (
            <MenuItem key={key} value={key}>
              {PRIORITY_LEVELS[key].title}
            </MenuItem>
          ))}
        </Select>

        <Tooltip title="Ordenar">
          <IconButton
            size="small"
            onClick={(e) => setOrderMenuAnchor(e.currentTarget)}
            aria-label="Ordenar"
            sx={{ marginLeft: 1, color: theme.text }}
          >
            <Sort />
          </IconButton>
        </Tooltip>
        <Menu
          anchorEl={orderMenuAnchor}
          open={Boolean(orderMenuAnchor)}
          onClose={() => setOrderMenuAnchor(null)}
        >
          <MenuItem
            selected={orderBy === "name" && order === "asc"}
            onClick={() => {
              setOrderBy("name");
              setOrder("asc");
              setOrderMenuAnchor(null);
            }}
          >
            Nome (A-Z)
          </MenuItem>
          <MenuItem
            selected={orderBy === "name" && order === "desc"}
            onClick={() => {
              setOrderBy("name");
              setOrder("desc");
              setOrderMenuAnchor(null);
            }}
          >
            Nome (Z-A)
          </MenuItem>
          <MenuItem
            selected={orderBy === "priorityLevel" && order === "asc"}
            onClick={() => {
              setOrderBy("priorityLevel");
              setOrder("asc");
              setOrderMenuAnchor(null);
            }}
          >
            Prioridade (Baixa → Alta)
          </MenuItem>
          <MenuItem
            selected={orderBy === "priorityLevel" && order === "desc"}
            onClick={() => {
              setOrderBy("priorityLevel");
              setOrder("desc");
              setOrderMenuAnchor(null);
            }}
          >
            Prioridade (Alta → Baixa)
          </MenuItem>
          <MenuItem
            selected={orderBy === "completed" && order === "asc"}
            onClick={() => {
              setOrderBy("completed");
              setOrder("asc");
              setOrderMenuAnchor(null);
            }}
          >
            Incompletas primeiro
          </MenuItem>
          <MenuItem
            selected={orderBy === "completed" && order === "desc"}
            onClick={() => {
              setOrderBy("completed");
              setOrder("desc");
              setOrderMenuAnchor(null);
            }}
          >
            Completas primeiro
          </MenuItem>
        </Menu>

        <Tooltip title="Marcar todos como concluído">
          <IconButton
            size="small"
            onClick={handleCompleteAll}
            aria-label="Marcar todos como concluído"
            sx={{ marginLeft: 1, color: theme.text }}
          >
            <DoneAll />
          </IconButton>
        </Tooltip>

        <Tooltip title="Limpar todas as tarefas">
          <IconButton
            size="small"
            onClick={handleRemoveAll}
            aria-label="Limpar todas as tarefas"
            sx={{ marginLeft: 1, color: theme.text }}
          >
            <DeleteSweep />
          </IconButton>
        </Tooltip>

        {/* Dialog para limpar todas as tarefas */}
        <Dialog open={openRemoveAll} onClose={() => setOpenRemoveAll(false)}>
          <DialogTitle style={{ color: theme.text }}>
            Deseja realmente remover todos os itens?
          </DialogTitle>
          <DialogActions>
            <MuiButton onClick={() => setOpenRemoveAll(false)} color="primary">
              Cancelar
            </MuiButton>
            <MuiButton onClick={confirmRemoveAll} color="error" autoFocus>
              Remover todos
            </MuiButton>
          </DialogActions>
        </Dialog>

        {/* Dialog para marcar todos como concluído */}
        <Dialog
          open={openCompleteAll}
          onClose={() => setOpenCompleteAll(false)}
        >
          <DialogTitle style={{ color: theme.text }}>
            Deseja marcar todos os itens como concluídos?
          </DialogTitle>
          <DialogActions>
            <MuiButton
              onClick={() => setOpenCompleteAll(false)}
              color="primary"
            >
              Cancelar
            </MuiButton>
            <MuiButton onClick={confirmCompleteAll} color="success" autoFocus>
              Marcar todos
            </MuiButton>
          </DialogActions>
        </Dialog>
      </FilterContainer>
    </>
  );
}
