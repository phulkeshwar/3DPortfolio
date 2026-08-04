import { useEffect, useState, useMemo, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft, Search, Globe, ExternalLink } from 'lucide-react';
import { gsap } from 'gsap';
import ThreeBackground from '../components/ThreeBackground';
import { staticProjects } from '../data/projects';
import { getApiUrl } from '../api/client';
import ProjectIcon from '../components/ProjectIcon';

const categories = ['All', 'Full-Stack', 'React', 'Utilities', 'Calculators'];

const ProjectSkeletonCard = () => (
    <div className="glass-card !rounded-2xl p-6 flex flex-col h-60 border border-slate-900 animate-pulse">
        <div className="flex items-center gap-3 mb-4">
            <div className="w-9 h-9 rounded-xl bg-slate-800" />
            <div className="h-5 bg-slate-800 rounded w-2/3" />
        </div>
        <div className="space-y-2 mb-6">
            <div className="h-3 bg-slate-800/80 rounded w-full" />
            <div className="h-3 bg-slate-800/80 rounded w-4/5" />
        </div>
        <div className="flex gap-2 mt-auto">
            <div className="h-4 bg-slate-800 rounded w-12" />
            <div className="h-4 bg-slate-800 rounded w-16" />
        </div>
    </div>
);

const Projects = () => {
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    const pageRef = useRef(null);
    const [fetchedProjects, setFetchedProjects] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const searchQuery = searchParams.get('search') || '';
    const selectedCategory = searchParams.get('category') || 'All';

    const setSearchQuery = (val) => {
        setSearchParams(prev => {
            if (val) prev.set('search', val);
            else prev.delete('search');
            return prev;
        }, { replace: true });
    };

    const setSelectedCategory = (cat) => {
        setSearchParams(prev => {
            if (cat && cat !== 'All') prev.set('category', cat);
            else prev.delete('category');
            return prev;
        }, { replace: true });
    };

    // 1. Fetch dynamic projects from DB
    useEffect(() => {
        const loadProjects = async () => {
            setIsLoading(true);
            try {
                const response = await fetch(getApiUrl('/api/projects'));
                if (response.ok) {
                    const data = await response.json();
                    setFetchedProjects(data);
                }
            } catch (error) {
                console.error('Failed to load dynamic project links from backend:', error);
            } finally {
                setIsLoading(false);
            }
        };
        loadProjects();
    }, []);

    // 2. Merge backend links into the highly styled core projects
    const allProjects = useMemo(() => {
        const merged = staticProjects.map(proj => {
            const dbMatch = fetchedProjects.find(
                fp => fp.title.toLowerCase().trim() === proj.title.toLowerCase().trim()
            );
            return {
                ...proj,
                githubLink: dbMatch?.githubLink || proj.githubLink || 'https://github.com/phulkeshwar',
                liveLink: dbMatch?.liveLink || proj.liveLink || '#',
            };
        });

        // Add entirely new projects created dynamically in the admin dashboard
        const extraProjects = fetchedProjects.filter(
            fp => !staticProjects.some(sp => sp.title.toLowerCase().trim() === fp.title.toLowerCase().trim())
        );

        const styledExtra = extraProjects.map((fp, index) => {
            const accents = [
                'from-cyan-500 to-blue-600',
                'from-amber-400 to-orange-500',
                'from-emerald-400 to-teal-500',
                'from-red-400 to-pink-500',
                'from-violet-400 to-purple-500',
                'from-sky-400 to-indigo-500'
            ];
            const accentBorders = [
                'group-hover:border-cyan-400/40',
                'group-hover:border-amber-400/40',
                'group-hover:border-emerald-400/40',
                'group-hover:border-red-400/40',
                'group-hover:border-violet-400/40',
                'group-hover:border-sky-400/40'
            ];

            return {
                title: fp.title,
                description: fp.description,
                tech: fp.techStack || [],
                icon: Globe,
                accent: accents[index % accents.length],
                accentBorder: accentBorders[index % accentBorders.length],
                githubLink: fp.githubLink,
                liveLink: fp.liveLink,
                category: 'Full-Stack' // Default fallback category for custom db entries
            };
        });

        return [...merged, ...styledExtra];
    }, [fetchedProjects]);

    // 3. Filter projects based on Search and Selected Category
    const filteredProjects = useMemo(() => {
        return allProjects.filter(project => {
            const matchesSearch = 
                project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                project.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                project.tech.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));

            const matchesCategory = 
                selectedCategory === 'All' || 
                project.category === selectedCategory;

            return matchesSearch && matchesCategory;
        });
    }, [allProjects, searchQuery, selectedCategory]);

    // 4. GSAP Page & Grid entry animations
    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.fromTo(
                '.projects-page-header',
                { y: 40, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out' }
            );

            gsap.fromTo(
                '.projects-controls',
                { y: 30, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.8, delay: 0.15, ease: 'power3.out' }
            );
        }, pageRef);

        return () => ctx.revert();
    }, []);

    // Re-trigger cards animation when list updates
    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.killTweensOf('.project-card-full');
            gsap.fromTo(
                '.project-card-full',
                { y: 40, opacity: 0, scale: 0.95 },
                { y: 0, opacity: 1, scale: 1, duration: 0.6, stagger: 0.05, ease: 'power3.out', overwrite: 'auto' }
            );
        }, pageRef);

        return () => ctx.revert();
    }, [filteredProjects]);

    return (
        <div ref={pageRef} className="min-h-screen relative overflow-hidden pb-20">
            {/* 3D Canvas Background */}
            <ThreeBackground shiftLeft={true} />

            <div className="relative z-10 max-w-6xl mx-auto px-6 pt-12">
                
                {/* Back Button */}
                <button 
                    onClick={() => navigate('/')}
                    className="group inline-flex items-center gap-2 px-4 py-2 bg-slate-900/60 hover:bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-400 hover:text-white rounded-xl text-xs font-mono transition duration-300 mb-12 shadow-lg shadow-black/20"
                >
                    <ArrowLeft size={13} className="transition-transform group-hover:-translate-x-0.5" />
                    Back to Portfolio
                </button>

                {/* Header */}
                <header className="projects-page-header mb-12">
                    <p className="text-primary-400 font-semibold text-sm uppercase tracking-widest mb-3 font-mono">
                        Archive & Sandbox
                    </p>
                    <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white">
                        Creative Sandbox<span className="gradient-text">.</span>
                    </h1>
                    <p className="mt-4 text-slate-400 text-lg max-w-2xl leading-relaxed">
                        A repository of production builds, open-source projects, design components, and custom utility scripts.
                    </p>
                </header>

                {/* Filters and Search Bar */}
                <div className="projects-controls flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12 p-4 bg-slate-950/40 border border-slate-900 rounded-2xl backdrop-blur-md">
                    {/* Category Filter Tabs */}
                    <div className="flex flex-wrap gap-2 order-2 md:order-1">
                        {categories.map((cat) => (
                            <button
                                key={cat}
                                onClick={() => setSelectedCategory(cat)}
                                className={`px-4 py-2 rounded-xl text-xs font-mono font-bold border transition duration-300 ${
                                    selectedCategory === cat
                                        ? 'bg-white text-gray-900 border-white'
                                        : 'bg-slate-900/40 border-slate-800/80 text-slate-400 hover:text-white hover:border-slate-700'
                                }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>

                    {/* Search Input */}
                    <div className="relative w-full md:w-80 order-1 md:order-2">
                        <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search projects or tech..."
                            className="w-full pl-11 pr-4 py-2.5 rounded-xl bg-slate-900/40 border border-slate-800 focus:border-primary-400 focus:outline-none text-white text-xs font-mono transition placeholder:text-slate-600 focus:ring-1 focus:ring-primary-400"
                        />
                    </div>
                </div>

                {/* Projects Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6" aria-live="polite">
                    {isLoading ? (
                        Array.from({ length: 6 }).map((_, i) => <ProjectSkeletonCard key={i} />)
                    ) : (
                        filteredProjects.map((project, idx) => {
                            return (
                                <div
                                    key={idx}
                                    className="project-card-full group glass-card !rounded-2xl p-6 flex flex-col h-full card-shine relative overflow-hidden border border-slate-850 hover:border-slate-700/50"
                                    style={{ perspective: '1000px' }}
                                >
                                    {/* Top gradient line */}
                                    <div className={`absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r ${project.accent} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />

                                    {/* Header */}
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex items-center gap-3">
                                            <ProjectIcon project={project} className="w-9 h-9 rounded-xl" iconSize={16} />
                                            <div>
                                                <h3 className="text-lg font-bold text-white group-hover:text-primary-300 transition-colors leading-tight">
                                                    {project.title}
                                                </h3>
                                            </div>
                                        </div>
                                        
                                        {/* Action Links */}
                                        <div className="flex items-center gap-3 shrink-0">
                                            {project.githubLink && (
                                                <a
                                                    href={project.githubLink}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    aria-label={`View ${project.title} GitHub repository`}
                                                    title="View GitHub Repository"
                                                    className="text-slate-400 hover:text-white transition-all duration-300 hover:scale-110"
                                                >
                                                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                                                        <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.28-1.56 3.285-1.23 3.285-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                                                    </svg>
                                                </a>
                                            )}
                                            {project.liveLink && (
                                                <a
                                                    href={project.liveLink}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    aria-label={`Visit ${project.title} live website`}
                                                    title="Visit Live Website"
                                                    className="text-slate-400 hover:text-primary-400 transition-all duration-300 hover:scale-110"
                                                >
                                                    <ExternalLink size={15} aria-hidden="true" />
                                                </a>
                                            )}
                                        </div>
                                    </div>

                                    {/* Description */}
                                    <p className="text-slate-300 text-xs leading-relaxed flex-grow mb-5 line-clamp-3">
                                        {project.description}
                                    </p>

                                    {/* Tech tags */}
                                    <div className="flex flex-wrap gap-1.5 mt-auto">
                                        {project.tech.map((tech, i) => (
                                            <span
                                                key={i}
                                                className="text-[10px] font-mono font-medium text-primary-400/90 bg-primary-400/10 px-2 py-0.5 rounded border border-primary-400/20"
                                            >
                                                {tech}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>

                {/* Empty State */}
                {filteredProjects.length === 0 && (
                    <div className="text-center py-20 bg-slate-950/20 border border-slate-900 rounded-3xl backdrop-blur-sm">
                        <p className="text-slate-500 font-mono text-sm mb-2">No projects matching your filters were found.</p>
                        <button 
                            onClick={() => { setSearchQuery(''); setSelectedCategory('All'); }}
                            className="text-xs text-primary-400 hover:text-primary-300 font-mono underline"
                        >
                            Reset filters & search
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Projects;
