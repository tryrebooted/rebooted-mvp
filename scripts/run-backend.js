#!/usr/bin/env node

const { spawn } = require('child_process');
const path = require('path');
const os = require('os');

/**
 * Cross-platform script to run the Spring Boot backend
 * Automatically detects the operating system and uses the appropriate Maven wrapper
 */

function runBackend() {
  const isWindows = os.platform() === 'win32';
  const backendDir = path.join(__dirname, '..', 'backend');
  
  // Choose the appropriate Maven wrapper based on OS
  const mvnCommand = isWindows ? '.\\mvnw.cmd' : './mvnw';
  const args = ['spring-boot:run'];
  
  console.log(`🚀 Starting backend on ${os.platform()}...`);
  console.log(`📁 Backend directory: ${backendDir}`);
  console.log(`⚡ Running: ${mvnCommand} ${args.join(' ')}`);
  
  // Spawn the Maven process
  const mvnProcess = spawn(mvnCommand, args, {
    cwd: backendDir,
    stdio: 'inherit', // This will pipe the output to the parent process
    shell: isWindows // Use shell on Windows to handle .cmd files properly
  });
  
  // Handle process events
  mvnProcess.on('error', (error) => {
    console.error('❌ Failed to start backend process:', error.message);
    
    if (error.code === 'ENOENT') {
      console.error('💡 Make sure Maven wrapper exists in the backend directory');
      console.error(`   Expected file: ${path.join(backendDir, mvnCommand)}`);
    }
    
    process.exit(1);
  });
  
  mvnProcess.on('close', (code) => {
    if (code !== 0) {
      console.error(`❌ Backend process exited with code ${code}`);
      process.exit(code);
    } else {
      console.log('✅ Backend process completed successfully');
    }
  });
  
  // Handle Ctrl+C gracefully
  process.on('SIGINT', () => {
    console.log('\n🛑 Shutting down backend...');
    mvnProcess.kill('SIGINT');
  });
  
  process.on('SIGTERM', () => {
    console.log('\n🛑 Terminating backend...');
    mvnProcess.kill('SIGTERM');
  });
}

// Run the backend
runBackend();
