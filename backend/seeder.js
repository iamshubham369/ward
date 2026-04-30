const Database = require('better-sqlite3');
const path = require('path');
const db = new Database(path.join(__dirname, 'database.db'));

const workspaces = [
    { id: 'nagpur', city: 'Nagpur', ward: 'Ward 14', admin: 'admin@ward14.in', theme: 'Tactical Dark', pop: 45000, desc: 'Central logistics and residential hub.' },
    { id: 'pune', city: 'Pune', ward: 'Ward 05 (Kothrud)', admin: 'pune.admin@wardpulse.in', theme: 'Strategic Blue', pop: 68000, desc: 'High-density tech corridor and cultural node.' },
    { id: 'mumbai', city: 'Mumbai', ward: 'Ward D (Malabar Hill)', admin: 'mumbai.admin@wardpulse.in', theme: 'Premium Gold', pop: 120000, desc: 'Critical financial and high-value residential zone.' },
    { id: 'delhi', city: 'Delhi', ward: 'Ward 10 (Chanakyapuri)', admin: 'delhi.admin@wardpulse.in', theme: 'Military Green', pop: 35000, desc: 'Diplomatic enclave and administrative center.' }
];

const users = [
    { email: 'admin@ward14.in', pass: 'admin123', name: 'Smt. Priya Deshmukh', role: 'Authority', q: 'Portal Node', a: 'Ward-14' },
    { email: 'citizen@ward14.in', pass: 'citizen123', name: 'Ankit Mishra', role: 'Citizen', q: 'Favorite City', a: 'Nagpur' },
    { email: 'pune.admin@wardpulse.in', pass: 'pune123', name: 'Shri. Rajesh Patil', role: 'Authority', q: 'Deployment Code', a: 'Pune-05' },
    { email: 'mumbai.admin@wardpulse.in', pass: 'mumbai123', name: 'Ms. Neha Kapoor', role: 'Authority', q: 'Node ID', a: 'Mumbai-D' }
];

const projects = [
    // NAGPUR
    { wid: 'nagpur', name: 'MG Road Smart Resurfacing', cat: 'Roads', dept: 'PWD', budget: 120, start: '2026-01-10', end: '2026-08-15', contractor: 'Larsen & Toubro', lat: 21.1458, lng: 79.0882, prog: 45, status: 'On-Track' },
    { wid: 'nagpur', name: 'Amravati Pipeline Upgrade', cat: 'Water Supply', dept: 'NMC Water', budget: 85, start: '2026-02-01', end: '2026-06-30', contractor: 'Tata Projects', lat: 21.1520, lng: 79.0800, prog: 78, status: 'On-Track' },
    { wid: 'nagpur', name: 'Orange City Park Renovation', cat: 'Parks & Admin', dept: 'Gardens Dept', budget: 45, start: '2026-03-15', end: '2026-05-20', contractor: 'Green Scapes Inc', lat: 21.1400, lng: 79.0950, prog: 90, status: 'Resolved' },
    
    // PUNE
    { wid: 'pune', name: 'Kothrud Flyover Extension', cat: 'Roads', dept: 'PMC Infra', budget: 450, start: '2025-11-01', end: '2026-12-31', contractor: 'Reliance Infra', lat: 18.5074, lng: 73.8077, prog: 32, status: 'Delayed' },
    { wid: 'pune', name: 'Metro Line 3 Feeder Connectivity', cat: 'Electricity', dept: 'MSEDCL', budget: 210, start: '2026-04-01', end: '2026-10-15', contractor: 'ABB India', lat: 18.5150, lng: 73.8150, prog: 15, status: 'On-Track' },
    
    // MUMBAI
    { wid: 'mumbai', name: 'Coastal Road Phase 4 Junction', cat: 'Roads', dept: 'BMC Roads', budget: 1200, start: '2025-06-01', end: '2027-03-20', contractor: 'HCC-Hyundai', lat: 18.9500, lng: 72.8000, prog: 65, status: 'On-Track' },
    { wid: 'mumbai', name: 'Malabar Hill Reservoir Repair', cat: 'Water Supply', dept: 'Hydraulic Dept', budget: 340, start: '2026-01-15', end: '2026-09-01', contractor: 'Voltas Ltd', lat: 18.9580, lng: 72.7980, prog: 40, status: 'On-Track' }
];

const issues = [
    { wid: 'nagpur', id: 'NGP-001', cat: 'Roads', street: 'Pratap Nagar', landmark: 'SBI', desc: 'Severe pothole cluster in high-traffic lane.', status: 'submitted', up: 42, lat: 21.1200, lng: 79.0500 },
    { wid: 'pune', id: 'PUN-001', cat: 'Sanitation', street: 'Paud Road', landmark: 'McDonalds', desc: 'Garbage collection node overflow near food court.', status: 'in progress', up: 89, lat: 18.5080, lng: 73.8100 },
    { wid: 'mumbai', id: 'BOM-001', cat: 'Electricity', street: 'Nepean Sea Road', landmark: 'Petroleum Pump', desc: 'Multiple streetlights offline. Security protocol risk.', status: 'submitted', up: 12, lat: 18.9600, lng: 72.8050 },
    { wid: 'delhi', id: 'DEL-001', cat: 'Water Supply', street: 'Shanti Path', landmark: 'US Embassy', desc: 'Minor leakage detected in diplomatic pipeline.', status: 'resolved', up: 5, lat: 28.5900, lng: 77.1900 }
];

const notifications = [
    { wid: 'nagpur', text: 'Critical Water Maintenance scheduled for 2nd May.', icon: 'Zap', color: 'text-saffron-500' },
    { wid: 'pune', text: 'Kothrud Flyover night work: High decibel alert.', icon: 'AlertTriangle', color: 'text-red-500' },
    { wid: 'mumbai', text: 'Monsoon readiness audit completed for Ward D.', icon: 'CheckCircle', color: 'text-emerald-500' }
];

function seed() {
    console.log('--- WARDPULSE OS SEEDING PROTOCOL INITIATED ---');

    try {
        db.exec('DELETE FROM workspaces; DELETE FROM users; DELETE FROM projects; DELETE FROM issues; DELETE FROM notifications;');
        console.log('Data Purge: Complete.');

        const insertWorkspace = db.prepare('INSERT INTO workspaces (id, city, ward_name, admin_email, theme, population_estimate, ward_description) VALUES (?, ?, ?, ?, ?, ?, ?)');
        workspaces.forEach(w => insertWorkspace.run(w.id, w.city, w.ward, w.admin, w.theme, w.pop, w.desc));
        console.log('Workspaces: Synchronized.');

        const insertUser = db.prepare('INSERT INTO users (email, password, name, role, security_question, security_answer) VALUES (?, ?, ?, ?, ?, ?)');
        users.forEach(u => insertUser.run(u.email, u.pass, u.name, u.role, u.q, u.a));
        console.log('Users: Authenticated.');

        const insertProject = db.prepare('INSERT INTO projects (workspace_id, name_en, category, dept_en, budget, start_date, deadline, contractor, lat, lng, progress, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)');
        projects.forEach(p => insertProject.run(p.wid, p.name, p.cat, p.dept, p.budget, p.start, p.end, p.contractor, p.lat, p.lng, p.prog, p.status));
        console.log('Projects: Commissioned.');

        const insertIssue = db.prepare('INSERT INTO issues (workspace_id, id, category, street, landmark, description, status, upvotes, lat, lng) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)');
        issues.forEach(i => insertIssue.run(i.wid, i.id, i.cat, i.street, i.landmark, i.desc, i.status, i.up, i.lat, i.lng));
        console.log('Issues: Broadcasted.');

        const insertNotification = db.prepare('INSERT INTO notifications (workspace_id, text, icon, color) VALUES (?, ?, ?, ?)');
        notifications.forEach(n => insertNotification.run(n.wid, n.text, n.icon, n.color));
        console.log('Notifications: Broadcasted.');

        console.log('--- SEEDING PROTOCOL SUCCESSFUL ---');
    } catch (error) {
        console.error('--- SEEDING PROTOCOL FAULT ---');
        console.error(error);
    } finally {
        db.close();
    }
}

seed();
