// import { BROWSERS } from "./Constants";
const getBrowser = () => {
    const userAgent = window.navigator.userAgent;
    const userAgentData = window.navigator.userAgentData;
    // console.log(userAgent);

    if (userAgent.includes('Firefox/')) {
        return 'firefox';
    } else if (userAgentData.brands[0].brand === 'Google Chrome') {
        return 'chrome';
    } else if (userAgentData.brands[0].brand === 'Microsoft Edge') {
        return 'edge';
    }

    // setCurrentBrowser(browser);
    // setBrowser(BROWSERS.find(b => b !== browser))
}

export default getBrowser;
