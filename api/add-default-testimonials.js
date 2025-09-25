// api/add-default-testimonials.js
import mysql from "mysql2";
import dotenv from "dotenv";
import { randomUUID } from "crypto";

dotenv.config();

const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE
});

console.log('Adding default testimonials...');

const defaultTestimonials = [
    {
        name: 'Charlie Low',
        role: 'Co-founder of Nohma',
        review: "Ever since we've been with HostVoucher, it's been amazing. We've not really had any issues at all and if we ever do have a question, their customer service is incredible.",
        imageUrl: 'https://i.pravatar.cc/150?u=charlie',
        rating: 5
    },
    {
        name: 'Jack Bies',
        role: 'Creative Director',
        review: "HostVoucher's Customer Success team goes above and beyond to understand my problem. Their dedication to performance and support is unmatched.",
        imageUrl: 'https://i.pravatar.cc/150?u=jack',
        rating: 5
    },
    {
        name: 'Jhon Ortega',
        role: 'Entrepreneur',
        review: "I was looking for a hosting company that is very intuitive for beginners and very well-configured for good performance. HostVoucher delivered on all fronts.",
        imageUrl: 'https://i.pravatar.cc/150?u=jhon',
        rating: 5
    },
    {
        name: 'Sarah Mills',
        role: 'E-commerce Specialist',
        review: "The speed and uptime are phenomenal. Our online store has never been faster, and we've seen a noticeable increase in conversions since switching to a provider found on HostVoucher.",
        imageUrl: 'https://i.pravatar.cc/150?u=sarah',
        rating: 5
    },
    {
        name: 'Mike Chen',
        role: 'Lead Developer, TechStart',
        review: "The VPS deals are unbeatable. We get the power and flexibility we need without the exorbitant costs. The curated selection on HostVoucher saved us days of research.",
        imageUrl: 'https://i.pravatar.cc/150?u=mike',
        rating: 5
    },
    {
        name: 'Elena Rodriguez',
        role: 'Digital Nomad & Blogger',
        review: "As someone who works from different countries, the VPN deals on HostVoucher are a lifesaver. I get top-tier security and access to global content at a fraction of the price.",
        imageUrl: 'https://i.pravatar.cc/150?u=elena',
        rating: 5
    },
    {
        name: 'David Kim',
        role: 'Startup Founder',
        review: "The hosting deals here saved our startup thousands of dollars. Quality providers at unbeatable prices. HostVoucher is a game-changer for small businesses.",
        imageUrl: 'https://i.pravatar.cc/150?u=david',
        rating: 5
    },
    {
        name: 'Lisa Wang',
        role: 'Marketing Manager',
        review: "Our website performance improved dramatically after switching to a hosting provider we found through HostVoucher. The deals are legitimate and the savings are real.",
        imageUrl: 'https://i.pravatar.cc/150?u=lisa',
        rating: 5
    },
    {
        name: 'Alex Thompson',
        role: 'Web Developer',
        review: "I've been using HostVoucher for over a year now. The curated deals and exclusive discounts have saved me and my clients significant money without compromising quality.",
        imageUrl: 'https://i.pravatar.cc/150?u=alex',
        rating: 5
    },
    {
        name: 'Maria Garcia',
        role: 'Online Store Owner',
        review: "The cloud hosting deals are incredible. My e-commerce site loads lightning fast now, and customer satisfaction has gone through the roof. Highly recommend HostVoucher!",
        imageUrl: 'https://i.pravatar.cc/150?u=maria',
        rating: 5
    }
];

db.connect((err) => {
    if (err) {
        console.error('Database connection failed:', err);
        process.exit(1);
    }
    
    console.log('✅ Connected to database');
    
    // Check if testimonials already exist
    db.query('SELECT COUNT(*) as count FROM testimonials', (err, results) => {
        if (err) {
            console.error('Error checking testimonials:', err);
            db.end();
            return;
        }
        
        const existingCount = results[0].count;
        console.log(`Found ${existingCount} existing testimonials`);
        
        if (existingCount > 0) {
            console.log('Testimonials already exist, skipping...');
            db.end();
            return;
        }
        
        console.log('Adding default testimonials...');
        
        let completed = 0;
        
        defaultTestimonials.forEach((testimonial, index) => {
            const insertQuery = `
                INSERT INTO testimonials (id, name, role, review, image_url, rating, created_at)
                VALUES (?, ?, ?, ?, ?, ?, NOW())
            `;
            
            const values = [
                randomUUID(),
                testimonial.name,
                testimonial.role,
                testimonial.review,
                testimonial.imageUrl,
                testimonial.rating
            ];
            
            db.query(insertQuery, values, (err, result) => {
                if (err) {
                    console.error(`Error inserting testimonial ${testimonial.name}:`, err);
                } else {
                    console.log(`✅ Added testimonial: ${testimonial.name}`);
                }
                
                completed++;
                
                if (completed === defaultTestimonials.length) {
                    console.log('🎉 All default testimonials added successfully!');
                    db.end();
                }
            });
        });
    });
});
