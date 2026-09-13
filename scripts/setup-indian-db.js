#!/usr/bin/env node

/**
 * MedInv Indian Database Setup Script
 * 
 * This script sets up the database with Indian preset data for the MedInv application.
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');
const { exec } = require('child_process');
const mysql = require('mysql2/promise');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs'); // Add bcrypt for password hashing

// Load environment variables
dotenv.config({ path: '.env.local' });

const sqlFile = path.join(__dirname, 'setup-indian-data.sql');
const sqlContent = fs.readFileSync(sqlFile, 'utf8');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

async function main() {
  console.log('MedInv Indian Database Setup');
  console.log('============================');
  
  try {
    // Get database credentials
    const host = process.env.DB_HOST || await prompt('Enter database host (default: localhost): ') || 'localhost';
    const user = process.env.DB_USER || await prompt('Enter database user (default: root): ') || 'root';
    const password = process.env.DB_PASSWORD || await prompt('Enter database password: ') || '';
    const database = process.env.DB_NAME || 'test2';
    
    // First check if MySQL server is running
    console.log('Checking if MySQL server is running...');
    
    try {
      await checkMySQLServer(host);
      console.log('MySQL server is running.');
    } catch (error) {
      console.error('Error connecting to MySQL server:', error.message);
      console.log('Attempting to start MySQL server...');
      
      try {
        await startMySQLServer();
        console.log('MySQL server started successfully.');
      } catch (startError) {
        console.error('Failed to start MySQL server:', startError.message);
        console.log('Please start your MySQL server manually and try again.');
        process.exit(1);
      }
    }
    
    // Create connection without database first
    console.log('Connecting to MySQL server...');
    let connection = await mysql.createConnection({
      host,
      user,
      password
    });
    
    // Create database if it doesn't exist
    console.log(`Creating database ${database} if it doesn't exist...`);
    await connection.query(`CREATE DATABASE IF NOT EXISTS ${database};`);
    
    // Close connection and reconnect with database selected
    await connection.end();
    
    // Execute the SQL file directly
    console.log('Importing schema and data from SQL file...');
    
    const command = `mysql -h${host} -u${user} ${password ? `-p${password}` : ''} ${database} < "${sqlFile}"`;
    
    exec(command, async (error, stdout, stderr) => {
      if (error) {
        console.error(`Error executing SQL file: ${error.message}`);
        console.log('Try running the following command manually:');
        console.log(`mysql -h ${host} -u ${user} -p ${database} < "${sqlFile}"`);
        rl.close();
        return;
      }
      
      if (stderr) {
        console.error(`SQL execution warning: ${stderr}`);
      }
      
      // Now hash the passwords for the staff accounts
      console.log('Hashing passwords for staff accounts...');
      try {
        await hashStaffPasswords(host, user, password, database);
        console.log('Staff passwords hashed successfully!');
      } catch (hashError) {
        console.error('Error hashing passwords:', hashError.message);
      }
      
      console.log('\nDatabase setup with Indian preset data complete!');
      console.log(`
Configuration for .env.local:
----------------------------
DB_HOST=${host}
DB_USER=${user}
DB_PASSWORD=${password}
DB_NAME=${database}
DEPLOYMENT_MODE=local
      `);
      
      // Update .env.local file
      updateEnvFile(host, user, password, database);
      
      rl.close();
    });
  } catch (err) {
    console.error('Error setting up database:', err);
    rl.close();
  }
}

async function prompt(question) {
  return new Promise(resolve => {
    rl.question(question, resolve);
  });
}

async function checkMySQLServer(host) {
  return new Promise((resolve, reject) => {
    const testConnection = mysql.createConnection({
      host,
      user: 'root',
      connectTimeout: 5000 // 5 second timeout
    });
    
    testConnection.then(conn => {
      conn.end();
      resolve(true);
    }).catch(err => {
      reject(err);
    });
  });
}

async function startMySQLServer() {
  return new Promise((resolve, reject) => {
    exec('brew services start mysql', (error, stdout, stderr) => {
      if (error) {
        reject(error);
        return;
      }
      
      // Wait a few seconds for MySQL to start
      setTimeout(() => {
        resolve(true);
      }, 5000); // 5 second delay
    });
  });
}

function updateEnvFile(host, user, password, database) {
  try {
    const envPath = path.join(process.cwd(), '.env.local');
    let envContent = '';
    
    if (fs.existsSync(envPath)) {
      envContent = fs.readFileSync(envPath, 'utf8');
      
      // Update existing variables
      envContent = envContent.replace(/DB_HOST=.*/g, `DB_HOST=${host}`);
      envContent = envContent.replace(/DB_USER=.*/g, `DB_USER=${user}`);
      envContent = envContent.replace(/DB_PASSWORD=.*/g, `DB_PASSWORD=${password}`);
      envContent = envContent.replace(/DB_NAME=.*/g, `DB_NAME=${database}`);
      envContent = envContent.replace(/DEPLOYMENT_MODE=.*/g, 'DEPLOYMENT_MODE=local');
    } else {
      // Create new file
      envContent = `# Database Connection
DB_HOST=${host}
DB_USER=${user}
DB_PASSWORD=${password}
DB_NAME=${database}
DB_PORT=3306

# Deployment Mode - Set to local for local MySQL database
DEPLOYMENT_MODE=local

# General App Config
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development
`;
    }
    
    fs.writeFileSync(envPath, envContent);
    console.log('.env.local file updated successfully.');
  } catch (error) {
    console.error('Error updating .env.local file:', error);
  }
}

// Function to hash passwords in the StaffAccount table
async function hashStaffPasswords(host, user, password, database) {
  try {
    // Create a connection to the database
    const connection = await mysql.createConnection({
      host,
      user,
      password,
      database
    });
    
    // Get all staff accounts
    const [staffAccounts] = await connection.execute('SELECT username, password FROM StaffAccount');
    
    // Hash each password and update the database
    for (const account of staffAccounts) {
      // Only hash if not already hashed (bcrypt hashes start with $2a$ or $2b$)
      if (!account.password.startsWith('$2a$') && !account.password.startsWith('$2b$')) {
        // Hash the password with bcrypt (10 rounds)
        const hashedPassword = await bcrypt.hash(account.password, 10);
        
        // Update the database with the hashed password
        await connection.execute(
          'UPDATE StaffAccount SET password = ? WHERE username = ?',
          [hashedPassword, account.username]
        );
        
        console.log(`Hashed password for user: ${account.username}`);
      }
    }
    
    // Close the connection
    await connection.end();
    
    return true;
  } catch (error) {
    console.error('Error hashing passwords:', error);
    throw error;
  }
}

main();
