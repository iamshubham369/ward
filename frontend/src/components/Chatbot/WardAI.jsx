import React, { useState, useContext, useRef, useEffect } from 'react';
import { AppContext } from '../../context/AppContext';
import { MessageSquare, Send, X, Bot, User, Zap, MessageCircleCode, ChevronRight, Activity, Database, AlertCircle } from 'lucide-react';

const WardAI = () => {
    const { user, issues, projects } = useContext(AppContext);
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [isThinking, setIsThinking] = useState(false);
    const scrollRef = useRef();

    useEffect(() => {
        if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }, [messages]);

    const botResponses = {
        'greetings': "Namaste! I am WardAI, your digital liaison. How can I assist you with Ward 14 services today?",
        'water': "Current water disruption in Sectors 5-8 until Jul 12. Normal supply resumes Jul 13.",
        'default': "I'm not sure about that. Try asking about 'water supply', 'road work', or 'projects'."
    };

    const handleSend = async (e) => {
        e.preventDefault();
        const text = input.trim().toLowerCase();
        if (!text) return;

        const newMessages = [...messages, { text: input, side: 'user' }];
        setMessages(newMessages);
        setInput('');
        setIsThinking(true);

        setTimeout(() => {
            let reply = "";
            if (text.includes('hi') || text.includes('hello') || text.includes('namaste')) reply = botResponses.greetings;
            else if (text.includes('water')) reply = botResponses.water;
            else if (text.includes('project')) {
                reply = `There are currently ${projects.length} active infrastructure projects in your ward.`;
            } else if (text.includes('issue')) {
                reply = `There are ${issues.length} reported civic issues currently being monitored.`;
            } else reply = botResponses.default;

            setMessages([...newMessages, { text: reply, side: 'bot' }]);
            setIsThinking(false);
        }, 1000);
    };

    const toggle = () => {
        setIsOpen(!isOpen);
        if (!isOpen && messages.length === 0) {
            let greeting = `Namaste Neighbor! How can I assist you with Ward 14 telemetry today?`;
            if (user) {
                greeting = user.role === 'Authority' 
                    ? `Welcome back, Commissioner. Telemetry synced.` 
                    : `Hello ${user?.name?.split(' ')[0]}! Ready to explore Ward 14?`;
            }
            setMessages([{ text: greeting, side: 'bot' }]);
        }
    };

    return (
        <div className="fixed bottom-4 right-4 sm:bottom-10 sm:right-10 z-[100] flex flex-col items-end gap-4 sm:gap-6">
            <div className={`w-[calc(100vw-32px)] sm:w-[450px] h-[calc(100vh-100px)] sm:h-[650px] max-h-[800px] bg-white dark:bg-navy-900 rounded-3xl sm:rounded-[3rem] shadow-2xl border border-stone-200 dark:border-navy-700 flex flex-col overflow-hidden transition-all duration-700 transform origin-bottom-right ${isOpen ? 'scale-100 opacity-100 translate-y-0 translate-x-0' : 'scale-0 opacity-0 translate-y-16 translate-x-16 pointer-events-none'}`}>
                {/* Bot Header */}
                <div className="bg-navy-900 border-b border-navy-700 p-6 sm:p-8 flex items-center justify-between relative group overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-saffron-500/5 rounded-full -translate-y-16 translate-x-16 blur-2xl group-hover:bg-saffron-500/10 transition-all"></div>
                    <div className="flex items-center gap-4 sm:gap-5 relative z-10">
                        <div className="w-12 h-12 sm:w-16 sm:h-16 bg-navy-800 border border-navy-700 rounded-2xl sm:rounded-3xl flex items-center justify-center shadow-inner group-hover:rotate-12 transition-transform duration-500"><Bot className="w-6 h-6 sm:w-10 sm:h-10 text-saffron-500 animate-pulse" /></div>
                        <div>
                            <h3 className="font-display font-black text-xl sm:text-2xl text-stone-50 leading-tight uppercase tracking-tight">Ward<span className="text-saffron-500 italic">AI</span></h3>
                            <div className="flex items-center gap-2 mt-1.5 px-2 sm:px-3 py-1 bg-navy-800/80 rounded-xl border border-navy-700 shadow-sm">
                                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-lg shadow-emerald-500/50"></div>
                                <span className="text-[9px] sm:text-[10px] font-mono text-emerald-400 uppercase tracking-widest font-black">Strategic Core Online</span>
                            </div>
                        </div>
                    </div>
                    <button onClick={toggle} className="p-3 bg-navy-800 rounded-full text-stone-500 hover:text-white transition-all border border-navy-700 active:scale-95 group/close self-start"><X className="w-5 h-5 group-close:rotate-90 transition-transform duration-500" /></button>
                </div>

                <div className="flex-1 overflow-y-auto p-4 sm:p-8 space-y-6 sm:space-y-8 bg-stone-50/30 dark:bg-navy-950/20" ref={scrollRef}>
                    {messages.map((m, idx) => (
                        <div key={idx} className={`flex items-start gap-4 ${m.side === 'user' ? 'flex-row-reverse' : ''} animate-in fade-in slide-in-from-bottom-4 duration-500`}>
                            <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 shadow-2xl transition-transform ${m.side === 'bot' ? 'bg-navy-900 border border-navy-700' : 'bg-saffron-500'}`}>{m.side === 'bot' ? <Bot className="w-5 h-5 text-saffron-500" /> : <User className="w-5 h-5 text-navy-900" />}</div>
                            <div className={`p-5 rounded-3xl text-xs leading-[1.6] max-w-[80%] font-bold shadow-xl backdrop-blur-md border ${m.side === 'bot' ? 'bg-white dark:bg-navy-800 border-stone-200 dark:border-navy-700 text-navy-900 dark:text-stone-100 rounded-tl-none' : 'bg-navy-900 text-stone-100 border-navy-800 rounded-tr-none'}`}>{m.text}</div>
                        </div>
                    ))}
                    {isThinking && (
                        <div className="flex items-center gap-4 animate-pulse">
                            <div className="w-10 h-10 rounded-2xl bg-navy-900 border border-navy-700 flex items-center justify-center shrink-0"><Bot className="w-5 h-5 text-saffron-500" /></div>
                            <div className="flex gap-1.5"><div className="w-2.5 h-2.5 bg-saffron-500 rounded-full animate-bounce"></div><div className="w-2.5 h-2.5 bg-saffron-500 rounded-full animate-bounce delay-100"></div><div className="w-2.5 h-2.5 bg-saffron-500 rounded-full animate-bounce delay-200"></div></div>
                        </div>
                    )}
                </div>

                {isOpen && messages.length < 3 && (
                    <div className="px-4 sm:px-8 flex flex-wrap gap-2 mb-4 sm:mb-6">
                         <QuickQuery text="Water Analytics" icon={<Activity className="w-3 h-3"/>} onClick={() => setInput('Water supply')} />
                         <QuickQuery text="Project Records" icon={<Database className="w-3 h-3"/>} onClick={() => setInput('Active projects')} />
                         <QuickQuery text="Risk Alerts" icon={<AlertCircle className="w-3 h-3"/>} onClick={() => setInput('Current issues')} />
                    </div>
                )}

                <form onSubmit={handleSend} className="p-4 sm:p-8 border-t border-stone-100 dark:border-navy-800 bg-white dark:bg-navy-900">
                    <div className="flex items-center gap-2 sm:gap-4 bg-stone-100 dark:bg-navy-950 p-2 sm:p-2.5 rounded-full sm:rounded-[2rem] border border-stone-200 dark:border-navy-800 focus-within:border-saffron-500 focus-within:ring-4 focus-within:ring-saffron-500/5 transition-all group overflow-hidden">
                        <MessageSquare className="hidden sm:block w-5 h-5 text-stone-400 group-focus-within:text-saffron-500 ml-4" />
                        <input type="text" value={input} onChange={e => setInput(e.target.value)} placeholder="Query Strategic Core..." className="flex-1 bg-transparent border-none outline-none text-xs font-mono font-bold dark:text-stone-100 placeholder:text-stone-500 px-3 sm:px-0" />
                        <button type="submit" className="w-10 h-10 sm:w-12 sm:h-12 shrink-0 bg-navy-900 dark:bg-saffron-500 rounded-full sm:rounded-2xl flex items-center justify-center text-stone-50 dark:text-navy-900 hover:scale-110 active:scale-95 transition-all shadow-xl group/send"><Send className="w-4 h-4 sm:w-5 sm:h-5 group-send:rotate-[-45deg] transition-transform" /></button>
                    </div>
                </form>
            </div>

            <button onClick={toggle} className={`w-16 h-16 rounded-[2rem] flex items-center justify-center shadow-2xl transition-all duration-500 z-[101] rotate-0 group relative overflow-hidden ${isOpen ? 'bg-white dark:bg-navy-800 text-saffron-500 border border-stone-200 dark:border-navy-700' : 'bg-navy-900 text-saffron-500 hover:rotate-12 hover:scale-110 translate-y-0 translate-x-0'}`}>
                {isOpen ? <X className="w-8 h-8 font-black" /> : <MessageCircleCode className="w-8 h-8 animate-pulse" />}
                <div className="absolute top-0 left-0 w-full h-full bg-white/5 translate-y-[-101%] group-hover:translate-y-[101%] transition-transform duration-1000"></div>
            </button>
        </div>
    );
};

const QuickQuery = ({ text, icon, onClick }) => (
    <button onClick={onClick} className="px-4 py-2 bg-stone-100 dark:bg-navy-800 border border-stone-200 dark:border-navy-700 rounded-xl text-[10px] font-mono font-black text-stone-500 hover:text-saffron-500 hover:border-saffron-500 transition-all flex items-center gap-2 group uppercase tracking-widest shadow-sm">
        {icon} {text} <ChevronRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
    </button>
);

export default WardAI;
