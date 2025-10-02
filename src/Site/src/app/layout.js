import Script from "next/script";
import { DownloadCountProvider } from "@/context/DownloadCountContext";
import { VisitCountProvider } from "@/context/VisitCountContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { atatusScript } from "@/config/atatus";
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
                <Script id="atatus-init">
                    {atatusScript}
                </Script>
                <link rel="sitemap" type="application/xml" title="Sitemap" href="/sitemap.xml" />
                <link rel="author" href="https://github.com/Ashif4354" />
            </head>
            <body>
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
