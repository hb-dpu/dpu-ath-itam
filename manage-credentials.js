#!/usr/bin/env node

const bcrypt = require('bcrypt');
const fs = require('fs');
const path = require('path');
const readline = require('readline');

const CREDENTIALS_FILE = path.join(__dirname, 'data', 'credentials.json');

// Create readline interface for user input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(query) {
  return new Promise(resolve => rl.question(query, resolve));
}

async function hashPassword(password) {
  const saltRounds = 10;
  return await bcrypt.hash(password, saltRounds);
}

async function loadCredentials() {
  try {
    const data = await fs.promises.readFile(CREDENTIALS_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    return { users: [] };
  }
}

async function saveCredentials(credentials) {
  await fs.promises.mkdir(path.dirname(CREDENTIALS_FILE), { recursive: true });
  await fs.promises.writeFile(
    CREDENTIALS_FILE,
    JSON.stringify(credentials, null, 2),
    'utf8'
  );
}

async function listUsers() {
  const credentials = await loadCredentials();
  
  if (credentials.users.length === 0) {
    console.log('\n❌ No users found.');
    return;
  }
  
  console.log('\n📋 Current Users:');
  console.log('═'.repeat(50));
  credentials.users.forEach((user, index) => {
    console.log(`${index + 1}. ${user.username}`);
  });
  console.log('═'.repeat(50));
}

async function addUser() {
  console.log('\n➕ Add New User');
  console.log('═'.repeat(50));
  
  const username = await question('Enter username: ');
  
  if (!username || username.trim() === '') {
    console.log('❌ Username cannot be empty.');
    return;
  }
  
  const credentials = await loadCredentials();
  
  // Check if username already exists
  if (credentials.users.some(u => u.username === username)) {
    console.log(`❌ User "${username}" already exists.`);
    return;
  }
  
  const password = await question('Enter password: ');
  
  if (!password || password.length < 6) {
    console.log('❌ Password must be at least 6 characters.');
    return;
  }
  
  const hashedPassword = await hashPassword(password);
  
  credentials.users.push({
    username: username,
    passwordHash: hashedPassword
  });
  
  await saveCredentials(credentials);
  console.log(`✅ User "${username}" added successfully!`);
}

async function changePassword() {
  console.log('\n🔑 Change Password');
  console.log('═'.repeat(50));
  
  const username = await question('Enter username: ');
  
  const credentials = await loadCredentials();
  const userIndex = credentials.users.findIndex(u => u.username === username);
  
  if (userIndex === -1) {
    console.log(`❌ User "${username}" not found.`);
    return;
  }
  
  const newPassword = await question('Enter new password: ');
  
  if (!newPassword || newPassword.length < 6) {
    console.log('❌ Password must be at least 6 characters.');
    return;
  }
  
  const hashedPassword = await hashPassword(newPassword);
  credentials.users[userIndex].passwordHash = hashedPassword;
  
  await saveCredentials(credentials);
  console.log(`✅ Password changed successfully for "${username}"!`);
}

async function deleteUser() {
  console.log('\n🗑️  Delete User');
  console.log('═'.repeat(50));
  
  const username = await question('Enter username to delete: ');
  
  const credentials = await loadCredentials();
  const userIndex = credentials.users.findIndex(u => u.username === username);
  
  if (userIndex === -1) {
    console.log(`❌ User "${username}" not found.`);
    return;
  }
  
  const confirm = await question(`Are you sure you want to delete "${username}"? (yes/no): `);
  
  if (confirm.toLowerCase() === 'yes') {
    credentials.users.splice(userIndex, 1);
    await saveCredentials(credentials);
    console.log(`✅ User "${username}" deleted successfully!`);
  } else {
    console.log('❌ Deletion cancelled.');
  }
}

async function initializeDefaultUser() {
  const credentials = await loadCredentials();
  
  if (credentials.users.length === 0) {
    console.log('\n⚠️  No users found. Creating default admin user...');
    const defaultPassword = 'depaul2024';
    const hashedPassword = await hashPassword(defaultPassword);
    
    credentials.users.push({
      username: 'admin',
      passwordHash: hashedPassword
    });
    
    await saveCredentials(credentials);
    console.log('✅ Default user created:');
    console.log('   Username: admin');
    console.log('   Password: depaul2024');
    console.log('   ⚠️  Please change this password immediately!');
  }
}

async function main() {
  console.log('\n╔════════════════════════════════════════════════╗');
  console.log('║   DePaul Athletics ITAM                        ║');
  console.log('║   Credentials Manager                          ║');
  console.log('╚════════════════════════════════════════════════╝');
  
  await initializeDefaultUser();
  
  while (true) {
    console.log('\n📋 Menu:');
    console.log('  1. List users');
    console.log('  2. Add user');
    console.log('  3. Change password');
    console.log('  4. Delete user');
    console.log('  5. Exit');
    console.log('');
    
    const choice = await question('Select an option (1-5): ');
    
    switch (choice) {
      case '1':
        await listUsers();
        break;
      case '2':
        await addUser();
        break;
      case '3':
        await changePassword();
        break;
      case '4':
        await deleteUser();
        break;
      case '5':
        console.log('\n👋 Goodbye!\n');
        rl.close();
        process.exit(0);
      default:
        console.log('❌ Invalid option. Please try again.');
    }
  }
}

main().catch(error => {
  console.error('Error:', error);
  rl.close();
  process.exit(1);
});
