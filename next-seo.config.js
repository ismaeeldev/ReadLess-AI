// next-seo.config.js

export default {
    defaultTitle: 'Readless AI – Instant PDF Summarizer',
    description: 'Summarize PDFs with the power of AI. Get key insights fast.',
    openGraph: {
        type: 'website',
        locale: 'en_US',
        url: 'https://readless.vercel.app/',
        site_name: 'Readless AI',
        images: [
            {
                url: 'openGraph.png',
                width: 1200,
                height: 630,
                alt: 'Readless AI – Summarize PDFs instantly',
            },
        ],
    },
    twitter: {
        cardType: 'summary_large_image',
    },
};
