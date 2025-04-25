import CloseIcon from "@mui/icons-material/Close";
import { IconButton } from "@mui/material";
import Alert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";
import React, { createContext, useCallback, useContext, useState } from "react";

const NotificationContext = createContext();

// Função personalizada para exibir notificações
export function NotificationProvider({ children }) {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [severity, setSeverity] = useState("info");

  // O hook useCallback é usado para memorizar a função notify e evitar que ela seja recriada em cada renderização
  // Isso melhora o desempenho, especialmente quando a função é passada como prop para componentes filhos
  const notify = useCallback((msg, type = "info") => {
    setMessage(msg);
    setSeverity(type);
    setOpen(true);
  }, []);

  return (
    <NotificationContext.Provider value={notify}>
      {children}

      <Snackbar
        open={open}
        autoHideDuration={2000}
        onClose={() => setOpen(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          style={{
            borderRadius: "10px",
            fontWeight: "600",
            fontSize: "16px",
            textAlign: "center",
            width: "100%",
          }}
          severity={severity}
          action={
            <IconButton
              aria-label="close"
              color="inherit"
              size="small"
              onClick={() => {
                setOpen(false);
              }}
            >
              <CloseIcon fontSize="inherit" />
            </IconButton>
          }
          sx={{ mb: 2 }}
        >
          {message}
        </Alert>
      </Snackbar>
    </NotificationContext.Provider>
  );
}

export function useNotification() {
  return useContext(NotificationContext);
}
