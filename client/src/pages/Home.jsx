import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import profilePic from '../assets/me.jpg'; 

const Home = () => {
    const [featuredProjects, setFeaturedProjects] = useState([]);

    // Dummy data for visual development if API fails or is empty
    const dummyProjects = [
        {
            _id: '1',
            title: 'Project Name 1',
            description: 'I created this personal project in order to show how to create an interface in Figma using a portfolio as an example.',
            image: null // Will use placeholder
        },
        {
            _id: '2',
            title: 'Project Name 2',
            description: 'What was your role, your deliverables, if the project was personal, freelancing.',
            image: null
        },
        {
            _id: '3',
            title: 'Project Name 3',
            description: 'You can also add in this description the type of the project, if it was for web, mobile, electron.',
            image: null
        }
    ];

    useEffect(() => {
        // ideally fetch from API, using dummy for now to match design strictly first
        setFeaturedProjects(dummyProjects);
    }, []);

    return (
        <div className="min-h-screen font-sans">
            {/* Hero Section */}
            <div className="max-w-7xl mx-auto px-6 py-12 md:py-24 flex flex-col-reverse md:flex-row items-center justify-between">
                {/* Left Content */}
                <div className="w-full md:w-1/2 mt-8 md:mt-0 space-y-6">
                    <p className="text-amber-500 font-bold tracking-wider uppercase text-sm">Full Stack Developer</p>
                    <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white leading-tight">
                        Hello, my name <br />
                        is <span className="relative z-10">Phulkeshwar Mahto</span>
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400 text-lg md:text-xl max-w-lg leading-relaxed">
                        Short text with details about you, what you do or your professional career. You can add more information on the about page.
                    </p>
                    <div className="flex space-x-4 pt-4">
                        <Link to="/projects" className="px-8 py-3 bg-amber-400 text-gray-900 font-bold rounded-lg hover:bg-amber-500 transition shadow-md">
                            Projects
                        </Link>
                        <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="px-8 py-3 border-2 border-gray-900 dark:border-white text-gray-900 dark:text-white font-bold rounded-lg hover:bg-gray-100 dark:hover:bg-neutral-800 transition">
                            LinkedIn
                        </a>
                    </div>
                </div>

                {/* Right Image */}
                <div className="w-full md:w-1/2 flex justify-center relative">
                    {/* Add abstract background blob here using CSS or SVG */}
                    <div className="absolute top-0 right-10 w-96 h-96 bg-amber-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
                    <img
                        src={profilePic}
                        alt="Profile"
                        className="relative z-10 w-3/4 md:w-full max-w-md rounded-br-[100px] object-cover shadow-2xl"
                    />
                </div>
            </div>
        </div>
    );
};

export default Home;
