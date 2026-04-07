import React, { useContext, useEffect, useRef } from 'react';
import { AppContext } from '../../context/AppContext';
import { UserCheck, Users, Clock, ShieldCheck, ChevronDown } from 'lucide-react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

const Hero = () => {
    const { issues, projects } = useContext(AppContext);

    const stats = [
        { label: 'Issues Reported', target: issues?.length || 847, color: 'text-stone-50' },
        { label: 'Issues Resolved', target: 612, color: 'text-emerald-400' },
        { label: 'Active Projects', target: projects?.length || 5, color: 'text-saffron-400' },
        { label: 'Accuracy Score', target: 72, color: 'text-stone-50', suffix: '%' }
    ];

    const gaugeData = {
        datasets: [{
            data: [72, 28],
            backgroundColor: ['#E8A317', '#1A2640'],
            borderWidth: 0,
            circumference: 180,
            rotation: 270,
            cutout: '85%',
        }]
    };

    const gaugeOptions = {
        plugins: { tooltip: { enabled: false }, legend: { display: false } },
        maintainAspectRatio: false,
        responsive: true
    };

    return (
        <section id="hero" className="relative bg-navy-800 grid-bg pt-36 pb-16 md:pt-48 md:pb-24 overflow-hidden min-h-screen flex items-center">
            <div className="absolute inset-0 bg-gradient-to-b from-navy-900/50 via-transparent to-navy-900/80 pointer-events-none"></div>
            <div className="absolute top-20 right-10 w-96 h-96 bg-saffron-500/5 rounded-full blur-3xl pointer-events-none"></div>
            <div className="absolute bottom-10 left-10 w-72 h-72 bg-navy-500/10 rounded-full blur-3xl pointer-events-none"></div>
            
            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 w-full flex flex-col items-center lg:items-start">
                <div className="mb-6 text-center lg:text-left">
                    <span className="inline-block font-mono text-[10px] tracking-[0.3em] uppercase text-saffron-400 font-semibold border border-saffron-500/30 px-3 py-1 rounded-full">Nagpur Municipal Corporation</span>
                </div>

                <div className="grid lg:grid-cols-5 gap-12 items-center w-full">
                    <div className="lg:col-span-3 text-center lg:text-left">
                        <h1 className="font-display font-black text-5xl sm:text-6xl md:text-7xl lg:text-8xl text-stone-50 leading-[0.95] tracking-tight mb-4">
                            <span>Ward <span className="text-saffron-400">14</span></span>
                        </h1>
                        <p className="font-display text-xl sm:text-2xl text-stone-300/80 mb-6 italic">
                            Dharampeth, Nagpur
                        </p>

                        <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-stone-400 mb-8 justify-center lg:justify-start">
                            <span className="flex items-center gap-2"><UserCheck className="w-4 h-4 text-saffron-500/60" /> Councillor: Smt. Priya Deshmukh</span>
                            <span className="flex items-center gap-2"><Users className="w-4 h-4 text-saffron-500/60" /> Population: ~48,200</span>
                            <span className="flex items-center gap-2"><Clock className="w-4 h-4 text-saffron-500/60" /> Last sync: 3 min ago</span>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                            {stats.map((stat, idx) => (
                                <div key={idx} className="bg-navy-700/60 border border-navy-500/20 rounded-lg p-4 text-center backdrop-blur-sm">
                                    <div className={`font-mono font-bold text-2xl sm:text-3xl ${stat.color}`}>
                                        {stat.target}{stat.suffix}
                                    </div>
                                    <div className="text-[10px] font-mono text-stone-400 mt-1 uppercase tracking-wider">
                                        {stat.label}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="lg:col-span-2 flex flex-col items-center">
                        <div className="text-[10px] font-mono text-stone-400 uppercase tracking-[0.25em] mb-3 mt-12 lg:mt-0">
                            Ward Health Score
                        </div>
                        <div className="relative gauge-glow scale-90 sm:scale-100 w-64 h-40">
                            <Doughnut data={gaugeData} options={gaugeOptions} />
                            <div className="absolute inset-0 flex flex-col items-center justify-center pt-8">
                                <span className="font-mono text-4xl font-black text-stone-50 leading-none">72<span className="text-xl text-saffron-400 font-bold ml-0.5">%</span></span>
                                <span className="text-[10px] font-mono font-bold text-saffron-500 uppercase tracking-widest mt-1">Stellar</span>
                            </div>
                        </div>
                        <div className="grid grid-cols-3 gap-4 mt-8 w-full max-w-xs">
                            <div className="text-center"><div className="font-mono text-sm font-semibold text-stone-200">72%</div><div className="text-[9px] font-mono text-stone-500 uppercase">Resolution</div></div>
                            <div className="text-center"><div className="font-mono text-sm font-semibold text-stone-200">58%</div><div className="text-[9px] font-mono text-stone-500 uppercase">On-Time</div></div>
                            <div className="text-center"><div className="font-mono text-sm font-semibold text-stone-200">71%</div><div className="text-[9px] font-mono text-stone-500 uppercase">Satisfaction</div></div>
                        </div>
                    </div>
                </div>

                <div className="mt-10 flex justify-center w-full lg:justify-start">
                    <a href="#buzz" className="inline-flex items-center gap-2 text-stone-400 hover:text-saffron-400 transition-colors text-xs font-mono uppercase tracking-widest group">
                        <span>Scroll to explore</span>
                        <ChevronDown className="w-4 h-4 animate-bounce group-hover:translate-y-1 transition-transform" />
                    </a>
                </div>
            </div>
        </section>
    );
};

export default Hero;
