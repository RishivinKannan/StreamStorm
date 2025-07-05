import { useMediaQuery } from '@mui/material';

const NavBar = ({ orientation }) => {

    const isSmallScreen = useMediaQuery('(max-width: 700px)')

    return (
        <nav className={`navbar navbar-${orientation}`}>
            <a href="#overview" className={`navbar-item navbar-item-${isSmallScreen ? 'small' : 'large'}`}>Overview</a>
            <a href="#features" className={`navbar-item navbar-item-${isSmallScreen ? 'small' : 'large'}`}>Features</a>
            <a href="#disclaimer" className={`navbar-item navbar-item-${isSmallScreen ? 'small' : 'large'}`}>Disclaimer</a>
        </nav>
    )
}

export default NavBar;