#!/usr/bin/env node
/**
 * SSH Tunnel Setup for AWS MySQL Database Connection
 *
 * This script creates an SSH tunnel to securely connect to your AWS MySQL database
 * Usage: node setup-ssh-tunnel.js
 */

const { spawn } = require('child_process');
const fs = require('fs');

console.log('🔧 Setting up SSH tunnel for AWS MySQL database...\n');

// Configuration
const localPort = 3307; // Use different port to avoid conflicts
const remoteHost = '41.216.185.84';
const remotePort = 3306;
const sshUser = 'ubuntu'; // or your SSH username
const sshKeyPath = 'c:/Users/Asus ROG/OneDrive/Pictures/webhost/hostvoucher-dev-firebase-adminsdk-fbsvc-e942b79e18.json'; // Update this path

console.log('Configuration:');
console.log(`  Local Port: ${localPort}`);
console.log(`  Remote Host: ${remoteHost}:${remotePort}`);
console.log(`  SSH User: ${sshUser}`);
console.log(`  SSH Key: ${sshKeyPath}\n`);

// Check if SSH key exists
if (!fs.existsSync(sshKeyPath)) {
  console.error(`❌ SSH key not found at: ${sshKeyPath}`);
  console.log('\n🔧 To fix this:');
  console.log('1. Locate your AWS .pem key file');
  console.log('2. Update the sshKeyPath variable in this script');
  console.log('3. Make sure the key has correct permissions: chmod 400 your-key.pem');
  process.exit(1);
}

// SSH tunnel command
const sshCommand = 'ssh';
const sshArgs = [
  '-N', // Don't execute remote commands
  '-L', `${localPort}:${remoteHost}:${remotePort}`, // Local port forwarding
  '-i', sshKeyPath, // SSH key
  `${sshUser}@${remoteHost}` // SSH destination
];

console.log('🚀 Starting SSH tunnel...');
console.log(`Command: ${sshCommand} ${sshArgs.join(' ')}\n`);

const sshProcess = spawn(sshCommand, sshArgs, {
  stdio: 'inherit' // Show output in console
});

sshProcess.on('close', (code) => {
  if (code === 0) {
    console.log('\n✅ SSH tunnel closed successfully');
  } else {
    console.log(`\n❌ SSH tunnel failed with code: ${code}`);
  }
});

sshProcess.on('error', (error) => {
  console.error('\n❌ SSH tunnel error:', error.message);
  console.log('\n🔧 Troubleshooting:');
  console.log('1. Check your SSH key path and permissions');
  console.log('2. Verify your AWS instance is running');
  console.log('3. Make sure security group allows SSH (port 22)');
  console.log('4. Try connecting manually: ssh -i key.pem ubuntu@41.216.185.84');
});

// Keep the script running
console.log('🔄 SSH tunnel is active. Press Ctrl+C to stop.');
console.log('📝 Now update your .env.local to use:');
console.log(`   DB_HOST=localhost`);
console.log(`   DB_PORT=${localPort}`);
console.log('   (keep other DB settings the same)');
