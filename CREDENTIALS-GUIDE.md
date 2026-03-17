# Login Credentials Management Guide

## Overview

Your ITAM system now uses **secure, hashed passwords** stored server-side. Passwords are never stored in plaintext and cannot be recovered - only reset.

## Default Credentials

When you first run the server, a default admin account is created:
- **Username:** `admin`
- **Password:** `depaul2024`

⚠️ **IMPORTANT:** Change this password immediately after first login!

## Managing Credentials

### Starting the Credentials Manager

**Option 1: Using npm script (Recommended)**
```bash
npm run credentials
```

**Option 2: Direct command**
```bash
node manage-credentials.js
```

### Menu Options

When you run the credentials manager, you'll see this menu:

```
📋 Menu:
  1. List users
  2. Add user
  3. Change password
  4. Delete user
  5. Exit
```

## Common Tasks

### 1️⃣ Change the Default Password

1. Run: `npm run credentials`
2. Select: `3. Change password`
3. Enter username: `admin`
4. Enter new password (minimum 6 characters)
5. Confirm the change

### 2️⃣ Add a New User

1. Run: `npm run credentials`
2. Select: `2. Add user`
3. Enter new username
4. Enter password (minimum 6 characters)
5. User is created immediately

### 3️⃣ View All Users

1. Run: `npm run credentials`
2. Select: `1. List users`
3. See all usernames (passwords are hidden)

### 4️⃣ Delete a User

1. Run: `npm run credentials`
2. Select: `4. Delete user`
3. Enter username to delete
4. Type `yes` to confirm

## Security Features

✅ **Bcrypt Hashing:** Passwords are hashed using bcrypt with salt rounds
✅ **Server-side Validation:** Login is validated on the server, not the client
✅ **No Plaintext Storage:** Passwords are never stored in readable form
✅ **Secure File:** Credentials stored in `data/credentials.json` (hashed)

## Password Requirements

- Minimum 6 characters
- No maximum length
- Any characters allowed (letters, numbers, symbols)

## File Location

Credentials are stored in:
```
depaul-itam/data/credentials.json
```

⚠️ **DO NOT** edit this file manually! Always use the credentials manager.

## Important Notes

⚠️ **Passwords Cannot Be Recovered**
- If you forget a password, you must reset it using the credentials manager
- There is no "forgot password" feature

⚠️ **Backup Your Credentials**
- Back up the entire `depaul-itam` folder to preserve login credentials
- The `data/credentials.json` file contains all user accounts

⚠️ **Server Must Be Stopped**
- You can manage credentials while the server is running or stopped
- Changes take effect immediately

## Example Session

```bash
$ npm run credentials

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

Select an option (1-5): 3

🔑 Change Password
══════════════════════════════════════════════════
Enter username: admin
Enter new password: MyNewSecurePassword123
✅ Password changed successfully for "admin"!

📋 Menu:
  1. List users
  2. Add user
  3. Change password
  4. Delete user
  5. Exit

Select an option (1-5): 5

👋 Goodbye!
```

## Troubleshooting

**Problem:** "Cannot find module 'bcrypt'"
**Solution:** Run `npm install` first

**Problem:** "ENOENT: no such file or directory"
**Solution:** Make sure you're in the `depaul-itam` folder

**Problem:** "User already exists"
**Solution:** Choose a different username or delete the existing user first

**Problem:** Forgot admin password
**Solution:** Delete `data/credentials.json` and restart the server to recreate default admin account

## Best Practices

✅ Change default password immediately
✅ Use strong passwords (8+ characters with mixed case, numbers, symbols)
✅ Create individual accounts for each administrator
✅ Delete unused accounts
✅ Back up the `data` folder regularly
✅ Keep credentials confidential

---

**Questions?** Contact your IT administrator.
