import { useEffect } from 'react';
import { logEvent } from 'firebase/analytics';
import { analytics } from '../config/firebase';

const PrivacyPolicy = () => {

  useEffect(() => {
    logEvent(analytics, 'pp_viewed', {
      page_location: window.location.href,
      page_path: window.location.pathname,
      page_title: document.title
    });
  }, []);

  return (
    <div className="pp-page">
      <div className="pp-container">
        <h1>Privacy Policy</h1>
        <p className="last-updated">Last Updated: July 12, 2025</p>

        <section>
          <h2>1. No Personal Data Collection</h2>
          <p>
            StreamStorm does not collect, store, or share any personal or identifiable user data. We do not collect your name, email address, IP address, or any other personal information.
          </p>
        </section>

        <section>
          <h2>2. Anonymous Analytics</h2>
          <p>
            We use analytics to understand how users interact with the app. This includes page visits (like this privacy policy) and actions such as downloading the application or viewing the GitHub repository.
            However, this data is completely anonymous. We do not know who you are and cannot identify you in any way. The information we collect is general and helps us improve the application experience.
          </p>
        </section>

        <section>
          <h2>3. Internet Usage</h2>
          <p>
            The app uses the internet only for:
            <ul>
              <li>Checking for software updates</li>
              <li>Downloading required browser webdrivers</li>
              <li>Sending analytics data</li>
            </ul>
            These operations are technical and do not involve any personal data.
          </p>
        </section>

        <section>
          <h2>4. No Tracking</h2>
          <p>
            StreamStorm does not use cookies, telemetry, or any background tracking technologies. We do not monitor your behavior or usage patterns beyond general anonymous analytics.
          </p>
        </section>

        <section>
          <h2>5. Offline-Friendly</h2>
          <p>
            Except for update checks and webdriver downloads, all core features of the app work entirely offline.
          </p>
        </section>

        <section>
          <h2>6. Third-Party Services</h2>
          <p>
            The app does not rely on third-party services that collect user data. StreamStorm is fully self-contained.
          </p>
        </section>

        <section>
          <h2>7. Children’s Privacy</h2>
          <p>
            We do not collect any data from users, including those under the age of 13. The app is safe to use for all ages.
          </p>
        </section>

        <section>
          <h2>8. Contact</h2>
          <p>
            For any questions or concerns, feel free to contact:<br />
            📧 <a href="mailto:darkglance.developer@gmail.com">darkglance.developer@gmail.com</a>
          </p>
        </section>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
