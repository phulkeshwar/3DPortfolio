import { useEffect } from 'react';

/**
 * Dynamic SEO Component to update meta tags on route change
 * 
 * @param {Object} props
 * @param {string} props.title - The document title
 * @param {string} [props.description] - The meta description
 * @param {string} [props.robots] - Robots instructions ("index, follow" or "noindex, nofollow")
 * @param {string} [props.canonical] - The canonical URL
 */
const SEO = ({ title, description, robots = 'index, follow', canonical = 'https://phulkeshwar.vercel.app/' }) => {
    useEffect(() => {
        // Update document title
        if (title) {
            document.title = title;
        }

        // Update description tag
        if (description) {
            let descTag = document.querySelector('meta[name="description"]');
            if (descTag) {
                descTag.setAttribute('content', description);
            } else {
                descTag = document.createElement('meta');
                descTag.setAttribute('name', 'description');
                descTag.setAttribute('content', description);
                document.head.appendChild(descTag);
            }
        }

        // Update robots tag
        let robotsTag = document.querySelector('meta[name="robots"]');
        if (robotsTag) {
            robotsTag.setAttribute('content', robots);
        } else {
            robotsTag = document.createElement('meta');
            robotsTag.setAttribute('name', 'robots');
            robotsTag.setAttribute('content', robots);
            document.head.appendChild(robotsTag);
        }

        // Update canonical link
        let canonicalTag = document.querySelector('link[rel="canonical"]');
        if (canonicalTag) {
            canonicalTag.setAttribute('href', canonical);
        } else {
            canonicalTag = document.createElement('link');
            canonicalTag.setAttribute('rel', 'canonical');
            canonicalTag.setAttribute('href', canonical);
            document.head.appendChild(canonicalTag);
        }

        // Update Open Graph url and title
        const ogUrlTag = document.querySelector('meta[property="og:url"]');
        if (ogUrlTag) ogUrlTag.setAttribute('content', canonical);

        const ogTitleTag = document.querySelector('meta[property="og:title"]');
        if (ogTitleTag && title) ogTitleTag.setAttribute('content', title);

        const twitterTitleTag = document.querySelector('meta[name="twitter:title"]');
        if (twitterTitleTag && title) twitterTitleTag.setAttribute('content', title);
        
        if (description) {
            const ogDescTag = document.querySelector('meta[property="og:description"]');
            if (ogDescTag) ogDescTag.setAttribute('content', description);

            const twitterDescTag = document.querySelector('meta[name="twitter:description"]');
            if (twitterDescTag) twitterDescTag.setAttribute('content', description);
        }
    }, [title, description, robots, canonical]);

    return null; // This component doesn't render any UI
};

export default SEO;
