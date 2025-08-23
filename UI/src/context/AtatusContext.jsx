import { createContext, useContext } from 'react';

const AtatusContext = createContext();

export const AtatusProvider = ({ children }) => {
    

    return (
        <AtatusContext.Provider value={atatus}>
            {children}
        </AtatusContext.Provider>
    );
};

export const useAtatus = () => {
    return useContext(AtatusContext);
};
