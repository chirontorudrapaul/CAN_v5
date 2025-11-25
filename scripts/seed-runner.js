#!/usr/bin/env node
/**
 * Seed Script Runner
 * Ensures environment variables are properly loaded before running the seed script
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Load .env.local
const envLocalPath = path.join(__dirname, '..', '.env.local');

console.log(' Loading environment variables...');

if (!fs.existsSync(envLocalPath)) {
  console.error(' Error: .env.local not found at', envLocalPath);
  process.exit(1);
}

try {
  const envContent = fs.readFileSync(envLocalPath, 'utf-8');

  envContent.split('\n').forEach((line) => {
    line = line.trim();

    // Skip empty lines and comments
    if (!line || line.startsWith('#')) {
      return;
    }

    const [key, ...valueParts] = line.split('=');
    const value = valueParts.join('=').replace(/^["']|["']$/g, '');

    if (key && value) {
      process.env[key] = value;
      if (key === 'MONGODB_URI') {
        console.log(' Set MONGODB_URI');
      } else if (key === 'MONGODB_DB_NAME') {
        console.log(' Set MONGODB_DB_NAME');
      } else if (key === 'JWT_SECRET') {
        console.log(' Set JWT_SECRET');
      }
    }
  });
} catch (error) {
  console.error(' Error reading .env.local:', error.message);
  process.exit(1);
}

// Verify required variables
if (!process.env.MONGODB_URI) {
  console.error(' Error: MONGODB_URI not set in .env.local');
  process.exit(1);
}

console.log('\n Running seed script...\n');

// Run the actual seed script with the loaded environment
try {
  const seedScript = path.join(__dirname, 'seed-database.ts');
  execSync(`npx tsx "${seedScript}"`, {
    stdio: 'inherit',
    env: process.env,
    shell: process.platform === 'win32' ? 'powershell' : true,
  });
} catch (error) {
  // execSync throws on non-zero exit, but we want to propagate that
  process.exit(error.status || 1);
}
