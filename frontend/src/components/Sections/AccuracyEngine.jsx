import React, { useContext } from 'react';
import { AppContext } from '../../context/AppContext';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';
import { TrendingDown, TrendingUp, Info, Activity, Database, ShieldAlert, Cpu } from 'lucide-react';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend);

const AccuracyEngine = () => {
    const {} = useContext(AppContext);

    const lineData = {
        labels: ['Q1', 'Q2', 'Q3', 'Q4', 'Jan', 'Feb', 'Mar'],
        datasets: [{
            label: 'System Accuracy %',
            data: [65, 71, 68, 74, 72, 75, 72],
            borderColor: '#E8A317',
            backgroundColor: 'rgba(232, 163, 23, 0.1)',
            tension: 0.4,
            fill: true,
            pointRadius: 6,
            pointHoverRadius: 10,
            pointBackgroundColor: '#070D18',
            pointBorderWidth: 3,
            borderWidth: 4
        }]
    };

    const barData = {
        labels: ['Roads', 'Water', 'Electric', 'Sanit', 'Parks'],
        datasets: [{
            label: 'Dept Score',
            data: [58, 82, 75, 61, 90],
            backgroundColor: ['#3D5580', '#E8A317', '#2E4068', '#FBD96B', '#1A2640'],
            borderRadius: 12,
            hoverBackgroundColor: '#F5C342'
        }]
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false }, tooltip: { backgroundColor: '#0F1B2D', titleFont: { size: 10, family: 'JetBrains Mono' }, bodyFont: { size: 12, family: 'DM Sans' }, padding: 12, borderRadius: 12, displayColors: false } },
        scales: {
            y: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#B8A99A', font: { size: 10, family: 'JetBrains Mono' } } },
            x: { grid: { display: false }, ticks: { color: '#B8A99A', font: { size: 10, family: 'JetBrains Mono' } } }
        }
    };

    return (
        <section id="accuracy" className="bg-navy-900 grid-bg py-16 md:py-24 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-navy-950/80 via-navy-900/50 to-navy-950/90 pointer-events-none"></div>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
                <div className="reveal visible mb-12">
                    <span className="font-mono text-[10px] tracking-[0.3em] uppercase text-saffron-400 font-black mb-3 block italic tracking-[0.5em]">Data Intelligence Node</span>
                    <h2 className="font-display font-black text-4xl sm:text-5xl md:text-6xl text-stone-50 mt-2 mb-3 tracking-tighter uppercase group">
                        Accuracy <span className="text-saffron-500 italic">Engine</span>
                    </h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-12 reveal visible">
                    <div className="bg-navy-800/80 border border-navy-700/50 rounded-3xl p-10 text-center shadow-2xl backdrop-blur-xl group hover:border-saffron-500/30 transition-all duration-700">
                        <div className="text-[10px] font-mono text-stone-500 hover:text-saffron-400 uppercase tracking-[0.4em] mb-6 font-bold flex items-center justify-center gap-3 transition-colors">
                            Overall Accuracy <Cpu className="w-3.5 h-3.5 animate-pulse" />
                        </div>
                        <div className="flex items-end justify-center gap-3 group-hover:scale-110 transition-transform duration-500">
                            <span className="font-mono font-black text-7xl sm:text-8xl text-stone-50 tracking-tighter italic">72</span>
                            <span className="font-mono font-black text-3xl text-saffron-500 mb-4">%</span>
                            <span className="text-red-400 text-sm mb-6 ml-1 animate-bounce"><TrendingDown className="w-4 h-4" /></span>
                        </div>
                    </div>
                    <div className="bg-navy-800/80 border border-navy-700/50 rounded-3xl p-10 text-center shadow-2xl backdrop-blur-xl group hover:border-emerald-500/30 transition-all duration-700">
                        <div className="text-[10px] font-mono text-stone-500 hover:text-emerald-400 uppercase tracking-[0.4em] mb-6 font-bold flex items-center justify-center gap-3 transition-colors">
                            Trust Index <Activity className="w-3.5 h-3.5" />
                        </div>
                        <div className="flex items-end justify-center gap-3 group-hover:scale-110 transition-transform duration-500">
                            <span className="font-mono font-black text-7xl sm:text-8xl text-emerald-400 tracking-tighter italic">64</span>
                            <span className="font-mono font-black text-3xl text-stone-500 mb-4 italic">/100</span>
                            <span className="text-emerald-400 text-sm mb-6 ml-1"><TrendingUp className="w-4 h-4" /></span>
                        </div>
                    </div>
                </div>

                <div className="grid lg:grid-cols-2 gap-8 mb-12 reveal visible">
                    <div className="bg-navy-800/80 border border-navy-700/50 rounded-3xl p-8 sm:p-10 shadow-2xl backdrop-blur-md group hover:border-saffron-500/20 transition-all">
                        <h3 className="font-mono text-[10px] font-black text-stone-300 uppercase tracking-[0.25em] mb-10 flex items-center justify-between">
                            Historical Analytics — Quarterly Trend <Database className="w-4 h-4 text-saffron-500" />
                        </h3>
                        <div className="h-64 sm:h-80"><Line data={lineData} options={options} /></div>
                    </div>
                    <div className="bg-navy-800/80 border border-navy-700/50 rounded-3xl p-8 sm:p-10 shadow-2xl backdrop-blur-md group hover:border-saffron-500/20 transition-all">
                        <h3 className="font-mono text-[10px] font-black text-stone-300 uppercase tracking-[0.25em] mb-10 flex items-center justify-between">
                            Department Scorecard <ShieldAlert className="w-4 h-4 text-saffron-500" />
                        </h3>
                        <div className="h-64 sm:h-80"><Bar data={barData} options={options} /></div>
                    </div>
                </div>

                <div className="reveal visible group">
                    <div className="flex items-center justify-between mb-8">
                        <h3 className="font-display font-black text-2xl text-stone-50 tracking-tight uppercase group-hover:text-saffron-400 transition-colors">
                            Department Performance Meta-Breakdown
                        </h3>
                        <div className="text-[10px] font-mono text-stone-500 uppercase font-black bg-navy-900 px-4 py-2 rounded-xl border border-navy-700 flex items-center gap-2">
                             Full Telemetry <TrendingUp className="w-3 h-3 text-emerald-500" />
                        </div>
                    </div>
                    <div className="overflow-hidden rounded-[2rem] border border-navy-700/50 shadow-2xl backdrop-blur-xl">
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm font-mono font-bold text-stone-300">
                                <thead>
                                    <tr className="bg-navy-950/80 border-b border-navy-700/50">
                                        <th className="text-left px-8 py-6 text-[10px] uppercase tracking-[0.3em] font-black text-saffron-500 transition-colors">Department</th>
                                        <th className="text-center px-8 py-6 text-[10px] uppercase tracking-[0.3em] font-black text-stone-500">Accuracy</th>
                                        <th className="text-center px-8 py-6 text-[10px] uppercase tracking-[0.3em] font-black text-stone-500">Avg Delay</th>
                                        <th className="text-center px-8 py-6 text-[10px] uppercase tracking-[0.3em] font-black text-stone-500">Risk Profile</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-navy-700/30">
                                    <TableRow dept="PWD (Roads)" acc="58%" delay="+22 Days" risk="High" riskColor="text-red-500" />
                                    <TableRow dept="Water Board" acc="82%" delay="-4 Days" risk="Low" riskColor="text-emerald-500" />
                                    <TableRow dept="Electricity" acc="75%" delay="+2 Days" risk="Moderate" riskColor="text-saffron-400" />
                                    <TableRow dept="Sanitation" acc="61%" delay="+14 Days" risk="High" riskColor="text-red-500" />
                                    <TableRow dept="Parks & Admin" acc="90%" delay="-12 Days" risk="Stable" riskColor="text-emerald-500" />
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

const TableRow = ({ dept, acc, delay, risk, riskColor }) => (
    <tr className="hover:bg-navy-700/30 transition-all group/row cursor-default">
        <td className="px-8 py-6 text-stone-100 group-hover/row:text-saffron-400 transition-colors font-black tracking-tight">{dept}</td>
        <td className="px-8 py-6 text-center text-stone-300 font-black">{acc}</td>
        <td className="px-8 py-6 text-center text-stone-500 bg-navy-950/30">{delay}</td>
        <td className={`px-8 py-6 text-center ${riskColor} uppercase tracking-tighter text-[11px] font-black italic`}>{risk}</td>
    </tr>
);

export default AccuracyEngine;
