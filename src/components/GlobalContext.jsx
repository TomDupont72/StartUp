import React, { createContext, useState, useEffect } from 'react';

export const GlobalContext = createContext();

const GlobalContextProvider = ({ children }) => {

    const initialBlockchainValue = localStorage.getItem('blockchain') || '';

    const [blockchain, setBlockchain] = useState(initialBlockchainValue);

    useEffect(() => {
        localStorage.setItem('blockchain', blockchain);
    }, [blockchain]);

    return (
        <GlobalContext.Provider value={{ blockchain, setBlockchain }}>
            {children}
        </GlobalContext.Provider>
    );
};

export default GlobalContextProvider;