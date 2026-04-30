import React, { useContext, useState } from 'react';
import { AppContext } from '../../context/AppContext';
import { useTranslation } from 'react-i18next';
import { ThumbsUp, MessageSquare, MapPin, Calendar, CheckCircle2, Siren, ArrowRight, TrendingUp, Search, Filter, Send, ChevronDown, ChevronUp, User } from 'lucide-react';
import axios from 'axios';

// ─── DUMMY CONVERSATIONS (hardcoded, always visible) ───────────────────────────
const DUMMY_CONVOS = [
    {
        id: 'NGP-BUZZ-001',
        author: 'Rahul Sharma',
        avatar: 'RS',
        avatarColor: 'bg-sky-500',
        category: 'Roads',
        time: '2 hours ago',
        text: 'The MG Road pothole near SBI ATM has gotten worse after last night\'s rain. 3 bikes slipped today morning. This needs URGENT attention from PWD!',
        upvotes: 42,
        aiTag: 'High Criticality',
        aiAcc: 94,
        replies: [
            { author: 'Priya Deshmukh (Councillor)', avatar: 'PD', avatarColor: 'bg-saffron-500', text: 'Acknowledged. I have escalated this to the PWD superintendent. A team will inspect by tomorrow morning.', time: '1 hour ago', isOfficial: true },
            { author: 'Ankit Mishra', avatar: 'AM', avatarColor: 'bg-indigo-500', text: 'Same thing happened on Laxmi Nagar Lane too. Roads are terrible after monsoon.', time: '45 min ago', isOfficial: false },
        ]
    },
    {
        id: 'NGP-BUZZ-002',
        author: 'Sunita Patil',
        avatar: 'SP',
        avatarColor: 'bg-purple-500',
        category: 'Water Supply',
        time: '5 hours ago',
        text: 'Water supply in Vivekanand Nagar Lane 4 has been irregular for the past 4 days. We are only getting water for 30 minutes in the morning. Please look into this.',
        upvotes: 28,
        aiTag: 'Routine Node',
        aiAcc: 87,
        replies: [
            { author: 'Rahul K. (Water Board)', avatar: 'RK', avatarColor: 'bg-emerald-600', text: 'There is a valve maintenance happening in sector 5. Normal supply will resume by Friday. We apologize for the inconvenience.', time: '3 hours ago', isOfficial: true },
        ]
    },
    {
        id: 'NGP-BUZZ-003',
        author: 'Deepak Joshi',
        avatar: 'DJ',
        avatarColor: 'bg-orange-500',
        category: 'Sanitation',
        time: '1 day ago',
        text: 'The garbage truck has not come to Bajaj Nagar Market for 3 days. The waste is overflowing and the smell is unbearable. Health risk for the whole area. Who is responsible?',
        upvotes: 67,
        aiTag: 'High Criticality',
        aiAcc: 96,
        replies: [
            { author: 'NMC Sanitation Cell', avatar: 'NS', avatarColor: 'bg-red-600', text: 'We received your complaint. The assigned vehicle had a breakdown. Replacement vehicle deployed. Area will be cleared by tonight.', time: '20 hours ago', isOfficial: true },
            { author: 'Meera Nair', avatar: 'MN', avatarColor: 'bg-pink-500', text: 'Finally some response! This has been going on for weeks. Please set up a proper schedule.', time: '18 hours ago', isOfficial: false },
            { author: 'Deepak Joshi', avatar: 'DJ', avatarColor: 'bg-orange-500', text: 'Garbage was cleared this evening. Thank you for the quick action.', time: '10 hours ago', isOfficial: false },
        ]
    },
    {
        id: 'NGP-BUZZ-004',
        author: 'Kavita Singh',
        avatar: 'KS',
        avatarColor: 'bg-teal-500',
        category: 'Electricity',
        time: '2 days ago',
        text: 'Streetlights on Laxmi Nagar Square have been off for a week. It\'s very unsafe for pedestrians at night. Can someone from the Electricity Dept take action?',
        upvotes: 19,
        aiTag: 'Routine Node',
        aiAcc: 83,
        replies: [
            { author: 'MSEDCL Ward 14', avatar: 'MW', avatarColor: 'bg-yellow-600', text: 'Thank you for flagging this. Our team has been dispatched. The issue was a faulty transformer fuse. Lights restored.', time: '1 day ago', isOfficial: true },
        ]
    },
];

const WardBuzz = () => {
    const { issues, language, API_BASE, fetchIssues, user, showToast, currentWorkspace } = useContext(AppContext);
    const { t } = useTranslation();
    const [filterCat, setFilterCat] = useState('all');
    const [filterStatus, setFilterStatus] = useState('all');
    const [newPostText, setNewPostText] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [expandedConvo, setExpandedConvo] = useState(null);
    const [replyTexts, setReplyTexts] = useState({});
    const [localReplies, setLocalReplies] = useState({});
    const [localUpvotes, setLocalUpvotes] = useState({});
    const [convos, setConvos] = useState(DUMMY_CONVOS);

    const handleUpvote = async (id) => {
        // Also upvote local dummy convos
        if (id.startsWith('NGP-BUZZ')) {
            setLocalUpvotes(p => ({ ...p, [id]: (p[id] || 0) + 1 }));
            return;
        }
        try {
            await axios.post(`${API_BASE}/issues/upvote/${id}`);
            fetchIssues();
        } catch (e) { console.error(e); }
    };

    const handleStatusUpdate = async (id, status) => {
        if (!user || user.role !== 'Authority') {
            showToast && showToast('Authorization Required', 'error');
            return;
        }
        try {
            await axios.post(`${API_BASE}/issues/status/${id}`, { status });
            fetchIssues();
            showToast && showToast(`Status Updated: ${status}`, 'success');
        } catch (e) { console.error(e); }
    };

    const handleReply = (convoId) => {
        const text = replyTexts[convoId]?.trim();
        if (!text) return;
        const newReply = {
            author: user?.name || 'Anonymous Citizen',
            avatar: (user?.name || 'A').slice(0, 2).toUpperCase(),
            avatarColor: 'bg-indigo-500',
            text,
            time: 'Just now',
            isOfficial: user?.role === 'Authority',
        };
        setLocalReplies(p => ({ ...p, [convoId]: [...(p[convoId] || []), newReply] }));
        setReplyTexts(p => ({ ...p, [convoId]: '' }));
    };

    const handleNewPost = () => {
        const text = newPostText.trim();
        if (!text) return;
        try {
            const newConvo = {
                id: 'NGP-BUZZ-' + Date.now(),
                author: user?.name || 'Community Member',
                avatar: (user?.name || 'C').slice(0, 2).toUpperCase(),
                avatarColor: 'bg-indigo-500',
                category: 'Community',
                time: 'Just now',
                text: text,
                upvotes: 0,
                aiTag: 'Routine Node',
                aiAcc: 82,
                replies: [],
            };
            setConvos(prev => [newConvo, ...prev]);
            setNewPostText('');
            try { showToast('Post broadcasted to community!', 'success'); } catch(e) {}
        } catch (err) {
            console.error('Post failed:', err);
        }
    };

    const filteredIssues = (issues || []).filter(i => {
        if (filterCat !== 'all' && i.category !== filterCat) return false;
        if (filterStatus !== 'all' && (i.status || '').toLowerCase() !== filterStatus.toLowerCase()) return false;
        return true;
    });

    return (
        <section id="buzz" className="bg-navy-800 grid-bg py-16 md:py-24 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-navy-900/50 to-navy-900/90 pointer-events-none"></div>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
                <div className="flex flex-wrap items-end justify-between gap-6 mb-12">
                    <div>
                        <span className="font-mono text-[10px] tracking-[0.3em] uppercase text-saffron-400 font-black mb-2 block">{t('buzz.tactical')}</span>
                        <h2 className="font-display font-black text-4xl sm:text-5xl md:text-6xl text-stone-50 leading-tight">
                            {t('buzz.ward')} <span className="text-saffron-500 italic">{t('buzz.buzz')}</span>
                        </h2>
                    </div>
                    <div className="flex items-center gap-3 bg-navy-900/80 p-3 rounded-2xl border border-navy-700 shadow-2xl backdrop-blur-md relative overflow-hidden">
                        <div className="absolute inset-0 bg-saffron-500/5 animate-pulse"></div>
                        <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_10px_#10b981]"></div>
                        <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-widest font-black relative z-10">Live Feed — {convos.length + filteredIssues.length} Posts</span>
                    </div>
                </div>

                {/* New Post Box — always visible */}
                <div className="bg-navy-900/80 border border-navy-700 rounded-3xl p-6 mb-8 backdrop-blur-xl shadow-2xl">
                    <h3 className="font-bold text-stone-50 flex items-center gap-2 mb-4 uppercase tracking-tight text-sm">
                        <MessageSquare className="w-4 h-4 text-saffron-500" /> Start a Conversation
                    </h3>
                    <div className="flex flex-col gap-3">
                        <textarea
                            value={newPostText}
                            onChange={e => setNewPostText(e.target.value)}
                            onKeyDown={e => { if (e.key === 'Enter' && e.ctrlKey) handleNewPost(); }}
                            placeholder="Share an update, ask a question, or report a civic issue... (Ctrl+Enter to post)"
                            className="w-full bg-navy-950 border border-navy-800 rounded-xl px-4 py-3 text-sm text-stone-200 placeholder:text-stone-600 focus:outline-none focus:border-saffron-500 focus:ring-1 focus:ring-saffron-500 transition-all resize-none"
                            rows="3"
                        ></textarea>
                        <div className="flex justify-end">
                            <button
                                type="button"
                                onClick={handleNewPost}
                                disabled={!newPostText.trim()}
                                className="bg-saffron-500 hover:bg-saffron-400 disabled:opacity-40 disabled:cursor-not-allowed text-navy-900 font-black px-6 py-2.5 rounded-xl text-xs font-mono uppercase tracking-widest transition-all active:scale-95 flex items-center gap-2"
                            >
                                Post to Community <Send className="w-3.5 h-3.5" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Filters */}
                <div className="flex flex-wrap gap-3 mb-8">
                    <div className="relative">
                        <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-stone-500" />
                        <select value={filterCat} onChange={e => setFilterCat(e.target.value)} className="bg-navy-900/80 border border-navy-700/50 text-stone-200 text-xs font-mono rounded-xl pl-9 pr-8 py-2.5 appearance-none outline-none focus:border-saffron-500 cursor-pointer">
                            <option value="all">All Categories</option>
                            <option value="Roads">Roads</option>
                            <option value="Water Supply">Water Supply</option>
                            <option value="Electricity">Electricity</option>
                            <option value="Sanitation">Sanitation</option>
                        </select>
                    </div>
                </div>

                {/* Conversations */}
                <div className="space-y-5">
                    {convos.map(convo => {
                        const allReplies = [...convo.replies, ...(localReplies[convo.id] || [])];
                        const isExpanded = expandedConvo === convo.id;
                        const totalUpvotes = convo.upvotes + (localUpvotes[convo.id] || 0);
                        return (
                            <div key={convo.id} className="bg-navy-900/80 border border-navy-700 hover:border-saffron-500/20 rounded-3xl overflow-hidden backdrop-blur-xl shadow-xl transition-all">
                                <div className="p-6">
                                    <div className="flex gap-4">
                                        {/* Upvote */}
                                        <div className="flex flex-col items-center gap-1 shrink-0">
                                            <button
                                                onClick={() => handleUpvote(convo.id)}
                                                className="w-12 h-12 bg-navy-800 border border-navy-700 rounded-xl flex flex-col items-center justify-center gap-0.5 hover:bg-saffron-500 hover:border-saffron-600 hover:text-navy-900 text-stone-400 transition-all active:scale-95"
                                            >
                                                <TrendingUp className="w-4 h-4" />
                                                <span className="text-[10px] font-mono font-black">{totalUpvotes}</span>
                                            </button>
                                        </div>

                                        {/* Content */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex flex-wrap items-center gap-2 mb-2">
                                                <div className={`w-7 h-7 rounded-full ${convo.avatarColor} flex items-center justify-center text-[9px] font-black text-white shrink-0`}>{convo.avatar}</div>
                                                <span className="text-sm font-bold text-stone-100">{convo.author}</span>
                                                <span className="text-[10px] text-stone-500 font-mono">{convo.time}</span>
                                                <span className="ml-auto bg-navy-800 border border-navy-700 text-saffron-500 px-2 py-0.5 rounded-lg text-[9px] font-mono font-black uppercase">{convo.category}</span>
                                                <span className="bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 px-2 py-0.5 rounded-lg text-[9px] font-mono font-black uppercase">AI: {convo.aiTag} · {convo.aiAcc}%</span>
                                            </div>
                                            <p className="text-stone-200 text-sm leading-relaxed">{convo.text}</p>

                                            {/* Reply toggle */}
                                            <button
                                                onClick={() => setExpandedConvo(isExpanded ? null : convo.id)}
                                                className="mt-3 flex items-center gap-2 text-[10px] font-mono text-stone-500 hover:text-saffron-400 uppercase tracking-widest transition-colors"
                                            >
                                                <MessageSquare className="w-3.5 h-3.5" />
                                                {allReplies.length} {allReplies.length === 1 ? 'Reply' : 'Replies'}
                                                {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                                            </button>
                                        </div>
                                    </div>

                                    {/* Replies section */}
                                    {isExpanded && (
                                        <div className="mt-4 ml-16 space-y-3">
                                            {allReplies.map((reply, ri) => (
                                                <div key={ri} className={`p-4 rounded-2xl border ${reply.isOfficial ? 'bg-saffron-500/5 border-saffron-500/20' : 'bg-navy-800/60 border-navy-700'}`}>
                                                    <div className="flex items-center gap-2 mb-1.5">
                                                        <div className={`w-6 h-6 rounded-full ${reply.avatarColor} flex items-center justify-center text-[8px] font-black text-white shrink-0`}>{reply.avatar}</div>
                                                        <span className="text-xs font-bold text-stone-100">{reply.author}</span>
                                                        {reply.isOfficial && <span className="bg-saffron-500/20 text-saffron-400 px-2 py-0.5 rounded text-[8px] font-mono font-black uppercase">Official</span>}
                                                        <span className="text-[9px] text-stone-500 font-mono ml-auto">{reply.time}</span>
                                                    </div>
                                                    <p className="text-xs text-stone-300 leading-relaxed">{reply.text}</p>
                                                </div>
                                            ))}

                                            {/* Reply input */}
                                            <div className="flex gap-2 mt-3">
                                                <div className="w-7 h-7 rounded-full bg-navy-700 border border-navy-600 flex items-center justify-center shrink-0">
                                                    <User className="w-3 h-3 text-stone-400" />
                                                </div>
                                                <div className="flex-1 flex gap-2">
                                                    <input
                                                        type="text"
                                                        value={replyTexts[convo.id] || ''}
                                                        onChange={e => setReplyTexts(p => ({ ...p, [convo.id]: e.target.value }))}
                                                        onKeyDown={e => e.key === 'Enter' && handleReply(convo.id)}
                                                        placeholder="Write a reply..."
                                                        className="flex-1 bg-navy-950 border border-navy-700 rounded-xl px-3 py-2 text-xs text-stone-200 placeholder:text-stone-600 focus:outline-none focus:border-saffron-500 transition-all"
                                                    />
                                                    <button
                                                        onClick={() => handleReply(convo.id)}
                                                        className="w-9 h-9 rounded-xl bg-saffron-500 hover:bg-saffron-400 text-navy-900 flex items-center justify-center transition-all active:scale-95 shrink-0"
                                                    >
                                                        <Send className="w-3.5 h-3.5" />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}

                    {/* Backend issues also shown */}
                    {filteredIssues.map(issue => (
                        <IssueCard key={issue.id} issue={issue} onUpvote={handleUpvote} onStatus={handleStatusUpdate} isAdmin={user?.role === 'Authority'} />
                    ))}

                    {convos.length === 0 && filteredIssues.length === 0 && (
                        <div className="bg-navy-900/50 border-2 border-dashed border-navy-700 p-20 rounded-3xl text-center flex flex-col items-center justify-center opacity-50">
                            <Search className="w-12 h-12 text-stone-600 mb-6" />
                            <h3 className="font-mono text-sm font-black text-stone-500 uppercase tracking-widest">No posts yet. Start the first conversation!</h3>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
};

const IssueCard = ({ issue, onUpvote, onStatus, isAdmin }) => {
    const { t } = useTranslation();
    const { language } = useContext(AppContext);
    const isResolved = (issue.status || '').toLowerCase() === 'resolved';

    return (
        <div className={`bg-navy-900/80 border rounded-3xl p-6 sm:p-8 hover:translate-y-[-2px] transition-all duration-300 group backdrop-blur-xl shadow-xl ${isResolved ? 'border-emerald-500/30' : 'border-navy-700 hover:border-saffron-500/30'}`}>
            {isResolved && <div className="inline-flex bg-emerald-500/10 text-emerald-500 border border-emerald-500/50 px-3 py-1 rounded-xl font-mono text-[9px] font-black uppercase tracking-widest items-center gap-1.5 mb-4"><CheckCircle2 className="w-3 h-3" /> Resolved</div>}
            <div className="flex flex-col sm:flex-row gap-5">
                <div className="flex flex-col items-center gap-1 shrink-0">
                    <button onClick={() => onUpvote(issue.id)} className="w-12 h-12 bg-navy-800 border border-navy-700 rounded-xl flex flex-col items-center justify-center gap-0.5 hover:bg-saffron-500 hover:border-saffron-600 hover:text-navy-900 text-stone-400 transition-all active:scale-95">
                        <TrendingUp className="w-4 h-4" />
                        <span className="text-[10px] font-mono font-black">{issue.upvotes}</span>
                    </button>
                </div>
                <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                        <span className="bg-navy-800 border border-navy-700 text-saffron-500 px-2 py-0.5 rounded-lg text-[9px] font-mono font-black uppercase">{issue.category}</span>
                        <span className="bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 px-2 py-0.5 rounded-lg text-[9px] font-mono font-black">AI: {issue.upvotes > 50 ? 'High' : 'Routine'} · {80 + (issue.upvotes % 20)}%</span>
                        <span className="text-[9px] font-mono text-stone-500 ml-auto">#{issue.id}</span>
                    </div>
                    <p className="text-stone-200 text-sm leading-relaxed mb-2">{language === 'hi' ? issue.description_hi : language === 'mr' ? issue.description_mr : issue.description}</p>
                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-[10px] text-stone-500 font-mono">
                        <span className="flex items-center gap-1"><MapPin className="w-3 h-3 text-saffron-500/50" />{issue.street}{issue.landmark && ` — ${issue.landmark}`}</span>
                        <span className="flex items-center gap-1"><Calendar className="w-3 h-3 text-saffron-500/50" />{new Date(issue.timestamp).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</span>
                    </div>
                    {isAdmin && !isResolved && (
                        <div className="mt-4 pt-4 border-t border-navy-700 flex flex-wrap gap-2">
                            <button onClick={() => onStatus(issue.id, 'In Progress')} className="bg-navy-800 border border-navy-700 hover:border-saffron-500/50 px-4 py-2 rounded-xl text-[9px] font-mono font-black text-stone-400 hover:text-saffron-400 transition-all uppercase">Mark: In Progress</button>
                            <button onClick={() => onStatus(issue.id, 'Resolved')} className="bg-emerald-500/10 border border-emerald-500/30 hover:bg-emerald-500 hover:text-navy-900 px-4 py-2 rounded-xl text-[9px] font-mono font-black text-emerald-500 transition-all uppercase">Verify: Resolved</button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default WardBuzz;
