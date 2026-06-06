import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Mail, ArrowUpRight, Heart, Send, CheckCircle, AlertCircle, Sparkles } from 'lucide-react';

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

const getApiUrl = (path) => {
    if (import.meta.env.VITE_API_URL) return `${import.meta.env.VITE_API_URL}${path}`;
    if (typeof window !== 'undefined' && !window.location.hostname.includes('localhost')) {
        return `https://portfolio-backend-980z.onrender.com${path}`;
    }
    return path;
};

const ContactSection = () => {
    const sectionRef = useRef(null);
    const [formData, setFormData] = useState({ name: '', email: '', message: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isImproving, setIsImproving] = useState(false);
    const [status, setStatus] = useState({ type: '', text: '' }); // 'success', 'error'

    const handleImproveWithAI = async () => {
        if (!formData.message.trim()) {
            setStatus({ type: 'error', text: 'Please write a draft message first so Gemini can improve it!' });
            return;
        }
        if (formData.message.trim().length < 5) {
            setStatus({ type: 'error', text: 'Message draft must be at least 5 characters long for AI polishing.' });
            return;
        }
        setIsImproving(true);
        setStatus({ type: '', text: '' });
        try {
            const res = await fetch(getApiUrl('/api/ai/improve-message'), {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: formData.message }),
            });
            if (res.ok) {
                const data = await res.json();
                if (data.success && data.improvedMessage) {
                    setFormData(prev => ({ ...prev, message: data.improvedMessage }));
                    setStatus({ type: 'success', text: 'Polished your message into a professional report with Gemini AI!' });
                } else {
                    setStatus({ type: 'error', text: data.message || 'Failed to refine the message.' });
                }
            } else {
                setStatus({ type: 'error', text: 'AI service responded with an error. Please write manually!' });
            }
        } catch (error) {
            setStatus({ type: 'error', text: 'Gemini AI service offline or unreachable. Please write manually!' });
        } finally {
            setIsImproving(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
            setStatus({ type: 'error', text: 'Please fill in all fields before sending.' });
            return;
        }
        setIsSubmitting(true);
        setStatus({ type: '', text: '' });

        try {
            const response = await fetch(getApiUrl('/api/contact'), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                setStatus({ type: 'success', text: 'Thank you! Your message was delivered directly to my email.' });
                setFormData({ name: '', email: '', message: '' });
            } else {
                const errData = await response.json();
                setStatus({ type: 'error', text: errData.message || 'Failed to dispatch report. Please try again.' });
            }
        } catch (error) {
            setStatus({ type: 'error', text: 'Network connection issue. Feel free to use the direct email link below!' });
        } finally {
            setIsSubmitting(false);
        }
    };

    useEffect(() => {
        const ctx = gsap.context(() => {
            // Header flies up
            gsap.fromTo(
                '.contact-header',
                { y: 80, opacity: 0, scale: 0.95 },
                {
                    y: 0,
                    opacity: 1,
                    scale: 1,
                    duration: 1,
                    ease: 'power3.out',
                    scrollTrigger: {
                        trigger: '.contact-header',
                        start: 'top 85%',
                        toggleActions: 'play none none none',
                    },
                }
            );

            // CTA card zooms in with a bounce
            gsap.fromTo(
                '.contact-card',
                { y: 100, opacity: 0, scale: 0.95, rotateX: 5 },
                {
                    y: 0,
                    opacity: 1,
                    scale: 1,
                    rotateX: 0,
                    duration: 1.2,
                    ease: 'power3.out',
                    scrollTrigger: {
                        trigger: '.contact-card',
                        start: 'top 88%',
                        toggleActions: 'play none none none',
                    },
                }
            );

            // Social links stagger in
            gsap.utils.toArray('.social-link-item').forEach((link, i) => {
                gsap.fromTo(
                    link,
                    { y: 30, opacity: 0 },
                    {
                        y: 0,
                        opacity: 1,
                        duration: 0.5,
                        delay: 0.3 + i * 0.1,
                        ease: 'power3.out',
                        scrollTrigger: {
                            trigger: '.contact-card',
                            start: 'top 80%',
                            toggleActions: 'play none none none',
                        },
                    }
                );
            });

            // Footer fades up
            gsap.fromTo(
                '.contact-footer',
                { y: 20, opacity: 0 },
                {
                    y: 0,
                    opacity: 1,
                    duration: 0.6,
                    ease: 'power3.out',
                    scrollTrigger: {
                        trigger: '.contact-footer',
                        start: 'top 95%',
                        toggleActions: 'play none none none',
                    },
                }
            );
        }, sectionRef);

        return () => ctx.revert();
    }, []);

    return (
        <section id="contact" ref={sectionRef} className="relative py-28 sm:py-36 pb-40 sm:pb-44">
            <div className="section-divider mb-20" />

            <div className="max-w-2xl mx-auto px-6">
                {/* Section Header */}
                <div className="contact-header text-center mb-12">
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

                {/* Direct Contact Form Card */}
                <div className="contact-card glass-card !rounded-3xl p-8 sm:p-12 text-left" style={{ perspective: '1000px' }}>
                    <div className="text-center mb-10">
                        <h3 className="font-display text-2xl sm:text-3xl font-bold text-white mb-3">
                            Let's build something <span className="gradient-text">exceptional</span>.
                        </h3>
                        <p className="text-slate-400 text-sm">
                            Submit a message directly to my personal email inbox.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl mx-auto">
                        {/* Status notification */}
                        {status.text && (
                            <div className={`p-4 rounded-xl flex items-start gap-3 border text-sm transition-all duration-300 ${
                                status.type === 'success'
                                    ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                                    : 'bg-rose-500/10 border-rose-500/30 text-rose-400'
                            }`}>
                                {status.type === 'success' ? (
                                    <CheckCircle size={18} className="shrink-0 mt-0.5" />
                                ) : (
                                    <AlertCircle size={18} className="shrink-0 mt-0.5" />
                                )}
                                <span>{status.text}</span>
                            </div>
                        )}

                        <div className="grid sm:grid-cols-2 gap-6">
                            {/* Name input */}
                            <div className="space-y-2">
                                <label htmlFor="name" className="text-xs font-mono font-semibold uppercase tracking-wider text-slate-400">
                                    Full Name
                                </label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    required
                                    disabled={isSubmitting}
                                    placeholder="Your Name"
                                    className="w-full px-4 py-3 rounded-xl bg-slate-950/40 border border-slate-800 focus:border-primary-400 focus:ring-1 focus:ring-primary-400 focus:outline-none text-white text-sm transition placeholder:text-slate-600"
                                />
                            </div>

                            {/* Email input */}
                            <div className="space-y-2">
                                <label htmlFor="email" className="text-xs font-mono font-semibold uppercase tracking-wider text-slate-400">
                                    Email Address
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    required
                                    disabled={isSubmitting}
                                    placeholder="your@email.com"
                                    className="w-full px-4 py-3 rounded-xl bg-slate-950/40 border border-slate-800 focus:border-primary-400 focus:ring-1 focus:ring-primary-400 focus:outline-none text-white text-sm transition placeholder:text-slate-600"
                                />
                            </div>
                        </div>

                        {/* Message input */}
                        <div className="space-y-2">
                            <div className="flex justify-between items-center">
                                <label htmlFor="message" className="text-xs font-mono font-semibold uppercase tracking-wider text-slate-400">
                                    Message
                                </label>
                                <button
                                    type="button"
                                    onClick={handleImproveWithAI}
                                    disabled={isSubmitting || isImproving || !formData.message.trim()}
                                    className="text-xs font-mono font-semibold text-primary-400 hover:text-primary-300 transition-colors flex items-center gap-1.5 disabled:opacity-40 disabled:hover:text-primary-400"
                                >
                                    <Sparkles size={13} className={isImproving ? 'animate-spin' : ''} />
                                    {isImproving ? 'Polishing Draft...' : '✨ Polish with Gemini'}
                                </button>
                            </div>
                            <textarea
                                id="message"
                                name="message"
                                value={formData.message}
                                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                required
                                disabled={isSubmitting}
                                rows="5"
                                placeholder="Type your message here... Use 'Polish with Gemini' to draft a professional version before sending."
                                className="w-full px-4 py-3 rounded-xl bg-slate-950/40 border border-slate-800 focus:border-primary-400 focus:ring-1 focus:ring-primary-400 focus:outline-none text-white text-sm transition placeholder:text-slate-600 resize-none leading-relaxed"
                            />
                        </div>

                        {/* Actions */}
                        <div className="flex flex-col sm:flex-row items-center gap-4 pt-2">
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full sm:w-auto group inline-flex items-center justify-center gap-2.5 px-8 py-4 bg-white text-gray-900 font-bold text-sm rounded-xl hover:bg-primary-400 hover:text-white transition-all duration-300 hover:-translate-y-0.5 shadow-xl shadow-white/5 hover:shadow-primary-400/20 disabled:opacity-50 disabled:pointer-events-none"
                            >
                                <Send size={15} />
                                {isSubmitting ? 'Sending Message...' : 'Send Message'}
                            </button>

                            <a
                                href="mailto:phulkeshwar.e@gmail.com"
                                className="text-xs font-mono text-slate-500 hover:text-slate-300 transition-colors text-center py-2 underline underline-offset-4 decoration-slate-800 hover:decoration-slate-500"
                            >
                                Or email directly: phulkeshwar.e@gmail.com
                            </a>
                        </div>
                    </form>

                    {/* Social Links */}
                    <div className="flex flex-wrap justify-center gap-6 sm:gap-8 mt-12 pt-10 border-t border-slate-900">
                        {socials.map((social, i) => (
                            <a
                                key={i}
                                href={social.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="social-link-item group flex items-center gap-2 text-slate-400 hover:text-primary-300 transition-all duration-300 font-medium text-xs sm:text-sm"
                            >
                                {social.icon ? (
                                    <i
                                        className={`${social.icon} text-base sm:text-lg`}
                                        style={social.iconColor ? { color: social.iconColor } : undefined}
                                    />
                                ) : (
                                    <span className="text-sm sm:text-base">{social.emoji}</span>
                                )}
                                {social.name}
                                <ArrowUpRight
                                    size={12}
                                    className="opacity-0 group-hover:opacity-100 transition-all duration-300 -translate-y-1 translate-x-1 group-hover:translate-y-0 group-hover:translate-x-0"
                                />
                            </a>
                        ))}
                    </div>
                </div>

                {/* Footer */}
                <div className="contact-footer text-center mt-16 space-y-2">
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
