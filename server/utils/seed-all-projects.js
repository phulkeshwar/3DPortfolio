const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const Project = require('../models/Project');

const newProjects = [
    {
        title: 'GramBazaar',
        description: 'Full-stack enterprise e-commerce build. Features complex Mongoose data modeling for product catalogs, secure cart sessions, stateful order tracking, and a seller management dashboard.',
        techStack: ['MongoDB', 'Express', 'React', 'Node'],
        githubLink: 'https://github.com/phulkeshwar/GramBazaar',
        liveLink: 'https://garambazaar.vercel.app/'
    },
    {
        title: 'Call.io',
        description: 'Real-time anonymous WebRTC video calling architecture. Solved critical N² signaling bottlenecks utilizing debounced presence broadcasting and a scalable Redis pub/sub adapter.',
        techStack: ['WebRTC', 'Redis', 'Socket.io', 'Node'],
        githubLink: 'https://github.com/phulkeshwar/Call.io',
        liveLink: 'https://callrandom.vercel.app/'
    },
    {
        title: 'MedScribe AI',
        description: 'Clinical assistant platform. Engineered a Doctor Mode for automated SOAP notes and Patient Mode for OCR prescription analysis utilizing Google\'s Gemma 4 27B model.',
        techStack: ['MERN', 'Gemma 4 API', 'Google AI Studio'],
        githubLink: 'https://github.com/phulkeshwar/MedScribe-AI',
        liveLink: 'https://medscribe-ai-ruby.vercel.app/'
    },
    {
        title: 'NIAMT Racing',
        description: 'Developed the official web presence for the university Formula Student team. Optimized for strict SEO standards, served via Cloudinary CDN, with a custom backend hosted on Railway.',
        techStack: ['React', 'Node.js', 'Cloudinary', 'Vercel'],
        githubLink: 'https://github.com/phulkeshwar/niamt-racing',
        liveLink: 'https://niamtracing.vercel.app/'
    },
    {
        title: 'Striver DSA Tracker',
        description: 'A comprehensive progress tracking matrix for mastering Data Structures and Algorithms. Features organized problem sets, stateful progress tracking, and optimized search/filter utilities.',
        techStack: ['React', 'Tailwind CSS', 'LocalStorage'],
        githubLink: 'https://github.com/phulkeshwar/DSATracker',
        liveLink: 'https://striverdsatracker.vercel.app/'
    },
    {
        title: 'Business Portfolio',
        description: 'A highly tailored professional landing page showcasing corporate services, team profiles, and client case studies with interactive layout transitions.',
        techStack: ['React', 'Tailwind CSS', 'Vite'],
        githubLink: 'https://github.com/phulkeshwar/bussiness-portfolio-one',
        liveLink: 'https://bussiness-portfolio-one.vercel.app/'
    },
    {
        title: 'VolunteerSync',
        description: 'NGO volunteer coordination matrix. Features live interactive map tracking (Leaflet.js) and intelligent task delegation powered by Gemini API, synced entirely via WebSockets.',
        techStack: ['Socket.io', 'Gemini API', 'Leaflet.js'],
        githubLink: 'https://github.com/phulkeshwar/VolunteerSync',
        liveLink: 'https://volunteersync.vercel.app/'
    },
    {
        title: 'PeekPost',
        description: 'Scalable instagram clone handling complex relational data. Implemented a strict Mongoose schema to manage infinite-scroll feeds, nested comments, and bidirectional follow graphs.',
        techStack: ['React', 'Node', 'Mongoose', 'MongoDB'],
        githubLink: 'https://github.com/phulkeshwar/PeekPost',
        liveLink: 'https://peek-post2.vercel.app/'
    },
    {
        title: 'Media Extractor Pro',
        description: 'A streamlined media extraction utility. Features instant video/audio stream processing, parsing of remote links, and rapid download pipelines.',
        techStack: ['React', 'Node.js', 'Express', 'Axios'],
        githubLink: 'https://github.com/phulkeshwar/MediaExtractorPro',
        liveLink: 'https://mediaextractorpro.vercel.app/'
    },
    {
        title: 'Focus Logger',
        description: 'Interactive productivity tracker and session logger. Developed for goal-oriented scheduling, dynamic task duration logs, and daily execution metrics.',
        techStack: ['React', 'Tailwind CSS', 'Vite'],
        githubLink: 'https://github.com/phulkeshwar/FocusLogger',
        liveLink: 'https://focuslogger.vercel.app/'
    },
    {
        title: 'LinkedIn Job Description Saver',
        description: 'Lightweight utility tool to organize, bookmark, and save LinkedIn job postings and descriptions. Built for seamless job application tracking and indexing.',
        techStack: ['React', 'LocalStorage', 'Tailwind CSS'],
        githubLink: 'https://github.com/phulkeshwar/LinkedInJobDescriptionSaver',
        liveLink: 'https://linkedinjobdescriptionsaver.vercel.app/'
    },
    {
        title: '3D Portfolio',
        description: 'The previous iterations and core designs of my interactive 3D developer showcase, built to highlight custom WebGL/Three.js assets.',
        techStack: ['Three.js', 'React Three Fiber', 'GSAP'],
        githubLink: 'https://github.com/phulkeshwar/MyPortfolio',
        liveLink: 'https://phulkeshwar.vercel.app/'
    },
    {
        title: 'GST Invoice Calculator',
        description: 'A high-performance financial utility for generating real-time GST-compliant invoices. Features instant multi-tier tax computations, dynamic invoice preview, and optimized client-side calculation pipelines.',
        techStack: ['React', 'Tailwind CSS', 'Vite'],
        githubLink: 'https://github.com/phulkeshwar/GSTcalculator',
        liveLink: 'https://gs-tcalculator.vercel.app/'
    },
    {
        title: 'EMI Loan Calculator',
        description: 'Advanced amortization planner with interactive visualization. Computes reducing-balance loan interest, dynamic principal/interest breakdowns, and outputs real-time payment schedule tables.',
        techStack: ['React', 'Chart.js', 'Tailwind CSS', 'Vite'],
        githubLink: 'https://github.com/phulkeshwar/EMIcalculator',
        liveLink: 'https://emicalculator-vert.vercel.app/'
    },
    {
        title: 'Resume Builder',
        description: 'Dynamic resume builder with real-time editing and PDF generation. Features dynamic single-page resume templates, custom theme customization, and client-side rendering capabilities.',
        techStack: ['React', 'CSS', 'HTML5 Canvas'],
        githubLink: 'https://github.com/phulkeshwar/ResumeBuilder',
        liveLink: 'https://resume-builder-fawn-two.vercel.app/'
    },
    {
        title: 'JSON Formatter + Validator',
        description: 'A robust developer sandbox for parsing, validating, and beautifying complex JSON data. Built with real-time linting feedback, syntax error detection, and nested object collapsibility.',
        techStack: ['React', 'CSS', 'AST Parser'],
        githubLink: 'https://github.com/phulkeshwar/JSONformatter',
        liveLink: 'https://jso-nformatter-ebon.vercel.app/'
    },
    {
        title: 'Password Generator',
        description: 'Cryptographically secure string utility for credential generation. Implemented dynamic entropy calculations, custom constraint filtering (alphanumeric, symbols), and clipboard API integration.',
        techStack: ['React', 'JS Crypto API', 'Tailwind CSS'],
        githubLink: 'https://github.com/phulkeshwar/PasswordGenerator',
        liveLink: 'https://password-generator-tau-sooty.vercel.app/'
    }
];

async function seed() {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB.');

        // First clean the projects collection to avoid duplicates or old formats
        console.log('Cleaning existing projects collection...');
        await Project.deleteMany({});
        console.log('Collection cleared.');

        for (const proj of newProjects) {
            await Project.create(proj);
            console.log(`✅ Seeded project: ${proj.title}`);
        }
        
        console.log('Database seeding complete.');
    } catch (e) {
        console.error('❌ Seeding error:', e);
    } finally {
        await mongoose.disconnect();
    }
}

seed();
