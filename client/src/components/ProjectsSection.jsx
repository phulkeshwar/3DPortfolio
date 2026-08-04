import { useEffect, useRef, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ExternalLink, Globe } from 'lucide-react';
import { staticProjects } from '../data/projects';
import { getApiUrl } from '../api/client';
import ProjectIcon from './ProjectIcon';

gsap.registerPlugin(ScrollTrigger);

// staticProjects is now imported from ../data/projects

const ProjectsSection = () => {
    const sectionRef = useRef(null);
    const [fetchedProjects, setFetchedProjects] = useState([]);

    useEffect(() => {
        const loadProjects = async () => {
            try {
                const response = await fetch(getApiUrl('/api/projects'));
                if (response.ok) {
                    const data = await response.json();
                    setFetchedProjects(data);
                }
            } catch (error) {
                console.error('Failed to load dynamic project links from backend:', error);
            }
        };
        loadProjects();
    }, []);

    // Merge backend links (githubLink, liveLink) into the highly styled core projects
    // or display completely new dynamic projects appended to the grid!
    const displayedProjects = useMemo(() => {
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
            };
        });

        return [...merged, ...styledExtra];
    }, [fetchedProjects]);

    useEffect(() => {
        const ctx = gsap.context(() => {
            // Section header
            gsap.fromTo(
                '.projects-header',
                { y: 80, opacity: 0 },
                {
                    y: 0,
                    opacity: 1,
                    duration: 1,
                    ease: 'power3.out',
                    scrollTrigger: {
                        trigger: '.projects-header',
                        start: 'top 85%',
                        toggleActions: 'play none none none',
                    },
                }
            );

            // Stagger animation triggers on viewport enter
            gsap.utils.toArray('.project-card-item').forEach((card, i) => {
                const fromLeft = i % 2 === 0;
                gsap.fromTo(
                    card,
                    {
                        x: fromLeft ? -120 : 120,
                        y: 60,
                        opacity: 0,
                        rotateY: fromLeft ? -8 : 8,
                        scale: 0.9,
                    },
                    {
                        x: 0,
                        y: 0,
                        opacity: 1,
                        rotateY: 0,
                        scale: 1,
                        duration: 1,
                        ease: 'power3.out',
                        scrollTrigger: {
                            trigger: card,
                            start: 'top 90%',
                            end: 'top 60%',
                            toggleActions: 'play none none none',
                        },
                    }
                );
            });
        }, sectionRef);

        return () => ctx.revert();
    }, [displayedProjects]); // Re-run GSAP context when dynamic projects finish merging

    return (
        <section id="projects" ref={sectionRef} className="relative py-28 sm:py-36">
            <div className="section-divider mb-20" />

            <div className="max-w-6xl mx-auto px-6">
                {/* Section Header */}
                <div className="projects-header mb-16">
                    <p className="text-primary-400 font-semibold text-sm uppercase tracking-widest mb-3">
                        What I've Built
                    </p>
                    <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white">
                        Selected Works<span className="gradient-text">.</span>
                    </h2>
                    <p className="mt-4 text-slate-400 text-lg max-w-2xl leading-relaxed">
                        Enterprise-level applications, hackathon wins, and production deployments.
                    </p>
                </div>

                {/* Projects Grid */}
                <div className="grid md:grid-cols-2 gap-6">
                    {displayedProjects.slice(0, 6).map((project, idx) => {
                        return (
                            <div
                                key={idx}
                                className={`project-card-item group glass-card !rounded-2xl p-7 flex flex-col h-full card-shine relative overflow-hidden ${project.accentBorder}`}
                                style={{ perspective: '1000px' }}
                            >
                                {/* Top gradient line */}
                                <div className={`absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r ${project.accent} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />

                                {/* Header */}
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex items-center gap-3">
                                        <ProjectIcon project={project} className="w-10 h-10 rounded-xl" iconSize={18} />
                                        <div>
                                            <h3 className="text-xl font-bold text-white group-hover:text-primary-300 transition-colors">
                                                {project.title}
                                            </h3>
                                            {project.badge && (
                                                <span className="text-xs font-semibold text-amber-400">
                                                    {project.badge}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    
                                    {/* Action Links */}
                                    <div className="flex items-center gap-3 mt-1.5 shrink-0">
                                        {project.githubLink && (
                                            <a
                                                href={project.githubLink}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                title="View GitHub Repository"
                                                className="text-slate-500 hover:text-white transition-all duration-300 hover:scale-110"
                                            >
                                                <svg className="w-4.5 h-4.5 fill-current" viewBox="0 0 24 24">
                                                    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.28-1.56 3.285-1.23 3.285-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                                                </svg>
                                            </a>
                                        )}
                                        {project.liveLink && (
                                            <a
                                                href={project.liveLink}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                title="Visit Live Website"
                                                className="text-slate-500 hover:text-primary-400 transition-all duration-300 hover:scale-110"
                                            >
                                                <ExternalLink size={17} />
                                            </a>
                                        )}
                                    </div>
                                </div>

                                {/* Description */}
                                <p className="text-slate-400 text-sm leading-relaxed flex-grow mb-5">
                                    {project.description}
                                </p>

                                {/* Tech tags */}
                                <div className="flex flex-wrap gap-2 mt-auto">
                                    {project.tech.map((tech, i) => (
                                        <span
                                            key={i}
                                            className="text-xs font-mono font-medium text-primary-400/80 bg-primary-400/5 px-2.5 py-1 rounded-md border border-primary-400/10"
                                        >
                                            {tech}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* See More Projects CTA */}
                <div className="flex justify-center mt-14">
                    <Link
                        to="/projects"
                        className="group inline-flex items-center gap-2.5 px-8 py-3.5 bg-slate-900/40 hover:bg-slate-900 border border-slate-800 text-slate-300 hover:text-white rounded-xl text-sm font-semibold transition-all duration-300 hover:-translate-y-0.5 shadow-lg shadow-black/20 hover:border-slate-700/50"
                    >
                        See More Projects
                        <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
                    </Link>
                </div>
            </div>
        </section>
    );
};

export default ProjectsSection;
