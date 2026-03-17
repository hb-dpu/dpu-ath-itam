# DePaul Athletics IT Asset Management System

A web-based IT Asset Management (ITAM) solution for cataloging and tracking IT equipment at DePaul University Athletics.

## 📚 Documentation

- **🚀 [QUICK-START.md](QUICK-START.md)** - Get up and running in 5 minutes
- **📖 [SETUP-GUIDE.md](SETUP-GUIDE.md)** - Detailed step-by-step installation guide
- **🔒 [CREDENTIALS-GUIDE.md](CREDENTIALS-GUIDE.md)** - Complete password management guide
- **📋 README.md** - This file (feature overview)

**New to this?** Start with [QUICK-START.md](QUICK-START.md) or [SETUP-GUIDE.md](SETUP-GUIDE.md)!

## Features

✅ User authentication and secure login
✅ Complete device catalog with detailed asset information
✅ User management system
✅ Dual search modes with autocomplete
✅ **Barcode scanning** - Scan asset tags with device camera
✅ Track device assignments to users
✅ Add, edit, and delete devices and users
✅ **Persistent file-based storage** (works across all browsers!)
✅ Responsive design that works on desktop and mobile
✅ Three-tab navigation (Home, Devices, Users)
✅ Excel upload for bulk user import

## Getting Started

### Prerequisites

You need **Node.js** installed on your computer. 

**Check if you have Node.js:**
```bash
node --version
```

**If you don't have Node.js**, download it from: https://nodejs.org/
(Download the LTS version)

### Installation

1. **Extract the ZIP file** to your desired location

2. **Open Terminal/Command Prompt** and navigate to the folder:
   ```bash
   cd /path/to/depaul-itam
   ```

3. **Install dependencies** (only needed once):
   ```bash
   npm install
   ```

### Running the Application

#### Option 1: Use the Startup Scripts (Easiest)

**Windows:**
- Double-click `start-windows.bat`

**Mac/Linux:**
- Double-click `start-mac.sh` (or run `./start-mac.sh` in Terminal)

#### Option 2: Manual Start

In Terminal/Command Prompt:
```bash
npm start
```

or

```bash
node server.js
```

### Accessing the Application

1. After starting the server, open your browser
2. Go to: **http://localhost:3000**
3. Log in with:
   - **Default Username:** admin
   - **Default Password:** depaul2024
   - ⚠️ **IMPORTANT:** Change this password immediately! See [CREDENTIALS-GUIDE.md](CREDENTIALS-GUIDE.md)

That's it! The server will continue running until you close the Terminal window or press Ctrl+C.

## 🔒 Security & Login Management

### Secure Authentication
- ✅ Passwords are **hashed** using bcrypt (never stored in plaintext)
- ✅ Server-side validation
- ✅ Multiple user accounts supported

### Managing Login Credentials

**To manage users and passwords, run:**
```bash
npm run credentials
```

This opens an interactive menu where you can:
- Change passwords
- Add new users
- Delete users
- List all users

📖 **Full instructions:** See [CREDENTIALS-GUIDE.md](CREDENTIALS-GUIDE.md) for complete documentation.

⚠️ **IMPORTANT:** Change the default password before using in production!

## How to Use

### Adding Devices
1. Go to the "Devices" tab
2. Click "Add Device" button
3. Fill in all required fields (marked with *)
4. Optionally assign the device to a user
5. Click "Add Device" to save

### Adding Users
1. Go to the "Users" tab
2. Click "Add User" button
3. Enter name, department, and email
4. Click "Add User" to save

### Uploading Users from Excel
1. Go to the "Users" tab
2. Click "Upload Excel" button
3. Select your staff Excel file (.xlsx or .xls)
4. The system will:
   - Add any new users that don't already exist
   - Skip existing users (matched by email address)
   - Show you a summary of what was imported
5. The page will automatically refresh to show new users

**Excel File Format:**
Your Excel file should have these columns:
- **Name** (required) - Full name of the person
- **Email** (required) - Email address (used to detect duplicates)
- **Title** - Job title (will be used as Department)

### Searching (Home Tab)
- **By Device:** Search by asset tag or serial number (with autocomplete)
- **By User:** Search by user name (with autocomplete)
- Type to see suggestions appear automatically
- Click a suggestion to select it

### Barcode Scanning (Home Tab)
1. Make sure you're on the "By Device" search mode
2. Click the **"📷 Scan Asset Tag Barcode"** button
3. Allow camera access when prompted
4. Point your camera at the barcode on the asset tag
5. The scanner will automatically detect and read the barcode
6. If device exists: Opens the device details for editing
7. If device doesn't exist: Opens "Add Device" form with asset tag pre-filled

**Camera Permissions:**
- Your browser will ask for camera access the first time
- Click "Allow" to enable barcode scanning
- Works on computers with webcams and mobile devices
- Supports most standard barcode formats (Code 39, Code 128, etc.)

### Editing & Deleting
- Click the pencil icon (✏️) to edit a device or user
- Click the trash icon (🗑️) to delete (you'll be asked to confirm)

## Data Storage

All data is stored in JSON files in the `data/` folder:
- `data/devices.json` - All device records
- `data/users.json` - All user records

**Benefits:**
- ✅ Works across all browsers (Chrome, Firefox, Safari, etc.)
- ✅ Data persists between sessions
- ✅ Easy to backup (just copy the `data` folder)
- ✅ Can be moved to different computers
- ✅ Human-readable format (open in any text editor)

**To backup your data:**
Simply copy the entire `depaul-itam` folder to a safe location!

## Device Information Fields

Each device can store:
- Asset Tag (unique identifier)
- Serial Number
- Manufacturer
- Model
- Purchase Date
- Warranty End Date
- Purchase Price
- Assigned User
- Notes

## Customization

To change the login credentials, edit `server.js` or `app.jsx` and modify the login check.

## Files in This Project

- `index.html` - Main HTML file
- `app.jsx` - React application code
- `server.js` - Backend server for data persistence
- `package.json` - Node.js dependencies
- `start-windows.bat` - Windows startup script
- `start-mac.sh` - Mac/Linux startup script
- `manage-credentials.js` - Login credentials manager
- `data/` - Folder containing your data files
  - `devices.json` - Device records
  - `users.json` - User records  
  - `credentials.json` - Login credentials (hashed passwords)
- `README.md` - This file with instructions
- `CREDENTIALS-GUIDE.md` - Complete credentials management guide

## Browser Compatibility

Works with modern browsers including:
- Google Chrome
- Microsoft Edge
- Mozilla Firefox
- Safari

## Troubleshooting

**Problem: "Cannot find module 'express'"**
- Solution: Run `npm install` in the project folder

**Problem: Port 3000 is already in use**
- Solution: Edit `server.js` and change `PORT = 3000` to another number (e.g., 3001)

**Problem: Can't access from another computer**
- Note: By default, the server only runs on your local machine. This is a security feature.

## Support

For issues or questions, contact your IT administrator.

---

**DePaul University Athletics**
IT Asset Management System
Version 2.0 - File-based Storage
