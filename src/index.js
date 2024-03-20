import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import { QueryClient, QueryClientProvider } from "react-query";
import { DarkModeContextProvider } from "./context/darkModeContext";

const queryClient = new QueryClient();
ReactDOM.render(

  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
    <DarkModeContextProvider>
      <App />
    </DarkModeContextProvider>
    </QueryClientProvider>
  </React.StrictMode>,

  document.getElementById("root")
);
