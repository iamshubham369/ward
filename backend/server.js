require('dotenv').config();
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const db = require('./database');
const fs = require('fs');

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Status Route
app.get('/', (req, res) => {
    res.send('<h1>Ward 14 Tactical Node: ACTIVE</h1><p>Status: All systems operational. Access the <a href="http://localhost:5173">Portal Dashboard</a>.</p>');
});

// Multer storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = path.join(__dirname, 'uploads');
        if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});
const upload = multer({ storage });

// AUTH - LOGIN
app.post('/api/auth/login', (req, res) => {
    const { email, password } = req.body;
    const user = db.prepare('SELECT id, email, name, role FROM users WHERE email = ? AND password = ?').get(email, password);
    if (user) {
        res.json({ success: true, user });
    } else {
        res.status(401).json({ success: false, message: 'Identity Verification Failed' });
    }
});

// AUTH - GOOGLE FEDERATION
app.post('/api/auth/google', (req, res) => {
    const { email, name } = req.body;
    try {
        let user = db.prepare('SELECT id, email, name, role FROM users WHERE email = ?').get(email);
        
        if (!user) {
            // Auto-enroll Google users
            const result = db.prepare('INSERT INTO users (name, email, role, security_question, security_answer) VALUES (?, ?, ?, ?, ?)').run(name, email, 'Citizen', 'Google SSO', 'Federated');
            user = { id: result.lastInsertRowid, name, email, role: 'Citizen' };
        }
        
        res.json({ success: true, user });
    } catch (e) {
        res.status(500).json({ success: false, message: 'Federation Protocol Error' });
    }
});

// AUTH - REGISTER
app.post('/api/auth/register', (req, res) => {
    const { name, email, password, security_question, security_answer, role } = req.body;
    try {
        const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(email);
        if (existing) return res.status(400).json({ success: false, message: 'Identity Already Protocolled' });

        const userRole = role === 'Authority' ? 'Authority' : 'Citizen';
        const result = db.prepare('INSERT INTO users (name, email, password, role, security_question, security_answer) VALUES (?, ?, ?, ?, ?, ?)').run(name, email, password, userRole, security_question, security_answer);
        const user = { id: result.lastInsertRowid, name, email, role: userRole };
        res.json({ success: true, user });
    } catch (e) {
        res.status(500).json({ success: false, message: 'Protocol Insertion Error' });
    }
});

// AUTH - GET SECURITY QUESTION
app.post('/api/auth/get-question', (req, res) => {
    const { email } = req.body;
    const user = db.prepare('SELECT security_question FROM users WHERE email = ?').get(email);
    if (user) {
        res.json({ success: true, question: user.security_question });
    } else {
        res.status(404).json({ success: false, message: 'Identity Not Found' });
    }
});

// AUTH - RECOVER (FORGOT)
app.post('/api/auth/recover', (req, res) => {
    const { email, answer, newPassword } = req.body;
    const user = db.prepare('SELECT id, security_answer FROM users WHERE email = ?').get(email);
    if (user && user.security_answer.toLowerCase() === answer.toLowerCase()) {
        db.prepare('UPDATE users SET password = ? WHERE id = ?').run(newPassword, user.id);
        res.json({ success: true, message: 'Security Key Reset Successful' });
    } else {
        res.status(401).json({ success: false, message: 'Verification Protocol Failure' });
    }
});

// AUTH - UPDATE PASSWORD (LOGGED IN)
app.post('/api/auth/update-password', (req, res) => {
    const { userId, answer, newPassword } = req.body;
    const user = db.prepare('SELECT security_answer FROM users WHERE id = ?').get(userId);
    if (user && user.security_answer.toLowerCase() === answer.toLowerCase()) {
        db.prepare('UPDATE users SET password = ? WHERE id = ?').run(newPassword, userId);
        res.json({ success: true, message: 'Security Key Updated' });
    } else {
        res.status(401).json({ success: false, message: 'Verification Protocol Failure' });
    }
});

// ISSUES
app.get('/api/issues', (req, res) => {
    const { workspace_id } = req.query;
    const issues = db.prepare('SELECT * FROM issues WHERE workspace_id = ? ORDER BY timestamp DESC').all(workspace_id || 'nagpur');
    res.json(issues);
});

app.post('/api/issues', upload.single('file'), (req, res) => {
    const { id, category, street, landmark, pincode, description, priority, anonymous, lat, lng, workspace_id } = req.body;
    const file_path = req.file ? `/uploads/${req.file.filename}` : null;
    
    db.prepare(`
        INSERT INTO issues (id, category, street, landmark, pincode, description, file_path, priority, anonymous, lat, lng, workspace_id)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(id, category, street, landmark, pincode, description, file_path, priority, anonymous == 'true' ? 1 : 0, lat, lng, workspace_id || 'nagpur');
    
    res.json({ success: true });
});

app.post('/api/issues/upvote/:id', (req, res) => {
    const { id } = req.params;
    db.prepare('UPDATE issues SET upvotes = upvotes + 1 WHERE id = ?').run(id);
    res.json({ success: true });
});

app.post('/api/issues/status/:id', (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    db.prepare('UPDATE issues SET status = ? WHERE id = ?').run(status, id);
    res.json({ success: true });
});

// PROJECTS
app.get('/api/projects', (req, res) => {
    const { workspace_id } = req.query;
    const projects = db.prepare('SELECT * FROM projects WHERE workspace_id = ? ORDER BY start_date DESC').all(workspace_id || 'nagpur');
    res.json(projects);
});

app.post('/api/projects', (req, res) => {
    try {
        const { name_en, name_hi, name_mr, category, dept_en, budget, start_date, deadline, contractor, lat, lng, allocation_details, workspace_id } = req.body;
        db.prepare(`
            INSERT INTO projects (name_en, name_hi, name_mr, category, dept_en, budget, start_date, deadline, contractor, lat, lng, allocation_details, workspace_id)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `).run(name_en, name_hi, name_mr, category, dept_en, budget, start_date, deadline, contractor, lat, lng, allocation_details || '{}', workspace_id || 'nagpur');
        res.json({ success: true });
    } catch (error) {
        console.error('CRITICAL: Project Genesis Failure:', error);
        res.status(500).json({ success: false, message: 'Project node rejected by database', error: error.message });
    }
});

app.get('/api/projects/:id', (req, res) => {
    const project = db.prepare('SELECT * FROM projects WHERE id = ?').get(req.params.id);
    if (project) res.json(project);
    else res.status(404).json({ error: 'Project not found' });
});

app.put('/api/projects/:id', (req, res) => {
    const { id } = req.params;
    const { name_en, name_hi, name_mr, category, budget, status, progress, allocation_details, fund_usage } = req.body;
    db.prepare(`
        UPDATE projects SET 
        name_en = ?, name_hi = ?, name_mr = ?, category = ?, 
        budget = ?, status = ?, progress = ?, allocation_details = ?, fund_usage = ?
        WHERE id = ?
    `).run(name_en, name_hi, name_mr, category, budget, status, progress, allocation_details, fund_usage, id);
    res.json({ success: true });
});

// NOTIFICATIONS
app.get('/api/notifications', (req, res) => {
    const { workspace_id } = req.query;
    const notifs = db.prepare('SELECT * FROM notifications WHERE workspace_id = ? ORDER BY timestamp DESC LIMIT 5').all(workspace_id || 'nagpur');
    res.json(notifs);
});

app.post('/api/notifications', (req, res) => {
    const { text, icon, color, workspace_id } = req.body;
    db.prepare('INSERT INTO notifications (text, icon, color, workspace_id) VALUES (?, ?, ?, ?)').run(text, icon, color, workspace_id || 'nagpur');
    res.json({ success: true });
});

// ARCHIVE
app.get('/api/archive', (req, res) => {
    const { workspace_id } = req.query;
    const records = db.prepare('SELECT * FROM archive_records WHERE workspace_id = ? ORDER BY disclosure_date DESC').all(workspace_id || 'nagpur');
    res.json(records);
});

// PROJECT LEDGER
app.get('/api/projects/ledger/:id', (req, res) => {
    const { id } = req.params;
    const ledger = db.prepare('SELECT * FROM project_ledger WHERE project_id = ? ORDER BY timestamp DESC').all(id);
    res.json(ledger);
});

// WORKSPACES
app.post('/api/workspaces', (req, res) => {
    const { id, city, ward_name, admin_email, theme, admin_name, population_estimate, ward_description, contact_number } = req.body;
    try {
        db.prepare(`
            INSERT INTO workspaces (id, city, ward_name, admin_email, theme, admin_name, population_estimate, ward_description, contact_number) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `).run(id, city, ward_name, admin_email, theme, admin_name, population_estimate || 0, ward_description, contact_number);
        res.json({ success: true, workspaceId: id });
    } catch (e) {
        console.error(e);
        res.status(500).json({ success: false, message: 'Failed to provision workspace' });
    }
});

app.put('/api/workspaces/:id', (req, res) => {
    const { id } = req.params;
    const { city, ward_name, admin_email, theme, admin_name, population_estimate, ward_description, contact_number } = req.body;
    try {
        db.prepare(`
            UPDATE workspaces 
            SET city = ?, ward_name = ?, admin_email = ?, theme = ?, admin_name = ?, population_estimate = ?, ward_description = ?, contact_number = ?
            WHERE id = ?
        `).run(city, ward_name, admin_email, theme, admin_name, population_estimate || 0, ward_description, contact_number, id);
        res.json({ success: true });
    } catch (e) {
        console.error(e);
        res.status(500).json({ success: false, message: 'Failed to update workspace' });
    }
});

app.get('/api/workspaces', (req, res) => {
    try {
        const workspaces = db.prepare('SELECT * FROM workspaces ORDER BY created_at DESC').all();
        res.json(workspaces);
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: 'Failed to fetch workspaces' });
    }
});

app.get('/api/workspaces/:id', (req, res) => {
    const workspace = db.prepare('SELECT * FROM workspaces WHERE id = ?').get(req.params.id);
    if (workspace) res.json(workspace);
    else res.status(404).json({ error: 'Workspace not found' });
});

// USERS (Admin Only in real world)
app.get('/api/users', (req, res) => {
    try {
        const users = db.prepare('SELECT id, name, email, role FROM users ORDER BY id DESC').all();
        res.json(users);
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: 'Failed to fetch users' });
    }
});

app.listen(port, () => {
    console.log(`Backend server running on http://localhost:${port}`);

    // Seed initial projects if empty
    try {
        const projectCount = db.prepare('SELECT count(*) as count FROM projects').get().count;
        if (projectCount === 0) {
            db.prepare(`
                INSERT INTO projects (name_en, name_hi, name_mr, category, dept_en, budget, start_date, deadline, contractor, progress, status, lat, lng)
                VALUES 
                ('MG Road Resurfacing', 'एमजी रोड पुनर्संयोजन', 'एमजी रोड पुनरुज्जीवन', 'Roads', 'PWD', 240, '2025-06-01', '2025-08-15', 'Sharma Infrastructure', 45, 'On-Track', 21.146, 79.088),
                ('New Water Pipeline', 'नई जल पाइपलाइन', 'नवीन पाणी पाईपलाईन', 'Water Supply', 'Water Board', 180, '2025-05-15', '2025-09-10', 'Global Pipes Ltd', 25, 'Delayed', 21.144, 79.086)
            `).run();
        }
    } catch (e) {}
});
