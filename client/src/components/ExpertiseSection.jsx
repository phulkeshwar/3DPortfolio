import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const skillCategories = [
    {
        title: 'Languages',
        color: 'text-sky-400',
        dotColor: 'bg-sky-400',
        skills: [
            { name: 'JavaScript', icon: 'devicon-javascript-plain colored' },
            { name: 'TypeScript', icon: 'devicon-typescript-plain colored' },
            { name: 'C++', icon: 'devicon-cplusplus-plain colored' },
            { name: 'Python', icon: 'devicon-python-plain colored' },
            { name: 'HTML5', icon: 'devicon-html5-plain colored' },
            { name: 'CSS3', icon: 'devicon-css3-plain colored' },
        ],
    },
    {
        title: 'Frontend & UI',
        color: 'text-primary-400',
        dotColor: 'bg-primary-400',
        skills: [
            { name: 'React.js', icon: 'devicon-react-original colored' },
            { name: 'Three.js', icon: 'devicon-threejs-original' },
            { name: 'Tailwind CSS', icon: 'devicon-tailwindcss-original colored' },
            { name: 'Figma', icon: 'devicon-figma-plain colored' },
        ],
    },
    {
        title: 'Core Backend',
        color: 'text-emerald-400',
        dotColor: 'bg-emerald-400',
        skills: [
            { name: 'Node.js', icon: 'devicon-nodejs-plain colored' },
            { name: 'Express.js', icon: 'devicon-express-original' },
            { name: 'Socket.io', icon: 'devicon-socketio-original' },
            { name: 'WebRTC', emoji: '🌐' },
            { name: 'Redis', icon: 'devicon-redis-plain colored' },
        ],
    },
    {
        title: 'Database & Cloud',
        color: 'text-amber-400',
        dotColor: 'bg-amber-400',
        skills: [
            { name: 'MongoDB', icon: 'devicon-mongodb-plain colored' },
            { name: 'PostgreSQL', icon: 'devicon-postgresql-plain colored' },
            { name: 'Firebase', icon: 'devicon-firebase-plain colored' },
            { name: 'Cloudinary', icon: 'devicon-cloudinary-original' },
        ],
    },
    {
        title: 'DevOps & Tools',
        color: 'text-purple-400',
        dotColor: 'bg-purple-400',
        skills: [
            { name: 'Docker', icon: 'devicon-docker-plain colored' },
            { name: 'Git', icon: 'devicon-git-plain colored' },
            { name: 'GitHub', icon: 'devicon-github-plain colored' },
            { name: 'Postman', icon: 'devicon-postman-plain colored' },
            { name: 'Vercel', icon: 'devicon-vercel-original' },
            { name: 'Render', icon: 'devicon-render-plain colored' },
        ],
    },
];

const ExpertiseSection = () => {
    const sectionRef = useRef(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            // Section header slides in from left
            gsap.fromTo(
                '.expertise-header',
                { x: -100, opacity: 0 },
                {
                    x: 0,
                    opacity: 1,
                    duration: 1,
                    ease: 'power3.out',
                    scrollTrigger: {
                        trigger: '.expertise-header',
                        start: 'top 85%',
                        toggleActions: 'play none none none',
                    },
                }
            );

            // Container card scales up
            gsap.fromTo(
                '.expertise-container',
                { scale: 0.92, opacity: 0, y: 40 },
                {
                    scale: 1,
                    opacity: 1,
                    y: 0,
                    duration: 0.8,
                    ease: 'power3.out',
                    scrollTrigger: {
                        trigger: '.expertise-container',
                        start: 'top 85%',
                        toggleActions: 'play none none none',
                    },
                }
            );

            // Each skill row slides in from the right one by one
            gsap.utils.toArray('.skill-row-item').forEach((row, i) => {
                gsap.fromTo(
                    row,
                    { x: 80, opacity: 0 },
                    {
                        x: 0,
                        opacity: 1,
                        duration: 0.7,
                        delay: i * 0.15,
                        ease: 'power3.out',
                        scrollTrigger: {
                            trigger: '.expertise-container',
                            start: 'top 75%',
                            toggleActions: 'play none none none',
                        },
                    }
                );
            });

            // Stagger tech pills within each row
            gsap.utils.toArray('.skill-row-item').forEach((row) => {
                const pills = row.querySelectorAll('.tech-pill');
                gsap.fromTo(
                    pills,
                    { scale: 0, opacity: 0, rotate: -10 },
                    {
                        scale: 1,
                        opacity: 1,
                        rotate: 0,
                        duration: 0.4,
                        stagger: 0.07,
                        ease: 'back.out(2)',
                        scrollTrigger: {
                            trigger: row,
                            start: 'top 85%',
                            toggleActions: 'play none none none',
                        },
                    }
                );
            });
        }, sectionRef);

        return () => ctx.revert();
    }, []);

    return (
        <section id="expertise" ref={sectionRef} className="relative py-28 sm:py-36">
            <div className="section-divider mb-20" />

            <div className="max-w-6xl mx-auto px-6">
                {/* Section Header */}
                <div className="expertise-header mb-16">
                    <p className="text-primary-400 font-semibold text-sm uppercase tracking-widest mb-3">
                        What I Work With
                    </p>
                    <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white">
                        Expertise<span className="gradient-text">.</span>
                    </h2>
                    <p className="mt-4 text-slate-400 text-lg max-w-2xl leading-relaxed">
                        The tools, languages, and architectures I use to build robust software.
                    </p>
                </div>

                {/* Skills Grid */}
                <div className="expertise-container glass-card p-6 sm:p-8 lg:p-10 !rounded-3xl">
                    {skillCategories.map((category, idx) => (
                        <div
                            key={idx}
                            className={`skill-row-item grid grid-cols-1 sm:grid-cols-[180px_1fr] gap-4 sm:gap-8 items-start py-6 ${
                                idx !== skillCategories.length - 1
                                    ? 'border-b border-slate-700/50'
                                    : ''
                            }`}
                        >
                            <div className="flex items-center gap-3">
                                <div className={`w-2 h-2 rounded-full ${category.dotColor}`} />
                                <strong className={`${category.color} text-base font-bold`}>
                                    {category.title}
                                </strong>
                            </div>

                            <div className="flex flex-wrap gap-3">
                                {category.skills.map((skill, i) => (
                                    <span key={i} className="tech-pill">
                                        {skill.icon ? (
                                            <i className={skill.icon} />
                                        ) : (
                                            <span>{skill.emoji}</span>
                                        )}
                                        {skill.name}
                                    </span>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default ExpertiseSection;
