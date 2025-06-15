import { useContext, useState, useEffect } from 'react';
import { useColorScheme } from '@mui/material/styles';
import { Divider, Modal, Box } from '@mui/material';
import { Users } from 'lucide-react';

import './ManageProfiles.css';
import CreateProfiles from './Sections/CreateProfiles';
import FixProfiles from './Sections/FixProfiles';
import DeleteAllProfiles from './Sections/DeleteAllProfiles';
import { currentBrowser, customMUIProps } from '../../../lib/ContextAPI';
import CloseButton from '../../CloseButton';

const ManageProfiles = (props) => {

    const { modalProps } = useContext(customMUIProps);
    const browser = useContext(currentBrowser);

    const { open, setOpen } = props;
    const { colorScheme } = useColorScheme();

    const modalCloseHandler = () => {
        setOpen(false);
    }

    useEffect(() => {
        console.log("Current Browser: ", browser);
    }, [browser]);

    return (
        <Modal open={open} onClose={modalCloseHandler}>
            <Box sx={modalProps}>
                <div className='modal-header-container'>
                    <CloseButton onClick={modalCloseHandler} />
                    <div className={`modal-heading ${colorScheme}-text`}
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            color: colorScheme === 'light' ? 'var(--dark-text)' : 'var(--light-text)',
                            padding: 0,
                        }}
                    >
                        <Users className='profile-icon' />
                        Profile Management
                    </div>
                    <div className="modal-header-description-container">
                        <span className={`modal-header-description modal-header-description-${colorScheme}`}>
                            Manage your browser profiles for the Storm
                        </span>
                    </div>
                </div>
                <CreateProfiles currentBrowser={browser} />

                <Divider sx={{ margin: '2rem 0' }} />

                <FixProfiles currentBrowser={browser} />

                <Divider sx={{ margin: '2rem 0' }} />

                <DeleteAllProfiles currentBrowser={browser} />
            </Box>
        </Modal>
    );
};

export default ManageProfiles;