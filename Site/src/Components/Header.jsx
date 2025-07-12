import { useState } from 'react';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import { useMediaQuery } from '@mui/material';
import { useLocation } from 'react-router-dom';

import AppTitle from './AppTitle'
import NavBar from './NavBar';
import DrawerComponent from './Drawer';

const Header = () => {
    const isSmallScreen = useMediaQuery('(max-width: 760px)');
    const location = useLocation();
    const [drawerOpen, setDrawerOpen] = useState(false);

    return (
        <header className={`header header-${isSmallScreen ? 'small' : 'large'} ${location.pathname === '/' ? '' : 'only-title-header'}`}>
            <AppTitle />
            {
                isSmallScreen && location.pathname === '/' ? (
                    <IconButton
                        onClick={() => setDrawerOpen(true)}
                        sx={{
                            position: 'absolute',
                            top: 10,
                            right: 10,
                            zIndex: 1000,
                        }}
                    >
                        <MenuIcon sx={{ color: 'white' }} />
                    </IconButton>

                ) : (
                    <NavBar orientation="horizontal" />

                )
            }

            <DrawerComponent open={drawerOpen} onClose={() => setDrawerOpen(false)} />

        </header>
    );
};

export default Header;