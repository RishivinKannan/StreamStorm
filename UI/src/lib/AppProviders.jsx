import { useMemo, useState } from "react";
import { DialogsProvider } from '@toolpad/core/useDialogs';
import { NotificationsProvider, } from '@toolpad/core/useNotifications';

import { CustomMUIPropsContext, SystemInfoContext } from './ContextAPI';
import { getCustomMUIProps } from "./CustomMUIProps";
import fetchRAM from "./FetchRAM"
import { RAM_PER_PROFILE } from "./Constants";
import { StormDataProvider } from "../context/StormDataContext";


const AppProviders = ({ children, theme }) => {

    const MUIProps = useMemo(() => getCustomMUIProps(theme), [theme]);

    const [availableRAM, setAvailableRAM] = useState(null);
    const systemInfoControls = { availableRAM, setAvailableRAM, fetchRAM, RAM_PER_PROFILE };

    return (
        <CustomMUIPropsContext.Provider value={MUIProps}>
            <SystemInfoContext.Provider value={systemInfoControls}>
                <DialogsProvider>
                    <NotificationsProvider slotProps={{
                        snackbar: {
                            anchorOrigin: { vertical: 'bottom', horizontal: 'left' },
                            autoHideDuration: 2500,
                        },
                    }}>
                        <StormDataProvider>
                            {children}
                        </StormDataProvider>
                    </NotificationsProvider>
                </DialogsProvider>
            </SystemInfoContext.Provider>
        </CustomMUIPropsContext.Provider>
    )
}

export default AppProviders;