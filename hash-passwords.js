const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');

async function hashPasswords() {
  try {
    console.log('Starting password hashing...');
    
    // Create a connection to the database
    console.log('Connecting to database...');
    const connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '',
      database: 'test2'
    });
    console.log('Connected to database');
    
    // Get all staff accounts
    console.log('Fetching staff accounts...');
    const [staffAccounts] = await connection.execute('SELECT username, password FROM StaffAccount');
    
    console.log('Found staff accounts:', staffAccounts.length);
    console.log('Staff accounts:', JSON.stringify(staffAccounts, null, 2));
    
    // Hash each password and update the database
    for (const account of staffAccounts) {
      // Only hash if not already hashed (bcrypt hashes start with $2a$ or $2b$)
      if (!account.password.startsWith('$2a$') && !account.password.startsWith('$2b$')) {
        console.log('Hashing password for user:', account.username);
        
        // Hash the password with bcrypt (10 rounds)
        const hashedPassword = await bcrypt.hash(account.password, 10);
        console.log('Hashed password:', hashedPassword);
        
        // Update the database with the hashed password
        const updateResult = await connection.execute(
          'UPDATE StaffAccount SET password = ? WHERE username = ?',
          [hashedPassword, account.username]
        );
        console.log('Update result:', JSON.stringify(updateResult, null, 2));
        
        console.log('Password hashed for user:', account.username);
      } else {
        console.log('Password for', account.username, 'is already hashed.');
      }
    }
    
    // Close the connection
    await connection.end();
    
    console.log('All passwords hashed successfully!');
  } catch (error) {
    console.error('Error hashing passwords:', error);
  }
}

hashPasswords();
