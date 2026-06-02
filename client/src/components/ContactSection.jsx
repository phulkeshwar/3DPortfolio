import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Mail, ArrowUpRight, Heart } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const socials = [
    {
        name: 'GitHub',
        url: 'https://github.com/phulkeshwar',
        icon: 'devicon-github-original',
    },
    {
        name: 'LinkedIn',
        url: 'https://linkedin.com/in/phulkeshwar',
        icon: 'devicon-linkedin-plain',
        iconColor: '#0077b5',
    },
    {
        name: 'LeetCode',
        url: 'https://leetcode.com/phulkeshwar',
        emoji: '⚡',
    },
    {
        name: 'Twitter / X',
        url: 'https://x.com/phulkeshwar2005',
        icon: 'devicon-twitter-original',
        iconColor: '#1DA1F2',
    },
];

const ContactSection = () => {
    const sectionRef = useRef(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.utils.toArray('.contact-reveal').forEach((el, i) => {
                gsap.fromTo(
                    el,
                    { y: 40, opacity: 0 },
                    {
                        y: 0,
                        opacity: 1,
                        duration: 0.7,
                        delay: i * 0.1,
                        ease: 'power3.out',
                        scrollTrigger: {
                            trigger: el,
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
        <section id="contact" ref={sectionRef} className="relative py-28 sm:py-36 pb-40 sm:pb-44">
            <div className="section-divider mb-20" />

            {/* Ambient glow */}
            <div className="ambient-orb w-[500px] h-[500px] bg-primary-500 bottom-0 right-0" />

            <div className="max-w-4xl mx-auto px-6">
                {/* Section Header */}
                <div className="contact-reveal text-center mb-12">
                    <p className="text-primary-400 font-semibold text-sm uppercase tracking-widest mb-3">
                        Let's Connect
                    </p>
                    <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white">
                        Get In Touch<span className="gradient-text">.</span>
                    </h2>
                    <p className="mt-4 text-slate-400 text-lg max-w-xl mx-auto leading-relaxed">
                        My inbox is always open. Whether you have a question, a project proposal, or just want to connect.
                    </p>
                </div>

                {/* CTA Card */}
                <div className="contact-reveal glass-card !rounded-3xl p-10 sm:p-14 text-center">
                    <h3 className="font-display text-2xl sm:text-3xl font-bold text-white mb-8">
                        Let's build something{' '}
                        <span className="gradient-text">exceptional</span>.
                    </h3>

                    <a
                        href="mailto:phulkeshwar.e@gmail.com"
                        className="group inline-flex items-center gap-3 px-8 py-4 bg-white text-gray-900 font-bold text-base rounded-xl hover:bg-primary-400 hover:text-white transition-all duration-300 hover:-translate-y-1 shadow-xl shadow-white/10 hover:shadow-primary-400/20"
                    >
                        <Mail size={18} />
                        Send an Email
                        <ArrowUpRight size={16} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </a>

                    {/* Social Links */}
                    <div className="flex flex-wrap justify-center gap-6 sm:gap-8 mt-10">
                        {socials.map((social, i) => (
                            <a
                                key={i}
                                href={social.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group flex items-center gap-2 text-slate-400 hover:text-primary-300 transition-all duration-300 font-medium text-sm"
                            >
                                {social.icon ? (
                                    <i
                                        className={`${social.icon} text-lg`}
                                        style={social.iconColor ? { color: social.iconColor } : undefined}
                                    />
                                ) : (
                                    <span className="text-base">{social.emoji}</span>
                                )}
                                {social.name}
                                <ArrowUpRight
                                    size={13}
                                    className="opacity-0 group-hover:opacity-100 transition-all duration-300 -translate-y-1 translate-x-1 group-hover:translate-y-0 group-hover:translate-x-0"
                                />
                            </a>
                        ))}
                    </div>
                </div>

                {/* Footer */}
                <div className="contact-reveal text-center mt-16 space-y-2">
                    <p className="text-slate-600 text-sm flex items-center justify-center gap-1.5">
                        Designed & Built with{' '}
                        <Heart size={13} className="text-red-500 fill-red-500" /> by Phulkeshwar Mahto
                    </p>
                    <p className="text-slate-700 text-xs">
                        © {new Date().getFullYear()} All Rights Reserved.
                    </p>
                </div>
            </div>
        </section>
    );
};

export default ContactSection;
