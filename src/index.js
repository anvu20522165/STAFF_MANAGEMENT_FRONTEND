import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import {QueryClient, QueryClientProvider} from 'react-query';
import {DarkModeContextProvider} from './context/darkModeContext';
import {Provider} from "react-redux";
import store from './redux-store/store';


const queryClient = new QueryClient();
ReactDOM.render(
    <Provider store={store}>
        <React.StrictMode>
            <QueryClientProvider client={queryClient}>
                <DarkModeContextProvider>
                    <App/>
                </DarkModeContextProvider>
            </QueryClientProvider>
        </React.StrictMode>
    </Provider>,
    document.getElementById('root'),
);
