# 🚀 VERCEL DEPLOYMENT CHECKLIST

## ⚠️ DEPLOYMENT FAILED? Follow This:

### Step 1: Check Error Logs (2 minutes)

1. Go to: https://vercel.com/pendtiumpraz/dibeli-platform/deployments
2. Click on **FAILED** deployment
3. Click **"Build Logs"** tab
4. Look for RED error messages

**Common Errors:**

#### Error 1: "Environment variable not found"
```
❌ Error: NEXTAUTH_URL is not defined
```
**Fix**: Add missing environment variable in Vercel settings

#### Error 2: "Table does not exist"  
```
❌ PrismaClientKnownRequestError: Table 'Account' does not exist
```
**Fix**: Database already initialized, just need env vars

#### Error 3: "Build failed"
```
❌ Command "npm run build" exited with 1
```
**Fix**: Check full build logs for specific error

---

## ✅ MANDATORY ENVIRONMENT VARIABLES

Go to: https://vercel.com/pendtiumpraz/dibeli-platform/settings/environment-variables

### CRITICAL (Must Add First):

```env
DATABASE_URL
prisma+postgres://accelerate.prisma-data.net/?api_key=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqd3RfaWQiOjEsInNlY3VyZV9rZXkiOiJza18zaUl5UERYVlphN1A1d3RqLXpWbTciLCJhcGlfa2V5IjoiMDFLOUo2RzRRRlpQM0JHRjMwRUNLWUtYWTciLCJ0ZW5hbnRfaWQiOiI4NDUzYTRhZjYwMGI2Y2Q1ZmRhYjkzZGFkZjRhMTg0MmQxZGQyOTdjMTIxNGU4ZmMyYzg4MjlkMWVlZTcyYTRjIiwiaW50ZXJuYWxfc2VjcmV0IjoiYzZiMzQwZWYtYjhhOS00YzBjLTliZGEtNjFhODZiODA3YThiIn0.2DptL5x10E2_AqSdLfvbqHjgGsOgqAFyzY1ygB7xyKU
Environments: Production ✓ Preview ✓ Development ✓

NEXTAUTH_SECRET
KBZsbJYtK33kk0+dntx5lBP/oA2iQ61XeCB4iYR2hfg=
Environments: Production ✓ Preview ✓ Development ✓

NEXTAUTH_URL
https://dibeli-platform.vercel.app
Environments: Production ✓ (ONLY Production!)

GOOGLE_CLIENT_ID
1031782040891-e1ehj2dv3h43g2q20dino4dhcv597ona.apps.googleusercontent.com
Environments: Production ✓ Preview ✓ Development ✓

GOOGLE_CLIENT_SECRET
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
Environments: Production ✓ Preview ✓ Development ✓
```

### OPTIONAL (Add Later for Email):

```env
SMTP_HOST = smtp.gmail.com
SMTP_PORT = 587
SMTP_USER = dibeli.my.id@gmail.com
SMTP_PASS = zgco varv nrxs hpun
SMTP_FROM = dibeli.my.id <dibeli.my.id@gmail.com>
NEXT_PUBLIC_APP_URL = https://dibeli-platform.vercel.app
```

---

## 🔧 HOW TO ADD ENVIRONMENT VARIABLES:

### Method 1: Via Dashboard (Easiest)

1. Go to: https://vercel.com/pendtiumpraz/dibeli-platform/settings/environment-variables
2. Click **"Add New"** button
3. Enter **Key** name (e.g., DATABASE_URL)
4. Enter **Value** (copy from above)
5. Select **Environments**:
   - For DATABASE_URL: Check all 3 (Production, Preview, Development)
   - For NEXTAUTH_URL: Check ONLY Production
6. Click **"Save"**
7. Repeat for all variables

### Method 2: Via Vercel CLI

```bash
vercel env add DATABASE_URL production
# Paste value when prompted
```

---

## 🚀 AFTER ADDING VARIABLES:

### Option A: Automatic (Recommended)
**Just wait!** Vercel will auto-deploy after environment variables are added.

Check: https://vercel.com/pendtiumpraz/dibeli-platform/deployments

### Option B: Manual Trigger
If no auto-deploy:
1. Go to Deployments
2. Click latest deployment
3. Click **"Redeploy"** button
4. **UNCHECK** "Use existing Build Cache"
5. Click **"Redeploy"**

---

## ✅ VERIFICATION STEPS:

### Step 1: Check Deployment Status
https://vercel.com/pendtiumpraz/dibeli-platform/deployments

Should see: **✅ Ready** (not ❌ Failed)

### Step 2: Visit Site
https://dibeli-platform.vercel.app

Should load the landing page (not 500 error)

### Step 3: Test Login
1. Click "Masuk dengan Google"
2. Login with dibeli.my.id@gmail.com
3. Should redirect to /dashboard
4. Check email for welcome message

---

## 🐛 TROUBLESHOOTING:

### Issue: "Still failing after adding env vars"

**Check:**
1. Did you add ALL 5 critical variables?
2. Did you select correct environments? (Production ✓)
3. Did you click "Save" for each one?
4. Did you wait 2-3 minutes for deploy?

**Fix:**
- Check deployment logs for specific error
- Paste error here for help

### Issue: "Deployment succeeds but login fails"

**Check:**
1. Is NEXTAUTH_URL = `https://dibeli-platform.vercel.app` (not localhost)?
2. Did you add Google OAuth redirect URI in Google Console?
3. Did you add dibeli.my.id@gmail.com as test user?

**Fix:**
- Go to: https://console.cloud.google.com/apis/credentials/consent
- Add test user: dibeli.my.id@gmail.com
- Update redirect URI

### Issue: "Build succeeds but site shows 500 error"

**Check Function Logs:**
1. Go to: https://vercel.com/pendtiumpraz/dibeli-platform/logs
2. Filter by: Error
3. Look for Prisma or NextAuth errors

**Common cause:** Database not initialized
**Fix:** Already done! Just need env vars.

---

## 📋 QUICK STATUS CHECK:

### Current Status:
```
✅ Code pushed to GitHub
✅ Database initialized (all tables exist)
✅ Schema includes Account & VerificationToken
✅ Latest commit: ed74769 (trigger redeploy)
⚠️ Environment variables: Need to be added in Vercel
⏳ Deployment: In progress
```

### What's Needed:
1. Add 5 critical environment variables to Vercel
2. Wait for deployment to complete (~2 min)
3. Test login

### Expected Timeline:
- Add env vars: 5 minutes
- Deployment: 2 minutes
- Testing: 1 minute
- **Total: 8 minutes to working site!**

---

## 🎯 MOST COMMON MISTAKE:

**Forgetting to select environments!**

When adding env vars, make sure to CHECK:
- ✓ Production (always!)
- ✓ Preview (for preview deployments)
- ✓ Development (for local dev)

**Except NEXTAUTH_URL**: Only Production!

---

## 💡 PRO TIPS:

### Tip 1: Check Logs First
Always check deployment logs before asking for help. Error message tells you exactly what's wrong!

### Tip 2: One Variable at a Time
Add env vars one by one, check spelling carefully.

### Tip 3: Use Vercel CLI
Faster for multiple variables:
```bash
vercel env pull .env.production
```

### Tip 4: Copy-Paste Carefully
Don't manually type long values. Copy from VERCEL-ENV-VARS.txt file.

---

## 📞 STILL STUCK?

### Share These:
1. Screenshot of Vercel deployment logs (Build Logs tab)
2. Screenshot of Environment Variables page (list of vars added)
3. URL of failed deployment

### Or Try:
1. Delete all env vars
2. Add one by one from VERCEL-ENV-VARS.txt
3. Trigger redeploy

---

**ADD THOSE 5 CRITICAL ENV VARS NOW!** 🚀

After adding, deployment should succeed automatically in 2-3 minutes!
