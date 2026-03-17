# Mobile Device Setup Guide

## 📱 Accessing the App from iPhone/iPad/Android

Mobile Safari and Chrome require **HTTPS** for camera access. This app automatically generates a self-signed certificate for secure mobile access.

---

## Quick Setup (5 minutes)

### Step 1: Start the Server
On your Mac/PC:
```bash
npm start
```

You'll see output like:
```
╔════════════════════════════════════════════════════╗
║   DePaul Athletics ITAM Server                     ║
║                                                    ║
║   📱 MOBILE CAMERA ACCESS (iOS/Android):           ║
║   https://192.168.1.5:3443                         ║
║   ⚠️  Accept security warning (self-signed cert)   ║
╚════════════════════════════════════════════════════╝
```

**Copy the HTTPS URL** (e.g., `https://192.168.1.5:3443`)

### Step 2: Connect from Your Mobile Device

1. **Connect to the same WiFi network** as your server
2. **Open Safari** (iOS) or **Chrome** (Android)
3. **Navigate to the HTTPS URL** from Step 1
4. **You'll see a security warning** - this is expected!

---

## Accepting the Self-Signed Certificate

### iOS Safari:

1. When you see "This Connection Is Not Private"
2. Tap **"Show Details"**
3. Tap **"visit this website"**
4. Tap **"Visit Website"** again to confirm
5. The app will load!

### Android Chrome:

1. When you see "Your connection is not private"
2. Tap **"Advanced"**
3. Tap **"Proceed to [IP address] (unsafe)"**
4. The app will load!

**Note:** This warning appears because we're using a self-signed certificate. The connection is still encrypted - it's just not verified by a certificate authority.

---

## Camera Permissions

### First Time Using Camera:

1. When you tap a camera button (📷), the browser will ask for camera access
2. Tap **"Allow"** to grant permission
3. Camera will activate automatically

### If Camera Doesn't Work:

#### iOS Safari:
1. Go to **Settings** → **Safari**
2. Scroll down to **Camera**
3. Make sure it's set to **"Ask"** or **"Allow"**
4. Return to Safari and reload the page

#### Android Chrome:
1. Tap the **🔒** icon in the address bar
2. Tap **"Permissions"**
3. Enable **"Camera"**
4. Reload the page

---

## Add to Home Screen (Optional)

Make the app feel like a native app!

### iOS:
1. Tap the **Share** button (square with arrow)
2. Scroll down and tap **"Add to Home Screen"**
3. Tap **"Add"**
4. The app icon will appear on your home screen!

### Android:
1. Tap the **menu** (⋮) in Chrome
2. Tap **"Add to Home screen"**
3. Tap **"Add"**
4. The app icon will appear on your home screen!

---

## Troubleshooting

### "Camera streaming not supported by the browser"
- ✅ Make sure you're using the **HTTPS** URL (not HTTP)
- ✅ Verify you're on the **same WiFi network** as the server
- ✅ Check that you **accepted the certificate warning**

### "Cannot connect to server" when logging in
- ✅ Verify the server is running on your Mac/PC
- ✅ Check the IP address hasn't changed (router may assign new IPs)
- ✅ Make sure firewall isn't blocking ports 3443

### Certificate keeps expiring
- The self-signed certificate is valid for 365 days
- After a year, just restart the server - it will auto-generate a new one
- Or manually delete `server.key` and `server.crt` and restart

### Camera permission denied
- Go to iOS Settings → Safari → Camera
- Or Android Settings → Apps → Chrome → Permissions → Camera
- Enable camera access and reload the page

---

## Why HTTPS is Required

Mobile browsers (Safari, Chrome) require secure HTTPS connections to access:
- Camera
- Microphone  
- Location
- Other sensitive hardware

This is a security feature to protect users. Our self-signed certificate enables HTTPS without needing to purchase a certificate from a Certificate Authority.

---

## Network Security Note

The self-signed certificate provides encryption but not identity verification. This is fine for:
- ✅ Internal networks (home/office WiFi)
- ✅ Trusted devices only
- ✅ Not exposing to the internet

**Do NOT:**
- ❌ Expose this server to the public internet
- ❌ Use on untrusted networks
- ❌ Share the URL outside your organization

---

## Quick Reference

| Use Case | URL to Use |
|----------|-----------|
| Desktop (same machine) | `http://localhost:3000` |
| Desktop (network) | `http://192.168.x.x:3000` |
| **Mobile (with camera)** | **`https://192.168.x.x:3443`** ⭐ |

---

## Need Help?

Common issues:
1. **Wrong URL?** - Use HTTPS (port 3443) for mobile, not HTTP (port 3000)
2. **Can't connect?** - Verify same WiFi network and server is running
3. **Security warning?** - This is normal for self-signed certs, accept and proceed
4. **No camera access?** - Check browser permissions in device settings

The server displays the correct URLs when it starts - just copy the one under "📱 MOBILE CAMERA ACCESS"!
