import { useEffect, useState } from "react";
import { useColorScheme } from '@mui/material/styles';
import { useLocalStorageState } from '@toolpad/core/useLocalStorageState';
import { DialogsProvider } from '@toolpad/core/useDialogs';
import { NotificationsProvider, } from '@toolpad/core/useNotifications';

import "./App.css";
import { customMUIPropsContext, currentBrowserContext } from './lib/ContextAPI';
import Header from "./Components/Header/Header";
import Footer from "./Components/Footer/Footer";
import Main from "./Components/Main/Main";
import { getCustomMUIProps } from "./lib/CustomMUIProps";
import getBrowser from "./lib/getBrowser";


const App = () => {

    const { colorScheme, setColorScheme } = useColorScheme();
    const [defaultColorScheme] = useLocalStorageState('theme', 'light');
    const [browser, setBrowser] = useState(getBrowser());

    useEffect(() => {
        setColorScheme(defaultColorScheme);
    }, [setColorScheme, defaultColorScheme]);


    return (
        <customMUIPropsContext.Provider value={getCustomMUIProps(colorScheme)}>
            <DialogsProvider>
                <NotificationsProvider slotProps={{
                    snackbar: {
                        anchorOrigin: { vertical: 'bottom', horizontal: 'left' },
                        autoHideDuration: 3000,
                    },
                }}>
                    <currentBrowserContext.Provider value={browser}>

                        <div className={`main-container main-container-${colorScheme}`}>
                            <Header />
                            <Main />
                            <Footer />
                        </div>
                    </currentBrowserContext.Provider>

                </NotificationsProvider>
            </DialogsProvider>
        </customMUIPropsContext.Provider>
    )
}

export default App;