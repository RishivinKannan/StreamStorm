import { IconButton, Tooltip } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useColorScheme } from '@mui/material/styles';

const CloseButton = ({ onClick }) => {

    const { colorScheme } = useColorScheme();

    return (
        <Tooltip title="Close" placement="bottom"> 
            <IconButton
                sx={{ position: 'absolute', right: '5px', top: '5px', '&:hover': { backgroundColor: '#ffffff10' } }}
                onClick={onClick}
            >
                <CloseIcon sx={{ color: colorScheme === 'light' ? 'var(--dark-text)' : 'var(--light-text)' }} />
            </IconButton>
        </Tooltip>
    );
};

export default CloseButton;