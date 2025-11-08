# 🔐 COMPLETE GOOGLE SETUP GUIDE

## 📋 What You'll Setup:

1. ✅ **Google OAuth** - Login dengan Google
2. ✅ **Google Drive API** - Upload gambar produk
3. ✅ **Gmail SMTP** - Email notifikasi otomatis

**Total Time**: ~15 menit

---

## 🎯 PART 1: GOOGLE CLOUD CONSOLE

### Step 1: Create Project

1. Go to: https://console.cloud.google.com
2. Click dropdown project (kiri atas) → "New Project"
3. **Project name**: `dibeli-platform`
4. Click **"Create"**
5. Wait 30 detik
6. **Select** project yang baru dibuat

---

### Step 2: OAuth Consent Screen

1. Go to: https://console.cloud.google.com/apis/credentials/consent
2. **User Type**: **External**
3. Click **"Create"**

#### Page 1: App Information
```
App name: dibeli.my.id
User support email: [YOUR-EMAIL@gmail.com]
App logo: (skip)

App domain:
- Home page: https://dibeli-platform.vercel.app
- Privacy policy: https://dibeli-platform.vercel.app
- Terms: https://dibeli-platform.vercel.app

Developer contact: [YOUR-EMAIL@gmail.com]
```
Click **"Save and Continue"**

#### Page 2: Scopes
Click **"Add or Remove Scopes"**

Select these:
```
✓ .../auth/userinfo.email
✓ .../auth/userinfo.profile  
✓ openid
✓ .../auth/drive.file
```

Click **"Update"** → **"Save and Continue"**

#### Page 3: Test Users
Click **"Add Users"**
Add: `your-email@gmail.com`

Click **"Save and Continue"** → **"Back to Dashboard"**

---

### Step 3: Create OAuth Credentials

1. Go to: https://console.cloud.google.com/apis/credentials
2. Click **"Create Credentials"** → **"OAuth client ID"**
3. **Application type**: **Web application**
4. **Name**: `dibeli.my.id Web Client`

5. **Authorized JavaScript origins**:
```
http://localhost:3000
https://dibeli-platform.vercel.app
```

6. **Authorized redirect URIs**:
```
http://localhost:3000/api/auth/callback/google
https://dibeli-platform.vercel.app/api/auth/callback/google
```

7. Click **"Create"**

### ✅ COPY THIS:
```
Client ID: 123456789-xxxxx.apps.googleusercontent.com
Client Secret: GOCSPX-xxxxxxxxxxxx
```

**⚠️ SAVE TO NOTEPAD!**

---

### Step 4: Enable Google Drive API

1. Go to: https://console.cloud.google.com/apis/library
2. Search: **"Google Drive API"**
3. Click **"Google Drive API"**
4. Click **"Enable"**
5. Wait 15 detik

✅ **DONE!** OAuth credentials tadi otomatis bisa akses Drive API juga!

---

## 📧 PART 2: GMAIL SMTP SETUP

### Step 5: Enable 2-Step Verification

1. Go to: https://myaccount.google.com/security
2. Find **"2-Step Verification"**
3. Click **"Get Started"**
4. Follow wizard (verify phone)
5. Complete setup

### Step 6: Generate App Password

1. Go to: https://myaccount.google.com/apppasswords
2. **Select app**: Mail
3. **Select device**: Other → Type: **dibeli.my.id**
4. Click **"Generate"**
5. **Copy** 16-character password

Format: `xxxx xxxx xxxx xxxx`

**⚠️ SAVE TO NOTEPAD!**

---

## 🔧 PART 3: UPDATE LOCAL .ENV

Open: `D:\github\dibeli-platform\.env`

### Edit These Lines:

```env
# Line 2 - PASTE YOUR POSTGRES_URL
DATABASE_URL="prisma+postgres://accelerate.prisma-data.net/?api_key=YOUR_API_KEY"

# Line 9-10 - PASTE GOOGLE OAUTH CREDENTIALS
GOOGLE_CLIENT_ID="123456789-xxxxx.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="GOCSPX-xxxxxxxxxxxx"

# Line 14-16 - PASTE GMAIL SMTP
SMTP_USER="your-email@gmail.com"
SMTP_PASS="xxxx xxxx xxxx xxxx"
SMTP_FROM="dibeli.my.id <your-email@gmail.com>"
```

**Save file!**

---

## 🚀 PART 4: INSTALL & TEST

### 1. Install Nodemailer

```powershell
cd D:\github\dibeli-platform
npm install
```

### 2. Initialize Database

```powershell
npx prisma db push
```

### 3. Test Locally

```powershell
npm run dev
```

Visit: http://localhost:3000

### 4. Test Login
1. Click **"Masuk dengan Google"**
2. Login dengan email Anda
3. Check email inbox untuk **Welcome Email** 📧

---

## ☁️ PART 5: UPDATE VERCEL ENV VARS

Go to: https://vercel.com/your-username/dibeli-platform/settings/environment-variables

### Add These Variables:

```env
DATABASE_URL = prisma+postgres://accelerate.prisma-data.net/?api_key=...
NEXTAUTH_SECRET = KBZsbJYtK33kk0+dntx5lBP/oA2iQ61XeCB4iYR2hfg=
NEXTAUTH_URL = https://dibeli-platform.vercel.app
GOOGLE_CLIENT_ID = 123456789-xxxxx.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET = GOCSPX-xxxxxxxxxxxx
SMTP_HOST = smtp.gmail.com
SMTP_PORT = 587
SMTP_USER = your-email@gmail.com
SMTP_PASS = xxxx xxxx xxxx xxxx
SMTP_FROM = dibeli.my.id <your-email@gmail.com>
NEXT_PUBLIC_APP_URL = https://dibeli-platform.vercel.app
```

Click **"Save"** untuk setiap variable.

---

## 🔄 PART 6: REDEPLOY

### Option A: Via Dashboard
1. Go to Deployments
2. Click **"Redeploy"**
3. **UNCHECK** "Use existing Build Cache"
4. Click **"Redeploy"**

### Option B: Via Git
```powershell
git add .
git commit -m "Add email notifications with Gmail SMTP"
git push
```

---

## ✅ VERIFICATION CHECKLIST

Test setelah deploy:

```
Local Testing:
[✓] npm run dev works
[✓] Login dengan Google works
[✓] Welcome email diterima
[✓] Dashboard accessible

Production Testing:
[✓] https://dibeli-platform.vercel.app loads
[✓] Click "Masuk dengan Google"
[✓] Google OAuth works
[✓] Redirect ke dashboard
[✓] Welcome email diterima
```

---

## 📧 EMAIL TEMPLATES INCLUDED

### 1. Welcome Email
Dikirim saat user signup pertama kali:
- ✅ Greeting dengan nama
- ✅ Trial info (14 hari)
- ✅ Feature highlights
- ✅ Next steps guide
- ✅ Upgrade to Premium info

### 2. Trial Expiring Email
Dikirim 3 hari sebelum trial habis:
- ✅ Warning trial akan habis
- ✅ Premium benefits
- ✅ Special offer
- ✅ Upgrade link

### 3. Store Published Email
Dikirim saat toko pertama kali publish:
- ✅ Congratulations message
- ✅ Store URL
- ✅ Share tips
- ✅ Sales tips

---

## 🐛 TROUBLESHOOTING

### Error: "Invalid Client ID"
**Fix**: 
1. Check GOOGLE_CLIENT_ID di .env
2. Pastikan format: `xxxxx.apps.googleusercontent.com`
3. Copy ulang dari Google Console

### Error: "Redirect URI mismatch"
**Fix**:
1. Check Google Console → Credentials
2. Authorized redirect URIs harus ada:
   - `http://localhost:3000/api/auth/callback/google`
   - `https://dibeli-platform.vercel.app/api/auth/callback/google`

### Error: "Email not sent"
**Fix**:
1. Check Gmail App Password benar
2. Pastikan 2-Step Verification enabled
3. Check SMTP_USER = email yang sama dengan yang generate app password

### Error: "Configuration error"
**Fix**:
1. Check NEXTAUTH_URL di Vercel = `https://dibeli-platform.vercel.app`
2. Redeploy (uncheck build cache)

---

## 📊 EXPECTED RESULTS

### After Successful Setup:

1. **User signs up** → Welcome email sent ✅
2. **User creates store** → Store published email sent ✅
3. **Trial expires in 3 days** → Reminder email sent ✅
4. **User uploads image** → Saved to Google Drive ✅
5. **All features working** → Production ready ✅

---

## 💡 PRO TIPS

### Email Best Practices:
- ✅ Don't spam users
- ✅ Only send important notifications
- ✅ Make emails mobile-friendly
- ✅ Include unsubscribe link (future)

### Security:
- ✅ Never commit .env to git
- ✅ Use App Password, not real password
- ✅ Rotate credentials periodically
- ✅ Monitor failed login attempts

### Testing:
- ✅ Test emails before going live
- ✅ Check spam folder
- ✅ Verify links work
- ✅ Test on mobile devices

---

## 📞 NEED HELP?

### Common Issues:

**Q: Email masuk ke spam?**
A: Normal untuk app baru. User perlu mark "Not Spam" dulu.

**Q: Cara custom email template?**
A: Edit file: `src/lib/email.ts` → function `sendWelcomeEmail()`

**Q: Bisa pakai custom domain untuk email?**
A: Ya, tapi perlu setup SPF, DKIM, DMARC records di domain DNS.

**Q: Limit sending berapa email per hari?**
A: Gmail App Password: ~500 email/hari. Cukup untuk MVP.

---

## 🎉 SUCCESS!

Setelah setup ini complete, platform Anda akan:

✅ **Authentication** - User bisa login dengan Google
✅ **Image Upload** - User bisa upload ke Google Drive
✅ **Email Notifications** - Otomatis kirim welcome email
✅ **Production Ready** - Siap di-deploy ke Vercel

---

## 📋 SUMMARY CREDENTIALS NEEDED

```
1. POSTGRES_URL (from Prisma)
2. GOOGLE_CLIENT_ID (from Google Console)
3. GOOGLE_CLIENT_SECRET (from Google Console)
4. GMAIL APP PASSWORD (from Google Account)
```

---

**Total Setup Time**: 15 menit ⏱️  
**Difficulty**: Medium 📊  
**Cost**: FREE 🎉

**GOOD LUCK! 🚀**
