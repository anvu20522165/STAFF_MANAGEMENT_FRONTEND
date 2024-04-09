import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { QueryClient, QueryClientProvider } from 'react-query';
import { DarkModeContextProvider } from './context/darkModeContext';
import { AppProvider } from './context/authenticated';

const queryClient = new QueryClient();
ReactDOM.render(
    <React.StrictMode>
        <QueryClientProvider client={queryClient}>
            <DarkModeContextProvider>
                <AppProvider>
                    <App />
                </AppProvider>
            </DarkModeContextProvider>
        </QueryClientProvider>
    </React.StrictMode>,

    document.getElementById('root'),
);
