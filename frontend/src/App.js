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

function App() {
  return (
    <ApolloProvider client={client}>
      <NotificationProvider>
        <TodoProvider>
          <div className="App">
            <header className="App-header">
              <ListTasks />
            </header>
            <Footer />
          </div>
        </TodoProvider>
      </NotificationProvider>
    </ApolloProvider>
  );
}

export default App;
