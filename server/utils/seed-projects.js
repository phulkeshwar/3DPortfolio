const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const Project = require('../models/Project');

const newProjects = [
    {
        title: 'GST Invoice Calculator',
        description: 'A high-performance financial utility for generating real-time GST-compliant invoices. Features instant multi-tier tax computations, dynamic invoice preview, and optimized client-side calculation pipelines.',
        techStack: ['React', 'Tailwind CSS', 'Vite'],
        githubLink: 'https://github.com/phulkeshwar/GSTcalculator',
        liveLink: 'https://gs-tcalculator.vercel.app'
    },
    {
        title: 'EMI Loan Calculator',
        description: 'Advanced amortization planner with interactive visualization. Computes reducing-balance loan interest, dynamic principal/interest breakdowns, and outputs real-time payment schedule tables.',
        techStack: ['React', 'Chart.js', 'Tailwind CSS', 'Vite'],
        githubLink: 'https://github.com/phulkeshwar/EMIcalculator',
        liveLink: 'https://emicalculator-vert.vercel.app'
    },
    {
        title: 'Resume Builder',
        description: 'Dynamic resume builder with real-time editing and PDF generation. Features dynamic single-page resume templates, custom theme customization, and client-side rendering capabilities.',
        techStack: ['React', 'CSS', 'HTML5 Canvas'],
        githubLink: 'https://github.com/phulkeshwar/ResumeBuilder',
        liveLink: 'https://resume-builder-fawn-two.vercel.app'
    },
    {
        title: 'JSON Formatter + Validator',
        description: 'A robust developer sandbox for parsing, validating, and beautifying complex JSON data. Built with real-time linting feedback, syntax error detection, and nested object collapsibility.',
        techStack: ['React', 'CSS', 'AST Parser'],
        githubLink: 'https://github.com/phulkeshwar/JSONformatter',
        liveLink: 'https://jso-nformatter-ebon.vercel.app'
    },
    {
        title: 'Password Generator',
        description: 'Cryptographically secure string utility for credential generation. Implemented dynamic entropy calculations, custom constraint filtering (alphanumeric, symbols), and clipboard API integration.',
        techStack: ['React', 'JS Crypto API', 'Tailwind CSS'],
        githubLink: 'https://github.com/phulkeshwar/PasswordGenerator',
        liveLink: 'https://password-generator-tau-sooty.vercel.app'
    }
];

async function seed() {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB.');

        for (const proj of newProjects) {
            const exists = await Project.findOne({ title: proj.title });
            if (!exists) {
                await Project.create(proj);
                console.log(`✅ Seeded project: ${proj.title}`);
            } else {
                console.log(`ℹ️ Project already exists: ${proj.title}`);
            }
        }
        
        console.log('Database seeding complete.');
    } catch (e) {
        console.error('❌ Seeding error:', e);
    } finally {
        await mongoose.disconnect();
    }
}

seed();
