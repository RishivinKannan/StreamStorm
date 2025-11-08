import "./Footer.css";
import { useColorScheme } from '@mui/material/styles';
import { useStormData } from "../../../context/StormDataContext";

const Footer = () => {
    const { colorScheme } = useColorScheme();
    const formControls = useStormData();

    return (
        <footer className={`footer footer-${colorScheme} ${colorScheme}-bordered-container`}>
            <p>© 2025 StreamStorm. All rights reserved.</p>
            <div className="versions-text">
                <p>UI Version: {import.meta.env.VITE_APP_VERSION}</p>
                <p>Engine Version: {formControls.engineVersion}</p>
            </div>

        </footer>
    );
}

export default Footer;