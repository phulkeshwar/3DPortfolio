import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const skillCategories = [
    {
        title: 'Core Backend',
        color: 'text-emerald-400',
        bgColor: 'bg-emerald-400/10',
        skills: [
            { name: 'Node.js', icon: 'devicon-nodejs-plain colored' },
            { name: 'Express.js', icon: 'devicon-express-original' },
            { name: 'Socket.io', icon: 'devicon-socketio-original' },
            { name: 'Redis', icon: 'devicon-redis-plain colored' },
            { name: 'WebRTC', emoji: '🌐' },
        ],
    },
    {
        title: 'Frontend & UI',
        color: 'text-primary-400',
        bgColor: 'bg-primary-400/10',
        skills: [
            { name: 'React.js', icon: 'devicon-react-original colored' },
            { name: 'Next.js', icon: 'devicon-nextjs-plain' },
            { name: 'TypeScript', icon: 'devicon-typescript-plain colored' },
            { name: 'JavaScript', icon: 'devicon-javascript-plain colored' },
            { name: 'Tailwind CSS', icon: 'devicon-tailwindcss-original colored' },
        ],
    },
    {
        title: 'Database & Cloud',
        color: 'text-amber-400',
        bgColor: 'bg-amber-400/10',
        skills: [
            { name: 'MongoDB', icon: 'devicon-mongodb-plain colored' },
            { name: 'PostgreSQL', icon: 'devicon-postgresql-plain colored' },
            { name: 'Prisma ORM', icon: 'devicon-prisma-original' },
            { name: 'Vercel', icon: 'devicon-vercel-original' },
            { name: 'AWS', icon: 'devicon-amazonwebservices-plain-wordmark colored' },
        ],
    },
    {
        title: 'Computer Science',
        color: 'text-purple-400',
        bgColor: 'bg-purple-400/10',
        skills: [
            { name: 'C++', icon: 'devicon-cplusplus-plain colored' },
            { name: 'Git', icon: 'devicon-git-plain colored' },
            { name: 'Linux', icon: 'devicon-linux-plain' },
            { name: 'Docker', icon: 'devicon-docker-plain colored' },
        ],
    },
];

const ExpertiseSection = () => {
    const sectionRef = useRef(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.utils.toArray('.expertise-reveal').forEach((el, i) => {
                gsap.fromTo(
                    el,
                    { y: 40, opacity: 0 },
                    {
                        y: 0,
                        opacity: 1,
                        duration: 0.7,
                        delay: i * 0.08,
                        ease: 'power3.out',
                        scrollTrigger: {
                            trigger: el,
                            start: 'top 85%',
                            toggleActions: 'play none none none',
                        },
                    }
                );
            });

            // Stagger the pills within each row
            gsap.utils.toArray('.skill-row').forEach((row) => {
                const pills = row.querySelectorAll('.tech-pill');
                gsap.fromTo(
                    pills,
                    { scale: 0.8, opacity: 0 },
                    {
                        scale: 1,
                        opacity: 1,
                        duration: 0.4,
                        stagger: 0.06,
                        ease: 'back.out(1.5)',
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
                <div className="expertise-reveal mb-16">
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
                <div className="glass-card p-6 sm:p-8 lg:p-10 !rounded-3xl">
                    {skillCategories.map((category, idx) => (
                        <div
                            key={idx}
                            className={`skill-row expertise-reveal grid grid-cols-1 sm:grid-cols-[180px_1fr] gap-4 sm:gap-8 items-start py-6 ${
                                idx !== skillCategories.length - 1
                                    ? 'border-b border-slate-700/50'
                                    : ''
                            }`}
                        >
                            <div className="flex items-center gap-3">
                                <div className={`w-2 h-2 rounded-full ${category.bgColor.replace('/10', '')}`} />
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
