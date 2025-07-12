import { useMediaQuery } from '@mui/material';
import { analytics } from '../config/firebase';
import { logEvent } from 'firebase/analytics';
import { useLocation } from 'react-router-dom';

const NavBar = ({ orientation, onClose }) => {

    const isSmallScreen = useMediaQuery('(max-width: 700px)')
    const location = useLocation();

    const handleLinkClick = (name) => {
        onClose();
        logEvent(analytics, 'nav_link_click', {
            link_name: name,
        });
    }
    

    return (
        <>
            {location.pathname === '/' ? (
                <nav className={`navbar navbar-${orientation}`}>

                    <a href="/#overview" onClick={() => handleLinkClick('overview')} className={`navbar-item navbar-item-${isSmallScreen ? 'small' : 'large'}`}>Overview</a>
                    <a href="/#features" onClick={() => handleLinkClick('features')} className={`navbar-item navbar-item-${isSmallScreen ? 'small' : 'large'}`}>Features</a>
                    <a href="/#disclaimer" onClick={() => handleLinkClick('disclaimer')} className={`navbar-item navbar-item-${isSmallScreen ? 'small' : 'large'}`}>Disclaimer</a>
                    <a href="/instructions" onClick={() => handleLinkClick('instructions')} className={`navbar-item navbar-item-${isSmallScreen ? 'small' : 'large'}`}>Instructions</a>
                </nav>

            ) : null}
        </>
    )
}

export default NavBar;