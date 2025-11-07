import { DownloadCountProvider } from "@/context/DownloadCountContext";
import { VisitCountProvider } from "@/context/VisitCountContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import "./globals.css";

export const metadata = {
    title: 'StreamStorm - Spam YouTube live chat',
    description: 'Download StreamStorm - a powerful tool to spam custom messages using multiple YouTube accounts in live chats. Fast, parallel, and built for impact.',
    robots: 'index, follow',
    applicationName: 'StreamStorm - YouTube Live Chat Spammer',
    authors: [{ name: 'Ashif', url: 'https://github.com/Ashif4354' }],
    manifest: '/manifest.json',
    icons: {
        icon: '/favicon.ico',
    },
    openGraph: {
        type: 'website',
        title: 'StreamStorm - Spam YouTube live chat',
        description: 'Bot to spam YouTube Live chat using multiple accounts in parallel.',
        url: 'https://streamstorm.darkglance.in/',
        siteName: 'StreamStorm by DarkGlance',
        images: [{
            url: 'https://streamstorm.darkglance.in/assets/ss.png',
        }],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'StreamStorm - Spam YouTube live chat',
        description: 'Bot to spam YouTube Live chat using multiple accounts in parallel.',
        site: '@ashifda',
        images: ['https://streamstorm.darkglance.in/assets/ss.png'],
    },
    alternates: {
        canonical: 'https://streamstorm.darkglance.in/',
    },
    other: {
        'sitemap': '/sitemap.xml',
    }
}

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <head>
                <script>
                    {
                        (function (w, d, s, l, i) {
                            w[l] = w[l] || []; w[l].push({
                                'gtm.start':
                                    new Date().getTime(), event: 'gtm.js'
                            }); var f = d.getElementsByTagName(s)[0],
                                j = d.createElement(s), dl = l != 'dataLayer' ? '&l=' + l : ''; j.async = true; j.src =
                                    'https://www.googletagmanager.com/gtm.js?id=' + i + dl; f.parentNode.insertBefore(j, f);
                        })(window, document, 'script', 'dataLayer', 'GTM-KDFP7XDC')
                    }
                </script>
                <link rel="sitemap" type="application/xml" title="Sitemap" href="/sitemap.xml" />
                <link rel="author" href="https://github.com/Ashif4354" />
                <script
                    id="website-schema"
                    type="application/ld+json"
                >
                    {
                        JSON.stringify({
                            "@context": "https://schema.org",
                            "@type": "WebSite",
                            "name": "streamstorm",
                            "url": "https://streamstorm.darkglance.in"
                        })
                    }
                </script>
            </head>
            <body>
                <noscript>
                    <iframe src="https://www.googletagmanager.com/ns.html?id=GTM-KDFP7XDC"
                        height="0" width="0" style="display:none;visibility:hidden"></iframe>
                </noscript>
                <DownloadCountProvider>
                    <VisitCountProvider>
                        <Header />
                        {children}
                        <Footer />
                    </VisitCountProvider>
                </DownloadCountProvider>
            </body>
        </html>
    );
}
