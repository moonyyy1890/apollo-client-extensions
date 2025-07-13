import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  createHttpLink,
  ApolloLink,
  Observable,
  type FetchResult,
  from,
} from "@apollo/client";
import "./index.css";
import App from "./App.tsx";
import { worker } from "./mocks/browser";

// Start MSW worker in development
// if (import.meta.env.DEV) {
worker.start({
  onUnhandledRequest: "bypass",
});
// }

export const extensionsLink = new ApolloLink((operation, forward) => {
  return new Observable((observer) => {
    if (forward) {
      forward(operation).subscribe({
        next: (result: FetchResult) => {
          console.log("🔗 Extensions Link - Full result:", result);
          console.log(
            "🔗 Extensions Link - Extensions found:",
            result.extensions
          );

          // Attach extensions directly to result.data for easy access
          if (result.extensions && result.data) {
            console.log(
              "🔗 Extensions Link - Attaching extensions to result.data:",
              result.extensions
            );
            (result.data as any).extensions = result.extensions;
          } else {
            console.log(
              "🔗 Extensions Link - No extensions in result or no data"
            );
          }

          observer.next(result);
        },
        error: (error) => {
          console.error("🔗 Apollo Link error:", error);
          observer.error(error);
        },
        complete: () => {
          observer.complete();
        },
      });
    } else {
      observer.error(new Error("No forward function provided"));
    }
  });
});

// Create HTTP link to the real Countries API
const httpLink = createHttpLink({
  uri: "https://countries.trevorblades.com/graphql",
});

const link = from([
  extensionsLink,
  httpLink, // Make HTTP request
]);

// Create Apollo Client with just the HTTP link
const client = new ApolloClient({
  // link: httpLink,
  link,
  cache: new InMemoryCache(),
});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>
  </StrictMode>
);
