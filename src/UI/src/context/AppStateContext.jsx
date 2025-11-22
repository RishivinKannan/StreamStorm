import { useEffect, useRef, useState } from 'react';
import { createContext, useContext } from 'react';

import { useLocalStorageState } from "@toolpad/core/useLocalStorageState";
import { DEFAULT_HOST_ADDRESS } from '../lib/Constants';


const AppStateContext = createContext();

const AppStateProvider = ({ children }) => {

    const [hostAddress] = useLocalStorageState("hostAddress", DEFAULT_HOST_ADDRESS);
    const [logs, setLogs] = useState([]);
    const [UIVersion, setUIVersion] = useLocalStorageState("VITE_APP_VERSION", "0.0.0");
    const [engineVersion, setEngineVersion] = useState('...');
    const [allChannels, setAllChannels] = useState({});

    const values = {
        hostAddress, logs, setLogs, UIVersion, setUIVersion, engineVersion, setEngineVersion, allChannels, setAllChannels,
    };

    return (
        <AppStateContext.Provider value={values}>
            {children}
        </AppStateContext.Provider>
    );
};

const useAppState = () => {
    return useContext(AppStateContext);
};

export { AppStateProvider, useAppState };