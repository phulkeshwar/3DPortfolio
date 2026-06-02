import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
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
import Dashboard from './pages/Dashboard';

gsap.registerPlugin(ScrollTrigger);

// Main portfolio page layout with fixed custom sidebar navigation and progress tracking
function PortfolioLayout() {
    useEffect(() => {
        // Refresh ScrollTrigger after sections mount
        const timeout = setTimeout(() => {
            ScrollTrigger.refresh();
        }, 600);

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

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<PortfolioLayout />} />
                <Route path="/admin" element={<Dashboard />} />
            </Routes>
        </Router>
    );
}

export default App;
