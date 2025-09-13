import { useEffect } from 'react';
import { createContext, useState, useContext } from 'react';
import { RAM_PER_PROFILE } from "../lib/Constants";
import fetchRAM from "../lib/FetchRAM"
import { useNotifications } from '@toolpad/core/useNotifications';

const SystemInfoContext = createContext();

const SystemInfoProvider = ({children}) => {

    const [availableRAM, setAvailableRAM] = useState(null);
    const [debugMode, setDebugMode] = useState(false);
    
    const [debugList, setDebugList] = useState([]);
    const [pollingIntervals, setPollingIntervals] = useState([]);

    const notifications = useNotifications();

    const systemInfoControls = { availableRAM, setAvailableRAM, fetchRAM, RAM_PER_PROFILE, debugMode, debugList, setDebugList, setPollingIntervals };

    useEffect(() => { 
        console.log(debugList, debugList.length)

        if (debugList.length >= 10) {
            setDebugMode(true);
            console.log("DONE");
            notifications.show('Debug mode enabled!', { severity: 'info' });

            pollingIntervals.forEach((interval) => clearInterval(interval));
        }   
    }, [debugList]);

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