import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ExternalLink, Trophy, Zap, Globe, ShoppingCart, Users, Video } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const projects = [
    {
        title: 'Call.io',
        description:
            'Real-time anonymous WebRTC video calling architecture. Solved critical N² signaling bottlenecks utilizing debounced presence broadcasting and a scalable Redis pub/sub adapter.',
        tech: ['WebRTC', 'Redis', 'Socket.io', 'Node'],
        icon: Video,
        accent: 'from-cyan-500 to-blue-600',
        accentBorder: 'group-hover:border-cyan-400/40',
    },
    {
        title: 'MedScribe AI',
        description:
            "Award-winning clinical assistant platform. Engineered a Doctor Mode for automated SOAP notes and Patient Mode for OCR prescription analysis utilizing Google's Gemma 4 27B model.",
        tech: ['MERN', 'Gemma 4 API', 'Google AI Studio'],
        icon: Trophy,
        accent: 'from-amber-400 to-orange-500',
        accentBorder: 'group-hover:border-amber-400/40',
        badge: '🏆 Hackathon Winner',
    },
    {
        title: 'VolunteerSync',
        description:
            'NGO volunteer coordination matrix. Features live interactive map tracking (Leaflet.js) and intelligent task delegation powered by Gemini API, synced entirely via WebSockets.',
        tech: ['Socket.io', 'Gemini API', 'Leaflet.js'],
        icon: Users,
        accent: 'from-emerald-400 to-teal-500',
        accentBorder: 'group-hover:border-emerald-400/40',
    },
    {
        title: 'NIAMT Racing',
        description:
            'Developed the official web presence for the university Formula Student team. Optimized for strict SEO standards, served via Cloudinary CDN, with a custom backend hosted on Railway.',
        tech: ['React', 'Node.js', 'Cloudinary', 'Vercel'],
        icon: Zap,
        accent: 'from-red-400 to-pink-500',
        accentBorder: 'group-hover:border-red-400/40',
    },
    {
        title: 'GramBazaar',
        description:
            'Full-stack enterprise e-commerce build. Features complex Mongoose data modeling for product catalogs, secure cart sessions, stateful order tracking, and a seller management dashboard.',
        tech: ['MongoDB', 'Express', 'React', 'Node'],
        icon: ShoppingCart,
        accent: 'from-violet-400 to-purple-500',
        accentBorder: 'group-hover:border-violet-400/40',
    },
    {
        title: 'PeekPost',
        description:
            'Scalable social networking clone handling complex relational data. Implemented a strict Prisma ORM schema to manage infinite-scroll feeds, nested comments, and bidirectional follow graphs.',
        tech: ['React', 'Node', 'Prisma ORM', 'PostgreSQL'],
        icon: Globe,
        accent: 'from-sky-400 to-indigo-500',
        accentBorder: 'group-hover:border-sky-400/40',
    },
];

const ProjectsSection = () => {
    const sectionRef = useRef(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.utils.toArray('.project-reveal').forEach((el, i) => {
                gsap.fromTo(
                    el,
                    { y: 60, opacity: 0 },
                    {
                        y: 0,
                        opacity: 1,
                        duration: 0.8,
                        delay: i * 0.1,
                        ease: 'power3.out',
                        scrollTrigger: {
                            trigger: el,
                            start: 'top 88%',
                            toggleActions: 'play none none none',
                        },
                    }
                );
            });
        }, sectionRef);

        return () => ctx.revert();
    }, []);

    return (
        <section id="projects" ref={sectionRef} className="relative py-28 sm:py-36">
            <div className="section-divider mb-20" />

            {/* Ambient glow */}
            <div className="ambient-orb w-[500px] h-[500px] bg-purple-600 top-1/2 -left-60" />

            <div className="max-w-6xl mx-auto px-6">
                {/* Section Header */}
                <div className="project-reveal mb-16">
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
                    {projects.map((project, idx) => {
                        const Icon = project.icon;
                        return (
                            <div
                                key={idx}
                                className={`project-reveal group glass-card !rounded-2xl p-7 flex flex-col h-full card-shine relative overflow-hidden ${project.accentBorder}`}
                            >
                                {/* Top gradient line */}
                                <div className={`absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r ${project.accent} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />

                                {/* Header */}
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${project.accent} flex items-center justify-center opacity-80`}>
                                            <Icon size={18} className="text-white" />
                                        </div>
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
                                    <ExternalLink
                                        size={16}
                                        className="text-slate-600 group-hover:text-primary-400 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 mt-1"
                                    />
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
            </div>
        </section>
    );
};

export default ProjectsSection;
