import { useEffect, useRef, useState } from 'react';
import { Home, User, Code2, FolderKanban, Mail } from 'lucide-react';

const navItems = [
    { id: 'hero', label: 'Home', icon: Home },
    { id: 'about', label: 'About', icon: User },
    { id: 'expertise', label: 'Skills', icon: Code2 },
    { id: 'projects', label: 'Projects', icon: FolderKanban },
    { id: 'contact', label: 'Contact', icon: Mail },
];

const SideNav = () => {
    const [activeSection, setActiveSection] = useState('hero');

    useEffect(() => {
        const handleScroll = () => {
            const sections = navItems.map(item => document.getElementById(item.id));
            const scrollPos = window.scrollY + window.innerHeight / 3;

            for (let i = sections.length - 1; i >= 0; i--) {
                if (sections[i] && sections[i].offsetTop <= scrollPos) {
                    setActiveSection(navItems[i].id);
                    break;
                }
            }
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const scrollTo = (id) => {
        const el = document.getElementById(id);
        if (el) {
            el.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <nav
            className="side-nav-container fixed right-6 top-1/2 -translate-y-1/2 flex flex-col items-center gap-6 z-50 px-3 py-8 rounded-[50px]"
            style={{
                background: 'rgba(2, 6, 23, 0.5)',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                border: '1px solid rgba(51, 65, 85, 0.4)',
                boxShadow: '0 12px 40px rgba(0, 0, 0, 0.4)',
            }}
        >
            {/* Logo */}
            <a
                href="#hero"
                id="sidenav-logo"
                onClick={(e) => {
                    e.preventDefault();
                    scrollTo('hero');
                }}
                className="nav-logo-text font-display font-extrabold text-sm text-white tracking-widest mb-2"
                style={{ writingMode: 'vertical-lr' }}
            >
                PM.
            </a>

            {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeSection === item.id;
                return (
                    <a
                        key={item.id}
                        href={`#${item.id}`}
                        id={`sidenav-link-${item.id}`}
                        onClick={(e) => {
                            e.preventDefault();
                            scrollTo(item.id);
                        }}
                        className={`flex flex-col items-center gap-1.5 transition-all duration-300 group cursor-pointer ${
                            isActive ? 'text-primary-400' : 'text-slate-500 hover:text-primary-300'
                        }`}
                    >
                        <Icon
                            size={18}
                            strokeWidth={isActive ? 2.5 : 1.8}
                            className="transition-transform duration-300 group-hover:scale-110"
                        />
                        <span
                            className="nav-label text-[0.6rem] font-semibold uppercase tracking-[0.12em]"
                            style={{ writingMode: 'vertical-lr' }}
                        >
                            {item.label}
                        </span>
                    </a>
                );
            })}
        </nav>
    );
};

export default SideNav;
