module.exports = {
  apps: [
    {
      name: 'hostvoucher-frontend',
      script: 'npm',
      args: 'start',
      cwd: '/var/www/html/hostvoucher', // Sesuaikan dengan path deployment Anda
      env: {
        NODE_ENV: 'production',
        PORT: 3000
      },
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      error_file: './logs/frontend-error.log',
      out_file: './logs/frontend-out.log',
      log_file: './logs/frontend-combined.log',
      time: true
    },
    {
      name: 'hostvoucher-api',
      script: 'index.js',
      cwd: '/var/www/html/hostvoucher/api', // Sesuaikan dengan path deployment Anda
      env: {
        NODE_ENV: 'production',
        PORT: 5000
      },
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '512M',
      error_file: './logs/api-error.log',
      out_file: './logs/api-out.log',
      log_file: './logs/api-combined.log',
      time: true
    }
  ],

  deploy: {
    production: {
      user: 'root', // Sesuaikan dengan user server Anda
      host: 'your-server-ip', // Ganti dengan IP server Anda
      ref: 'origin/main',
      repo: 'https://github.com/your-username/hostvoucher.git', // Ganti dengan repo Anda
      path: '/var/www/html/hostvoucher',
      'pre-deploy-local': '',
      'post-deploy': 'npm install && cd api && npm install && cd .. && npm run build && pm2 reload ecosystem.config.js --env production',
      'pre-setup': ''
    }
  }
};
