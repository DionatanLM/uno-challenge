import {
  ApolloClient,
  ApolloProvider,
  createHttpLink,
  InMemoryCache,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import "./App.css";
import ListTasks from "./pages/ListTasks";
import { TodoProvider } from "./context/TodoContext";
import { NotificationProvider } from "./context/NotificationContext";
import Footer from "./components/Footer";
import { ThemeProvider, createGlobalStyle } from "styled-components";
import { ThemeModeProvider, useThemeMode } from "./context/ThemeModeContext";

const lightTheme = {
  mode: "light",
  background: "#e9e9e9",
  card: "#fff",
  text: "#222",
  border: "#0000002b",
  footer: "#f5f5f5",
  footerText: "#444",
  inputBg: "#fff",
  inputText: "#222",
  itemBg: "#f9f9f9",
  itemText: "#000",
  itemCompleted: "#888",
  priorityDefault: "#ccc",
};

const darkTheme = {
  mode: "dark",
  background: "#18191a",
  card: "#242526",
  text: "#f5f6fa",
  border: "#333",
  footer: "#0000002b",
  footerText: "#bbb",
  inputBg: "#0000002b",
  inputText: "#f5f6fa",
  itemBg: "#0000002b",
  itemText: "#f5f6fa",
  itemCompleted: "#888",
  priorityDefault: "#444",
};

const GlobalStyle = createGlobalStyle`
  body {
    background: ${({ theme }) => theme.background};
    color: ${({ theme }) => theme.text};
    transition: background 0.2s, color 0.2s;
  }
  .MuiDialog-paper {
    background: ${({ theme }) => theme.card} !important;
    color: ${({ theme }) => theme.text} !important;
  }
`;

const httpLink = createHttpLink({
  uri: process.env.REACT_APP_GRAPHQL_URI,
});

const authLink = setContext((_, { headers }) => {
  return {
    headers: {
      ...headers,
    },
  };
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

function AppContent() {
  const { theme } = useThemeMode();
  const themeObj = theme === "dark" ? darkTheme : lightTheme;

  return (
    <ThemeProvider theme={themeObj}>
      <GlobalStyle />
      <div className="App">
        <header
          className="App-header"
          style={{ background: themeObj.background }}
        >
          <ListTasks />
        </header>
        <Footer />
      </div>
    </ThemeProvider>
  );
}

function App() {
  return (
    <ApolloProvider client={client}>
      <NotificationProvider>
        <TodoProvider>
          <ThemeModeProvider>
            <AppContent />
          </ThemeModeProvider>
        </TodoProvider>
      </NotificationProvider>
    </ApolloProvider>
  );
}

export default App;
