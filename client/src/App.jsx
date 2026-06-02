import { useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import ThreeBackground from './components/ThreeBackground';
import ScrollProgress from './components/ScrollProgress';
import SideNav from './components/SideNav';
import HeroSection from './components/HeroSection';
import AboutSection from './components/AboutSection';
import ExpertiseSection from './components/ExpertiseSection';
import ProjectsSection from './components/ProjectsSection';
import ContactSection from './components/ContactSection';

gsap.registerPlugin(ScrollTrigger);

function App() {
    useEffect(() => {
        // Refresh ScrollTrigger after everything is loaded
        const timeout = setTimeout(() => {
            ScrollTrigger.refresh();
        }, 500);

        return () => clearTimeout(timeout);
    }, []);

    return (
        <>
            {/* Fixed 3D Background */}
            <ThreeBackground />

            {/* Scroll Progress Bar */}
            <ScrollProgress />

            {/* Navigation */}
            <SideNav />

            {/* Main Content */}
            <main className="main-content relative z-10 pr-0 md:pr-[100px]">
                <HeroSection />
                <AboutSection />
                <ExpertiseSection />
                <ProjectsSection />
                <ContactSection />
            </main>
        </>
    );
}

export default App;
