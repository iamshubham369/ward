import React, { useContext, useState } from 'react';
import { AppContext } from '../../context/AppContext';
import { Plus, Calendar, IndianRupee, HardHat, TrendingUp, AlertTriangle, CheckCircle2, ChevronRight, BarChart3, Clock } from 'lucide-react';

const OngoingProjects = ({ onOpenModal }) => {
    const { projects, user, setView, setSelectedProjectId } = useContext(AppContext);

    return (
        <section id="projects" className="bg-stone-100 dark:bg-navy-950 py-16 md:py-24 border-b border-stone-200 dark:border-navy-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6">
                <div className="reveal visible">
                    <span className="font-mono text-[10px] tracking-[0.3em] uppercase text-saffron-600 font-black mb-3 block italic tracking-[0.4em]">Strategic Deployment</span>
                    <div className="flex flex-wrap items-end justify-between gap-6 mb-12">
                        <div>
                            <h2 className="font-display font-black text-4xl sm:text-5xl md:text-6xl text-navy-900 dark:text-stone-50 leading-tight tracking-tight uppercase group">
                                Ongoing <span className="text-saffron-500 italic">Projects</span>
                            </h2>
                            <p className="text-stone-500 font-bold dark:text-stone-400 mt-4 max-w-xl text-xs font-mono uppercase tracking-widest leading-loose">
                                Every rupee tracked. Every deadline watched. Real-time project intelligence for Dharampeth Sector.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 reveal visible">
                    {projects.map((project, idx) => (
                        <ProjectCard key={project.id} project={project} name={project.name_en} />
                    ))}
                </div>
            </div>
        </section>
    );
};

const ProjectCard = ({ project, name }) => {
    const { setView, setSelectedProjectId } = useContext(AppContext);
    const isDelayed = project.status === 'Delayed';
    const isCompleted = project.progress === 100;

    return (
        <div className={`bg-white dark:bg-navy-900/80 border p-8 rounded-[2.5rem] shadow-xl hover:shadow-2xl hover:translate-y-[-8px] transition-all duration-700 group relative overflow-hidden flex flex-col h-full backdrop-blur-xl ${isDelayed ? 'border-red-500/20' : 'border-stone-100 dark:border-navy-700 hover:border-saffron-500/30'}`}>
            <div className="absolute top-0 right-0 w-32 h-32 bg-saffron-500/5 rounded-full -translate-y-16 translate-x-16 blur-2xl group-hover:bg-saffron-500/10 transition-all"></div>
            
            <div className="flex items-center justify-between mb-8 relative z-10">
                <div className="bg-stone-50 dark:bg-navy-800 border border-stone-100 dark:border-navy-700 px-4 py-2 rounded-2xl text-[9px] font-mono font-black text-stone-500 dark:text-saffron-400 uppercase tracking-widest shadow-inner">
                    {project.category}
                </div>
                {isDelayed ? <AlertTriangle className="w-5 h-5 text-red-500 animate-pulse" /> : isCompleted ? <CheckCircle2 className="w-5 h-5 text-emerald-500" /> : <TrendingUp className="w-5 h-5 text-emerald-400" />}
            </div>

            <h3 className="font-display font-black text-2xl text-navy-900 dark:text-stone-50 mb-3 leading-tight tracking-tight uppercase group-hover:text-saffron-500 transition-colors">{name}</h3>
            <p className="text-[10px] font-mono text-stone-400 uppercase tracking-widest font-black mb-8 flex items-center gap-2">
                <HardHat className="w-3.5 h-3.5 text-stone-500" /> {project.contractor || 'Assigned Logistics Agent'}
            </p>

            <div className="space-y-6 flex-1 mb-10">
                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-stone-50 dark:bg-navy-800/50 p-4 rounded-3xl border border-stone-100 dark:border-navy-700 shadow-inner group-hover:bg-stone-100 dark:group-hover:bg-navy-800 transition-all">
                        <div className="flex items-center gap-2 text-[9px] font-mono text-stone-400 uppercase tracking-widest font-bold mb-1"><IndianRupee className="w-3 h-3 text-emerald-500" /> Allocation</div>
                        <div className="text-lg font-black text-navy-900 dark:text-stone-100 tracking-tight">{project.budget} <span className="text-[10px] font-mono text-stone-400">LAKH</span></div>
                    </div>
                    <div className="bg-stone-50 dark:bg-navy-800/50 p-4 rounded-3xl border border-stone-100 dark:border-navy-700 shadow-inner group-hover:bg-stone-100 dark:group-hover:bg-navy-800 transition-all">
                        <div className="flex items-center gap-2 text-[9px] font-mono text-stone-400 uppercase tracking-widest font-bold mb-1"><Clock className="w-3 h-3 text-saffron-500" /> Deadline</div>
                        <div className="text-lg font-black text-navy-900 dark:text-stone-100 tracking-tight">{new Date(project.deadline).toLocaleDateString('en-IN', { day:'numeric', month:'short' })}</div>
                    </div>
                </div>

                <div>
                    <div className="flex items-center justify-between mb-3">
                        <span className="text-[10px] font-mono font-black text-stone-500 dark:text-stone-400 uppercase tracking-widest px-1">Phase Synchronization</span>
                        <span className="text-xs font-mono font-black text-navy-900 dark:text-saffron-400 bg-saffron-500/10 px-2 py-0.5 rounded-lg">{project.progress}%</span>
                    </div>
                    <div className="h-4 bg-stone-100 dark:bg-navy-800 rounded-full overflow-hidden border border-stone-200 dark:border-navy-700 shadow-inner p-1">
                        <div className={`h-full rounded-full transition-all duration-1000 ease-out relative ${isDelayed ? 'bg-gradient-to-r from-red-500 to-orange-500 shadow-lg shadow-red-500/40' : 'bg-gradient-to-r from-saffron-500 to-amber-400 shadow-lg shadow-saffron-500/40'}`} style={{ width: `${project.progress}%` }}>
                            <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                        </div>
                    </div>
                </div>
            </div>

            <button 
                onClick={() => {
                    setSelectedProjectId(project.id);
                    setView('project-details');
                }}
                className="w-full py-4 bg-navy-900 dark:bg-navy-800 hover:bg-navy-800 dark:hover:bg-navy-700 text-stone-200 rounded-2xl text-[9px] font-mono font-black uppercase tracking-[0.3em] transition-all flex items-center justify-center gap-3 group/btn shadow-xl active:scale-[0.98]"
            >
                Intelligence Details <ChevronRight className="w-3 h-3 group-hover/btn:translate-x-1 transition-transform" />
            </button>
        </div>
    );
};

export default OngoingProjects;
