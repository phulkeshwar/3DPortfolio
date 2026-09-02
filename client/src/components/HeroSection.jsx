import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ArrowDown, Sparkles } from 'lucide-react';
import profilePic from '../assets/me.jpg';

const HeroSection = () => {
    const sectionRef = useRef(null);
    const titleRef = useRef(null);
    const subtitleRef = useRef(null);
    const imageRef = useRef(null);
    const ctaRef = useRef(null);
    const scrollRef = useRef(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            const tl = gsap.timeline({ defaults: { ease: 'power4.out' } });

            tl.fromTo(
                imageRef.current,
                { scale: 0.8, opacity: 0 },
                { scale: 1, opacity: 1, duration: 1.2 }
            )
            .fromTo(
                titleRef.current?.children || [],
                { y: 80, opacity: 0 },
                { y: 0, opacity: 1, duration: 1, stagger: 0.15 },
                '-=0.8'
            )
            .fromTo(
                subtitleRef.current,
                { y: 30, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.8 },
                '-=0.5'
            )
            .fromTo(
                ctaRef.current,
                { y: 20, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.6 },
                '-=0.3'
            )
            .fromTo(
                scrollRef.current,
                { y: -10, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.5, repeat: -1, yoyo: true },
                '-=0.2'
            );
        }, sectionRef);

        return () => ctx.revert();
    }, []);

    return (
        <section
            id="hero"
            ref={sectionRef}
            className="min-h-screen flex items-center justify-center relative overflow-hidden"
        >
            {/* Ambient Glow Orbs */}
            <div className="ambient-orb w-[500px] h-[500px] bg-primary-400 -top-40 -left-40" />
            <div className="ambient-orb w-[400px] h-[400px] bg-purple-500 -bottom-32 -right-32" style={{ animationDelay: '3s' }} />

            <div className="max-w-6xl mx-auto px-6 py-20 w-full">
                <div className="flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-20">
                    {/* Left Content */}
                    <div className="flex-1 text-center lg:text-left order-2 lg:order-1">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary-400/30 bg-primary-400/5 mb-6">
                            <Sparkles size={14} className="text-primary-400" />
                            <span className="text-xs font-semibold text-primary-400 uppercase tracking-widest">
                                Available for Opportunities
                            </span>
                        </div>

                        <div ref={titleRef} className="overflow-hidden">
                            <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl font-black leading-[1.05] tracking-tight">
                                <span className="block text-white">Software</span>
                                <span className="block text-white">Engineer<span className="gradient-text">.</span></span>
                                <span className="block text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-400 mt-2">
                                    MERN Specialist
                                </span>
                            </h1>
                        </div>

                        <p ref={subtitleRef} className="mt-6 text-base sm:text-lg text-slate-400 max-w-xl leading-relaxed mx-auto lg:mx-0">
                            I engineer high-performance, real-time web applications and scalable
                            data architectures. Currently pursuing B.Tech Computer Engineering &
                            building production-grade solutions.
                        </p>

                        <div ref={ctaRef} className="flex flex-wrap items-center gap-4 mt-8 justify-center lg:justify-start">
                            <a
                                href="#projects"
                                className="group inline-flex items-center gap-2 px-7 py-3.5 bg-white text-gray-900 font-bold text-sm rounded-lg hover:bg-primary-400 hover:text-white transition-all duration-300 hover:-translate-y-0.5 shadow-lg shadow-white/10 hover:shadow-primary-400/20"
                            >
                                View Projects
                                <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                </svg>
                            </a>
                            <a
                                href="#contact"
                                className="inline-flex items-center gap-2 px-7 py-3.5 border border-slate-600 text-slate-300 font-semibold text-sm rounded-lg hover:border-primary-400 hover:text-primary-400 transition-all duration-300 hover:-translate-y-0.5"
                            >
                                Get In Touch
                            </a>
                        </div>
                    </div>

                    {/* Right — Profile Image */}
                    <div ref={imageRef} className="flex-shrink-0 order-1 lg:order-2">
                        <div className="relative">
                            {/* Glowing ring */}
                            <div className="profile-glow w-56 h-56 sm:w-64 sm:h-64 lg:w-72 lg:h-72 rounded-full">
                                <img
                                    src={profilePic}
                                    alt="Phulkeshwar Mahto"
                                    className="w-full h-full rounded-full object-cover border-4 border-surface-dark"
                                />
                            </div>

                            {/* Floating badge */}
                            <div className="absolute -bottom-3 -right-3 glass-card px-4 py-2 rounded-xl flex items-center gap-2">
                                <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                                <span className="text-xs font-semibold text-slate-300">Open to work</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Scroll indicator */}
                <div ref={scrollRef} className="flex flex-col items-center mt-16 lg:mt-24 gap-2">
                    <span className="text-xs text-slate-500 uppercase tracking-widest">Scroll Down</span>
                    <ArrowDown size={18} className="text-primary-400 animate-bounce" />
                </div>
            </div>
        </section>
    );
};

export default HeroSection;
