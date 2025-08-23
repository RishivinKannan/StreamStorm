import { createContext, useState, useContext } from 'react';
import { RAM_PER_PROFILE } from "../lib/Constants";
import fetchRAM from "../lib/FetchRAM"

const SystemInfoContext = createContext();

const SystemInfoProvider = ({children}) => {

    const [availableRAM, setAvailableRAM] = useState(null);

    const systemInfoControls = { availableRAM, setAvailableRAM, fetchRAM, RAM_PER_PROFILE };

    return (
        <SystemInfoContext.Provider value={systemInfoControls}>
            {children}
        </SystemInfoContext.Provider>
    );
};

const useSystemInfo = () => {
    return useContext(SystemInfoContext);
};

export { SystemInfoProvider, useSystemInfo };