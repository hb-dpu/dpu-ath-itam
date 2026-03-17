# Quick Start Card - DePaul Athletics ITAM

## 🚀 First Time Setup (5 minutes)

### 1. Install Node.js
- Download from: https://nodejs.org/
- Click the big green "LTS" button
- Install and restart computer

### 2. Extract Files
- Unzip `depaul-itam-v5-secure.zip`
- Remember where you saved it (e.g., Desktop)

### 3. Install Dependencies
Open Terminal/Command Prompt in the project folder:
```bash
npm install
```
Wait 1-3 minutes for completion.

### 4. Start Server
**Windows:** Double-click `start-windows.bat`
**Mac/Linux:** Run `./start-mac.sh`
**Or manually:** `npm start`

### 5. Open Browser
Go to: `localhost:3000`

### 6. Login
- Username: `admin`
- Password: `depaul2024`

### 7. Change Password Immediately
Open NEW terminal window:
```bash
npm run credentials
```
Select option 3, change password for "admin"

---

## 📅 Daily Use

### Starting the App
1. **Windows:** Double-click `start-windows.bat`
   **Mac:** Run `./start-mac.sh` in Terminal
2. Open browser → `localhost:3000`
3. Login with your credentials

### Stopping the App
- Close browser (data is saved)
- In Terminal: Press `Ctrl+C`
- Or close the Terminal window

---

## 🔑 Managing Users/Passwords

### Open Credentials Manager
```bash
npm run credentials
```

### Menu Options
1. List users
2. Add user
3. Change password
4. Delete user
5. Exit

**Example: Change Password**
- Select: `3`
- Enter username: `admin`
- Enter new password
- Done!

---

## 📤 Uploading Staff from Excel

1. Go to **Users** tab
2. Click **Upload Excel**
3. Select your `.xlsx` file
4. System adds new users, skips existing ones
5. See summary of what was imported

**Required Excel columns:**
- Name
- Email (used to detect duplicates)
- Title (becomes Department)

---

## 🔍 Using the System

### Home Tab - Search
- Switch between "By Device" or "By User"
- Type to search (autocomplete enabled)
- View full details of results
- **📷 Scan Barcode:** Click "Scan Asset Tag Barcode" to use your camera
  - Point at barcode, it auto-detects
  - Existing device → Opens for editing
  - New device → Opens add form with asset tag filled in

### Devices Tab
- View all devices
- Add new device (green button)
- Edit device (pencil icon)
- Delete device (trash icon)

### Users Tab
- View all users
- Upload Excel (blue button)
- Add user manually (purple button)
- Edit/delete users

---

## ⚠️ Common Issues

### "npm: command not found"
→ Install Node.js from https://nodejs.org/

### "Port 3000 in use"
→ Server already running, or change port in `server.js`

### "Cannot find module"
→ Run `npm install` first

### Login not working
→ Make sure server is running (check Terminal)

### Forgot password
→ Delete `data/credentials.json`, restart server, default recreated

### Page won't load
→ Check server is running, use `localhost:3000`

---

## 📁 Important Files

```
depaul-itam/
├── index.html              (Main app)
├── server.js               (Server code)
├── manage-credentials.js   (Password manager)
├── start-windows.bat       (Windows startup)
├── start-mac.sh           (Mac startup)
├── SETUP-GUIDE.md         (Detailed instructions)
├── CREDENTIALS-GUIDE.md   (Password management)
└── data/                  (Your data - auto-created)
    ├── devices.json       (Device records)
    ├── users.json         (User records)
    └── credentials.json   (Login info - hashed)
```

---

## 💡 Quick Tips

✅ **Server must be running** to use the app
✅ **Data auto-saves** to `data/` folder
✅ **Backup:** Copy entire `depaul-itam` folder
✅ **Multi-browser:** Works in Chrome, Firefox, Safari, Edge
✅ **Passwords are hashed** - never stored in plaintext
✅ **Excel uploads skip duplicates** - safe to re-upload

---

## 🆘 Need Help?

📖 **Detailed Setup:** See `SETUP-GUIDE.md`
🔒 **Password Help:** See `CREDENTIALS-GUIDE.md`
📋 **Features:** See `README.md`

---

**Default Login:** admin / depaul2024
**⚠️ Change immediately:** `npm run credentials`

**Questions?** Contact your IT administrator.
