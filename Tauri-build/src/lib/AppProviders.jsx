import { DialogsProvider } from '@toolpad/core/useDialogs';
import { NotificationsProvider } from '@toolpad/core/useNotifications';

import { StormDataProvider } from '../context/StormDataContext';
import { SystemInfoProvider } from '../context/SystemInfoContext';
import { CustomMUIPropsProvider } from '../context/CustomMUIPropsContext';

const AppProviders = ({ children }) => {
    return (
        <CustomMUIPropsProvider>
            <DialogsProvider>
                <NotificationsProvider
                    slotProps={{
                        snackbar: {
                            anchorOrigin: {
                                vertical: 'bottom',
                                horizontal: 'left',
                            },
                            autoHideDuration: 2500,
                        },
                    }}
                >
                    <StormDataProvider>
                        <SystemInfoProvider>{children}</SystemInfoProvider>
                    </StormDataProvider>
                </NotificationsProvider>
            </DialogsProvider>
        </CustomMUIPropsProvider>
    );
};

export default AppProviders;
