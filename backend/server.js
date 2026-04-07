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
    const { name, email, password, security_question, security_answer } = req.body;
    try {
        const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(email);
        if (existing) return res.status(400).json({ success: false, message: 'Identity Already Protocolled' });

        const result = db.prepare('INSERT INTO users (name, email, password, role, security_question, security_answer) VALUES (?, ?, ?, ?, ?, ?)').run(name, email, password, 'Citizen', security_question, security_answer);
        const user = { id: result.lastInsertRowid, name, email, role: 'Citizen' };
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
    const issues = db.prepare('SELECT * FROM issues ORDER BY timestamp DESC').all();
    res.json(issues);
});

app.post('/api/issues', upload.single('file'), (req, res) => {
    const { id, category, street, landmark, pincode, description, priority, anonymous, lat, lng } = req.body;
    const file_path = req.file ? `/uploads/${req.file.filename}` : null;
    
    db.prepare(`
        INSERT INTO issues (id, category, street, landmark, pincode, description, file_path, priority, anonymous, lat, lng)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(id, category, street, landmark, pincode, description, file_path, priority, anonymous == 'true' ? 1 : 0, lat, lng);
    
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
    const projects = db.prepare('SELECT * FROM projects ORDER BY start_date DESC').all();
    res.json(projects);
});

app.post('/api/projects', (req, res) => {
    const { name_en, name_hi, name_mr, category, dept_en, budget, start_date, deadline, contractor, lat, lng, allocation_details } = req.body;
    db.prepare(`
        INSERT INTO projects (name_en, name_hi, name_mr, category, dept_en, budget, start_date, deadline, contractor, lat, lng, allocation_details)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(name_en, name_hi, name_mr, category, dept_en, budget, start_date, deadline, contractor, lat, lng, allocation_details || '{}');
    res.json({ success: true });
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
    const notifs = db.prepare('SELECT * FROM notifications ORDER BY timestamp DESC LIMIT 5').all();
    res.json(notifs);
});

app.post('/api/notifications', (req, res) => {
    const { text, icon, color } = req.body;
    db.prepare('INSERT INTO notifications (text, icon, color) VALUES (?, ?, ?)').run(text, icon, color);
    res.json({ success: true });
});

app.listen(port, () => {
    console.log(`Backend server running on http://localhost:${port}`);

    // Seed initial projects if empty
    const projectCount = db.prepare('SELECT count(*) as count FROM projects').get().count;
    if (projectCount === 0) {
        db.prepare(`
            INSERT INTO projects (name_en, name_hi, name_mr, category, dept_en, budget, start_date, deadline, contractor, progress, status, lat, lng)
            VALUES 
            ('MG Road Resurfacing', 'एमजी रोड पुनर्संयोजन', 'एमजी रोड पुनरुज्जीवन', 'Roads', 'PWD', 240, '2025-06-01', '2025-08-15', 'Sharma Infrastructure', 45, 'On-Track', 21.146, 79.088),
            ('New Water Pipeline', 'नई जल पाइपलाइन', 'नवीन पाणी पाईपलाईन', 'Water Supply', 'Water Board', 180, '2025-05-15', '2025-09-10', 'Global Pipes Ltd', 25, 'Delayed', 21.144, 79.086)
        `).run();
    }
});
