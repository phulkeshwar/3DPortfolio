import profilePic from '../assets/me2.jpg';
import PhulkeshwarResume from '../assets/PhulkeshwarResume.pdf';

const About = () => {
    return (
        <div className="min-h-screen font-sans">
            <div className="max-w-6xl mx-auto px-6 py-20 flex flex-col-reverse md:flex-row items-center gap-16">
                <div className="w-full md:w-1/2 space-y-6">
                    <h2 className="text-5xl font-bold text-gray-900 dark:text-white mb-8">About me</h2>

                    <div className="space-y-4 text-gray-600 dark:text-gray-400 text-lg leading-relaxed">
                        <p>
                            I am a passionate full-stack developer with a strong foundation in web development. I specialize in building robust full-stack applications using the MERN stack. My passion lies in solving complex problems through clean and efficient code.
                        </p>
                        <p>
                            I am a quick learner and a team player with a strong work ethic. I am always looking for new challenges and opportunities to grow as a developer.
                        </p>
                    </div>

                    <div className="pt-6">
                        <a
                            href={PhulkeshwarResume}
                            download="Phulkeshwar_Mahto_Resume.pdf"
                            className="inline-block px-8 py-3 bg-amber-400 text-gray-900 font-bold rounded-lg hover:bg-amber-500 transition shadow-md"
                        >
                            Resume
                        </a>
                    </div>

                </div>

                <div className="w-full md:w-1/2 flex justify-center relative">
                    <div className="relative">
                        <div className="absolute inset-0 bg-amber-500 rounded-full scale-105  transform translate-x-1.5 translate-y-2 -z-10"></div>
                        <img
                            src={profilePic}
                            alt="Phulkeshwar Mahto"
                            className="w-80 h-80 rounded-full object-cover shadow-xl border-4 border-white dark:border-neutral-800"
                        />
                    </div>
                </div>
            </div>
        </div >
    );
};

export default About;
