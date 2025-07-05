import Drawer from '@mui/material/Drawer';
import Box from '@mui/material/Box';
import AppTitle from './AppTitle';
import NavBar from './NavBar';
import CloseButton from './CloseButton';

const DrawerComponent = ({ open, onClose }) => {

    return (
        <Drawer
            anchor="right"
            open={open}
            onClose={onClose}
        >
            <CloseButton onClick={onClose} />
            <Box
                role="presentation"
                sx={{
                    backgroundColor: 'var(--dark-gray)',
                    width: 150,
                    height: '100%',
                    padding: '2.5rem'
                }}
            >
                {/* <AppTitle /> */}
                <span className="drawer-title">Menu</span>
                <NavBar orientation="vertical" />


            </Box>
        </Drawer>
    )
}

export default DrawerComponent;