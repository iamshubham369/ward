import React, { useContext, useRef, useState } from 'react';
import { AppContext } from '../../context/AppContext';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, TrendingUp, TrendingDown, CheckCircle2, AlertTriangle, Users, Activity, Target, Download, Award, ShieldAlert, Loader2 } from 'lucide-react';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

const ReportCard = ({ onBack }) => {
    const { issues, projects, currentWorkspace, language } = useContext(AppContext);
    const { t } = useTranslation();
    const reportRef = useRef(null);
    const [isDownloading, setIsDownloading] = useState(false);

    // Data Processing & Grading Logic
    const resolvedIssues = issues.filter(i => (i.status || '').toLowerCase() === 'resolved');
    const unresolvedIssues = issues.filter(i => (i.status || '').toLowerCase() !== 'resolved');
    const completedProjects = projects.filter(p => (p.status || '').toLowerCase() === 'completed');
    const overdueProjects = projects.filter(p => (p.status || '').toLowerCase() === 'delayed');
    
    const resolutionRate = issues.length ? (resolvedIssues.length / issues.length) * 100 : 0;
    const projectCompletionRate = projects.length ? (completedProjects.length / projects.length) * 100 : 0;
    
    // Calculate Grade
    let grade = 'F';
    let gradeColor = 'text-red-500';
    let gradeMessage = 'Critical Intervention Required';
    const totalScore = (resolutionRate * 0.6) + (projectCompletionRate * 0.4);
    
    if (totalScore >= 90) { grade = 'A+'; gradeColor = 'text-emerald-400'; gradeMessage = 'Exceptional Governance'; }
    else if (totalScore >= 80) { grade = 'A'; gradeColor = 'text-emerald-500'; gradeMessage = 'Outstanding Performance'; }
    else if (totalScore >= 70) { grade = 'B'; gradeColor = 'text-blue-400'; gradeMessage = 'Solid Administration'; }
    else if (totalScore >= 60) { grade = 'C'; gradeColor = 'text-saffron-500'; gradeMessage = 'Needs Improvement'; }
    else if (totalScore >= 50) { grade = 'D'; gradeColor = 'text-orange-500'; gradeMessage = 'Below Expectations'; }

    // Category Breakdown
    const categoryCounts = issues.reduce((acc, issue) => {
        if (!acc[issue.category]) acc[issue.category] = { total: 0, resolved: 0 };
        acc[issue.category].total++;
        if ((issue.status || '').toLowerCase() === 'resolved') acc[issue.category].resolved++;
        return acc;
    }, {});
    
    const worstCategory = Object.entries(categoryCounts).sort((a, b) => (a[1].resolved / a[1].total) - (b[1].resolved / b[1].total))[0];

    const totalBudget = projects.reduce((sum, p) => sum + (p.budget || 0), 0);
    const utilizedBudget = projects.reduce((sum, p) => sum + (p.fund_usage || (p.budget * 0.5) || 0), 0); 

    const topIssue = [...issues].sort((a, b) => b.upvotes - a.upvotes)[0];
    const topCompletedProject = [...completedProjects].sort((a, b) => (b.budget || 0) - (a.budget || 0))[0];

    const handleDirectDownload = async () => {
        setIsDownloading(true);
        await new Promise(r => setTimeout(r, 100));
        
        try {
            const doc = new jsPDF();
            const wardName = currentWorkspace?.ward_name || 'Ward';
            const dateStr = new Date().toLocaleDateString();
            
            // ==========================================
            // HEADER BANNER
            // ==========================================
            doc.setFillColor(15, 23, 42); // Navy-900
            doc.rect(0, 0, 210, 45, 'F');
            
            // Accent Line
            doc.setFillColor(245, 158, 11); // Saffron
            doc.rect(0, 45, 210, 2, 'F');

            doc.setTextColor(255, 255, 255);
            doc.setFontSize(26);
            doc.setFont("helvetica", "bold");
            doc.text("WARD PERFORMANCE MANDATE", 14, 20);
            
            doc.setFontSize(11);
            doc.setFont("helvetica", "normal");
            doc.setTextColor(200, 200, 200);
            doc.text("Civic Intelligence & Infrastructure Report", 14, 28);
            
            doc.setTextColor(245, 158, 11); // Saffron
            doc.setFont("helvetica", "bold");
            doc.text(`WARD: ${wardName.toUpperCase()}`, 14, 38);
            
            doc.setTextColor(255, 255, 255);
            doc.setFont("helvetica", "normal");
            doc.text(`DATE: ${dateStr}`, 150, 38);

            // ==========================================
            // OVERALL GRADE CARD (Large Box Right Side)
            // ==========================================
            doc.setFillColor(248, 250, 252); // Slate-50
            doc.setDrawColor(226, 232, 240);
            doc.roundedRect(140, 55, 56, 40, 3, 3, 'FD');
            
            doc.setTextColor(100, 116, 139);
            doc.setFontSize(9);
            doc.setFont("helvetica", "bold");
            doc.text("MANDATE GRADE", 168, 65, { align: 'center' });
            
            // The Grade Letter
            let rgb = [245, 158, 11]; // default saffron
            if (grade.includes('A')) rgb = [16, 185, 129];
            else if (grade.includes('B')) rgb = [59, 130, 246];
            else if (grade.includes('D') || grade.includes('F')) rgb = [239, 68, 68];
            
            doc.setTextColor(rgb[0], rgb[1], rgb[2]);
            doc.setFontSize(36);
            doc.text(grade, 168, 82, { align: 'center' });
            
            doc.setTextColor(71, 85, 105);
            doc.setFontSize(8);
            doc.text(gradeMessage.toUpperCase(), 168, 90, { align: 'center' });

            // ==========================================
            // QUICK METRICS (Left Side)
            // ==========================================
            doc.setTextColor(15, 23, 42);
            doc.setFontSize(14);
            doc.setFont("helvetica", "bold");
            doc.text("Executive Summary", 14, 62);

            // Helper function to draw a metric block
            const drawMetric = (label, value, x, y) => {
                doc.setTextColor(100, 116, 139);
                doc.setFontSize(9);
                doc.setFont("helvetica", "normal");
                doc.text(label, x, y);
                doc.setTextColor(15, 23, 42);
                doc.setFontSize(14);
                doc.setFont("helvetica", "bold");
                doc.text(value.toString(), x, y + 6);
            };

            drawMetric("Total Citizen Issues", issues.length, 14, 75);
            drawMetric("Successfully Resolved", resolvedIssues.length, 55, 75);
            drawMetric("Pending Escalation", unresolvedIssues.length, 95, 75);
            
            drawMetric("Total Projects", projects.length, 14, 90);
            drawMetric("Apportioned Budget", `Rs ${(totalBudget/10000000).toFixed(2)} Cr`, 55, 90);

            // ==========================================
            // RESOLUTION & EFFICIENCY BARS
            // ==========================================
            doc.text("Operational Efficiency", 14, 110);
            
            const drawProgressBar = (label, percentage, x, y, color) => {
                doc.setTextColor(71, 85, 105);
                doc.setFontSize(10);
                doc.setFont("helvetica", "bold");
                doc.text(label, x, y);
                doc.text(`${percentage.toFixed(1)}%`, x + 160, y, { align: 'right' });
                
                // Track
                doc.setFillColor(241, 245, 249);
                doc.roundedRect(x, y + 3, 160, 6, 3, 3, 'F');
                // Fill
                if (percentage > 0) {
                    doc.setFillColor(color[0], color[1], color[2]);
                    doc.roundedRect(x, y + 3, (percentage/100)*160, 6, 3, 3, 'F');
                }
            };

            drawProgressBar("Public Grievance Resolution Rate", resolutionRate, 14, 120, [59, 130, 246]); // Blue
            drawProgressBar("Infrastructure Project Completion", projectCompletionRate, 14, 135, [16, 185, 129]); // Green

            // ==========================================
            // SECTOR PERFORMANCE (Visual Table)
            // ==========================================
            let finalY = 160;
            doc.text("Sector Diagnostics", 14, finalY);

            const categoryData = Object.entries(categoryCounts).map(([cat, data]) => [
                cat.toUpperCase(), 
                data.total.toString(), 
                data.resolved.toString(),
                `${((data.resolved / data.total) * 100).toFixed(0)}%`
            ]);

            autoTable(doc, {
                startY: finalY + 5,
                head: [['SECTOR', 'REPORTED', 'RESOLVED', 'EFFICIENCY']],
                body: categoryData.length > 0 ? categoryData : [['No data', '-', '-', '-']],
                theme: 'plain',
                headStyles: { fillColor: [248, 250, 252], textColor: [100, 116, 139], fontStyle: 'bold', fontSize: 8 },
                bodyStyles: { borderBottomColor: [226, 232, 240], borderBottomWidth: 0.1 },
                styles: { fontSize: 9, cellPadding: 6 }
            });

            // ==========================================
            // TOP HIGHLIGHTS
            // ==========================================
            finalY = doc.lastAutoTable.finalY + 15;
            
            if (finalY > 240) { doc.addPage(); finalY = 20; }
            
            // Draw a subtle highlighted box for critical mandate
            doc.setFillColor(254, 252, 232); // Yellow-50
            doc.setDrawColor(253, 224, 71); // Yellow-300
            doc.roundedRect(14, finalY, 182, 25, 3, 3, 'FD');
            
            doc.setTextColor(161, 98, 7); // Yellow-700
            doc.setFontSize(9);
            doc.setFont("helvetica", "bold");
            doc.text("CRITICAL CITIZEN DEMAND (MOST UPVOTED)", 20, finalY + 8);
            
            doc.setTextColor(15, 23, 42);
            doc.setFontSize(11);
            if (topIssue) {
                doc.text(`"${topIssue.description.substring(0, 80)}${topIssue.description.length > 80 ? '...' : ''}" (${topIssue.upvotes} Upvotes)`, 20, finalY + 17);
            } else {
                doc.text("No critical issues flagged by citizens.", 20, finalY + 17);
            }

            // ==========================================
            // DETAILED PROJECT LEDGER
            // ==========================================
            finalY += 35;
            if (finalY > 230) { doc.addPage(); finalY = 20; }
            
            doc.setTextColor(15, 23, 42);
            doc.setFontSize(14);
            doc.text("Infrastructure Register", 14, finalY);

            const projectData = projects.map(p => [
                p.name_en,
                p.status ? p.status.toUpperCase() : 'ONGOING',
                `Rs. ${((p.budget || 0)/10000000).toFixed(2)} Cr`
            ]);

            autoTable(doc, {
                startY: finalY + 5,
                head: [['PROJECT DESCRIPTION', 'STATUS', 'BUDGET (CR)']],
                body: projectData.length > 0 ? projectData : [['No active projects', '-', '-']],
                theme: 'striped',
                headStyles: { fillColor: [15, 23, 42], textColor: [255, 255, 255], fontStyle: 'bold', fontSize: 8 },
                alternateRowStyles: { fillColor: [248, 250, 252] },
                styles: { fontSize: 9, cellPadding: 5 }
            });

            // ==========================================
            // FOOTER & PAGINATION
            // ==========================================
            const pageCount = doc.internal.getNumberOfPages();
            for (let i = 1; i <= pageCount; i++) {
                doc.setPage(i);
                doc.setFontSize(8);
                doc.setTextColor(148, 163, 184);
                // Footer Line
                doc.setDrawColor(226, 232, 240);
                doc.line(14, 285, 196, 285);
                doc.text(`WardPulse Intelligence System • Official Document • Page ${i} of ${pageCount}`, 105, 290, { align: 'center' });
            }

            doc.save(`WardPulse_Mandate_${wardName.replace(/\s+/g, '_')}.pdf`);
            
        } catch (error) {
            console.error("PDF Generation failed:", error);
            alert(`PDF Error: ${error.message}`);
        } finally {
            setIsDownloading(false);
        }
    };

    return (
        <div ref={reportRef} className="min-h-screen bg-stone-50 dark:bg-navy-950 pt-32 pb-20 px-4 print:pt-10 print:bg-white print:text-black">
            <div className="max-w-7xl mx-auto relative z-10">
                {/* Header Actions */}
                <div className="flex justify-between items-center mb-10 print:hidden relative z-50" data-html2canvas-ignore>
                    <button onClick={onBack} disabled={isDownloading} className="cursor-pointer relative z-50 flex items-center gap-2 text-stone-400 hover:text-saffron-500 transition-colors group">
                        <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                        <span className="text-[10px] font-mono font-black uppercase tracking-[0.3em]">{t('profile.return') || 'RETURN TO DASHBOARD'}</span>
                    </button>
                </div>

                {/* Report Header */}
                <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-8 mb-16 border-b border-stone-200 dark:border-navy-800 pb-10 print:border-stone-300">
                    <div>
                        <div className="flex items-center gap-3 mb-4">
                            <Award className="w-8 h-8 text-saffron-500" />
                            <span className="text-[10px] font-mono font-black text-saffron-500 uppercase tracking-[0.3em]">Official Performance Mandate</span>
                        </div>
                        <h2 className="font-display font-black text-5xl sm:text-7xl text-navy-900 dark:text-stone-50 leading-none uppercase tracking-tighter print:text-black">
                            {currentWorkspace?.ward_name || 'Ward'} <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-saffron-500 to-amber-700">Report Card</span>
                        </h2>
                        <p className="text-stone-500 text-sm font-mono mt-6 uppercase tracking-widest font-bold">
                            Citizen Visibility & Transparency Matrix &bull; FY 2026
                        </p>
                    </div>
                    
                    {/* The Grade Badge */}
                    <div className="bg-white dark:bg-navy-900 border-2 border-stone-100 dark:border-navy-800 p-8 rounded-3xl shadow-2xl flex flex-col items-center justify-center min-w-[200px] print:border-stone-300 print:shadow-none">
                        <span className="text-[9px] font-mono font-black text-stone-400 uppercase tracking-widest mb-2">Overall Grade</span>
                        <div className={`text-7xl font-display font-black ${gradeColor} tracking-tighter leading-none mb-3`}>
                            {grade}
                        </div>
                        <span className="text-xs font-mono font-bold text-stone-500 uppercase tracking-widest text-center">{gradeMessage}</span>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                    {/* The Achievements */}
                    <div className="bg-emerald-50 dark:bg-emerald-500/5 border border-emerald-200 dark:border-emerald-500/20 rounded-3xl p-8 lg:p-10 shadow-xl relative overflow-hidden print:border-emerald-200 print:bg-emerald-50">
                        <div className="absolute -right-10 -top-10 text-emerald-500/10"><CheckCircle2 className="w-64 h-64" /></div>
                        <div className="relative z-10">
                            <h3 className="text-3xl font-black text-emerald-900 dark:text-emerald-400 uppercase tracking-tight mb-8">Civic Successes</h3>
                            
                            <div className="space-y-8">
                                <div>
                                    <div className="flex justify-between items-end mb-2">
                                        <span className="text-xs font-mono font-bold text-emerald-700 dark:text-emerald-500 uppercase tracking-widest">Protocol Resolution Rate</span>
                                        <span className="text-2xl font-black text-emerald-900 dark:text-emerald-300">{resolutionRate.toFixed(1)}%</span>
                                    </div>
                                    <div className="h-3 w-full bg-emerald-200 dark:bg-emerald-950 rounded-full overflow-hidden">
                                        <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${resolutionRate}%` }}></div>
                                    </div>
                                    <p className="text-[10px] font-mono text-emerald-600 dark:text-emerald-500 mt-2 uppercase tracking-wider">{resolvedIssues.length} out of {issues.length} Issues Resolved</p>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-white dark:bg-emerald-950/50 p-5 rounded-2xl border border-emerald-100 dark:border-emerald-900/50">
                                        <span className="block text-[9px] font-mono font-bold text-emerald-600 uppercase tracking-widest mb-1">Completed Projects</span>
                                        <span className="text-3xl font-black text-emerald-900 dark:text-emerald-300">{completedProjects.length}</span>
                                    </div>
                                    <div className="bg-white dark:bg-emerald-950/50 p-5 rounded-2xl border border-emerald-100 dark:border-emerald-900/50">
                                        <span className="block text-[9px] font-mono font-bold text-emerald-600 uppercase tracking-widest mb-1">Citizen Trust Score</span>
                                        <span className="text-3xl font-black text-emerald-900 dark:text-emerald-300">{issues.length ? Math.min(100, Math.round(resolutionRate + (completedProjects.length * 2))) : 0}/100</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* The Failures / Bads */}
                    <div className="bg-red-50 dark:bg-red-500/5 border border-red-200 dark:border-red-500/20 rounded-3xl p-8 lg:p-10 shadow-xl relative overflow-hidden print:border-red-200 print:bg-red-50">
                        <div className="absolute -right-10 -top-10 text-red-500/10"><AlertTriangle className="w-64 h-64" /></div>
                        <div className="relative z-10">
                            <h3 className="text-3xl font-black text-red-900 dark:text-red-400 uppercase tracking-tight mb-8">Vulnerability Points</h3>
                            
                            <div className="space-y-8">
                                <div>
                                    <div className="flex justify-between items-end mb-2">
                                        <span className="text-xs font-mono font-bold text-red-700 dark:text-red-500 uppercase tracking-widest">Unresolved & Pending Issues</span>
                                        <span className="text-2xl font-black text-red-900 dark:text-red-300">{unresolvedIssues.length}</span>
                                    </div>
                                    <div className="h-3 w-full bg-red-200 dark:bg-red-950 rounded-full overflow-hidden">
                                        <div className="h-full bg-red-500 rounded-full" style={{ width: `${100 - resolutionRate}%` }}></div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-white dark:bg-red-950/50 p-5 rounded-2xl border border-red-100 dark:border-red-900/50">
                                        <span className="block text-[9px] font-mono font-bold text-red-600 uppercase tracking-widest mb-1">Delayed Infrastructure</span>
                                        <span className="text-3xl font-black text-red-900 dark:text-red-300">{overdueProjects.length}</span>
                                    </div>
                                    <div className="bg-white dark:bg-red-950/50 p-5 rounded-2xl border border-red-100 dark:border-red-900/50">
                                        <span className="block text-[9px] font-mono font-bold text-red-600 uppercase tracking-widest mb-1">Emergency Backlogs</span>
                                        <span className="text-3xl font-black text-red-900 dark:text-red-300">{unresolvedIssues.filter(i => i.priority === 'Emergency').length}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Deep Dive & Trends */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    
                    {/* Left Column: Sector Performance & Funds */}
                    <div className="lg:col-span-1 space-y-8">
                        {/* Capital Utilization */}
                        <div className="bg-white dark:bg-navy-800 border border-stone-200 dark:border-navy-700 rounded-3xl p-8 shadow-xl">
                            <h4 className="text-[10px] font-mono font-black text-stone-400 uppercase tracking-[0.3em] mb-6 flex items-center gap-3">
                                <Activity className="w-4 h-4 text-saffron-500" /> Capital Allocation
                            </h4>
                            <div className="mb-6">
                                <span className="block text-4xl font-black text-navy-900 dark:text-stone-100 tracking-tighter">₹{(totalBudget/10000000).toFixed(2)} Cr</span>
                                <span className="text-xs font-mono font-bold text-stone-500 uppercase tracking-widest">Total Apportioned Budget</span>
                            </div>
                            
                            <div className="space-y-2">
                                <div className="flex justify-between text-[10px] font-mono font-bold uppercase tracking-widest">
                                    <span className="text-stone-400">Funds Utilized</span>
                                    <span className="text-saffron-500">₹{(utilizedBudget/10000000).toFixed(2)} Cr</span>
                                </div>
                                <div className="h-2 w-full bg-stone-100 dark:bg-navy-900 rounded-full overflow-hidden">
                                    <div className="h-full bg-gradient-to-r from-saffron-500 to-amber-600 rounded-full" style={{ width: `${totalBudget ? (utilizedBudget/totalBudget)*100 : 0}%` }}></div>
                                </div>
                            </div>
                        </div>

                        {/* Critical Focus Area */}
                        {worstCategory && (
                            <div className="bg-stone-900 border border-stone-800 rounded-3xl p-8 shadow-xl text-stone-100 relative overflow-hidden print:bg-white print:border-red-500 print:text-black">
                                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20"></div>
                                <div className="relative z-10">
                                    <h4 className="text-[10px] font-mono font-black text-red-500 uppercase tracking-[0.3em] mb-4 flex items-center gap-2">
                                        <ShieldAlert className="w-4 h-4" /> Immediate Attention Required
                                    </h4>
                                    <h5 className="text-2xl font-black uppercase tracking-tight mb-2">{worstCategory[0]}</h5>
                                    <p className="text-xs font-mono text-stone-400 print:text-stone-600">
                                        Sector showing lowest resolution efficiency. Only {worstCategory[1].resolved} of {worstCategory[1].total} protocols resolved.
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Right Column: Citizen Voice */}
                    <div className="lg:col-span-2 bg-white dark:bg-navy-800 border border-stone-200 dark:border-navy-700 rounded-3xl p-8 shadow-xl">
                        <div className="flex items-center justify-between mb-8">
                            <h4 className="text-[10px] font-mono font-black text-stone-400 uppercase tracking-[0.3em] flex items-center gap-3">
                                <Users className="w-4 h-4 text-saffron-500" /> Citizen Mandate & Trends
                            </h4>
                            <span className="px-3 py-1 bg-saffron-500/10 text-saffron-500 rounded-full text-[9px] font-mono font-black uppercase tracking-widest">
                                {issues.reduce((acc, curr) => acc + (curr.upvotes || 0), 0)} Total Community Interactions
                            </span>
                        </div>
                        
                        {/* Sector Breakdown */}
                        <div className="mb-10">
                            <h5 className="text-xs font-mono font-bold text-stone-500 uppercase tracking-widest mb-4">Volume by Sector</h5>
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                                {Object.entries(categoryCounts).map(([cat, data]) => (
                                    <div key={cat} className="bg-stone-50 dark:bg-navy-900 border border-stone-100 dark:border-navy-700 rounded-2xl p-4">
                                        <span className="text-[10px] font-mono text-stone-400 uppercase tracking-widest font-black block mb-2">{cat}</span>
                                        <div className="flex items-baseline gap-2">
                                            <span className="text-3xl font-black text-navy-900 dark:text-stone-100">{data.total}</span>
                                            <span className="text-[9px] font-mono text-stone-500 uppercase">Issues</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Top Public Demand */}
                        {topIssue && (
                            <div className="bg-saffron-50 dark:bg-saffron-500/5 border border-saffron-200 dark:border-saffron-500/20 rounded-2xl p-6 print:bg-white print:border-saffron-300">
                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 bg-saffron-200 dark:bg-saffron-500/20 rounded-xl flex items-center justify-center shrink-0">
                                        <TrendingUp className="w-5 h-5 text-saffron-700 dark:text-saffron-500" />
                                    </div>
                                    <div>
                                        <span className="text-[9px] font-mono text-saffron-600 dark:text-saffron-500 uppercase tracking-widest font-black block mb-1">
                                            Highest Public Demand ({topIssue.upvotes} Upvotes)
                                        </span>
                                        <h5 className="text-xl font-black text-navy-900 dark:text-stone-100 uppercase tracking-tight leading-tight mb-2">
                                            "{language === 'hi' ? topIssue.description_hi : language === 'mr' ? topIssue.description_mr : topIssue.description}"
                                        </h5>
                                        <span className="inline-block px-2 py-1 bg-stone-200 dark:bg-navy-700 text-[9px] font-mono font-bold text-stone-600 dark:text-stone-300 rounded uppercase tracking-widest">
                                            Category: {topIssue.category} | Status: {topIssue.status}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        )}
                        
                        {/* Highlighted Project */}
                        {topCompletedProject && (
                            <div className="mt-4 bg-emerald-50 dark:bg-emerald-500/5 border border-emerald-200 dark:border-emerald-500/20 rounded-2xl p-6 print:bg-white print:border-emerald-300">
                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 bg-emerald-200 dark:bg-emerald-500/20 rounded-xl flex items-center justify-center shrink-0">
                                        <CheckCircle2 className="w-5 h-5 text-emerald-700 dark:text-emerald-500" />
                                    </div>
                                    <div>
                                        <span className="text-[9px] font-mono text-emerald-600 dark:text-emerald-500 uppercase tracking-widest font-black block mb-1">
                                            Major Infrastructure Delivery
                                        </span>
                                        <h5 className="text-xl font-black text-navy-900 dark:text-stone-100 uppercase tracking-tight leading-tight mb-2">
                                            {topCompletedProject.name_en}
                                        </h5>
                                        <span className="inline-block px-2 py-1 bg-stone-200 dark:bg-navy-700 text-[9px] font-mono font-bold text-stone-600 dark:text-stone-300 rounded uppercase tracking-widest">
                                            Budget: ₹{(topCompletedProject.budget/10000000).toFixed(2)} Cr
                                        </span>
                                    </div>
                                </div>
                            </div>
                        )}

                    </div>
                </div>

                <div className="mt-16 flex flex-col items-center gap-6 print:hidden">
                    <button onClick={handleDirectDownload} disabled={isDownloading} className="cursor-pointer relative z-50 flex items-center gap-2 px-8 py-4 bg-saffron-500 text-navy-900 rounded-xl hover:bg-saffron-400 hover:scale-105 transition-all shadow-[0_0_30px_rgba(245,158,11,0.3)] disabled:opacity-50 disabled:hover:scale-100 disabled:cursor-not-allowed">
                        {isDownloading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Download className="w-5 h-5" />}
                        <span className="text-xs font-mono font-black uppercase tracking-[0.2em]">
                            {isDownloading ? 'Preparing PDF...' : 'Download PDF Report'}
                        </span>
                    </button>
                </div>

                <div className="mt-8 text-center print:block hidden">
                    <p className="text-[10px] font-mono text-stone-400 uppercase tracking-widest">
                        Generated by WardPulse Intelligence Portal &bull; {new Date().toLocaleDateString()}
                    </p>
                </div>

            </div>
        </div>
    );
};

export default ReportCard;
