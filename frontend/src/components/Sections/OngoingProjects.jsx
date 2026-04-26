import React, { useContext } from 'react';
import { AppContext } from '../../context/AppContext';
import { motion } from 'framer-motion';
import { HardHat, IndianRupee, Calendar, ArrowRight, Clock } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const OngoingProjects = () => {
    const { t } = useTranslation();
    const { projects, language, setView, setSelectedProjectId } = useContext(AppContext);

    const getTranslation = (proj) => {
        if (language === 'hi' && proj.name_hi) return proj.name_hi;
        if (language === 'mr' && proj.name_mr) return proj.name_mr;
        return proj.name_en;
    };

    const getDeptTranslation = (proj) => {
        if (language === 'hi' && proj.dept_hi) return proj.dept_hi;
        if (language === 'mr' && proj.dept_mr) return proj.dept_mr;
        return proj.dept_en;
    };

    return (
        <section id="projects" className="py-32 bg-stone-50 dark:bg-navy-950 relative overflow-hidden transition-colors duration-500">
            {/* Ambient Background */}
            <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-saffron-500/5 to-transparent pointer-events-none"></div>
            
            <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
                <div className="mb-20">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="h-[2px] w-12 bg-saffron-500"></div>
                        <span className="text-[10px] font-mono font-black text-saffron-600 dark:text-saffron-500 uppercase tracking-[0.4em]">{t('projects.strategic')}</span>
                    </div>
                    <h2 className="text-6xl sm:text-7xl font-display font-black text-navy-900 dark:text-stone-50 mb-8 tracking-tighter italic uppercase underline decoration-saffron-500/30 decoration-8 underline-offset-8">
                        {t('projects.ongoing')}<br />
                        <span className="text-saffron-500">{t('projects.projects')}</span>
                    </h2>
                    <p className="max-w-2xl text-lg text-stone-500 dark:text-stone-400 font-medium leading-relaxed">
                        {t('projects.desc')}
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                    {projects.map((project, idx) => (
                        <motion.div 
                            key={project.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            onClick={() => {
                                setSelectedProjectId(project.id);
                                setView('project-details');
                            }}
                            className="group bg-white dark:bg-navy-900 rounded-[2.5rem] p-10 border border-stone-200 dark:border-navy-800 hover:border-saffron-500/50 transition-all duration-500 shadow-xl hover:shadow-2xl cursor-pointer relative overflow-hidden"
                        >
                            <div className="relative z-10">
                                <div className="flex justify-between items-start mb-10">
                                    <div className="bg-navy-900 dark:bg-navy-800 p-4 rounded-2xl group-hover:scale-110 transition-transform duration-500">
                                        <HardHat className="text-saffron-500 w-6 h-6" />
                                    </div>
                                    <div className="flex flex-col items-end">
                                        <span className="text-[9px] font-mono font-black text-stone-400 uppercase tracking-widest mb-1 italic opacity-60">Status</span>
                                        <span className={`text-[10px] font-mono font-black uppercase tracking-widest ${project.status === 'Delayed' ? 'text-red-500' : 'text-emerald-500'}`}>
                                            {t(`status.${(project.status || '').toLowerCase().replace('-', '_')}`)}
                                        </span>
                                    </div>
                                </div>

                                <h3 className="text-2xl font-display font-black text-navy-900 dark:text-stone-50 mb-4 group-hover:text-saffron-500 transition-colors uppercase leading-tight tracking-tight">
                                    {getTranslation(project)}
                                </h3>
                                <p className="text-xs font-mono text-stone-500 dark:text-stone-400 font-bold uppercase tracking-widest mb-8 flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 bg-saffron-500 rounded-full"></span> {getDeptTranslation(project)}
                                </p>

                                <div className="space-y-4 pt-6 border-t border-stone-100 dark:border-navy-800">
                                    <ProjectStat icon={<IndianRupee className="w-3 h-3" />} label={t('projects.allocation')} value={`₹ ${project.budget} ${t('common.lakh')}`} />
                                    <ProjectStat icon={<Clock className="w-3 h-3" />} label={t('projects.deadline')} value={new Date(project.deadline).toLocaleDateString(language === 'hi' ? 'hi-IN' : language === 'mr' ? 'mr-IN' : 'en-IN', { day:'numeric', month:'short' })} />
                                </div>

                                <div className="mt-8">
                                    <div className="flex items-center justify-between mb-3">
                                        <span className="text-[10px] font-mono font-black text-stone-500 dark:text-stone-400 uppercase tracking-widest">{t('projects.phase')}</span>
                                        <span className="text-xs font-mono font-black text-navy-900 dark:text-saffron-400">{project.progress}%</span>
                                    </div>
                                    <div className="h-2 bg-stone-100 dark:bg-navy-800 rounded-full overflow-hidden">
                                        <motion.div 
                                            initial={{ width: 0 }}
                                            whileInView={{ width: `${project.progress}%` }}
                                            className="h-full bg-saffron-500 shadow-[0_0_15px_rgba(234,179,8,0.4)]"
                                        />
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

const ProjectStat = ({ icon, label, value }) => (
    <div className="flex justify-between items-center bg-stone-50/50 dark:bg-navy-950/30 p-3 rounded-xl border border-stone-100 dark:border-navy-800">
        <div className="flex items-center gap-2">
            {icon}
            <span className="text-[9px] font-mono font-black text-stone-400 uppercase tracking-widest">{label}</span>
        </div>
        <span className="text-[10px] font-mono font-black text-navy-900 dark:text-stone-100">{value}</span>
    </div>
);

export default OngoingProjects;
