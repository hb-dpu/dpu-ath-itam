# DePaul Athletics ITAM - Complete Setup Guide

This guide will walk you through setting up the IT Asset Management system from scratch, even if you've never used command line tools before.

---

## 📋 Table of Contents

1. [Prerequisites](#prerequisites)
2. [Installation Steps](#installation-steps)
3. [First Time Setup](#first-time-setup)
4. [Daily Usage](#daily-usage)
5. [Troubleshooting](#troubleshooting)

---

## Prerequisites

### What You Need

Before you begin, you need **Node.js** installed on your computer. Node.js is a free program that allows the server to run.

### Check If You Have Node.js

**Windows:**
1. Press `Windows Key + R`
2. Type `cmd` and press Enter
3. Type: `node --version`
4. Press Enter

**Mac:**
1. Press `Command + Space`
2. Type `terminal` and press Enter
3. Type: `node --version`
4. Press Enter

**What You'll See:**
- ✅ If you see something like `v18.17.0` or `v20.10.0` → You have Node.js! Skip to [Installation Steps](#installation-steps)
- ❌ If you see `command not found` or an error → You need to install Node.js (see below)

### Installing Node.js

**If you don't have Node.js:**

1. Go to: https://nodejs.org/
2. Click the big green button that says **"Download LTS"** (LTS stands for Long Term Support)
3. Run the downloaded installer
4. Click "Next" through all the prompts (the defaults are fine)
5. When installation is complete, restart your computer
6. After restart, verify installation using the steps above

---

## Installation Steps

### Step 1: Download and Extract

1. **Download** the `depaul-itam-v5-secure.zip` file
2. **Right-click** the ZIP file
3. **Windows:** Select "Extract All..." → Choose where to save it (Desktop is fine)
4. **Mac:** Double-click the ZIP file (it extracts automatically)
5. Remember where you saved it!

### Step 2: Open Terminal/Command Prompt in the Project Folder

**Windows Method 1 (Easiest):**
1. Open the extracted `depaul-itam` folder
2. Click in the address bar at the top (where it shows the folder path)
3. Type `cmd` and press Enter
4. A black window opens → You're in the right place!

**Windows Method 2:**
1. Press `Windows Key + R`
2. Type `cmd` and press Enter
3. Type: `cd Desktop\depaul-itam` (adjust if you saved it elsewhere)
4. Press Enter

**Mac:**
1. Open Finder and navigate to the `depaul-itam` folder
2. Right-click (or Control+click) the folder
3. Hold down the `Option` key
4. Select "Copy 'depaul-itam' as Pathname"
5. Open Terminal (Command + Space, type "terminal")
6. Type: `cd ` (with a space after cd)
7. Paste the path (Command + V)
8. Press Enter

**Verify You're in the Right Place:**
Type: `dir` (Windows) or `ls` (Mac) and press Enter

You should see files like:
- index.html
- server.js
- package.json
- README.md

If you don't see these files, you're in the wrong folder!

### Step 3: Install Dependencies

This step downloads all the required software packages. You only need to do this once.

**Type this command and press Enter:**
```bash
npm install
```

**What You'll See:**
- Lots of text scrolling by
- Messages about downloading packages
- This might take 1-3 minutes
- When it's done, you'll see a message like "added 150 packages"

**⚠️ Common Issues:**
- If you see "npm: command not found" → Node.js isn't installed properly. Go back to [Prerequisites](#prerequisites)
- If you see permission errors on Mac → Try: `sudo npm install` (you'll need to enter your Mac password)

---

## First Time Setup

### Step 1: Start the Server

Now let's start the ITAM server!

**Option A: Using the Startup Script (Easiest)**

**Windows:**
1. In the `depaul-itam` folder, find `start-windows.bat`
2. Double-click it
3. A black window opens with the server running

**Mac:**
1. In Terminal (from Step 2), type: `./start-mac.sh`
2. Press Enter
3. (If you get a permission error, first run: `chmod +x start-mac.sh`)

**Option B: Manual Start**

In your Terminal/Command Prompt, type:
```bash
npm start
```

**What Success Looks Like:**

You should see:
```
╔════════════════════════════════════════════════╗
║   DePaul Athletics ITAM Server                 ║
║                                                ║
║   Server running at: http://localhost:3000     ║
║                                                ║
║   Open your browser to: http://localhost:3000  ║
║                                                ║
║   Data is stored in: ./data/                   ║
║   - devices.json                               ║
║   - users.json                                 ║
║                                                ║
║   Press Ctrl+C to stop the server              ║
╚════════════════════════════════════════════════╝
```

**⚠️ Leave this window open!** The server needs to keep running while you use the app.

### Step 2: Open the Application

1. Open your web browser (Chrome, Firefox, Safari, Edge)
2. Type in the address bar: `localhost:3000`
3. Press Enter
4. You should see the login screen!

### Step 3: First Login

**Login with default credentials:**
- Username: `admin`
- Password: `depaul2024`

Click "Sign In"

🎉 **You're in!**

### Step 4: Change the Default Password (IMPORTANT!)

**⚠️ Do this immediately for security!**

1. **Keep the browser open** (you'll come back to it)
2. Go back to your Terminal/Command Prompt window
3. **Open a NEW Terminal/Command Prompt window** (don't close the server!)
   - **Windows:** Press Windows Key + R, type `cmd`, press Enter
   - **Mac:** Command + Space, type "terminal", press Enter
4. Navigate to the project folder again (see [Step 2 of Installation](#step-2-open-terminalcommand-prompt-in-the-project-folder))
5. Run the credentials manager:

```bash
npm run credentials
```

**You'll see this menu:**
```
╔════════════════════════════════════════════════╗
║   DePaul Athletics ITAM                        ║
║   Credentials Manager                          ║
╚════════════════════════════════════════════════╝

📋 Menu:
  1. List users
  2. Add user
  3. Change password
  4. Delete user
  5. Exit

Select an option (1-5):
```

**To change the password:**
1. Type `3` and press Enter
2. Enter username: `admin`
3. Enter new password: (choose a secure password, at least 6 characters)
4. You'll see: `✅ Password changed successfully for "admin"!`
5. Type `5` to exit

**Go back to your browser and try logging in with your new password!**

---

## Daily Usage

### Starting the Application

**Every time you want to use the ITAM system:**

1. **Start the Server:**
   - **Windows:** Double-click `start-windows.bat`
   - **Mac:** Open Terminal, navigate to folder, run `./start-mac.sh`
   - **Alternative:** Run `npm start` in Terminal

2. **Open Browser:**
   - Go to `localhost:3000`
   - Log in with your credentials

3. **When Finished:**
   - You can close the browser
   - In the Terminal/Command Prompt window, press `Ctrl+C` to stop the server
   - Or just close the Terminal window

### Accessing From Other Computers

**Important:** By default, the application only works on the computer running the server.

To access from other computers on the same network:
1. Find your computer's IP address
   - **Windows:** In cmd, type `ipconfig` → Look for "IPv4 Address"
   - **Mac:** In Terminal, type `ifconfig | grep inet` → Look for the 192.168.x.x address
2. On another computer, open browser and go to: `http://YOUR-IP-ADDRESS:3000`
   - Example: `http://192.168.1.105:3000`

---

## Troubleshooting

### Problem: Port 3000 is already in use

**Error Message:**
```
Error: listen EADDRINUSE: address already in use :::3000
```

**Solution:**
1. The server is already running somewhere else
2. Close any other Terminal/Command Prompt windows
3. Or, change the port:
   - Open `server.js` in a text editor
   - Find the line: `const PORT = 3000;`
   - Change to: `const PORT = 3001;`
   - Save the file
   - Restart the server
   - Access via `localhost:3001` instead

### Problem: Cannot find module 'express' or 'bcrypt'

**Error Message:**
```
Error: Cannot find module 'express'
```

**Solution:**
1. You forgot to run `npm install`
2. Navigate to the project folder
3. Run: `npm install`
4. Wait for it to complete
5. Try starting the server again

### Problem: npm command not found

**Error Message:**
```
'npm' is not recognized as an internal or external command
```

**Solution:**
1. Node.js is not installed or not in your PATH
2. Reinstall Node.js from https://nodejs.org/
3. Make sure to check the box "Add to PATH" during installation
4. Restart your computer
5. Try again

### Problem: Page won't load in browser

**Symptoms:**
- Browser shows "This site can't be reached"
- "Connection refused"

**Solution:**
1. Check if the server is running
   - Look for the Terminal window
   - Should show "Server running at: http://localhost:3000"
2. If server isn't running, start it: `npm start`
3. Make sure you're using `localhost:3000` (not `localhost:8000` or another port)
4. Try a different browser

### Problem: Login says "Invalid credentials" but password is correct

**Solution:**
1. The server might not be running
2. Check the Terminal for errors
3. Try restarting the server:
   - Press Ctrl+C to stop
   - Run `npm start` again
4. If still not working, check `data/credentials.json` exists
5. If file is missing, the server will recreate it on next start

### Problem: Can't upload Excel file

**Symptoms:**
- Upload button doesn't work
- Error message after selecting file

**Solution:**
1. Make sure the file is `.xlsx` or `.xls` format
2. Check that the server is running
3. Check browser console for errors (press F12)
4. Make sure file has "Name" and "Email" columns
5. Try restarting the server

### Problem: Changes aren't saving

**Symptoms:**
- Add a device, but it disappears after refresh
- Users aren't being saved

**Solution:**
1. Check if `data` folder exists in the project directory
2. Check file permissions (make sure you can write to the folder)
3. Check server Terminal for error messages
4. Restart the server: Ctrl+C, then `npm start`

### Problem: Forgot admin password

**Solution:**
1. Stop the server (Ctrl+C)
2. Delete the file: `data/credentials.json`
3. Start the server again: `npm start`
4. Default admin account will be recreated (admin/depaul2024)
5. Change the password immediately using `npm run credentials`

---

## Getting Help

### Check These First:
1. ✅ Is Node.js installed? (`node --version`)
2. ✅ Did you run `npm install`?
3. ✅ Is the server running? (look for the Terminal window)
4. ✅ Are you using the correct URL? (`localhost:3000`)
5. ✅ Are there any error messages in the Terminal?

### Still Having Issues?

1. Close everything and start fresh:
   - Close all browsers
   - Close all Terminal windows
   - Navigate to project folder
   - Run `npm install`
   - Run `npm start`
   - Open browser to `localhost:3000`

2. Check the Terminal window for error messages
3. Try a different browser
4. Restart your computer

---

## Quick Reference

### Essential Commands

```bash
# Install dependencies (first time only)
npm install

# Start the server
npm start

# Stop the server
Ctrl+C

# Manage credentials
npm run credentials
```

### Important Files

- `server.js` - The server code
- `package.json` - Project configuration
- `data/devices.json` - Your device records
- `data/users.json` - Your user records
- `data/credentials.json` - Login credentials (hashed)

### Important URLs

- Application: `http://localhost:3000`
- Same computer only by default
- To access from other computers: `http://YOUR-IP:3000`

---

## Next Steps

Once you're up and running:

1. ✅ Change default password
2. ✅ Add your devices (Devices tab)
3. ✅ Upload your staff Excel file (Users tab → Upload Excel)
4. ✅ Start assigning devices to users
5. ✅ Test the search feature (Home tab)

**Congratulations!** Your ITAM system is ready to use! 🎉

---

**Need more help?** Re-read this guide or check the main README.md and CREDENTIALS-GUIDE.md files.
