import { useState } from 'react';
import { Globe } from 'lucide-react';

export const getFaviconUrl = (liveLink) => {
    try {
        if (!liveLink || liveLink === '#') return null;
        const url = new URL(liveLink.startsWith('http') ? liveLink : `https://${liveLink}`);
        // Use unavatar with fallback=false so default hosting icons (like Vercel globes) 404,
        // allowing our rich, distinct Lucide icons to display instead of 9 duplicate globes!
        return `https://unavatar.io/${url.hostname}?fallback=false`;
    } catch (e) {
        return null;
    }
};

export const ProjectIcon = ({ project, className = "w-10 h-10 rounded-xl", iconSize = 18 }) => {
    const [imgError, setImgError] = useState(false);
    const [imgLoaded, setImgLoaded] = useState(false);

    const FallbackIcon = project.icon || Globe;
    const faviconUrl = getFaviconUrl(project.liveLink);

    return (
        <div className={`${className} bg-gradient-to-br ${project.accent || 'from-cyan-500 to-blue-600'} flex items-center justify-center relative overflow-hidden shrink-0 shadow-md`}>
            {faviconUrl && !imgError ? (
                <>
                    <img
                        src={faviconUrl}
                        alt={`${project.title} icon`}
                        onLoad={() => setImgLoaded(true)}
                        onError={() => setImgError(true)}
                        className={`w-5.5 h-5.5 object-contain rounded-sm transition-opacity duration-300 ${imgLoaded ? 'opacity-100' : 'opacity-0 absolute'}`}
                    />
                    {!imgLoaded && (
                        <FallbackIcon size={iconSize} className="text-white opacity-90" aria-hidden="true" />
                    )}
                </>
            ) : (
                <FallbackIcon size={iconSize} className="text-white opacity-90" aria-hidden="true" />
            )}
        </div>
    );
};

export default ProjectIcon;
