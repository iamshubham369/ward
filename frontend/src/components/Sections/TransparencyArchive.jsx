import React, { useContext } from 'react';
import { AppContext } from '../../context/AppContext';
import { useTranslation } from 'react-i18next';
import { FileStack, Table, Filter, Download, ExternalLink, ShieldCheck, ChevronRight } from 'lucide-react';

const TransparencyArchive = () => {
    const { language } = useContext(AppContext);
    const { t } = useTranslation();

    const rtiRecords = [
        { id: 'RTI-2025-001', subject: t('archive.rti1_subject'), status: t('archive.disclosed') },
        { id: 'RTI-2025-004', subject: t('archive.rti2_subject'), status: t('archive.disclosed') },
        { id: 'RTI-2025-009', subject: t('archive.rti3_subject'), status: t('archive.under_review') },
    ];

    return (
        <section id="archive" className="bg-stone-100 dark:bg-navy-950 py-16 md:py-24 border-t border-stone-200 dark:border-navy-900">
            <div className="max-w-7xl mx-auto px-4 sm:px-6">
                <div className="reveal visible mb-12">
                    <span className="font-mono text-[10px] tracking-[0.3em] uppercase text-saffron-600 font-black mb-2 block italic">{t('archive.portal')}</span>
                    <h2 className="font-display font-black text-3xl sm:text-4xl md:text-5xl text-navy-900 dark:text-stone-50 leading-tight flex items-center gap-4">
                        {t('archive.civic')} <span className="text-saffron-500 italic">{t('archive.archive')}</span> <FileStack className="w-8 h-8 text-saffron-500" />
                    </h2>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 reveal visible">
                    <div className="bg-white dark:bg-navy-900 rounded-3xl border border-stone-200 dark:border-navy-700 p-8 shadow-xl group">
                        <h3 className="text-xs font-mono font-black text-navy-800 dark:text-stone-300 uppercase tracking-widest mb-6 flex items-center justify-between">{t('archive.log')} <Table className="w-4 h-4 text-saffron-500" /></h3>
                        <div className="space-y-4">
                            {rtiRecords.map(rec => (
                                <div key={rec.id} className="p-4 rounded-2xl bg-stone-50 dark:bg-navy-800 border border-stone-100 dark:border-navy-700 hover:border-saffron-500/50 transition-all group/item cursor-pointer">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-[10px] font-mono font-bold text-saffron-500">{rec.id}</span>
                                        <span className={`text-[9px] font-mono px-2 py-0.5 rounded-lg border ${rec.status === t('archive.disclosed') ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 'bg-saffron-500/10 text-saffron-500 border-saffron-500/20'}`}>{rec.status}</span>
                                    </div>
                                    <h4 className="text-sm font-bold text-navy-900 dark:text-stone-100 mb-2 truncate">{rec.subject}</h4>
                                    <div className="flex items-center justify-between text-[10px] font-mono text-stone-400 font-bold uppercase tracking-widest">
                                        <span>Disclosed Sep 2025</span>
                                        <Download className="w-3 h-3 group-hover/item:text-saffron-500 transition-colors" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    
                    <div className="bg-navy-900 rounded-3xl p-10 text-stone-50 relative overflow-hidden group border border-navy-800">
                        <div className="relative z-10">
                            <ShieldCheck className="w-12 h-12 text-saffron-500 mb-6 group-hover:scale-110 transition-transform" />
                            <h3 className="font-display font-black text-3xl mb-4 tracking-tight uppercase">{t('archive.protocol')}</h3>
                            <p className="text-xs text-stone-400 font-bold uppercase tracking-widest mb-10 leading-relaxed max-w-[280px]">
                                {t('archive.desc')}
                            </p>
                            <button className="bg-saffron-500 text-navy-900 px-8 py-4 rounded-xl text-[10px] font-mono font-black uppercase tracking-[0.3em] hover:bg-saffron-400 transition-all flex items-center gap-3 group/btn">
                                {t('archive.initiate')}
                                <ChevronRight className="w-3 h-3 group-hover/btn:translate-x-1 transition-transform" />
                            </button>
                        </div>
                        <div className="absolute top-0 right-0 w-48 h-48 bg-saffron-500/5 rounded-full -translate-y-16 translate-x-16 blur-2xl"></div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default TransparencyArchive;
