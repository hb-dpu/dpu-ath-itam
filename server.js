const express = require('express');
const fs = require('fs').promises;
const fsSync = require('fs');
const path = require('path');
const cors = require('cors');
const multer = require('multer');
const XLSX = require('xlsx');
const bcrypt = require('bcrypt');
const https = require('https');
const http = require('http');

const app = express();
const HTTP_PORT = 3000;
const HTTPS_PORT = 3443;

// Configure multer for file uploads
const upload = multer({ dest: 'uploads/' });

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

// Data file paths
const DEVICES_FILE = path.join(__dirname, 'data', 'devices.json');
const USERS_FILE = path.join(__dirname, 'data', 'users.json');
const CREDENTIALS_FILE = path.join(__dirname, 'data', 'credentials.json');
const SOFTWARE_FILE = path.join(__dirname, 'data', 'software.json');

// Ensure data directory exists
async function ensureDataDir() {
  try {
    await fs.mkdir(path.join(__dirname, 'data'), { recursive: true });
    await fs.mkdir(path.join(__dirname, 'uploads'), { recursive: true });
    
    // Create initial credentials file if it doesn't exist
    try {
      await fs.access(CREDENTIALS_FILE);
    } catch {
      // Create default admin user with hashed password
      const defaultPassword = 'depaul2024';
      const hashedPassword = await bcrypt.hash(defaultPassword, 10);
      
      await fs.writeFile(CREDENTIALS_FILE, JSON.stringify({
        users: [{
          username: 'admin',
          passwordHash: hashedPassword,
          isAdmin: true
        }]
      }, null, 2));
      
      console.log('⚠️  Default credentials created (username: admin, password: depaul2024)');
      console.log('⚠️  Run "node manage-credentials.js" to change the password!');
    }
    
    // Create initial files if they don't exist
    try {
      await fs.access(DEVICES_FILE);
    } catch {
      await fs.writeFile(DEVICES_FILE, JSON.stringify([
        {
          id: '1',
          assetTag: 'DPA-LAP-001',
          serialNumber: 'SN123456789',
          manufacturer: 'Dell',
          model: 'Latitude 7420',
          purchaseDate: '2023-01-15',
          warrantyEnd: '2026-01-15',
          purchasePrice: '1299.99',
          assignedTo: 'John Smith',
          notes: 'Primary laptop for Head Coach'
        },
        {
          id: '2',
          assetTag: 'DPA-DES-002',
          serialNumber: 'SN987654321',
          manufacturer: 'HP',
          model: 'EliteDesk 800 G8',
          purchaseDate: '2022-08-20',
          warrantyEnd: '2025-08-20',
          purchasePrice: '899.00',
          assignedTo: 'Sarah Johnson',
          notes: 'Office workstation'
        },
        {
          id: '3',
          assetTag: 'DPA-IPD-003',
          serialNumber: 'DMQX2LL/A',
          manufacturer: 'Apple',
          model: 'iPad Pro 12.9"',
          purchaseDate: '2023-03-10',
          warrantyEnd: '2024-03-10',
          purchasePrice: '1099.00',
          assignedTo: 'Mike Williams',
          notes: 'Video analysis'
        }
      ], null, 2));
    }
    
    try {
      await fs.access(USERS_FILE);
    } catch {
      await fs.writeFile(USERS_FILE, JSON.stringify([
        { id: '1', name: 'John Smith', department: 'Coaching', email: 'jsmith@depaul.edu' },
        { id: '2', name: 'Sarah Johnson', department: 'Administration', email: 'sjohnson@depaul.edu' },
        { id: '3', name: 'Mike Williams', department: 'Training', email: 'mwilliams@depaul.edu' }
      ], null, 2));
    }
    
    // Create initial software file if it doesn't exist
    try {
      await fs.access(SOFTWARE_FILE);
    } catch {
      await fs.writeFile(SOFTWARE_FILE, JSON.stringify([], null, 2));
    }
  } catch (error) {
    console.error('Error setting up data directory:', error);
  }
}

// API Routes

// Login endpoint
app.post('/api/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    if (!username || !password) {
      return res.status(400).json({ success: false, error: 'Username and password required' });
    }
    
    // Read credentials file
    const credentialsData = await fs.readFile(CREDENTIALS_FILE, 'utf8');
    const credentials = JSON.parse(credentialsData);
    
    // Find user
    const user = credentials.users.find(u => u.username === username);
    
    if (!user) {
      return res.status(401).json({ success: false, error: 'Invalid credentials' });
    }
    
    // Compare password with hash
    const match = await bcrypt.compare(password, user.passwordHash);
    
    if (!match) {
      return res.status(401).json({ success: false, error: 'Invalid credentials' });
    }
    
    // Success
    res.json({ 
      success: true, 
      username: user.username,
      isAdmin: user.isAdmin || false
    });
    
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, error: 'Login failed' });
  }
});

// Get all accounts (admin only)
app.get('/api/accounts', async (req, res) => {
  try {
    const credentialsData = await fs.readFile(CREDENTIALS_FILE, 'utf8');
    const credentials = JSON.parse(credentialsData);
    
    // Return users without password hashes
    const accounts = credentials.users.map(u => ({
      username: u.username,
      isAdmin: u.isAdmin || false
    }));
    
    res.json(accounts);
  } catch (error) {
    console.error('Get accounts error:', error);
    res.status(500).json({ error: 'Failed to get accounts' });
  }
});

// Create new account (admin only)
app.post('/api/accounts', async (req, res) => {
  try {
    const { username, password, isAdmin } = req.body;
    
    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password required' });
    }
    
    const credentialsData = await fs.readFile(CREDENTIALS_FILE, 'utf8');
    const credentials = JSON.parse(credentialsData);
    
    // Check if user already exists
    if (credentials.users.find(u => u.username === username)) {
      return res.status(400).json({ error: 'Username already exists' });
    }
    
    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);
    
    // Add new user
    credentials.users.push({
      username,
      passwordHash,
      isAdmin: isAdmin || false
    });
    
    await fs.writeFile(CREDENTIALS_FILE, JSON.stringify(credentials, null, 2));
    
    res.json({ success: true, username });
  } catch (error) {
    console.error('Create account error:', error);
    res.status(500).json({ error: 'Failed to create account' });
  }
});

// Update account (admin only)
app.put('/api/accounts/:username', async (req, res) => {
  try {
    const { username } = req.params;
    const { password, isAdmin } = req.body;
    
    const credentialsData = await fs.readFile(CREDENTIALS_FILE, 'utf8');
    const credentials = JSON.parse(credentialsData);
    
    const user = credentials.users.find(u => u.username === username);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    // Update password if provided
    if (password) {
      user.passwordHash = await bcrypt.hash(password, 10);
    }
    
    // Update admin status if provided
    if (typeof isAdmin !== 'undefined') {
      user.isAdmin = isAdmin;
    }
    
    await fs.writeFile(CREDENTIALS_FILE, JSON.stringify(credentials, null, 2));
    
    res.json({ success: true, username });
  } catch (error) {
    console.error('Update account error:', error);
    res.status(500).json({ error: 'Failed to update account' });
  }
});

// Delete account (admin only)
app.delete('/api/accounts/:username', async (req, res) => {
  try {
    const { username } = req.params;
    
    const credentialsData = await fs.readFile(CREDENTIALS_FILE, 'utf8');
    const credentials = JSON.parse(credentialsData);
    
    // Prevent deleting the last admin
    const admins = credentials.users.filter(u => u.isAdmin);
    const targetUser = credentials.users.find(u => u.username === username);
    
    if (targetUser && targetUser.isAdmin && admins.length === 1) {
      return res.status(400).json({ error: 'Cannot delete the last admin account' });
    }
    
    credentials.users = credentials.users.filter(u => u.username !== username);
    
    await fs.writeFile(CREDENTIALS_FILE, JSON.stringify(credentials, null, 2));
    
    res.json({ success: true });
  } catch (error) {
    console.error('Delete account error:', error);
    res.status(500).json({ error: 'Failed to delete account' });
  }
});

// Backup: Download all data
app.get('/api/backup', async (req, res) => {
  try {
    const devicesData = await fs.readFile(DEVICES_FILE, 'utf8');
    const usersData = await fs.readFile(USERS_FILE, 'utf8');
    const softwareData = await fs.readFile(SOFTWARE_FILE, 'utf8');
    
    const backup = {
      version: '1.0',
      timestamp: new Date().toISOString(),
      devices: JSON.parse(devicesData),
      users: JSON.parse(usersData),
      software: JSON.parse(softwareData)
    };
    
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', `attachment; filename="itam-backup-${Date.now()}.json"`);
    res.json(backup);
  } catch (error) {
    console.error('Backup error:', error);
    res.status(500).json({ error: 'Failed to create backup' });
  }
});

// Restore: Upload backup file
app.post('/api/restore', async (req, res) => {
  try {
    const backup = req.body;
    
    // Validate backup structure
    if (!backup.devices || !backup.users || !backup.software) {
      return res.status(400).json({ error: 'Invalid backup file format' });
    }
    
    // Write all data files
    await fs.writeFile(DEVICES_FILE, JSON.stringify(backup.devices, null, 2));
    await fs.writeFile(USERS_FILE, JSON.stringify(backup.users, null, 2));
    await fs.writeFile(SOFTWARE_FILE, JSON.stringify(backup.software, null, 2));
    
    res.json({ 
      success: true, 
      restored: {
        devices: backup.devices.length,
        users: backup.users.length,
        software: backup.software.length
      }
    });
  } catch (error) {
    console.error('Restore error:', error);
    res.status(500).json({ error: 'Failed to restore backup' });
  }
});

// Get all devices
app.get('/api/devices', async (req, res) => {
  try {
    const data = await fs.readFile(DEVICES_FILE, 'utf8');
    res.json(JSON.parse(data));
  } catch (error) {
    console.error('Error reading devices:', error);
    res.status(500).json({ error: 'Failed to read devices' });
  }
});

// Save all devices
app.post('/api/devices', async (req, res) => {
  try {
    await fs.writeFile(DEVICES_FILE, JSON.stringify(req.body, null, 2));
    res.json({ success: true });
  } catch (error) {
    console.error('Error saving devices:', error);
    res.status(500).json({ error: 'Failed to save devices' });
  }
});

// Get all users
app.get('/api/users', async (req, res) => {
  try {
    const data = await fs.readFile(USERS_FILE, 'utf8');
    res.json(JSON.parse(data));
  } catch (error) {
    console.error('Error reading users:', error);
    res.status(500).json({ error: 'Failed to read users' });
  }
});

// Save all users
app.post('/api/users', async (req, res) => {
  try {
    await fs.writeFile(USERS_FILE, JSON.stringify(req.body, null, 2));
    res.json({ success: true });
  } catch (error) {
    console.error('Error saving users:', error);
    res.status(500).json({ error: 'Failed to save users' });
  }
});

// Get all software
app.get('/api/software', async (req, res) => {
  try {
    const data = await fs.readFile(SOFTWARE_FILE, 'utf8');
    res.json(JSON.parse(data));
  } catch (error) {
    console.error('Error reading software:', error);
    res.status(500).json({ error: 'Failed to read software' });
  }
});

// Save all software
app.post('/api/software', async (req, res) => {
  try {
    await fs.writeFile(SOFTWARE_FILE, JSON.stringify(req.body, null, 2));
    res.json({ success: true });
  } catch (error) {
    console.error('Error saving software:', error);
    res.status(500).json({ error: 'Failed to save software' });
  }
});

// Upload Excel file and sync users
app.post('/api/users/upload', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    // Read the uploaded Excel file
    const workbook = XLSX.readFile(req.file.path);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const excelData = XLSX.utils.sheet_to_json(worksheet);

    // Read existing users
    const existingUsersData = await fs.readFile(USERS_FILE, 'utf8');
    const existingUsers = JSON.parse(existingUsersData);

    // Create a map of existing users by email for quick lookup
    const existingUserMap = new Map();
    existingUsers.forEach(user => {
      if (user.email) {
        existingUserMap.set(user.email.toLowerCase(), user);
      }
    });

    let addedCount = 0;
    let skippedCount = 0;

    // Process each row from Excel
    excelData.forEach(row => {
      const email = row['Email'];
      const name = row['Name'];
      const title = row['Title'];

      // Skip if missing required fields
      if (!email || !name) {
        skippedCount++;
        return;
      }

      // Check if user already exists
      if (existingUserMap.has(email.toLowerCase())) {
        skippedCount++;
        return;
      }

      // Add new user
      const newUser = {
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        name: name,
        department: title || 'Staff',
        email: email
      };

      existingUsers.push(newUser);
      existingUserMap.set(email.toLowerCase(), newUser);
      addedCount++;
    });

    // Save updated users
    await fs.writeFile(USERS_FILE, JSON.stringify(existingUsers, null, 2));

    // Clean up uploaded file
    await fs.unlink(req.file.path);

    res.json({
      success: true,
      added: addedCount,
      skipped: skippedCount,
      total: excelData.length
    });

  } catch (error) {
    console.error('Error processing upload:', error);
    res.status(500).json({ error: 'Failed to process upload' });
  }
});

// Generate self-signed certificate for HTTPS
function generateSelfSignedCert() {
  const certPath = path.join(__dirname, 'server.crt');
  const keyPath = path.join(__dirname, 'server.key');
  
  // Check if certificate already exists
  if (fsSync.existsSync(certPath) && fsSync.existsSync(keyPath)) {
    return {
      cert: fsSync.readFileSync(certPath),
      key: fsSync.readFileSync(keyPath)
    };
  }
  
  // Generate new self-signed certificate using openssl
  const { execSync } = require('child_process');
  try {
    console.log('Generating self-signed certificate for HTTPS...');
    execSync(`openssl req -x509 -newkey rsa:2048 -nodes -sha256 -subj '/CN=localhost' \
      -keyout "${keyPath}" -out "${certPath}" -days 365 2>/dev/null`, { stdio: 'ignore' });
    
    return {
      cert: fsSync.readFileSync(certPath),
      key: fsSync.readFileSync(keyPath)
    };
  } catch (err) {
    console.log('Could not generate SSL certificate. HTTPS will not be available.');
    console.log('For mobile camera access, you may need to install OpenSSL.');
    return null;
  }
}

// Start server
ensureDataDir().then(() => {
  // Get local IP address
  const os = require('os');
  const networkInterfaces = os.networkInterfaces();
  let localIP = 'localhost';
  
  // Find the first non-internal IPv4 address
  for (const interfaceName in networkInterfaces) {
    for (const iface of networkInterfaces[interfaceName]) {
      if (iface.family === 'IPv4' && !iface.internal) {
        localIP = iface.address;
        break;
      }
    }
    if (localIP !== 'localhost') break;
  }

  // Start HTTP server
  http.createServer(app).listen(HTTP_PORT, '0.0.0.0', () => {
    console.log('HTTP server started on port ' + HTTP_PORT);
  });

  // Try to start HTTPS server
  const credentials = generateSelfSignedCert();
  if (credentials) {
    https.createServer(credentials, app).listen(HTTPS_PORT, '0.0.0.0', () => {
      console.log('HTTPS server started on port ' + HTTPS_PORT);
    });
  }

  console.log(`
╔════════════════════════════════════════════════════╗
║   DePaul Athletics ITAM Server                     ║
║                                                    ║
║   Server running on ports ${HTTP_PORT} (HTTP) & ${HTTPS_PORT} (HTTPS) ║
║                                                    ║
║   Local Access:                                    ║
║   http://localhost:${HTTP_PORT}                        ║
║                                                    ║
║   Network Access (from other devices):             ║
║   http://${localIP}:${HTTP_PORT}${' '.repeat(Math.max(0, 26 - localIP.length))}║
║                                                    ║
║   📱 MOBILE CAMERA ACCESS (iOS/Android):           ║
║   https://${localIP}:${HTTPS_PORT}${' '.repeat(Math.max(0, 25 - localIP.length))}║
║   ⚠️  Accept security warning (self-signed cert)   ║
║                                                    ║
║   Data is stored in: ./data/                       ║
║   - devices.json                                   ║
║   - users.json                                     ║
║   - software.json                                  ║
║                                                    ║
║   Press Ctrl+C to stop the server                  ║
╚════════════════════════════════════════════════════╝
  `);
});
