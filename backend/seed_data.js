const Database = require('better-sqlite3');
const db = new Database('./database.db');

const issues = [
    { 
        id: 'SEC-ROAD-01', 
        category: 'Roads', 
        street: 'Pratap Nagar Main Road', 
        landmark: 'Opposite State Bank', 
        description: 'Severe structural integrity failure: Massive pothole node affecting tactical transport flow.', 
        status: 'submitted', 
        upvotes: 42, 
        timestamp: new Date('2026-04-05T09:00:00Z').toISOString() 
    },
    { 
        id: 'SEC-WAT-02', 
        category: 'Water Supply', 
        street: 'Vivekanand Nagar Lane 4', 
        landmark: 'Near Ganesh Temple', 
        description: 'Pipeline rupture detected: Critical wastage of municipal water resources. Immediate synchronization required.', 
        status: 'In Progress', 
        upvotes: 28, 
        timestamp: new Date('2026-04-06T14:30:00Z').toISOString() 
    },
    { 
        id: 'SEC-ELE-03', 
        category: 'Electricity', 
        street: 'Laxmi Nagar Square', 
        landmark: 'Near Municipal School', 
        description: 'Streetlight node blackout: Security risk during night-time operation. Light sensor node offline.', 
        status: 'submitted', 
        upvotes: 15, 
        timestamp: new Date('2026-04-07T02:00:00Z').toISOString() 
    },
    { 
        id: 'SEC-SAN-04', 
        category: 'Sanitation', 
        street: 'Bajaj Nagar Market', 
        landmark: 'Central Fruit Market', 
        description: 'Solid waste overload at containment node. Health priority protocol initiated by community.', 
        status: 'Resolved', 
        upvotes: 56, 
        timestamp: new Date('2026-04-04T11:15:00Z').toISOString() 
    }
];

try {
    // 1. Purge draft/low-quality data
    const purge = db.prepare("DELETE FROM issues WHERE LENGTH(description) < 20 OR description LIKE '%test%'");
    const result = purge.run();
    console.log(`Strategic Purge Complete: ${result.changes} records neutralized.`);

    // 2. Telemetry Influx
    const insert = db.prepare("INSERT INTO issues (id, category, street, landmark, description, status, upvotes, timestamp) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
    
    for (const i of issues) {
        insert.run(i.id, i.category, i.street, i.landmark, i.description, i.status, i.upvotes, i.timestamp);
    }
    
    console.log("Telemetry Influx Successful: 4 high-fidelity intelligence records synchronized.");
} catch (err) {
    console.error("Protocol Genesis Fault:", err);
} finally {
    db.close();
}
