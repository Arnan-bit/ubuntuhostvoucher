#!/usr/bin/env node

// Script to initialize default mining tasks
const API_BASE = 'http://localhost:9002';

const defaultMiningTasks = [
    {
        id: 'screenshot_contributor',
        title: 'Screenshot Contributor',
        description: 'Submits proof of purchase and usage.',
        points: 25000000,
        icon: '📸',
        taskType: 'proof_submission',
        requirements: ['Screenshot of purchase', 'Usage proof', 'Service review'],
        cooldown: 168, // 1 week
        active: true
    },
    {
        id: 'loyal_reviewer',
        title: 'Loyal Reviewer',
        description: 'Provides a rating after using a service.',
        points: 2500,
        icon: '⭐',
        taskType: 'review_submission',
        requirements: ['Service usage', 'Honest review', 'Rating 1-5 stars'],
        cooldown: 72, // 3 days
        active: true
    },
    {
        id: 'social_ambassador',
        title: 'Social Ambassador',
        description: 'Shares deals on social media platforms.',
        points: 5000,
        icon: '📱',
        taskType: 'social_share',
        requirements: ['Share on social media', 'Include hashtags', 'Tag friends'],
        cooldown: 24,
        active: true
    },
    {
        id: 'daily_visitor',
        title: 'Daily Visitor',
        description: 'Visits the website daily and explores deals.',
        points: 500,
        icon: '🌐',
        taskType: 'daily_login',
        requirements: ['Daily website visit', 'Browse at least 3 deals'],
        cooldown: 24,
        active: true
    },
    {
        id: 'referral_master',
        title: 'Referral Master',
        description: 'Brings new users to the platform.',
        points: 10000,
        icon: '👥',
        taskType: 'referral',
        requirements: ['Invite new users', 'User must register', 'User must be active'],
        cooldown: 0,
        active: true
    }
];

async function saveMiningTask(taskData) {
    try {
        const response = await fetch(`${API_BASE}/api/action`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                type: 'saveProduct', 
                payload: { 
                    ...taskData, 
                    table: 'mining_tasks',
                    enabled: taskData.active
                } 
            })
        });

        const result = await response.json();
        if (!response.ok) throw new Error(result.error || 'Failed to save mining task');
        return result.data;
    } catch (error) {
        console.error(`Error saving mining task ${taskData.title}:`, error.message);
        return null;
    }
}

async function main() {
    console.log('🎯 Initializing default mining tasks...\n');
    
    let successCount = 0;
    let errorCount = 0;

    for (const task of defaultMiningTasks) {
        console.log(`⛏️ Adding: ${task.title} (+${task.points.toLocaleString()} points)`);
        
        const result = await saveMiningTask(task);
        if (result) {
            successCount++;
            console.log(`  ✅ Success`);
        } else {
            errorCount++;
            console.log(`  ❌ Failed`);
        }
        
        await new Promise(resolve => setTimeout(resolve, 100));
    }

    console.log(`\n📊 Mining Tasks Summary:`);
    console.log(`  ✅ Success: ${successCount}`);
    console.log(`  ❌ Errors: ${errorCount}`);
    console.log(`  📈 Total: ${defaultMiningTasks.length}`);
    
    if (successCount > 0) {
        console.log(`\n🎉 Mining tasks initialized successfully!`);
        console.log(`💡 Visit http://localhost:9002/admin/settings and go to "Advanced Gamification" → "Mining Activities" to manage them.`);
        console.log(`\n🎯 Available Tasks:`);
        defaultMiningTasks.forEach(task => {
            console.log(`  ${task.icon} ${task.title}: +${task.points.toLocaleString()} points`);
        });
    }
}

main();
