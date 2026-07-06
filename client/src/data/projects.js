import { 
    ShoppingCart, Video, Trophy, Zap, Award, Briefcase, Users, Globe, 
    Download, BookOpen, Lock, Sparkles, Calculator, Percent, Code, Key 
} from 'lucide-react';

export const staticProjects = [
    {
        title: 'GramBazaar',
        description:
            'Full-stack enterprise e-commerce build. Features complex Mongoose data modeling for product catalogs, secure cart sessions, stateful order tracking, and a seller management dashboard.',
        tech: ['MongoDB', 'Express', 'React', 'Node'],
        icon: ShoppingCart,
        accent: 'from-violet-400 to-purple-500',
        accentBorder: 'group-hover:border-violet-400/40',
        githubLink: 'https://github.com/phulkeshwar/GramBazaar',
        liveLink: 'https://garambazaar.vercel.app/',
        category: 'Full-Stack'
    },
    {
        title: 'Call.io',
        description:
            'Real-time anonymous WebRTC video calling architecture. Solved critical N² signaling bottlenecks utilizing debounced presence broadcasting and a scalable Redis pub/sub adapter.',
        tech: ['WebRTC', 'Redis', 'Socket.io', 'Node'],
        icon: Video,
        accent: 'from-cyan-500 to-blue-600',
        accentBorder: 'group-hover:border-cyan-400/40',
        githubLink: 'https://github.com/phulkeshwar/Call.io',
        liveLink: 'https://callrandom.vercel.app/',
        category: 'Full-Stack'
    },
    {
        title: 'MedScribe AI',
        description:
            "Clinical assistant platform. Engineered a Doctor Mode for automated SOAP notes and Patient Mode for OCR prescription analysis utilizing Google's Gemma 4 27B model.",
        tech: ['MERN', 'Gemma 4 API', 'Google AI Studio'],
        icon: Trophy,
        accent: 'from-amber-400 to-orange-500',
        accentBorder: 'group-hover:border-amber-400/40',
        githubLink: 'https://github.com/phulkeshwar/MedScribe-AI',
        liveLink: 'https://medscribe-ai-ruby.vercel.app/',
        category: 'Full-Stack'
    },
    {
        title: 'NIAMT Racing',
        description:
            'Developed the official web presence for the university Formula Student team. Optimized for strict SEO standards, served via Cloudinary CDN, with a custom backend hosted on Railway.',
        tech: ['React', 'Node.js', 'Cloudinary', 'Vercel'],
        icon: Zap,
        accent: 'from-red-400 to-pink-500',
        accentBorder: 'group-hover:border-red-400/40',
        githubLink: 'https://github.com/phulkeshwar/niamt-racing',
        liveLink: 'https://niamtracing.vercel.app/',
        category: 'React'
    },
    {
        title: 'Striver DSA Tracker',
        description:
            'A comprehensive progress tracking matrix for mastering Data Structures and Algorithms. Features organized problem sets, stateful progress tracking, and optimized search/filter utilities.',
        tech: ['React', 'Tailwind CSS', 'LocalStorage'],
        icon: Award,
        accent: 'from-emerald-400 to-teal-500',
        accentBorder: 'group-hover:border-emerald-400/40',
        githubLink: 'https://github.com/phulkeshwar/DSATracker',
        liveLink: 'https://striverdsatracker.vercel.app/',
        category: 'React'
    },
    // {
    //     title: 'Business Portfolio',
    //     description:
    //         'A highly tailored professional landing page showcasing corporate services, team profiles, and client case studies with interactive layout transitions.',
    //     tech: ['React', 'Tailwind CSS', 'Vite'],
    //     icon: Briefcase,
    //     accent: 'from-sky-400 to-indigo-500',
    //     accentBorder: 'group-hover:border-sky-400/40',
    //     githubLink: 'https://github.com/phulkeshwar/bussiness-portfolio-one',
    //     liveLink: 'https://bussiness-portfolio-one.vercel.app/',
    //     category: 'React'
    // },
    {
        title: 'VolunteerSync',
        description:
            'NGO volunteer coordination matrix. Features live interactive map tracking (Leaflet.js) and intelligent task delegation powered by Gemini API, synced entirely via WebSockets.',
        tech: ['Socket.io', 'Gemini API', 'Leaflet.js'],
        icon: Users,
        accent: 'from-teal-400 to-emerald-500',
        accentBorder: 'group-hover:border-teal-400/40',
        githubLink: 'https://github.com/phulkeshwar/VolunteerSync',
        liveLink: 'https://volunteersync.vercel.app/',
        category: 'Full-Stack'
    },
    {
        title: 'PeekPost',
        description:
            'Scalable instagram clone handling complex relational data. Implemented a strict Mongoose schema to manage infinite-scroll feeds, nested comments, and bidirectional follow graphs.',
        tech: ['React', 'Node', 'Mongoose', 'MongoDB'],
        icon: Globe,
        accent: 'from-sky-400 to-indigo-500',
        accentBorder: 'group-hover:border-sky-400/40',
        githubLink: 'https://github.com/phulkeshwar/PeekPost',
        liveLink: 'https://peek-post2.vercel.app/',
        category: 'Full-Stack'
    },
    {
        title: 'Media Extractor Pro',
        description:
            'A streamlined media extraction utility. Features instant video/audio stream processing, parsing of remote links, and rapid download pipelines.',
        tech: ['React', 'Node.js', 'Express', 'Axios'],
        icon: Download,
        accent: 'from-pink-400 to-red-500',
        accentBorder: 'group-hover:border-pink-400/40',
        githubLink: 'https://github.com/phulkeshwar/MediaExtractorPro',
        liveLink: 'https://mediaextractorpro.vercel.app/',
        category: 'Utilities'
    },
    {
        title: 'Focus Logger',
        description:
            'Interactive productivity tracker and session logger. Developed for goal-oriented scheduling, dynamic task duration logs, and daily execution metrics.',
        tech: ['React', 'Tailwind CSS', 'Vite'],
        icon: BookOpen,
        accent: 'from-cyan-400 to-blue-500',
        accentBorder: 'group-hover:border-cyan-400/40',
        githubLink: 'https://github.com/phulkeshwar/FocusLogger',
        liveLink: 'https://focuslogger.vercel.app/',
        category: 'Utilities'
    },
    {
        title: 'LinkedIn Job Description Saver',
        description:
            'Lightweight utility tool to organize, bookmark, and save LinkedIn job postings and descriptions. Built for seamless job application tracking and indexing.',
        tech: ['React', 'LocalStorage', 'Tailwind CSS'],
        icon: Lock,
        accent: 'from-violet-400 to-purple-500',
        accentBorder: 'group-hover:border-violet-400/40',
        githubLink: 'https://github.com/phulkeshwar/LinkedInJobDescriptionSaver',
        liveLink: 'https://linkedinjobdescriptionsaver.vercel.app/',
        category: 'Utilities'
    },
    {
        title: '3D Portfolio',
        description:
            'The previous iterations and core designs of my interactive 3D developer showcase, built to highlight custom WebGL/Three.js assets.',
        tech: ['Three.js', 'React Three Fiber', 'GSAP'],
        icon: Sparkles,
        accent: 'from-amber-400 to-orange-500',
        accentBorder: 'group-hover:border-amber-400/40',
        githubLink: 'https://github.com/phulkeshwar/MyPortfolio',
        liveLink: 'https://phulkeshwar.vercel.app/',
        category: 'React'
    },
    {
        title: 'GST Invoice Calculator',
        description:
            'A high-performance financial utility for generating real-time GST-compliant invoices. Features instant multi-tier tax computations, dynamic invoice preview, and optimized client-side calculation pipelines.',
        tech: ['React', 'Tailwind CSS', 'Vite'],
        icon: Calculator,
        accent: 'from-cyan-400 to-blue-500',
        accentBorder: 'group-hover:border-cyan-400/40',
        githubLink: 'https://github.com/phulkeshwar/GSTcalculator',
        liveLink: 'https://gs-tcalculator.vercel.app/',
        category: 'Calculators'
    },
    {
        title: 'EMI Loan Calculator',
        description:
            'Advanced amortization planner with interactive visualization. Computes reducing-balance loan interest, dynamic principal/interest breakdowns, and outputs real-time payment schedule tables.',
        tech: ['React', 'Chart.js', 'Tailwind CSS', 'Vite'],
        icon: Percent,
        accent: 'from-emerald-400 to-teal-500',
        accentBorder: 'group-hover:border-emerald-400/40',
        githubLink: 'https://github.com/phulkeshwar/EMIcalculator',
        liveLink: 'https://emicalculator-vert.vercel.app/',
        category: 'Calculators'
    },
    {
        title: 'Resume Builder',
        description:
            'Dynamic resume builder with real-time editing and PDF generation. Features dynamic single-page resume templates, custom theme customization, and client-side rendering capabilities.',
        tech: ['React', 'CSS', 'HTML5 Canvas'],
        icon: Briefcase,
        accent: 'from-amber-400 to-orange-500',
        accentBorder: 'group-hover:border-amber-400/40',
        githubLink: 'https://github.com/phulkeshwar/ResumeBuilder',
        liveLink: 'https://resume-builder-fawn-two.vercel.app/',
        category: 'Utilities'
    },
    {
        title: 'JSON Formatter + Validator',
        description:
            'A robust developer sandbox for parsing, validating, and beautifying complex JSON data. Built with real-time linting feedback, syntax error detection, and nested object collapsibility.',
        tech: ['React', 'CSS', 'AST Parser'],
        icon: Code,
        accent: 'from-violet-400 to-purple-500',
        accentBorder: 'group-hover:border-violet-400/40',
        githubLink: 'https://github.com/phulkeshwar/JSONformatter',
        liveLink: 'https://jso-nformatter-ebon.vercel.app/',
        category: 'Utilities'
    },
    {
        title: 'Password Generator',
        description:
            'Cryptographically secure string utility for credential generation. Implemented dynamic entropy calculations, custom constraint filtering (alphanumeric, symbols), and clipboard API integration.',
        tech: ['React', 'JS Crypto API', 'Tailwind CSS'],
        icon: Key,
        accent: 'from-red-400 to-pink-500',
        accentBorder: 'group-hover:border-red-400/40',
        githubLink: 'https://github.com/phulkeshwar/PasswordGenerator',
        liveLink: 'https://password-generator-tau-sooty.vercel.app/',
        category: 'Utilities'
    },
];
