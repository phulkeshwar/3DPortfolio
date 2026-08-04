import { useEffect, lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import SEO from './components/SEO';
import ThreeBackground from './components/ThreeBackground';
import ScrollProgress from './components/ScrollProgress';
import SideNav from './components/SideNav';
import HeroSection from './components/HeroSection';
import AboutSection from './components/AboutSection';
import ExpertiseSection from './components/ExpertiseSection';
import ProjectsSection from './components/ProjectsSection';
import ContactSection from './components/ContactSection';

const Dashboard = lazy(() => import('./pages/Dashboard'));
const Projects = lazy(() => import('./pages/Projects'));

gsap.registerPlugin(ScrollTrigger);

const PageFallback = () => (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 text-slate-400 font-mono text-xs">
        <div className="flex flex-col items-center gap-3">
            <div className="w-8 h-8 rounded-full border-2 border-primary-400 border-t-transparent animate-spin" />
            <span>Loading application workspace...</span>
        </div>
    </div>
);

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
            <SEO 
                title="Phulkeshwar Mahto | Software Engineer & MERN Specialist" 
                description="Phulkeshwar Mahto — Software Engineer & MERN Stack Specialist. Building high-performance, real-time web applications and scalable data architectures." 
                robots="index, follow" 
                canonical="https://phulkeshwar.vercel.app/" 
            />

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
            <Suspense fallback={<PageFallback />}>
                <Routes>
                    <Route path="/" element={<PortfolioLayout />} />
                    <Route path="/projects" element={
                        <>
                            <SEO 
                                title="Sandbox Portfolio | Phulkeshwar Mahto Showcase" 
                                description="Browse the complete repository of projects and web experiments designed and developed by Phulkeshwar Mahto."
                                robots="index, follow" 
                                canonical="https://phulkeshwar.vercel.app/projects" 
                            />
                            <Projects />
                        </>
                    } />
                    <Route path="/admin" element={
                        <>
                            <SEO 
                                title="Admin Dashboard | Phulkeshwar Mahto Portfolio" 
                                description="Secure administrator command center for managing showcase content."
                                robots="noindex, nofollow" 
                                canonical="https://phulkeshwar.vercel.app/admin" 
                            />
                            <Dashboard />
                        </>
                    } />
                </Routes>
            </Suspense>
        </Router>
    );
}

export default App;
