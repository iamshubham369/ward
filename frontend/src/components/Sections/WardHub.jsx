import React, { useContext } from 'react';
import { AppContext } from '../../context/AppContext';
import { Wind, CloudSun, Calendar, Phone, Trophy, UserPlus, ExternalLink, Zap, Clock } from 'lucide-react';

const WardHub = () => {
    const { language } = useContext(AppContext);

    const translations = {
        title: { en: 'Ward Command Center', hi: 'वार्ड कमांड सेंटर', mr: 'प्रभाग नियंत्रण केंद्र' },
        subtitle: { en: 'Tactical Dashboard', hi: 'सामरिक डैशबोर्ड', mr: 'सामरिक डॅशबोर्ड' },
        calendar: { en: 'Activity Calendar', hi: 'गतिविधि कैलेंडर', mr: 'कार्यक्रम कॅलेंडर' },
        directory: { en: 'Official Directory', hi: 'आधिकारिक निर्देशिका', mr: 'अधिकृत मार्गदर्शिका' },
        leaderboard: { en: 'Civic Leaderboard', hi: 'नागरिक लीडरबोर्ड', mr: 'नागरिक लीडरबोर्ड' },
        volunteer: { en: 'Volunteer Force', hi: 'स्वयंसेवक बल', mr: 'स्वयंसेवक दल' }
    };

    const getT = (key) => translations[key][language] || translations[key].en;

    const events = [
        { day: '12', month: 'Jul', title: 'Public Health Awareness Camp', time: '09:00 AM', location: 'Community Hall' },
        { day: '15', month: 'Jul', title: 'Digital Literacy Workshop', time: '11:30 AM', location: 'Ward Office' },
        { day: '18', month: 'Jul', title: 'Monthly Townhall Meeting', time: '04:00 PM', location: 'Virtual Only' }
    ];

    return (
        <section id="ward-hub" className="bg-navy-900 py-16 md:py-24 border-y border-navy-700/50 overflow-hidden relative">
            <div className="absolute inset-0 grid-bg opacity-10"></div>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 relative">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                    <div className="text-center md:text-left">
                        <span className="font-mono text-[10px] tracking-[0.3em] uppercase text-saffron-400 font-semibold mb-2 block">{getT('subtitle')}</span>
                        <h2 className="font-display font-black text-3xl sm:text-4xl md:text-5xl text-stone-50 leading-tight">
                            {getT('title')}
                        </h2>
                    </div>
                    <div className="flex items-center justify-center gap-4">
                        <div className="bg-navy-800 border border-navy-700 px-4 py-2 rounded-xl flex items-center gap-3">
                            <div className="w-2 h-2 rounded-full bg-emerald-500 pulse-dot"></div>
                            <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-widest font-bold">Systems Online</span>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {/* Environmental Monitoring */}
                    <div className="space-y-4">
                        <div className="bg-navy-800/80 backdrop-blur border border-navy-700 p-5 rounded-2xl group hover:border-saffron-500/50 transition-all duration-300">
                            <div className="flex items-center justify-between mb-4">
                                <span className="text-[10px] font-mono text-stone-500 uppercase tracking-widest">Air Quality Index</span>
                                <Wind className="w-4 h-4 text-emerald-400" />
                            </div>
                            <div className="flex items-end justify-between">
                                <div>
                                    <div className="font-display font-black text-4xl text-stone-50 italic">46</div>
                                    <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-tighter">Healthy Environment</span>
                                </div>
                                <div className="text-right">
                                    <div className="text-[10px] font-mono text-stone-500">PM2.5: 12µg</div>
                                    <div className="text-[10px] font-mono text-stone-500">PM10: 31µg</div>
                                </div>
                            </div>
                        </div>
                        <div className="bg-navy-800/80 backdrop-blur border border-navy-700 p-5 rounded-2xl group hover:border-saffron-500/50 transition-all">
                            <div className="flex items-center justify-between mb-4">
                                <span className="text-[10px] font-mono text-stone-500 uppercase tracking-widest">Local Weather</span>
                                <CloudSun className="w-4 h-4 text-saffron-400" />
                            </div>
                            <div className="flex items-end justify-between">
                                <div>
                                    <div className="font-display font-black text-4xl text-stone-50">32<span className="text-lg text-stone-400 font-light italic">°C</span></div>
                                    <span className="text-[10px] font-bold text-stone-300 uppercase tracking-tighter">Partly Cloudy Sky</span>
                                </div>
                                <Zap className="w-6 h-6 text-stone-600 mb-1" />
                            </div>
                        </div>
                    </div>

                    {/* Activity Calendar */}
                    <div className="md:col-span-2 reveal visible">
                        <div className="bg-navy-800/80 backdrop-blur border border-navy-700 p-6 md:p-8 rounded-3xl h-full flex flex-col group hover:border-saffron-500/20 transition-all">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                                <h3 className="font-display font-bold text-lg text-stone-50 flex items-center gap-3">
                                    <Calendar className="w-5 h-5 text-saffron-400" />
                                    {getT('calendar')}
                                </h3>
                                <button className="text-[10px] font-mono text-saffron-500 hover:text-saffron-400 hover:underline uppercase transition-all">View All Protocols</button>
                            </div>
                            <div className="space-y-4 flex-1">
                                {events.map((event, idx) => (
                                    <div key={idx} className="flex gap-4 p-3 rounded-xl bg-navy-900/50 border border-navy-700 hover:border-saffron-500/30 transition-all group/item cursor-pointer">
                                        <div className="shrink-0 w-12 h-12 bg-navy-800 rounded-lg border border-navy-600 flex flex-col items-center justify-center group-hover/item:border-saffron-500/50 shadow-inner">
                                            <span className="text-[9px] font-mono text-saffron-500 uppercase font-black">{event.month}</span>
                                            <span className="text-lg font-black text-stone-100 leading-none">{event.day}</span>
                                        </div>
                                        <div className="min-w-0">
                                            <h4 className="text-sm font-bold text-stone-50 truncate group-hover/item:text-saffron-400 transition-colors uppercase tracking-tight">{event.title}</h4>
                                            <p className="text-[10px] text-stone-500 mt-1 flex items-center gap-1.5"><Clock className="w-3 h-3" /> {event.time} — {event.location}</p>
                                        </div>
                                        <ExternalLink className="w-3 h-3 text-stone-600 ml-auto self-center group-hover/item:text-saffron-500" />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Meta Section */}
                    <div className="space-y-4">
                        <div className="bg-navy-800/80 backdrop-blur border border-navy-700 p-5 rounded-2xl shadow-xl hover:border-saffron-500/30 transition-all group">
                            <h3 className="text-[10px] font-mono font-black text-stone-100 uppercase mb-4 flex items-center justify-between tracking-widest">{getT('directory')} <Phone className="w-3 h-3 text-saffron-500" /></h3>
                            <div className="space-y-3">
                                <div className="flex items-center gap-3 p-2 rounded-lg bg-navy-900/50 hover:bg-navy-700 transition-colors cursor-pointer border border-transparent hover:border-navy-600">
                                    <div className="w-8 h-8 rounded-full bg-navy-700 border border-navy-600 flex items-center justify-center text-[10px] font-black text-stone-300">PD</div>
                                    <div className="min-w-0">
                                        <div className="text-[10px] font-bold text-stone-100 truncate">Smt. Priya D.</div>
                                        <div className="text-[8px] font-mono text-saffron-500 uppercase">Ward Councillor</div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 p-2 rounded-lg bg-navy-900/50 hover:bg-navy-700 transition-colors cursor-pointer border border-transparent hover:border-navy-600">
                                    <div className="w-8 h-8 rounded-full bg-navy-700 border border-navy-600 flex items-center justify-center text-[10px] font-black text-stone-300">RK</div>
                                    <div className="min-w-0">
                                        <div className="text-[10px] font-bold text-stone-100 truncate">Er. Rahul K.</div>
                                        <div className="text-[8px] font-mono text-saffron-500 uppercase">Water Board</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="bg-gradient-to-br from-saffron-600 to-orange-600 p-5 rounded-2xl shadow-2xl active:scale-[0.98] cursor-pointer transition-all hover:rotate-1 group relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -translate-y-12 translate-x-12 blur-2xl"></div>
                            <h3 className="text-[11px] font-mono font-black text-navy-900 uppercase tracking-widest">{getT('volunteer')}</h3>
                            <p className="text-[10px] text-navy-900/80 font-bold mt-1 max-w-[80%] leading-relaxed">Join 400+ citizens supporting ward initiatives.</p>
                            <div className="mt-4 flex items-center justify-between">
                                <div className="flex -space-x-1.5 font-bold">
                                    <div className="w-6 h-6 rounded-full border-2 border-saffron-500 bg-navy-900 text-[8px] flex items-center justify-center text-stone-100">4+</div>
                                </div>
                                <span className="bg-navy-900 text-saffron-400 px-3 py-1.5 rounded text-[8px] font-mono font-black uppercase tracking-widest shadow-xl">Apply Now</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default WardHub;
