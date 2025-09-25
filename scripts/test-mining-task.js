#!/usr/bin/env node

// Simple test to save one mining task
const API_BASE = 'http://localhost:9002';

const testTask = {
    title: 'Screenshot Contributor',
    description: 'Submits proof of purchase and usage.',
    points: 25000000,
    icon: '📸',
    taskType: 'proof_submission',
    requirements: ['Screenshot of purchase', 'Usage proof', 'Service review'],
    cooldown: 168,
    active: true
};

async function testSaveMiningTask() {
    try {
        console.log('🧪 Testing mining task save...');
        console.log('Task data:', JSON.stringify(testTask, null, 2));
        
        const response = await fetch(`${API_BASE}/api/action`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                type: 'saveProduct', 
                payload: { 
                    ...testTask, 
                    table: 'mining_tasks',
                    enabled: testTask.active
                } 
            })
        });

        console.log('Response status:', response.status);
        console.log('Response headers:', Object.fromEntries(response.headers.entries()));
        
        const result = await response.text();
        console.log('Response body:', result);
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${result}`);
        }
        
        const jsonResult = JSON.parse(result);
        console.log('✅ Success! Task saved with ID:', jsonResult.data?.id);
        
    } catch (error) {
        console.error('❌ Error:', error.message);
        console.error('Full error:', error);
    }
}

testSaveMiningTask();
