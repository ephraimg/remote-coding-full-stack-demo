module.exports = {
  apps: [{
    name: 'xrp-demo',
    cwd: './server',
    script: 'dist/index.js',  // Run compiled JavaScript
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    }
  }]
}
