import Script from "next/script";
import { GoogleTagManager } from '@next/third-parties/google'
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
                <GoogleTagManager id="GTM-KDFP7XDC" />
                <link rel="sitemap" type="application/xml" title="Sitemap" href="/sitemap.xml" />
                <link rel="author" href="https://github.com/Ashif4354" />
                <Script
                    id="website-schema"
                    type="application/ld+json"
                    strategy="beforeInteractive"
                >
                    {
                        JSON.stringify({
                            "@context": "https://schema.org",
                            "@type": "WebSite",
                            "name": "streamstorm",
                            "url": "https://streamstorm.darkglance.in"
                        })
                    }
                </Script>
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
