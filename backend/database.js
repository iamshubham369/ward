const { DatabaseSync } = require('node:sqlite');
const path = require('path');

// Initialize built-in synchronous SQLite (available in Node 22.5+)
const db = new DatabaseSync(path.join(__dirname, 'database.db'));

// Helper to mimic better-sqlite3's prepare().get() and prepare().run()
// as node:sqlite's prepare() returns an object with similar but slightly different methods
const originalPrepare = db.prepare.bind(db);
db.prepare = (sql) => {
    const stmt = originalPrepare(sql);
    return {
        run: (...args) => stmt.run(...args),
        get: (...args) => stmt.all(...args)[0],
        all: (...args) => stmt.all(...args)
    };
};

// Create tables with FULL schema initially
db.exec(`
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT UNIQUE,
        password TEXT,
        name TEXT,
        role TEXT,
        security_question TEXT,
        security_answer TEXT
    );

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
        lng REAL,
        workspace_id TEXT DEFAULT 'nagpur'
    );

    CREATE TABLE IF NOT EXISTS projects (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
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
        lng REAL,
        workspace_id TEXT DEFAULT 'nagpur'
    );

    CREATE TABLE IF NOT EXISTS workspaces (
        id TEXT PRIMARY KEY,
        city TEXT,
        ward_name TEXT,
        admin_email TEXT,
        theme TEXT,
        admin_name TEXT,
        population_estimate INTEGER,
        ward_description TEXT,
        contact_number TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS notifications (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        text TEXT,
        icon TEXT,
        color TEXT,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
        workspace_id TEXT DEFAULT 'nagpur'
    );

    CREATE TABLE IF NOT EXISTS archive_records (
        id TEXT PRIMARY KEY,
        subject TEXT,
        status TEXT,
        disclosure_date TEXT,
        file_path TEXT,
        workspace_id TEXT DEFAULT 'nagpur'
    );

    CREATE TABLE IF NOT EXISTS project_ledger (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        project_id INTEGER,
        image_path TEXT,
        caption TEXT,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
        workspace_id TEXT DEFAULT 'nagpur'
    );

    CREATE TABLE IF NOT EXISTS community_posts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        author_name TEXT,
        author_role TEXT DEFAULT 'Citizen',
        category TEXT,
        content TEXT,
        upvotes INTEGER DEFAULT 0,
        ai_tag TEXT,
        ai_accuracy INTEGER,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
        workspace_id TEXT DEFAULT 'nagpur'
    );

    CREATE TABLE IF NOT EXISTS community_replies (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        post_id INTEGER,
        author_name TEXT,
        author_role TEXT DEFAULT 'Citizen',
        content TEXT,
        is_official INTEGER DEFAULT 0,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(post_id) REFERENCES community_posts(id)
    );

    CREATE TABLE IF NOT EXISTS messages (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        sender_id INTEGER,
        receiver_id INTEGER,
        content TEXT,
        type TEXT DEFAULT 'direct', -- 'direct' or 'broadcast'
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
        workspace_id TEXT DEFAULT 'nagpur'
    );
`);

// MIGRATION: Security columns for users
try {
    db.prepare('ALTER TABLE users ADD COLUMN security_question TEXT').run();
} catch (e) {}
try {
    db.prepare('ALTER TABLE users ADD COLUMN security_answer TEXT').run();
} catch (e) {}

// MIGRATION: Project details
try {
    db.prepare('ALTER TABLE projects ADD COLUMN allocation_details TEXT DEFAULT "{}"').run();
} catch (e) {}
try {
    db.prepare('ALTER TABLE projects ADD COLUMN fund_usage REAL DEFAULT 0').run();
} catch (e) {}

// MIGRATION: Tri-lingual columns to issues
const issueCols = ['street_hi', 'street_mr', 'landmark_hi', 'landmark_mr', 'description_hi', 'description_mr'];
issueCols.forEach(col => {
    try {
        db.prepare(`ALTER TABLE issues ADD COLUMN ${col} TEXT`).run();
    } catch (e) {}
});

// MIGRATION: Workspace isolation
try { db.prepare('ALTER TABLE issues ADD COLUMN workspace_id TEXT DEFAULT "nagpur"').run(); } catch (e) {}
try { db.prepare('ALTER TABLE projects ADD COLUMN workspace_id TEXT DEFAULT "nagpur"').run(); } catch (e) {}
try { db.prepare('ALTER TABLE notifications ADD COLUMN workspace_id TEXT DEFAULT "nagpur"').run(); } catch (e) {}

// MIGRATION: Workspace metadata
try {
    db.prepare('ALTER TABLE workspaces ADD COLUMN admin_name TEXT').run();
} catch (e) {}
try {
    db.prepare('ALTER TABLE workspaces ADD COLUMN population_estimate INTEGER').run();
} catch (e) {}
try {
    db.prepare('ALTER TABLE workspaces ADD COLUMN ward_description TEXT').run();
} catch (e) {}
try {
    db.prepare('ALTER TABLE workspaces ADD COLUMN contact_number TEXT').run();
} catch (e) {}

// Seed initial data if empty
const userCountRes = db.prepare('SELECT count(*) as count FROM users').get();
const userCount = userCountRes ? userCountRes.count : 0;
if (userCount === 0) {
    db.prepare('INSERT INTO users (email, password, name, role, security_question, security_answer) VALUES (?, ?, ?, ?, ?, ?)').run('citizen@ward14.in', 'citizen123', 'Ankit Mishra', 'Citizen', 'Favorite City', 'Nagpur');
    db.prepare('INSERT INTO users (email, password, name, role, security_question, security_answer) VALUES (?, ?, ?, ?, ?, ?)').run('admin@ward14.in', 'admin123', 'Smt. Priya Deshmukh', 'Authority', 'Portal Node', 'Ward-14');
}

const workspaceCountRes = db.prepare('SELECT count(*) as count FROM workspaces').get();
const workspaceCount = workspaceCountRes ? workspaceCountRes.count : 0;
if (workspaceCount === 0) {
    db.prepare('INSERT INTO workspaces (id, city, ward_name, admin_email, theme) VALUES (?, ?, ?, ?, ?)').run('nagpur', 'Nagpur', 'Ward 14', 'admin@ward14.in', 'Tactical Dark');
}

module.exports = db;
