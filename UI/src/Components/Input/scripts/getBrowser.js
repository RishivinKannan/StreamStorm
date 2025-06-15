import { BROWSERS } from "../../../Constants";

const getBrowser = (setCurrentBrowser, setBrowser) => {
    const userAgent = window.navigator.userAgent;
    const userAgentData = window.navigator.userAgentData;
    console.log(userAgent);
    let browser;

    if (userAgent.includes('Firefox/')) {
        browser = 'firefox';
    } else if (userAgentData.brands[0].brand === 'Google Chrome') {
        browser = 'chrome';
    } else if (userAgentData.brands[0].brand === 'Microsoft Edge') {
        browser = 'edge';
    }

    setCurrentBrowser(browser);
    setBrowser(BROWSERS.find(b => b !== browser))

}

export default getBrowser;
