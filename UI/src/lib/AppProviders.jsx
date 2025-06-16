import { useMemo } from "react";
import { DialogsProvider } from '@toolpad/core/useDialogs';
import { NotificationsProvider, } from '@toolpad/core/useNotifications';

import { customMUIPropsContext, currentBrowserContext } from './ContextAPI';
import { getCustomMUIProps } from "./CustomMUIProps";
import getBrowser from "./getBrowser";


const AppProviders = ({ children, theme }) => {

    const browser = useMemo(getBrowser, []);
    const MUIProps = useMemo(() => getCustomMUIProps(theme), [theme]);

    return (
        <customMUIPropsContext.Provider value={MUIProps}>
            <DialogsProvider>
                <NotificationsProvider slotProps={{
                    snackbar: {
                        anchorOrigin: { vertical: 'bottom', horizontal: 'left' },
                        autoHideDuration: 2500,
                    },
                }}>
                    <currentBrowserContext.Provider value={browser}>
                        {children}
                    </currentBrowserContext.Provider>

                </NotificationsProvider>
            </DialogsProvider>
        </customMUIPropsContext.Provider>
    )
}

export default AppProviders;