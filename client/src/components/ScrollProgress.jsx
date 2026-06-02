import { useEffect, useRef } from 'react';

const ScrollProgress = () => {
    const barRef = useRef(null);

    useEffect(() => {
        const handleScroll = () => {
            if (!barRef.current) return;
            const scrollTop = window.scrollY;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            const progress = docHeight > 0 ? scrollTop / docHeight : 0;
            barRef.current.style.transform = `scaleX(${progress})`;
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        handleScroll();
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return <div ref={barRef} className="scroll-progress" />;
};

export default ScrollProgress;
