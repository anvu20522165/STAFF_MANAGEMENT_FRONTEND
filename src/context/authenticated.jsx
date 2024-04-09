import React, { createContext, useState, useContext } from 'react';
import { getAccessToken } from '../Utils/Auth';

const initialAppContext = {
    isAuth: getAccessToken(),
    setIsAuth: () => null,
};

export const appContext = createContext(initialAppContext);

export const AppProvider = ({ children }) => {
    // Sửa tên thành AppProvider và sử dụng children
    const [isAuth, setIsAuth] = useState(initialAppContext.isAuth);


    return <appContext.Provider value={{ isAuth, setIsAuth }}>{children}</appContext.Provider>;
};
