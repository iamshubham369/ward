const Database = require('better-sqlite3');
const path = require('path');

const db = new Database(path.join(__dirname, 'database.db'));

// Create tables with Migration Logic
db.exec(`
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT UNIQUE,
        password TEXT,
        name TEXT,
        role TEXT
    );
`);

// MIGRATION: Add security columns if they don't exist
try {
    db.prepare('ALTER TABLE users ADD COLUMN security_question TEXT').run();
    db.prepare('ALTER TABLE users ADD COLUMN security_answer TEXT').run();
    console.log('Database Migration: Security Columns Activated.');
} catch (e) {}

try {
    db.prepare('ALTER TABLE projects ADD COLUMN allocation_details TEXT DEFAULT "{}"').run();
    db.prepare('ALTER TABLE projects ADD COLUMN fund_usage REAL DEFAULT 0').run();
    console.log('Database Migration: Project Allocation Node Synchronized.');
} catch (e) {}

// MIGRATION: Add tri-lingual columns to issues
const issueCols = ['street_hi', 'street_mr', 'landmark_hi', 'landmark_mr', 'description_hi', 'description_mr'];
issueCols.forEach(col => {
    try {
        db.prepare(`ALTER TABLE issues ADD COLUMN ${col} TEXT`).run();
        console.log(`Database Migration: Issue Column ${col} Synchronized.`);
    } catch (e) {}
});

// MIGRATION: Add workspace isolation to issues and projects
try {
    db.prepare('ALTER TABLE issues ADD COLUMN workspace_id TEXT DEFAULT "nagpur"').run();
    console.log('Database Migration: Issues Workspace Node Synchronized.');
} catch (e) {}

try {
    db.prepare('ALTER TABLE projects ADD COLUMN workspace_id TEXT DEFAULT "nagpur"').run();
    console.log('Database Migration: Projects Workspace Node Synchronized.');
} catch (e) {}

try {
    db.prepare('ALTER TABLE notifications ADD COLUMN workspace_id TEXT DEFAULT "nagpur"').run();
    console.log('Database Migration: Notifications Workspace Node Synchronized.');
} catch (e) {}

db.exec(`
    CREATE TABLE IF NOT EXISTS issues (
        id TEXT PRIMARY KEY,
        category TEXT,
        street TEXT,
        street_hi TEXT,
        street_mr TEXT,
        landmark TEXT,
        landmark_hi TEXT,
        landmark_mr TEXT,
        pincode TEXT,
        description TEXT,
        description_hi TEXT,
        description_mr TEXT,
        file_path TEXT,
        priority TEXT,
        anonymous INTEGER,
        status TEXT DEFAULT 'Submitted',
        upvotes INTEGER DEFAULT 0,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
        lat REAL,
        lng REAL
    );

    CREATE TABLE IF NOT EXISTS projects (
        id INTEGER PRIMARY KEY,
        name_en TEXT,
        name_hi TEXT,
        name_mr TEXT,
        category TEXT,
        dept_en TEXT,
        budget REAL,
        allocation_details TEXT DEFAULT '{}',
        fund_usage REAL DEFAULT 0,
        start_date TEXT,
        deadline TEXT,
        contractor TEXT,
        progress INTEGER DEFAULT 0,
        status TEXT DEFAULT 'On-Track',
        lat REAL,
        lng REAL
    );

    CREATE TABLE IF NOT EXISTS workspaces (
        id TEXT PRIMARY KEY,
        city TEXT,
        ward_name TEXT,
        admin_email TEXT,
        theme TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS notifications (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        text TEXT,
        icon TEXT,
        color TEXT,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
    );
`);

// MIGRATION: Add additional fields to workspaces
try {
    db.prepare('ALTER TABLE workspaces ADD COLUMN admin_name TEXT').run();
    db.prepare('ALTER TABLE workspaces ADD COLUMN population_estimate INTEGER').run();
    db.prepare('ALTER TABLE workspaces ADD COLUMN ward_description TEXT').run();
    db.prepare('ALTER TABLE workspaces ADD COLUMN contact_number TEXT').run();
    console.log('Database Migration: Workspace Metadata Columns Activated.');
} catch (e) {}

// Seed initial data if empty
const userCount = db.prepare('SELECT count(*) as count FROM users').get().count;
if (userCount === 0) {
    db.prepare('INSERT INTO users (email, password, name, role, security_question, security_answer) VALUES (?, ?, ?, ?, ?, ?)').run('citizen@ward14.in', 'citizen123', 'Ankit Mishra', 'Citizen', 'Favorite City', 'Nagpur');
    db.prepare('INSERT INTO users (email, password, name, role, security_question, security_answer) VALUES (?, ?, ?, ?, ?, ?)').run('admin@ward14.in', 'admin123', 'Smt. Priya Deshmukh', 'Authority', 'Portal Node', 'Ward-14');
}

const workspaceCount = db.prepare('SELECT count(*) as count FROM workspaces').get().count;
if (workspaceCount === 0) {
    db.prepare('INSERT INTO workspaces (id, city, ward_name, admin_email, theme) VALUES (?, ?, ?, ?, ?)').run('nagpur', 'Nagpur', 'Ward 14', 'admin@ward14.in', 'Tactical Dark');
}

module.exports = db;
