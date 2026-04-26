const db = require('./database');

const issues = [
    { 
        id: 'SEC-ROAD-01', 
        category: 'Roads', 
        street: 'Pratap Nagar Main Road', 
        street_hi: 'प्रताप नगर मुख्य मार्ग',
        street_mr: 'प्रताप नगर मुख्य रस्ता',
        landmark: 'Opposite State Bank', 
        landmark_hi: 'स्टेट बैंक के सामने',
        landmark_mr: 'स्टेट बँकेच्या समोर',
        description: 'Severe structural integrity failure: Massive pothole node affecting tactical transport flow.', 
        description_hi: 'गंभीर संरचनात्मक विफलता: बड़े गड्ढे के कारण यातायात प्रवाह प्रभावित हो रहा है।',
        description_mr: 'गंभीर रचनात्मक बिघाड: मोठ्या खड्ड्यामुळे वाहतूक प्रवाहावर परिणाम होत आहे.',
        status: 'submitted', 
        upvotes: 42, 
        timestamp: new Date('2026-04-05T09:00:00Z').toISOString() 
    },
    { 
        id: 'SEC-WAT-02', 
        category: 'Water Supply', 
        street: 'Vivekanand Nagar Lane 4', 
        street_hi: 'विवेकानंद नगर लेन 4',
        street_mr: 'विवेकानंद नगर लेन ४',
        landmark: 'Near Ganesh Temple', 
        landmark_hi: 'गणेश मंदिर के पास',
        landmark_mr: 'गणेश मंदिराजवळ',
        description: 'Pipeline rupture detected: Critical wastage of municipal water resources. Immediate synchronization required.', 
        description_hi: 'पाइपलाइन फटने का पता चला: नगरपालिका जल संसाधनों की भारी बर्बादी। तत्काल सुधार की आवश्यकता।',
        description_mr: 'पाइपलाईन फुटली आहे: महापालिकेच्या पाणी संसाधनांची मोठी नासाडी. त्वरित दुरुस्ती आवश्यक.',
        status: 'In Progress', 
        upvotes: 28, 
        timestamp: new Date('2026-04-06T14:30:00Z').toISOString() 
    },
    { 
        id: 'SEC-ELE-03', 
        category: 'Electricity', 
        street: 'Laxmi Nagar Square', 
        street_hi: 'लक्ष्मी नगर चौक',
        street_mr: 'लक्ष्मी नगर चौक',
        landmark: 'Near Municipal School', 
        landmark_hi: 'नगरपालिका स्कूल के पास',
        landmark_mr: 'नगरपालिका शाळेजवळ',
        description: 'Streetlight node blackout: Security risk during night-time operation. Light sensor node offline.', 
        description_hi: 'स्ट्रीटलाइट ब्लैकआउट: रात के समय सुरक्षा जोखिम। प्रकाश सेंसर नोड ऑफलाइन।',
        description_mr: 'स्ट्रीटलाईट बंद आहे: रात्रीच्या वेळी सुरक्षेचा धोका. लाईट सेन्सर नोड ऑफलाईन.',
        status: 'submitted', 
        upvotes: 15, 
        timestamp: new Date('2026-04-07T02:00:00Z').toISOString() 
    },
    { 
        id: 'SEC-SAN-04', 
        category: 'Sanitation', 
        street: 'Bajaj Nagar Market', 
        street_hi: 'बजाज नगर मार्केट',
        street_mr: 'बजाज नगर मार्केट',
        landmark: 'Central Fruit Market', 
        landmark_hi: 'केंद्रीय फल बाजार',
        landmark_mr: 'मध्यवर्ती फळ बाजार',
        description: 'Solid waste overload at containment node. Health priority protocol initiated by community.', 
        description_hi: 'कचरा डिपो पर ठोस कचरे का अधिक भार। स्वास्थ्य प्राथमिकता प्रोटोकॉल शुरू।',
        description_mr: 'कचरा केंद्रावर घनकचऱ्याचा अतिभार. आरोग्य प्राधान्य प्रोटोकॉल सुरू.',
        status: 'Resolved', 
        upvotes: 56, 
        timestamp: new Date('2026-04-04T11:15:00Z').toISOString() 
    }
];

try {
    // 1. Clear existing Strategic Data to avoid PK conflicts
    db.prepare("DELETE FROM issues").run();
    console.log("Database Purge: Clean state initiated for telemetry influx.");

    // 2. Telemetry Influx with full Tri-Lingual metadata
    const insert = db.prepare(`
        INSERT INTO issues (
            id, category, street, street_hi, street_mr, 
            landmark, landmark_hi, landmark_mr, 
            description, description_hi, description_mr, 
            status, upvotes, timestamp
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    
    for (const i of issues) {
        insert.run(
            i.id, i.category, i.street, i.street_hi, i.street_mr, 
            i.landmark, i.landmark_hi, i.landmark_mr, 
            i.description, i.description_hi, i.description_mr, 
            i.status, i.upvotes, i.timestamp
        );
    }
    
    console.log("Telemetry Influx Successful: Tri-Lingual records synchronized.");
} catch (err) {
    console.error("Protocol Genesis Fault:", err);
} finally {
    db.close();
}
