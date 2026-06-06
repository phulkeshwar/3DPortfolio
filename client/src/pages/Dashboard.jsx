import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    Lock, User as UserIcon, Send, LogOut, Code, PlusCircle, Trash2, Edit, MessageSquare, 
    CheckCircle, AlertCircle, ArrowLeft, ArrowUpRight, Award, Plus, FolderGit2, Sparkles, BookOpen 
} from 'lucide-react';
import { gsap } from 'gsap';
import ThreeBackground from '../components/ThreeBackground';

const getApiUrl = (path) => {
    if (import.meta.env.VITE_API_URL) {
        return `${import.meta.env.VITE_API_URL}${path}`;
    }
    if (typeof window !== 'undefined' && !window.location.hostname.includes('localhost')) {
        return `https://portfolio-backend-980z.onrender.com${path}`;
    }
    return path;
};

const Dashboard = () => {
    const navigate = useNavigate();
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [adminUser, setAdminUser] = useState(null);
    const [activeTab, setActiveTab] = useState('projects');

    // Login Form State
    const [loginData, setLoginData] = useState({ username: '', password: '' });
    const [loginStatus, setLoginStatus] = useState({ type: '', text: '' });
    const [isLoggingIn, setIsLoggingIn] = useState(false);

    // Dynamic Lists State
    const [projects, setProjects] = useState([]);
    const [skills, setSkills] = useState([]);
    const [messages, setMessages] = useState([]);
    const [isLoadingData, setIsLoadingData] = useState(false);

    // Project Form State
    const [projectForm, setProjectForm] = useState({
        title: '',
        description: '',
        techStack: '',
        githubLink: '',
        liveLink: '',
        badge: ''
    });
    const [editingProjectId, setEditingProjectId] = useState(null);

    // Skill Form State
    const [skillForm, setSkillForm] = useState({
        name: '',
        category: 'Frontend',
        icon: '',
        level: 80
    });
    const [editingSkillId, setEditingSkillId] = useState(null);

    // Direct Reply Modal State
    const [replyModalOpen, setReplyModalOpen] = useState(false);
    const [replyingTo, setReplyingTo] = useState(null);
    const [replyForm, setReplyForm] = useState({ subject: '', message: '' });
    const [isSendingReply, setIsSendingReply] = useState(false);

    const [actionStatus, setActionStatus] = useState({ type: '', text: '' });

    // 1. Auth Check on Mount
    useEffect(() => {
        const storedUser = localStorage.getItem('adminUser');
        if (storedUser) {
            const parsed = JSON.parse(storedUser);
            if (parsed && parsed.token) {
                setAdminUser(parsed);
                setIsAuthenticated(true);
            }
        }
    }, []);

    // GSAP Landing animations for unauthenticated sign-in page
    useEffect(() => {
        if (!isAuthenticated) {
            gsap.fromTo(
                '.admin-login-card',
                { x: 120, opacity: 0 },
                { x: 0, opacity: 1, duration: 1.2, ease: 'power4.out', delay: 0.1 }
            );
            gsap.fromTo(
                '.admin-left-pane-text',
                { y: 40, opacity: 0 },
                { y: 0, opacity: 1, duration: 1.0, ease: 'power3.out', delay: 0.3 }
            );
        }
    }, [isAuthenticated]);

    // 2. Fetch data once authenticated
    useEffect(() => {
        if (isAuthenticated && adminUser) {
            fetchData();
        }
    }, [isAuthenticated, adminUser]);

    const fetchData = async () => {
        setIsLoadingData(true);
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${adminUser.token}`,
                },
            };

            const projectsRes = await fetch(getApiUrl('/api/projects'));
            const projectsData = await projectsRes.json();
            if (projectsRes.ok) setProjects(projectsData);

            const skillsRes = await fetch(getApiUrl('/api/skills'));
            const skillsData = await skillsRes.json();
            if (skillsRes.ok) setSkills(skillsData);

            const messagesRes = await fetch(getApiUrl('/api/contact'), config);
            const messagesData = await messagesRes.json();
            if (messagesRes.ok) setMessages(messagesData);

        } catch (error) {
            console.error("Error fetching data:", error);
            showActionFeedback('error', 'Failed to retrieve database records.');
        } finally {
            setIsLoadingData(false);
        }
    };

    const showActionFeedback = (type, text) => {
        setActionStatus({ type, text });
        setTimeout(() => setActionStatus({ type: '', text: '' }), 5000);
    };

    // 3. Handle Admin Login
    const handleLoginSubmit = async (e) => {
        e.preventDefault();
        if (!loginData.username.trim() || !loginData.password.trim()) {
            setLoginStatus({ type: 'error', text: 'Please fill in all credentials.' });
            return;
        }

        setIsLoggingIn(true);
        setLoginStatus({ type: '', text: '' });

        try {
            const response = await fetch(getApiUrl('/api/auth/login'), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: loginData.username,
                    password: loginData.password
                }),
            });

            const data = await response.json();

            if (response.ok && data.token) {
                localStorage.setItem('adminUser', JSON.stringify(data));
                setAdminUser(data);
                setIsAuthenticated(true);
                setLoginStatus({ type: 'success', text: 'Authenticated successfully!' });
            } else {
                setLoginStatus({ type: 'error', text: data.message || 'Invalid username or password.' });
            }
        } catch (error) {
            setLoginStatus({ type: 'error', text: 'Authentication server offline.' });
        } finally {
            setIsLoggingIn(false);
        }
    };

    // 4. Handle Admin Logout
    const handleLogout = () => {
        localStorage.removeItem('adminUser');
        setIsAuthenticated(false);
        setAdminUser(null);
        setLoginData({ username: '', password: '' });
        setLoginStatus({ type: '', text: '' });
    };

    // 5. CRUD Projects
    const handleProjectSubmit = async (e) => {
        e.preventDefault();
        setActionStatus({ type: '', text: '' });

        try {
            const isEditing = !!editingProjectId;
            const url = isEditing ? getApiUrl(`/api/projects/${editingProjectId}`) : getApiUrl('/api/projects');
            const method = isEditing ? 'PUT' : 'POST';

            const projectData = {
                title: projectForm.title,
                description: projectForm.description,
                techStack: projectForm.techStack.split(',').map(item => item.trim()).filter(Boolean),
                githubLink: projectForm.githubLink,
                liveLink: projectForm.liveLink,
            };
            if (projectForm.badge) {
                projectData.badge = projectForm.badge;
            }

            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${adminUser.token}`,
                },
                body: JSON.stringify(projectData),
            });

            if (response.ok) {
                showActionFeedback('success', isEditing ? 'Project updated successfully!' : 'Project created successfully!');
                setProjectForm({ title: '', description: '', techStack: '', githubLink: '', liveLink: '', badge: '' });
                setEditingProjectId(null);
                fetchData();
            } else {
                const err = await response.json();
                showActionFeedback('error', err.message || 'Failed to submit project details.');
            }
        } catch (error) {
            showActionFeedback('error', 'Network error submitting project.');
        }
    };

    const handleEditProjectClick = (project) => {
        setEditingProjectId(project._id);
        setProjectForm({
            title: project.title,
            description: project.description,
            techStack: project.techStack ? project.techStack.join(', ') : '',
            githubLink: project.githubLink,
            liveLink: project.liveLink,
            badge: project.badge || ''
        });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDeleteProject = async (id) => {
        if (!confirm("Are you sure you want to permanently delete this project?")) return;
        try {
            const response = await fetch(getApiUrl(`/api/projects/${id}`), {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${adminUser.token}`,
                },
            });
            if (response.ok) {
                showActionFeedback('success', 'Project removed successfully.');
                fetchData();
            } else {
                showActionFeedback('error', 'Failed to delete project.');
            }
        } catch (error) {
            showActionFeedback('error', 'Network error deleting project.');
        }
    };

    // 6. CRUD Skills
    const handleSkillSubmit = async (e) => {
        e.preventDefault();
        setActionStatus({ type: '', text: '' });

        try {
            const isEditing = !!editingSkillId;
            const url = isEditing ? getApiUrl(`/api/skills/${editingSkillId}`) : getApiUrl('/api/skills');
            const method = isEditing ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${adminUser.token}`,
                },
                body: JSON.stringify(skillForm),
            });

            if (response.ok) {
                showActionFeedback('success', isEditing ? 'Skill updated!' : 'Skill added successfully!');
                setSkillForm({ name: '', category: 'Frontend', icon: '', level: 80 });
                setEditingSkillId(null);
                fetchData();
            } else {
                const err = await response.json();
                showActionFeedback('error', err.message || 'Failed to submit skill details.');
            }
        } catch (error) {
            showActionFeedback('error', 'Network error submitting skill.');
        }
    };

    const handleEditSkillClick = (skill) => {
        setEditingSkillId(skill._id);
        setSkillForm({
            name: skill.name,
            category: skill.category || 'Frontend',
            icon: skill.icon || '',
            level: skill.level || 80
        });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDeleteSkill = async (id) => {
        if (!confirm("Remove this skill from your expertise records?")) return;
        try {
            const response = await fetch(getApiUrl(`/api/skills/${id}`), {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${adminUser.token}`,
                },
            });
            if (response.ok) {
                showActionFeedback('success', 'Skill record deleted.');
                fetchData();
            } else {
                showActionFeedback('error', 'Failed to delete skill.');
            }
        } catch (error) {
            showActionFeedback('error', 'Network error deleting skill.');
        }
    };

    // 7. Delete Message
    const handleDeleteMessage = async (id) => {
        if (!confirm("Are you sure you want to delete this message record?")) return;
        try {
            const response = await fetch(getApiUrl(`/api/contact/${id}`), {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${adminUser.token}`,
                },
            });
            if (response.ok) {
                showActionFeedback('success', 'Message record cleared.');
                fetchData();
            } else {
                showActionFeedback('error', 'Failed to remove message.');
            }
        } catch (error) {
            showActionFeedback('error', 'Network error removing message.');
        }
    };

    // 8. Open Reply Modal
    const handleOpenReplyModal = (contact) => {
        setReplyingTo(contact);
        setReplyForm({
            subject: `Re: Regarding your message on Phulkeshwar Mahto's portfolio`,
            message: `Hi ${contact.name},\n\nThank you for reaching out!\n\n`
        });
        setReplyModalOpen(true);
    };

    // 9. Send Email Reply
    const handleSendReply = async (e) => {
        e.preventDefault();
        if (!replyForm.subject.trim() || !replyForm.message.trim()) {
            showActionFeedback('error', 'Please fill in both the subject and response message.');
            return;
        }

        setIsSendingReply(true);
        try {
            const response = await fetch(getApiUrl(`/api/contact/${replyingTo._id}/reply`), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${adminUser.token}`,
                },
                body: JSON.stringify({
                    subject: replyForm.subject,
                    message: replyForm.message
                }),
            });

            if (response.ok) {
                const data = await response.json();
                if (data.emailSent === false) {
                    showActionFeedback('error', data.message || 'Saved in database, but email delivery failed due to SMTP block.');
                } else {
                    showActionFeedback('success', `Direct reply dispatched successfully to ${replyingTo.email}!`);
                }
                setReplyModalOpen(false);
                setReplyingTo(null);
                setReplyForm({ subject: '', message: '' });
                fetchData();
            } else {
                const errData = await response.json();
                showActionFeedback('error', errData.message || 'Failed to dispatch email reply.');
            }
        } catch (error) {
            showActionFeedback('error', 'Network error sending direct reply.');
        } finally {
            setIsSendingReply(false);
        }
    };

    // --- RENDER 1: LOGIN FORM ---
    if (!isAuthenticated) {
        return (
            <>
                <ThreeBackground shiftLeft={true} />
                <div className="min-h-screen w-full flex flex-col lg:flex-row relative z-10">
                    {/* Back to Site Button (always visible, top left) */}
                    <button 
                        onClick={() => navigate('/')}
                        className="absolute top-6 left-6 inline-flex items-center gap-2 px-4 py-2 bg-slate-900/60 hover:bg-slate-900 border border-slate-800 text-slate-400 hover:text-white rounded-xl text-xs font-mono transition duration-300 z-20"
                    >
                        <ArrowLeft size={13} />
                        Back to Portfolio
                    </button>

                    {/* Left Pane - Large spacer on desktop to showcase the 3D globe */}
                    <div className="hidden lg:flex lg:w-1/2 p-12 flex-col justify-end admin-left-pane-text">
                        <div className="max-w-md pb-12">
                            <h1 className="font-display text-4xl font-black text-white mb-4 tracking-tight leading-tight">
                                Control Center<span className="gradient-text">.</span>
                            </h1>
                            <p className="text-slate-400 text-sm leading-relaxed">
                                Manage project showcases, monitor incoming queries, and update system parameters in real-time.
                            </p>
                        </div>
                    </div>

                    {/* Right Pane - Holds the Login Form */}
                    <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 lg:p-20 bg-slate-950/10 lg:bg-[#020617]/40 lg:backdrop-blur-sm lg:border-l lg:border-slate-800/40 min-h-screen admin-login-card">
                        <div className="w-full max-w-md glass-card !rounded-3xl p-8 sm:p-10 border border-slate-800 relative overflow-hidden">
                            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-primary-400 via-purple-500 to-pink-500" />
                            
                            <div className="text-center mb-8">
                                <div className="w-12 h-12 bg-primary-400/10 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-primary-400/20">
                                    <Lock size={20} className="text-primary-400" />
                                </div>
                                <h2 className="font-display text-2xl font-black tracking-tight text-white">
                                    Command Center<span className="gradient-text">.</span>
                                </h2>
                                <p className="mt-2 text-slate-400 text-xs font-mono uppercase tracking-widest">
                                    Admin Authentication Required
                                </p>
                            </div>

                            <form onSubmit={handleLoginSubmit} className="space-y-5">
                                {loginStatus.text && (
                                    <div className={`p-4 rounded-xl flex items-start gap-3 border text-xs leading-relaxed ${
                                        loginStatus.type === 'success' 
                                            ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' 
                                            : 'bg-rose-500/10 border-rose-500/30 text-rose-400'
                                    }`}>
                                        {loginStatus.type === 'success' ? <CheckCircle size={15} className="shrink-0" /> : <AlertCircle size={15} className="shrink-0" />}
                                        <span>{loginStatus.text}</span>
                                    </div>
                                )}

                                <div className="space-y-2">
                                    <label className="text-xs font-mono font-semibold uppercase tracking-wider text-slate-400">
                                        Username / Email
                                    </label>
                                    <div className="relative">
                                        <UserIcon size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                                        <input
                                            type="text"
                                            value={loginData.username}
                                            onChange={(e) => setLoginData({ ...loginData, username: e.target.value })}
                                            required
                                            disabled={isLoggingIn}
                                            placeholder="Admin Username"
                                            className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-950/40 border border-slate-800 focus:border-primary-400 focus:ring-1 focus:ring-primary-400 focus:outline-none text-white text-sm transition placeholder:text-slate-700 font-mono"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-mono font-semibold uppercase tracking-wider text-slate-400">
                                        Access Password
                                    </label>
                                    <div className="relative">
                                        <Lock size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                                        <input
                                            type="password"
                                            value={loginData.password}
                                            onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                                            required
                                            disabled={isLoggingIn}
                                            placeholder="••••••••••••"
                                            className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-950/40 border border-slate-800 focus:border-primary-400 focus:ring-1 focus:ring-primary-400 focus:outline-none text-white text-sm transition placeholder:text-slate-700 font-mono"
                                        />
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={isLoggingIn}
                                    className="w-full mt-2 group inline-flex items-center justify-center gap-2.5 px-6 py-3.5 bg-white text-gray-900 font-bold text-sm rounded-xl hover:bg-primary-400 hover:text-white transition-all duration-300 hover:-translate-y-0.5 shadow-xl shadow-white/5 disabled:opacity-50 disabled:pointer-events-none"
                                >
                                    <Send size={14} />
                                    {isLoggingIn ? 'Verifying Identity...' : 'Access Dashboard'}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </>
        );
    }

    // --- RENDER 2: ADMIN DASHBOARD PANEL ---
    return (
        <>
            <ThreeBackground />
            <div className="min-h-screen relative z-10 p-4 sm:p-8 max-w-6xl mx-auto flex flex-col">
                {/* Header */}
                <header className="glass-card !rounded-2xl p-6 mb-8 flex flex-col sm:flex-row justify-between items-center gap-4 border border-slate-800">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-400 to-purple-500 flex items-center justify-center font-display font-black text-white">
                            PM
                        </div>
                        <div>
                            <h1 className="text-lg font-bold text-white leading-tight">Admin Terminal</h1>
                            <div className="flex items-center gap-2 mt-0.5">
                                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                                <span className="text-xs text-slate-400 font-mono">Operator: {adminUser?.name}</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <button 
                            onClick={() => navigate('/')}
                            className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-950/40 hover:bg-slate-900 border border-slate-800 text-slate-300 hover:text-white rounded-xl text-xs font-semibold transition"
                        >
                            View Site
                            <ArrowUpRight size={13} />
                        </button>
                        <button 
                            onClick={handleLogout}
                            className="inline-flex items-center gap-1.5 px-4 py-2 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-400 rounded-xl text-xs font-semibold transition"
                        >
                            <LogOut size={13} />
                            Disconnect
                        </button>
                    </div>
                </header>

                {/* Feedback notifications */}
                {actionStatus.text && (
                    <div className={`p-4 rounded-xl mb-6 flex items-start gap-3 border text-sm transition-all duration-300 ${
                        actionStatus.type === 'success' 
                            ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' 
                            : 'bg-rose-500/10 border-rose-500/30 text-rose-400'
                    }`}>
                        {actionStatus.type === 'success' ? <CheckCircle size={17} className="shrink-0 mt-0.5" /> : <AlertCircle size={17} className="shrink-0 mt-0.5" />}
                        <span>{actionStatus.text}</span>
                    </div>
                )}

                {/* Tabs */}
                <div className="flex flex-wrap gap-2.5 mb-8 border-b border-slate-800 pb-5">
                    {[
                        { id: 'projects', label: 'Projects Showcase', icon: FolderGit2 },
                        { id: 'skills', label: 'Expertise Matrix', icon: Code },
                        { id: 'messages', label: 'Inbox Reports', icon: MessageSquare, badge: messages.length }
                    ].map(tab => {
                        const TabIcon = tab.icon;
                        const isActive = activeTab === tab.id;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => {
                                    setActiveTab(tab.id);
                                    setActionStatus({ type: '', text: '' });
                                }}
                                className={`inline-flex items-center gap-2.5 px-5 py-3 rounded-xl text-xs font-mono font-bold border transition duration-300 ${
                                    isActive
                                        ? 'bg-white text-gray-900 border-white'
                                        : 'bg-slate-950/40 hover:bg-slate-900 text-slate-400 hover:text-slate-200 border-slate-800'
                                }`}
                            >
                                <TabIcon size={14} />
                                {tab.label}
                                {tab.badge > 0 && (
                                    <span className={`px-1.5 py-0.5 rounded-md text-[10px] ${
                                        isActive ? 'bg-primary-500 text-white' : 'bg-slate-800 text-slate-400'
                                    }`}>
                                        {tab.badge}
                                    </span>
                                )}
                            </button>
                        );
                    })}
                </div>

                {/* Content area */}
                <div className="flex-grow">
                    {isLoadingData ? (
                        <div className="text-center py-20 text-slate-500 font-mono text-sm">
                            Querying MERN database records...
                        </div>
                    ) : (
                        <>
                            {/* TAB 1: PROJECTS */}
                            {activeTab === 'projects' && (
                                <div className="grid lg:grid-cols-3 gap-8 items-start">
                                    {/* Left: Project Editor Form */}
                                    <div className="lg:col-span-1 glass-card !rounded-2xl p-6 border border-slate-800 space-y-5">
                                        <div className="flex items-center gap-2 mb-2">
                                            <FolderGit2 size={16} className="text-primary-400" />
                                            <h2 className="text-sm font-mono font-bold uppercase tracking-wider text-white">
                                                {editingProjectId ? 'Modify Project' : 'Register Project'}
                                            </h2>
                                        </div>

                                        <form onSubmit={handleProjectSubmit} className="space-y-4">
                                            <div className="space-y-1">
                                                <label className="text-[10px] font-mono font-semibold uppercase tracking-wider text-slate-500">Project Title</label>
                                                <input 
                                                    type="text" 
                                                    value={projectForm.title}
                                                    onChange={e => setProjectForm({ ...projectForm, title: e.target.value })}
                                                    required 
                                                    placeholder="e.g. Call.io"
                                                    className="w-full px-3 py-2.5 rounded-lg bg-slate-950/40 border border-slate-800 focus:border-primary-400 focus:outline-none text-white text-xs font-mono"
                                                />
                                            </div>

                                            <div className="space-y-1">
                                                <label className="text-[10px] font-mono font-semibold uppercase tracking-wider text-slate-500">Feature Badge (Optional)</label>
                                                <input 
                                                    type="text" 
                                                    value={projectForm.badge}
                                                    onChange={e => setProjectForm({ ...projectForm, badge: e.target.value })}
                                                    placeholder="e.g. 🏆 Hackathon Winner"
                                                    className="w-full px-3 py-2.5 rounded-lg bg-slate-950/40 border border-slate-800 focus:border-primary-400 focus:outline-none text-white text-xs font-mono"
                                                />
                                            </div>

                                            <div className="space-y-1">
                                                <label className="text-[10px] font-mono font-semibold uppercase tracking-wider text-slate-500">GitHub URL</label>
                                                <input 
                                                    type="text" 
                                                    value={projectForm.githubLink}
                                                    onChange={e => setProjectForm({ ...projectForm, githubLink: e.target.value })}
                                                    required 
                                                    placeholder="https://github.com/..."
                                                    className="w-full px-3 py-2.5 rounded-lg bg-slate-950/40 border border-slate-800 focus:border-primary-400 focus:outline-none text-white text-xs font-mono"
                                                />
                                            </div>

                                            <div className="space-y-1">
                                                <label className="text-[10px] font-mono font-semibold uppercase tracking-wider text-slate-500">Live Website URL</label>
                                                <input 
                                                    type="text" 
                                                    value={projectForm.liveLink}
                                                    onChange={e => setProjectForm({ ...projectForm, liveLink: e.target.value })}
                                                    required 
                                                    placeholder="https://..."
                                                    className="w-full px-3 py-2.5 rounded-lg bg-slate-950/40 border border-slate-800 focus:border-primary-400 focus:outline-none text-white text-xs font-mono"
                                                />
                                            </div>

                                            <div className="space-y-1">
                                                <label className="text-[10px] font-mono font-semibold uppercase tracking-wider text-slate-500">Tech Stack (comma separated)</label>
                                                <input 
                                                    type="text" 
                                                    value={projectForm.techStack}
                                                    onChange={e => setProjectForm({ ...projectForm, techStack: e.target.value })}
                                                    placeholder="e.g. React, Node, WebRTC"
                                                    className="w-full px-3 py-2.5 rounded-lg bg-slate-950/40 border border-slate-800 focus:border-primary-400 focus:outline-none text-white text-xs font-mono"
                                                />
                                            </div>

                                            <div className="space-y-1">
                                                <label className="text-[10px] font-mono font-semibold uppercase tracking-wider text-slate-500">Project Description</label>
                                                <textarea 
                                                    value={projectForm.description}
                                                    onChange={e => setProjectForm({ ...projectForm, description: e.target.value })}
                                                    required 
                                                    rows="4"
                                                    placeholder="Describe the architecture, bottlenecks solved, or technologies utilized..."
                                                    className="w-full px-3 py-2.5 rounded-lg bg-slate-950/40 border border-slate-800 focus:border-primary-400 focus:outline-none text-white text-xs font-mono resize-none leading-relaxed"
                                                />
                                            </div>

                                            <div className="flex gap-2.5 pt-2">
                                                <button 
                                                    type="submit" 
                                                    className="flex-grow inline-flex items-center justify-center gap-1.5 px-4 py-2.5 bg-white text-gray-900 hover:bg-primary-400 hover:text-white rounded-xl text-xs font-mono font-bold transition duration-300"
                                                >
                                                    <Plus size={14} />
                                                    {editingProjectId ? 'Save Project' : 'Create Project'}
                                                </button>
                                                {editingProjectId && (
                                                    <button 
                                                        type="button" 
                                                        onClick={() => {
                                                            setEditingProjectId(null);
                                                            setProjectForm({ title: '', description: '', techStack: '', githubLink: '', liveLink: '', badge: '' });
                                                        }}
                                                        className="px-4 py-2.5 bg-slate-950 border border-slate-800 hover:bg-slate-900 text-slate-400 rounded-xl text-xs font-mono font-bold transition"
                                                    >
                                                        Cancel
                                                    </button>
                                                )}
                                            </div>
                                        </form>
                                    </div>

                                    {/* Right: Existing Projects List */}
                                    <div className="lg:col-span-2 space-y-4">
                                        <div className="flex items-center justify-between mb-2">
                                            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">Database Showcases ({projects.length})</h3>
                                        </div>

                                        {projects.length === 0 ? (
                                            <div className="glass-card !rounded-xl p-8 border border-slate-800 text-center text-slate-500 font-mono text-xs">
                                                No project showcases found in MongoDB. Create one above!
                                            </div>
                                        ) : (
                                            <div className="grid md:grid-cols-2 gap-4">
                                                {projects.map(p => (
                                                    <div key={p._id} className="glass-card !rounded-xl p-5 border border-slate-800 hover:border-slate-700 transition flex flex-col justify-between">
                                                        <div>
                                                            <div className="flex justify-between items-start gap-2 mb-2">
                                                                <h4 className="font-bold text-white">{p.title}</h4>
                                                                {p.badge && (
                                                                    <span className="text-[10px] font-semibold text-amber-400 bg-amber-400/5 px-2 py-0.5 rounded border border-amber-400/10">
                                                                        {p.badge}
                                                                    </span>
                                                                )}
                                                            </div>
                                                            <p className="text-slate-400 text-xs leading-relaxed mb-4 line-clamp-3">{p.description}</p>
                                                            {p.techStack && (
                                                                <div className="flex flex-wrap gap-1.5 mb-5">
                                                                    {p.techStack.map((tech, i) => (
                                                                        <span key={i} className="text-[10px] font-mono text-primary-400/80 bg-primary-400/5 px-2 py-0.5 rounded border border-primary-400/10">
                                                                            {tech}
                                                                        </span>
                                                                    ))}
                                                                </div>
                                                            )}
                                                        </div>

                                                        <div className="flex justify-between items-center border-t border-slate-900 pt-3">
                                                            <div className="flex gap-2">
                                                                <a href={p.githubLink} target="_blank" rel="noreferrer" className="text-[10px] font-mono text-slate-500 hover:text-white transition underline">Github</a>
                                                                <a href={p.liveLink} target="_blank" rel="noreferrer" className="text-[10px] font-mono text-slate-500 hover:text-primary-400 transition underline">Website</a>
                                                            </div>
                                                            <div className="flex gap-2">
                                                                <button 
                                                                    onClick={() => handleEditProjectClick(p)}
                                                                    className="p-1.5 bg-slate-950 border border-slate-800 hover:border-slate-700 text-slate-400 hover:text-white rounded-lg transition"
                                                                    title="Modify Details"
                                                                >
                                                                    <Edit size={12} />
                                                                </button>
                                                                <button 
                                                                    onClick={() => handleDeleteProject(p._id)}
                                                                    className="p-1.5 bg-rose-500/10 border border-rose-500/20 hover:bg-rose-500/20 text-rose-400 rounded-lg transition"
                                                                    title="Delete Record"
                                                                >
                                                                    <Trash2 size={12} />
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* TAB 2: SKILLS */}
                            {activeTab === 'skills' && (
                                <div className="grid lg:grid-cols-3 gap-8 items-start">
                                    {/* Left: Skill Editor Form */}
                                    <div className="lg:col-span-1 glass-card !rounded-2xl p-6 border border-slate-800 space-y-5">
                                        <div className="flex items-center gap-2 mb-2">
                                            <Code size={16} className="text-primary-400" />
                                            <h2 className="text-sm font-mono font-bold uppercase tracking-wider text-white">
                                                {editingSkillId ? 'Modify Skill' : 'Register Skill'}
                                            </h2>
                                        </div>

                                        <form onSubmit={handleSkillSubmit} className="space-y-4">
                                            <div className="space-y-1">
                                                <label className="text-[10px] font-mono font-semibold uppercase tracking-wider text-slate-500">Skill Name</label>
                                                <input 
                                                    type="text" 
                                                    value={skillForm.name}
                                                    onChange={e => setSkillForm({ ...skillForm, name: e.target.value })}
                                                    required 
                                                    placeholder="e.g. React.js"
                                                    className="w-full px-3 py-2.5 rounded-lg bg-slate-950/40 border border-slate-800 focus:border-primary-400 focus:outline-none text-white text-xs font-mono"
                                                />
                                            </div>

                                            <div className="space-y-1">
                                                <label className="text-[10px] font-mono font-semibold uppercase tracking-wider text-slate-500">Category</label>
                                                <select 
                                                    value={skillForm.category}
                                                    onChange={e => setSkillForm({ ...skillForm, category: e.target.value })}
                                                    className="w-full px-3 py-2.5 rounded-lg bg-slate-950/40 border border-slate-800 focus:border-primary-400 focus:outline-none text-white text-xs font-mono"
                                                >
                                                    <option value="Frontend">Frontend</option>
                                                    <option value="Backend">Backend</option>
                                                    <option value="Database">Database & Cloud</option>
                                                    <option value="Computer Science">Computer Science</option>
                                                    <option value="Tools">Other Tools</option>
                                                </select>
                                            </div>

                                            <div className="space-y-1">
                                                <label className="text-[10px] font-mono font-semibold uppercase tracking-wider text-slate-500">Devicon Icon Class (or emoji)</label>
                                                <input 
                                                    type="text" 
                                                    value={skillForm.icon}
                                                    onChange={e => setSkillForm({ ...skillForm, icon: e.target.value })}
                                                    required 
                                                    placeholder="e.g. devicon-react-original colored"
                                                    className="w-full px-3 py-2.5 rounded-lg bg-slate-950/40 border border-slate-800 focus:border-primary-400 focus:outline-none text-white text-xs font-mono"
                                                />
                                                <p className="text-[9px] text-slate-500 font-mono mt-1">
                                                    Refer to Devicon classes (e.g. `devicon-nodejs-plain colored`). Use emoji fallback if needed.
                                                </p>
                                            </div>

                                            <div className="space-y-1">
                                                <div className="flex justify-between items-center">
                                                    <label className="text-[10px] font-mono font-semibold uppercase tracking-wider text-slate-500">Competency Level</label>
                                                    <span className="text-xs font-mono text-primary-400 font-bold">{skillForm.level}%</span>
                                                </div>
                                                <input 
                                                    type="range" 
                                                    min="0"
                                                    max="100"
                                                    value={skillForm.level}
                                                    onChange={e => setSkillForm({ ...skillForm, level: parseInt(e.target.value) })}
                                                    className="w-full accent-primary-400 bg-slate-950"
                                                />
                                            </div>

                                            <div className="flex gap-2.5 pt-2">
                                                <button 
                                                    type="submit" 
                                                    className="flex-grow inline-flex items-center justify-center gap-1.5 px-4 py-2.5 bg-white text-gray-900 hover:bg-primary-400 hover:text-white rounded-xl text-xs font-mono font-bold transition duration-300"
                                                >
                                                    <Plus size={14} />
                                                    {editingSkillId ? 'Save Skill' : 'Create Skill'}
                                                </button>
                                                {editingSkillId && (
                                                    <button 
                                                        type="button" 
                                                        onClick={() => {
                                                            setEditingSkillId(null);
                                                            setSkillForm({ name: '', category: 'Frontend', icon: '', level: 80 });
                                                        }}
                                                        className="px-4 py-2.5 bg-slate-950 border border-slate-800 hover:bg-slate-900 text-slate-400 rounded-xl text-xs font-mono font-bold transition"
                                                    >
                                                        Cancel
                                                    </button>
                                                )}
                                            </div>
                                        </form>
                                    </div>

                                    {/* Right: Existing Skills List */}
                                    <div className="lg:col-span-2 space-y-4">
                                        <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">Database Skills ({skills.length})</h3>

                                        {skills.length === 0 ? (
                                            <div className="glass-card !rounded-xl p-8 border border-slate-800 text-center text-slate-500 font-mono text-xs">
                                                No skill records found in MongoDB. Create one above!
                                            </div>
                                        ) : (
                                            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
                                                {skills.map(s => (
                                                    <div key={s._id} className="glass-card !rounded-xl p-4 border border-slate-800 hover:border-slate-700 transition flex justify-between items-center">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-9 h-9 rounded-lg bg-slate-950/60 border border-slate-900 flex items-center justify-center font-bold text-sm text-slate-300 shrink-0">
                                                                {s.icon && s.icon.startsWith('devicon') ? (
                                                                    <i className={s.icon} />
                                                                ) : (
                                                                    <span>{s.icon || '🚀'}</span>
                                                                )}
                                                            </div>
                                                            <div>
                                                                <h4 className="text-xs font-bold text-white">{s.name}</h4>
                                                                <p className="text-[10px] text-slate-500 font-mono mt-0.5">{s.category} | {s.level}%</p>
                                                            </div>
                                                        </div>

                                                        <div className="flex gap-1 shrink-0">
                                                            <button 
                                                                onClick={() => handleEditSkillClick(s)}
                                                                className="p-1.5 bg-slate-950 border border-slate-800 hover:border-slate-700 text-slate-400 hover:text-white rounded-lg transition"
                                                                title="Modify Skill"
                                                            >
                                                                <Edit size={11} />
                                                            </button>
                                                            <button 
                                                                onClick={() => handleDeleteSkill(s._id)}
                                                                className="p-1.5 bg-rose-500/10 border border-rose-500/20 hover:bg-rose-500/20 text-rose-400 rounded-lg transition"
                                                                title="Delete Skill"
                                                            >
                                                                <Trash2 size={11} />
                                                            </button>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* TAB 3: MESSAGES */}
                            {activeTab === 'messages' && (
                                <div className="space-y-4">
                                    <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">Visitor Reports ({messages.length})</h3>

                                    {messages.length === 0 ? (
                                        <div className="glass-card !rounded-xl p-8 border border-slate-800 text-center text-slate-500 font-mono text-xs">
                                            No messages or direct reports received yet.
                                        </div>
                                    ) : (
                                        <div className="space-y-4 max-w-4xl">
                                            {messages.map(m => (
                                                <div key={m._id} className="glass-card !rounded-xl p-6 border border-slate-800 hover:border-slate-700 transition relative group">
                                                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-4">
                                                        <div>
                                                            <span className="font-bold text-white text-sm">{m.name}</span>
                                                            <span className="text-xs text-slate-500 font-mono ml-2">({m.email})</span>
                                                        </div>
                                                        <span className="text-[10px] text-slate-500 font-mono">
                                                            {new Date(m.createdAt).toLocaleDateString()} at {new Date(m.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                                        </span>
                                                    </div>

                                                    <p className="text-slate-300 text-xs leading-relaxed max-w-3xl leading-relaxed whitespace-pre-wrap">
                                                        "{m.message}"
                                                    </p>

                                                    {/* Sent replies thread */}
                                                    {m.replies && m.replies.length > 0 && (
                                                        <div className="mt-4 pt-4 border-t border-slate-900/60 space-y-3">
                                                            <h4 className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                                                                <MessageSquare size={10} />
                                                                Sent Replies ({m.replies.length})
                                                            </h4>
                                                            <div className="space-y-2">
                                                                {m.replies.map((r, idx) => (
                                                                    <div key={idx} className="bg-slate-950/40 border border-slate-900 rounded-xl p-3.5 pl-4 ml-4 relative">
                                                                        <div className="flex justify-between items-center gap-2 mb-1.5">
                                                                            <span className="text-[10px] font-bold text-slate-400">Subject: {r.subject}</span>
                                                                            <span className="text-[9px] text-slate-500 font-mono">
                                                                                {new Date(r.sentAt).toLocaleDateString()}
                                                                            </span>
                                                                        </div>
                                                                        <p className="text-slate-300 text-xs whitespace-pre-wrap font-sans pl-2 border-l border-primary-400/40">
                                                                            {r.message}
                                                                        </p>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    )}

                                                    <div className="flex gap-3 mt-5 pt-4 border-t border-slate-900 justify-end">
                                                        <button 
                                                            onClick={() => handleOpenReplyModal(m)}
                                                            className="inline-flex items-center gap-1 text-[10px] font-mono text-primary-400 hover:text-primary-300 transition bg-transparent border-0 cursor-pointer p-0"
                                                        >
                                                            Send Direct Reply
                                                            <ArrowUpRight size={10} />
                                                        </button>
                                                        <button 
                                                            onClick={() => handleDeleteMessage(m._id)}
                                                            className="inline-flex items-center gap-1 text-[10px] font-mono text-rose-400 hover:text-rose-300 transition"
                                                        >
                                                            Clear Record
                                                            <Trash2 size={10} />
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>

            {/* Direct Reply Modal Overlay */}
            {replyModalOpen && replyingTo && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm transition-opacity duration-300 animate-in fade-in duration-200">
                    <div className="w-full max-w-lg glass-card !rounded-3xl p-6 sm:p-8 border border-slate-800 relative overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-primary-400 via-purple-500 to-pink-500" />
                        
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="font-display text-base font-black text-white flex items-center gap-2">
                                <MessageSquare size={15} className="text-primary-400" />
                                Send Direct Reply
                            </h3>
                            <button 
                                onClick={() => {
                                    setReplyModalOpen(false);
                                    setReplyingTo(null);
                                }}
                                className="text-slate-500 hover:text-white transition text-xs font-mono bg-transparent border-0 cursor-pointer"
                            >
                                ✕ Close
                            </button>
                        </div>

                        <div className="mb-4 bg-slate-950/60 border border-slate-900 rounded-xl p-4 text-xs font-mono text-slate-400 space-y-1">
                            <div><span className="text-slate-600">To:</span> {replyingTo.name} ({replyingTo.email})</div>
                            <div className="line-clamp-2"><span className="text-slate-600">Original:</span> "{replyingTo.message}"</div>
                        </div>

                        <form onSubmit={handleSendReply} className="space-y-4">
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-mono font-semibold uppercase tracking-wider text-slate-500">
                                    Email Subject
                                </label>
                                <input
                                    type="text"
                                    value={replyForm.subject}
                                    onChange={(e) => setReplyForm({ ...replyForm, subject: e.target.value })}
                                    required
                                    placeholder="Enter email subject"
                                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950/40 border border-slate-800 focus:border-primary-400 focus:ring-1 focus:ring-primary-400 focus:outline-none text-white text-xs font-mono"
                                />
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-[10px] font-mono font-semibold uppercase tracking-wider text-slate-500">
                                    Message Body
                                </label>
                                <textarea
                                    value={replyForm.message}
                                    onChange={(e) => setReplyForm({ ...replyForm, message: e.target.value })}
                                    required
                                    rows={8}
                                    placeholder="Write your email response..."
                                    className="w-full px-4 py-3 rounded-xl bg-slate-950/40 border border-slate-800 focus:border-primary-400 focus:ring-1 focus:ring-primary-400 focus:outline-none text-white text-xs font-sans leading-relaxed"
                                />
                            </div>

                            <div className="flex gap-3 pt-2">
                                <button
                                    type="submit"
                                    disabled={isSendingReply}
                                    className="flex-grow inline-flex items-center justify-center gap-2 px-6 py-3 bg-white text-gray-900 hover:bg-primary-400 hover:text-white font-bold text-xs rounded-xl transition duration-300 shadow-lg disabled:opacity-50"
                                >
                                    <Send size={12} />
                                    {isSendingReply ? 'Sending Email...' : 'Send Reply'}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setReplyModalOpen(false);
                                        setReplyingTo(null);
                                    }}
                                    className="px-6 py-3 bg-slate-950 border border-slate-800 hover:bg-slate-900 text-slate-400 hover:text-white font-bold text-xs rounded-xl transition"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
};

export default Dashboard;
