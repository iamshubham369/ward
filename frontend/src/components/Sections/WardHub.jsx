import React, { useContext, useState } from 'react';
import { AppContext } from '../../context/AppContext';
import { useTranslation } from 'react-i18next';
import { Wind, CloudSun, Calendar, Phone, ExternalLink, Zap, Clock, X, ChevronRight, UserPlus, CheckCircle } from 'lucide-react';

const WardHub = () => {
    const { language } = useContext(AppContext);
    const { t } = useTranslation();
    const [showEventsModal, setShowEventsModal] = useState(false);
    const [showVolunteerModal, setShowVolunteerModal] = useState(false);
    const [volunteerSubmitted, setVolunteerSubmitted] = useState(false);
    const [volunteerForm, setVolunteerForm] = useState({ name: '', phone: '', skill: '' });

    const events = [
        { day: '12', month: 'Jul', title: 'Public Health Awareness Camp', time: '09:00 AM', location: 'Community Hall', desc: 'Free health checkups, blood pressure, eye testing. Organized by Ward 14 & NMC Health Dept.' },
        { day: '15', month: 'Jul', title: 'Digital Literacy Workshop', time: '11:30 AM', location: 'Ward Office', desc: 'Smartphone & internet skills for senior citizens. Certificates provided by Govt. of Maharashtra.' },
        { day: '18', month: 'Jul', title: 'Monthly Townhall Meeting', time: '04:00 PM', location: 'Virtual — Google Meet', desc: 'Open forum with Councillor. Submit questions in advance via the portal.' },
        { day: '22', month: 'Jul', title: 'Tree Plantation Drive', time: '07:00 AM', location: 'MG Road Median', desc: 'Plant 500 native species. Volunteers needed. Register via the Volunteer Force card.' },
        { day: '28', month: 'Jul', title: 'Road Safety Audit Walk', time: '06:30 AM', location: 'Dharampeth Circle', desc: 'Citizens inspect footpaths, crossings, and potholes. Report submitted to PWD the same day.' },
    ];

    const handleVolunteerSubmit = (e) => {
        e.preventDefault();
        setVolunteerSubmitted(true);
    };

    return (
        <>
            <section id="ward-hub" className="bg-navy-900 py-16 md:py-24 border-y border-navy-700/50 overflow-hidden relative">
                <div className="absolute inset-0 grid-bg opacity-10"></div>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 relative">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                        <div className="text-center md:text-left">
                            <span className="font-mono text-[10px] tracking-[0.3em] uppercase text-saffron-400 font-semibold mb-2 block">{t('hub.subtitle')}</span>
                            <h2 className="font-display font-black text-3xl sm:text-4xl md:text-5xl text-stone-50 leading-tight">{t('hub.title')}</h2>
                        </div>
                        <div className="flex items-center justify-center gap-4">
                            <div className="bg-navy-800 border border-navy-700 px-4 py-2 rounded-xl flex items-center gap-3">
                                <div className="w-2 h-2 rounded-full bg-emerald-500 pulse-dot"></div>
                                <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-widest font-black">{t('hub.systems_online')}</span>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {/* Environmental Monitoring */}
                        <div className="space-y-4">
                            <div className="bg-navy-800/80 backdrop-blur border border-navy-700 p-5 rounded-2xl group hover:border-saffron-500/50 transition-all duration-300">
                                <div className="flex items-center justify-between mb-4">
                                    <span className="text-[10px] font-mono text-stone-500 uppercase tracking-widest">{t('hub.aqi')}</span>
                                    <Wind className="w-4 h-4 text-emerald-400" />
                                </div>
                                <div className="flex items-end justify-between">
                                    <div>
                                        <div className="font-display font-black text-4xl text-stone-50 italic">46</div>
                                        <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-tighter">{t('hub.healthy')}</span>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-[10px] font-mono text-stone-500">PM2.5: 12µg</div>
                                        <div className="text-[10px] font-mono text-stone-500">PM10: 31µg</div>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-navy-800/80 backdrop-blur border border-navy-700 p-5 rounded-2xl group hover:border-saffron-500/50 transition-all">
                                <div className="flex items-center justify-between mb-4">
                                    <span className="text-[10px] font-mono text-stone-500 uppercase tracking-widest">{t('hub.weather')}</span>
                                    <CloudSun className="w-4 h-4 text-saffron-400" />
                                </div>
                                <div className="flex items-end justify-between">
                                    <div>
                                        <div className="font-display font-black text-4xl text-stone-50">32<span className="text-lg text-stone-400 font-light italic">°C</span></div>
                                        <span className="text-[10px] font-bold text-stone-300 uppercase tracking-tighter">{t('hub.cloudy')}</span>
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
                                        {t('hub.calendar')}
                                    </h3>
                                    {/* VIEW ALL EVENTS BUTTON — GUARANTEED WORKING */}
                                    <button
                                        type="button"
                                        onClick={() => setShowEventsModal(true)}
                                        className="bg-saffron-500/10 border border-saffron-500/40 text-saffron-400 hover:bg-saffron-500 hover:text-navy-900 px-4 py-1.5 rounded-lg text-[10px] font-mono font-black uppercase tracking-widest transition-all flex items-center gap-1.5"
                                    >
                                        View All Events <ChevronRight className="w-3 h-3" />
                                    </button>
                                </div>
                                <div className="space-y-3 flex-1">
                                    {events.slice(0, 3).map((event, idx) => (
                                        <div
                                            key={idx}
                                            onClick={() => setShowEventsModal(true)}
                                            className="flex gap-4 p-3 rounded-xl bg-navy-900/50 border border-navy-700 hover:border-saffron-500/30 transition-all group/item cursor-pointer"
                                        >
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
                                <h3 className="text-[10px] font-mono font-black text-stone-100 uppercase mb-4 flex items-center justify-between tracking-widest">{t('hub.directory')} <Phone className="w-3 h-3 text-saffron-500" /></h3>
                                <div className="space-y-3">
                                    <div className="flex items-center gap-3 p-2 rounded-lg bg-navy-900/50 hover:bg-navy-700 transition-colors cursor-pointer border border-transparent hover:border-navy-600">
                                        <div className="w-8 h-8 rounded-full bg-navy-700 border border-navy-600 flex items-center justify-center text-[10px] font-black text-stone-300">PD</div>
                                        <div className="min-w-0">
                                            <div className="text-[10px] font-bold text-stone-100 truncate">{t('hub.councillor_name')}</div>
                                            <div className="text-[8px] font-mono text-saffron-500 uppercase">{t('hub.councillor')}</div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 p-2 rounded-lg bg-navy-900/50 hover:bg-navy-700 transition-colors cursor-pointer border border-transparent hover:border-navy-600">
                                        <div className="w-8 h-8 rounded-full bg-navy-700 border border-navy-600 flex items-center justify-center text-[10px] font-black text-stone-300">RK</div>
                                        <div className="min-w-0">
                                            <div className="text-[10px] font-bold text-stone-100 truncate">{t('hub.water_board_name')}</div>
                                            <div className="text-[8px] font-mono text-saffron-500 uppercase">{t('hub.water_board')}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* VOLUNTEER CARD — APPLY NOW BUTTON GUARANTEED WORKING */}
                            <div className="bg-gradient-to-br from-saffron-600 to-orange-600 p-5 rounded-2xl shadow-2xl group relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -translate-y-12 translate-x-12 blur-2xl"></div>
                                <h3 className="text-[11px] font-mono font-black text-navy-900 uppercase tracking-widest">{t('hub.volunteer')}</h3>
                                <p className="text-[10px] text-navy-900/80 font-bold mt-1 max-w-[80%] leading-relaxed">{t('hub.volunteer_desc')}</p>
                                <div className="mt-4 flex items-center justify-between">
                                    <div className="flex -space-x-1.5 font-bold">
                                        <div className="w-6 h-6 rounded-full border-2 border-white bg-navy-900 text-[8px] flex items-center justify-center text-stone-100">4+</div>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => { setShowVolunteerModal(true); setVolunteerSubmitted(false); }}
                                        className="bg-navy-900 text-saffron-400 px-3 py-1.5 rounded text-[8px] font-mono font-black uppercase tracking-widest shadow-xl hover:bg-navy-800 active:scale-95 transition-all flex items-center gap-1.5"
                                    >
                                        <UserPlus className="w-3 h-3" /> Apply Now
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* EVENTS MODAL */}
            {showEventsModal && (
                <div className="fixed inset-0 z-[9999] bg-navy-950/90 backdrop-blur-md flex items-center justify-center p-4" onClick={() => setShowEventsModal(false)}>
                    <div className="bg-navy-900 border border-navy-700 rounded-3xl shadow-2xl w-full max-w-2xl max-h-[85vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
                        <div className="sticky top-0 bg-navy-900 border-b border-navy-700 p-6 flex items-center justify-between rounded-t-3xl z-10">
                            <div>
                                <span className="text-[9px] font-mono text-saffron-500 uppercase tracking-widest block mb-1">Municipal Calendar — Ward 14</span>
                                <h2 className="font-display font-black text-2xl text-stone-50 uppercase">Upcoming Events</h2>
                            </div>
                            <button onClick={() => setShowEventsModal(false)} className="w-10 h-10 rounded-xl bg-navy-800 border border-navy-700 flex items-center justify-center text-stone-400 hover:text-white hover:border-red-500/50 transition-all">
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                        <div className="p-6 space-y-4">
                            {events.map((event, idx) => (
                                <div key={idx} className="bg-navy-800/80 border border-navy-700 rounded-2xl p-5 hover:border-saffron-500/40 transition-all">
                                    <div className="flex gap-4">
                                        <div className="shrink-0 w-14 h-14 bg-navy-900 rounded-xl border border-navy-600 flex flex-col items-center justify-center">
                                            <span className="text-[9px] font-mono text-saffron-500 uppercase font-black">{event.month}</span>
                                            <span className="text-xl font-black text-stone-100 leading-none">{event.day}</span>
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-stone-50 uppercase tracking-tight mb-1">{event.title}</h4>
                                            <p className="text-[10px] text-stone-400 font-mono mb-2"><Clock className="w-3 h-3 inline mr-1" />{event.time} · {event.location}</p>
                                            <p className="text-xs text-stone-400 leading-relaxed">{event.desc}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* VOLUNTEER ENROLLMENT MODAL */}
            {showVolunteerModal && (
                <div className="fixed inset-0 z-[9999] bg-navy-950/90 backdrop-blur-md flex items-center justify-center p-4" onClick={() => setShowVolunteerModal(false)}>
                    <div className="bg-navy-900 border border-navy-700 rounded-3xl shadow-2xl w-full max-w-md" onClick={e => e.stopPropagation()}>
                        <div className="border-b border-navy-700 p-6 flex items-center justify-between">
                            <div>
                                <span className="text-[9px] font-mono text-saffron-500 uppercase tracking-widest block mb-1">Ward 14 — Volunteer Force</span>
                                <h2 className="font-display font-black text-2xl text-stone-50 uppercase">Enroll Now</h2>
                            </div>
                            <button onClick={() => setShowVolunteerModal(false)} className="w-10 h-10 rounded-xl bg-navy-800 border border-navy-700 flex items-center justify-center text-stone-400 hover:text-white hover:border-red-500/50 transition-all">
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                        {volunteerSubmitted ? (
                            <div className="p-10 flex flex-col items-center text-center gap-4">
                                <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center">
                                    <CheckCircle className="w-8 h-8 text-emerald-500" />
                                </div>
                                <h3 className="font-display font-black text-xl text-stone-50 uppercase">Enrollment Confirmed!</h3>
                                <p className="text-sm text-stone-400">Welcome, {volunteerForm.name}! You'll receive your first assignment within 48 hours on your registered number.</p>
                                <button onClick={() => setShowVolunteerModal(false)} className="mt-4 bg-saffron-500 text-navy-900 font-black px-8 py-3 rounded-xl text-xs font-mono uppercase tracking-widest hover:bg-saffron-400 transition-all">
                                    Done
                                </button>
                            </div>
                        ) : (
                            <form onSubmit={handleVolunteerSubmit} className="p-6 space-y-4">
                                <div>
                                    <label className="text-[10px] font-mono text-stone-500 uppercase tracking-widest block mb-2">Full Name</label>
                                    <input
                                        type="text"
                                        required
                                        placeholder="e.g. Rahul Sharma"
                                        value={volunteerForm.name}
                                        onChange={e => setVolunteerForm(p => ({ ...p, name: e.target.value }))}
                                        className="w-full bg-navy-950 border border-navy-700 rounded-xl px-4 py-3 text-sm text-stone-200 placeholder:text-stone-600 focus:outline-none focus:border-saffron-500 transition-all"
                                    />
                                </div>
                                <div>
                                    <label className="text-[10px] font-mono text-stone-500 uppercase tracking-widest block mb-2">Mobile Number</label>
                                    <input
                                        type="tel"
                                        required
                                        placeholder="e.g. 9876543210"
                                        value={volunteerForm.phone}
                                        onChange={e => setVolunteerForm(p => ({ ...p, phone: e.target.value }))}
                                        className="w-full bg-navy-950 border border-navy-700 rounded-xl px-4 py-3 text-sm text-stone-200 placeholder:text-stone-600 focus:outline-none focus:border-saffron-500 transition-all"
                                    />
                                </div>
                                <div>
                                    <label className="text-[10px] font-mono text-stone-500 uppercase tracking-widest block mb-2">Area of Interest</label>
                                    <select
                                        required
                                        value={volunteerForm.skill}
                                        onChange={e => setVolunteerForm(p => ({ ...p, skill: e.target.value }))}
                                        className="w-full bg-navy-950 border border-navy-700 rounded-xl px-4 py-3 text-sm text-stone-200 focus:outline-none focus:border-saffron-500 transition-all"
                                    >
                                        <option value="">Select an area...</option>
                                        <option>Road Safety & Infrastructure</option>
                                        <option>Sanitation & Cleanliness</option>
                                        <option>Digital Literacy & Outreach</option>
                                        <option>Health & Welfare Camps</option>
                                        <option>Tree Plantation & Environment</option>
                                    </select>
                                </div>
                                <button type="submit" className="w-full bg-saffron-500 hover:bg-saffron-400 text-navy-900 font-black py-3 rounded-xl text-xs font-mono uppercase tracking-widest transition-all flex items-center justify-center gap-2 mt-2">
                                    <UserPlus className="w-4 h-4" /> Submit Enrollment
                                </button>
                            </form>
                        )}
                    </div>
                </div>
            )}
        </>
    );
};

export default WardHub;
