import { useMediaQuery } from '@mui/material';

const NavBar = ({ orientation, onClose }) => {

    const isSmallScreen = useMediaQuery('(max-width: 700px)')

    return (
        <nav className={`navbar navbar-${orientation}`}>
            <a href="#overview" onClick={onClose} className={`navbar-item navbar-item-${isSmallScreen ? 'small' : 'large'}`}>Overview</a>
            <a href="#features" onClick={onClose} className={`navbar-item navbar-item-${isSmallScreen ? 'small' : 'large'}`}>Features</a>
            <a href="#disclaimer" onClick={onClose} className={`navbar-item navbar-item-${isSmallScreen ? 'small' : 'large'}`}>Disclaimer</a>
            <a href="/instructions" className={`navbar-item navbar-item-${isSmallScreen ? 'small' : 'large'}`}>Storm Guide 📖</a>
        </nav>
    )
}

export default NavBar;