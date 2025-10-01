import './Footer.css';
import { useColorScheme } from '@mui/material/styles';

const Footer = () => {
    const { colorScheme } = useColorScheme();

    return (
        <footer
            className={`footer footer-${colorScheme} ${colorScheme}-bordered-container`}
        >
            <p>© 2025 StreamStorm. All rights reserved.</p>
        </footer>
    );
};

export default Footer;
