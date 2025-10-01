import { useColorScheme } from '@mui/material/styles';
import { Divider, Modal, Box } from '@mui/material';
import { Users } from 'lucide-react';

import './ManageProfiles.css';
import CreateProfiles from './Sections/CreateProfiles';
import DeleteAllProfiles from './Sections/DeleteAllProfiles';
import CloseButton from '../../Elements/CloseButton';
import { useCustomMUIProps } from '../../../context/CustomMUIPropsContext';

const ManageProfiles = (props) => {
    const { open, setOpen } = props;
    const { modalProps } = useCustomMUIProps();
    const { colorScheme } = useColorScheme();

    const modalCloseHandler = () => {
        setOpen(false);
    };

    return (
        <Modal open={open} onClose={modalCloseHandler}>
            <Box sx={modalProps}>
                <div className="modal-header-container">
                    <CloseButton onClick={modalCloseHandler} />
                    <div
                        className={`modal-heading ${colorScheme}-text`}
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            color:
                                colorScheme === 'light'
                                    ? 'var(--dark-text)'
                                    : 'var(--light-text)',
                            padding: 0,
                        }}
                    >
                        <Users className="profile-icon" />
                        Profile Management
                    </div>
                    <div className="modal-header-description-container">
                        <span
                            className={`modal-header-description modal-header-description-${colorScheme}`}
                        >
                            Manage your temp browser profiles for the Storm
                        </span>
                    </div>
                </div>
                <CreateProfiles />

                <Divider sx={{ margin: '2rem 0' }} />

                <DeleteAllProfiles />
            </Box>
        </Modal>
    );
};

export default ManageProfiles;
