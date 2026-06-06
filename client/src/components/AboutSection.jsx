import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { GraduationCap, Briefcase, MapPin, Target, Download } from 'lucide-react';
import ProfilePdf from '../assets/Profile.pdf';

gsap.registerPlugin(ScrollTrigger);

const stats = [
    { value: 8.0, suffix: '', label: 'Academic CGPA', isDecimal: true },
    { value: 6, suffix: '+', label: 'Projects', isDecimal: false },
    { value: 26, suffix: '+', label: 'GitHub Repositories', isDecimal: false },
    { value: 2, suffix: '', label: 'Hackathon Participation', isDecimal: false },
];

function AnimatedCounter({ target, suffix = '', isDecimal = false, inView }) {
    const [count, setCount] = useState(0);

    useEffect(() => {
        if (!inView) return;
        let start = 0;
        const end = target;
        const duration = 2000;
        const startTime = Date.now();

        const timer = setInterval(() => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            const current = start + (end - start) * eased;
            setCount(isDecimal ? parseFloat(current.toFixed(1)) : Math.floor(current));
            if (progress >= 1) clearInterval(timer);
        }, 16);

        return () => clearInterval(timer);
    }, [inView, target, isDecimal]);

    return (
        <span>
            {isDecimal ? count.toFixed(1) : count}
            {suffix}
        </span>
    );
}

const AboutSection = () => {
    const sectionRef = useRef(null);
    const [inView, setInView] = useState(false);

    useEffect(() => {
        const ctx = gsap.context(() => {
            // Section header slides in from the left
            gsap.fromTo(
                '.about-header',
                { x: -100, opacity: 0 },
                {
                    x: 0,
                    opacity: 1,
                    duration: 1,
                    ease: 'power3.out',
                    scrollTrigger: {
                        trigger: '.about-header',
                        start: 'top 85%',
                        toggleActions: 'play none none none',
                    },
                }
            );

            // Left bio blocks fly in one by one from the left
            gsap.utils.toArray('.bio-block').forEach((el, i) => {
                gsap.fromTo(
                    el,
                    { x: -80, opacity: 0, rotateY: -5 },
                    {
                        x: 0,
                        opacity: 1,
                        rotateY: 0,
                        duration: 0.8,
                        delay: i * 0.15,
                        ease: 'power3.out',
                        scrollTrigger: {
                            trigger: el,
                            start: 'top 88%',
                            toggleActions: 'play none none none',
                        },
                    }
                );
            });

            // Right stat cards fly in one by one from the right
            gsap.utils.toArray('.stat-card').forEach((el, i) => {
                gsap.fromTo(
                    el,
                    { x: 80, opacity: 0, scale: 0.85, rotateY: 5 },
                    {
                        x: 0,
                        opacity: 1,
                        scale: 1,
                        rotateY: 0,
                        duration: 0.7,
                        delay: i * 0.12,
                        ease: 'back.out(1.5)',
                        scrollTrigger: {
                            trigger: '.stats-container',
                            start: 'top 85%',
                            toggleActions: 'play none none none',
                        },
                    }
                );
            });

            // Stat counters trigger
            ScrollTrigger.create({
                trigger: '.stats-container',
                start: 'top 80%',
                onEnter: () => setInView(true),
            });
        }, sectionRef);

        return () => ctx.revert();
    }, []);

    return (
        <section id="about" ref={sectionRef} className="relative py-28 sm:py-36">
            <div className="section-divider mb-20" />

            <div className="max-w-6xl mx-auto px-6">
                {/* Section Header */}
                <div className="about-header mb-16">
                    <p className="text-primary-400 font-semibold text-sm uppercase tracking-widest mb-3">
                        Who I Am
                    </p>
                    <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white">
                        Background<span className="gradient-text">.</span>
                    </h2>
                    <p className="mt-4 text-slate-400 text-lg max-w-2xl leading-relaxed">
                        A deeper look at my academic journey, professional experience, and what drives me.
                    </p>
                </div>

                <div className="grid lg:grid-cols-2 gap-12 lg:gap-20">
                    {/* Left — Bio */}
                    <div className="space-y-8">
                        <div className="bio-block">
                            <h3 className="text-xl font-bold text-white flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 rounded-xl bg-primary-400/10 flex items-center justify-center">
                                    <Briefcase size={18} className="text-primary-400" />
                                </div>
                                The Journey
                            </h3>
                            <p className="text-slate-400 leading-relaxed">
                                I am a full-stack developer specializing in the{' '}
                                <span className="text-white font-medium">MERN stack</span> and real-time backend
                                architecture. I specialize in writing clean, scalable code and solving complex
                                performance bottlenecks for modern web platforms.
                            </p>
                        </div>

                        <div className="bio-block">
                            <p className="text-slate-400 leading-relaxed">
                                Recently selected as a{' '}
                                <span className="text-white font-medium">Web Development Intern at UptoSkills</span>,
                                I balance production builds with rigorous study of{' '}
                                <span className="text-white font-medium">Data Structures and Algorithms in C++</span>,
                                targeting <span className="text-primary-400 font-semibold">GATE 2027</span>.
                            </p>
                        </div>

                        <div className="bio-block glass-card p-6 !rounded-2xl">
                            <h3 className="text-lg font-bold text-white flex items-center gap-3 mb-3">
                                <div className="w-9 h-9 rounded-xl bg-purple-500/10 flex items-center justify-center">
                                    <GraduationCap size={17} className="text-purple-400" />
                                </div>
                                Education
                            </h3>
                            <p className="text-white font-semibold">B.Tech Computer Engineering</p>
                            <div className="flex items-center gap-2 mt-1 text-slate-400 text-sm">
                                <MapPin size={13} />
                                <span>NIAMT Ranchi (2024 – 2028)</span>
                            </div>
                            <div className="flex items-center gap-2 mt-1 text-slate-400 text-sm">
                                <Target size={13} />
                                <span>Current Semester: 5th</span>
                            </div>
                        </div>

                        <div className="bio-block">
                            <a
                                href={ProfilePdf}
                                download="Phulkeshwar_Mahto_Resume.pdf"
                                className="group inline-flex items-center gap-2.5 px-6 py-3 bg-white text-gray-900 font-bold text-sm rounded-lg hover:bg-primary-400 hover:text-white transition-all duration-300 hover:-translate-y-0.5 shadow-lg shadow-white/10 hover:shadow-primary-400/20"
                            >
                                <Download size={16} className="transition-transform group-hover:-translate-y-0.5" />
                                Download Resume
                            </a>
                        </div>
                    </div>

                    {/* Right — Stats */}
                    <div className="stats-container grid grid-cols-2 gap-5">
                        {stats.map((stat, i) => (
                            <div
                                key={i}
                                className="stat-card glass-card p-6 !rounded-2xl flex flex-col justify-center card-shine"
                            >
                                <div className="text-4xl sm:text-5xl font-black text-white mb-1 font-display">
                                    <AnimatedCounter
                                        target={stat.value}
                                        suffix={stat.suffix}
                                        isDecimal={stat.isDecimal}
                                        inView={inView}
                                    />
                                </div>
                                <p className="text-slate-400 text-sm font-medium">{stat.label}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default AboutSection;
