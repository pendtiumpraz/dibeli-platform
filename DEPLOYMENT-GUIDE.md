# 🚀 DEPLOYMENT GUIDE

## ⚠️ PREREQUISITES

Sebelum memulai, pastikan Anda sudah install:

### 1. Install Node.js
- Download dari: https://nodejs.org/
- Pilih versi LTS (Long Term Support)
- Minimum version: Node.js 18.x
- Cek instalasi: `node --version` dan `npm --version`

---

## 📦 STEP 1: Install Dependencies

```powershell
cd D:\github\dibeli-platform
npm install
```

Ini akan install semua packages yang dibutuhkan (~300MB node_modules).

---

## 🔧 STEP 2: Setup Environment Variables

### 1. Copy .env.example to .env
```powershell
copy .env.example .env
```

### 2. Edit .env dan isi semua variables

#### A. Database (PostgreSQL)

**Option 1: Supabase (Recommended)**
1. Sign up di https://supabase.com (gratis!)
2. Create new project
3. Ambil connection string dari Settings > Database
4. Format: `postgresql://postgres:[YOUR-PASSWORD]@[HOST]:5432/postgres`

**Option 2: Neon**
1. Sign up di https://neon.tech
2. Create new project
3. Copy connection string

**Option 3: Railway**
1. Sign up di https://railway.app
2. Create PostgreSQL database
3. Copy connection string

Add to `.env`:
```env
DATABASE_URL="your-postgresql-connection-string"
```

#### B. NextAuth Secret

Generate random secret:
```powershell
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

Add to `.env`:
```env
NEXTAUTH_SECRET="generated-secret-here"
NEXTAUTH_URL="http://localhost:3000"
```

#### C. Google OAuth & Drive API

1. Go to https://console.cloud.google.com
2. Create new project atau pilih existing
3. Enable APIs:
   - Google+ API
   - Google Drive API
4. Create OAuth 2.0 Credentials:
   - Application type: Web application
   - Authorized redirect URIs: 
     - `http://localhost:3000/api/auth/callback/google` (development)
     - `https://yourdomain.vercel.app/api/auth/callback/google` (production)
5. Copy Client ID and Client Secret

Add to `.env`:
```env
GOOGLE_CLIENT_ID="your-client-id.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="your-client-secret"
```

---

## 🗄️ STEP 3: Initialize Database

Push Prisma schema to database:
```powershell
npm run db:push
```

Ini akan create semua tables berdasarkan `prisma/schema.prisma`.

Optional - Open Prisma Studio untuk view database:
```powershell
npm run db:studio
```

---

## 🧪 STEP 4: Type Check

Verify semua TypeScript types valid:
```powershell
npx tsc --noEmit
```

Jika ada errors, fix dulu sebelum deploy!

---

## 🏃 STEP 5: Run Development Server

```powershell
npm run dev
```

Open http://localhost:3000

Test:
- ✅ Landing page loads
- ✅ Click "Masuk dengan Google"
- ✅ Google OAuth works
- ✅ Redirect to Dashboard
- ✅ Create store
- ✅ Add products
- ✅ View public storefront

---

## 📤 STEP 6: Deploy to Vercel

### 1. Install Vercel CLI (optional)
```powershell
npm install -g vercel
```

### 2. Initialize Git Repository

```powershell
cd D:\github\dibeli-platform
git init
git add .
git commit -m "Initial commit: dibeli.my.id MVP

Complete Next.js 14 SaaS platform with:
- Authentication (NextAuth + Google OAuth)
- Multi-tenant store management
- Product CRUD
- Public storefront with WhatsApp integration
- Landing page with store directory
- Prisma ORM with PostgreSQL
- Tier-based permissions (Trial/Premium/Unlimited)

Co-authored-by: factory-droid[bot] <138933559+factory-droid[bot]@users.noreply.github.com>"
```

### 3. Push to GitHub

```powershell
# Create repo on GitHub first, then:
git remote add origin https://github.com/YOUR-USERNAME/dibeli-platform.git
git branch -M main
git push -u origin main
```

### 4. Deploy to Vercel

**Via Web Dashboard (Easiest):**
1. Go to https://vercel.com
2. Click "Add New Project"
3. Import your GitHub repository
4. Add Environment Variables:
   - `DATABASE_URL`
   - `NEXTAUTH_SECRET`
   - `NEXTAUTH_URL` (set to your vercel domain)
   - `GOOGLE_CLIENT_ID`
   - `GOOGLE_CLIENT_SECRET`
5. Click Deploy!

**Via CLI:**
```powershell
vercel
```

Follow prompts and deploy!

---

## ✅ POST-DEPLOYMENT CHECKLIST

After deployment:

### 1. Update Google OAuth Redirect URIs
Add your production URL:
- `https://yourdomain.vercel.app/api/auth/callback/google`

### 2. Update NEXTAUTH_URL
In Vercel environment variables:
```env
NEXTAUTH_URL="https://yourdomain.vercel.app"
```

### 3. Test Production
- ✅ Sign in works
- ✅ Store creation works
- ✅ Products display
- ✅ WhatsApp links work
- ✅ Images load (if uploaded)

### 4. Setup Custom Domain (Optional)
In Vercel:
- Settings > Domains
- Add `dibeli.my.id`
- Update DNS records

---

## 🐛 TROUBLESHOOTING

### Error: "Module not found"
```powershell
rm -rf node_modules
npm install
```

### Error: Database connection failed
- Check DATABASE_URL format
- Ensure database is accessible
- Check firewall settings

### Error: OAuth callback failed
- Verify GOOGLE_CLIENT_ID and SECRET
- Check redirect URIs in Google Console
- Ensure NEXTAUTH_URL is correct

### Error: Prisma client not generated
```powershell
npx prisma generate
npm run db:push
```

### Build fails on Vercel
- Check environment variables
- Run `npm run build` locally first
- Check build logs for specific errors

---

## 📊 MONITORING

### Check Logs
Vercel:
- Dashboard > Your Project > Logs

Local:
- Terminal output
- Prisma Studio: `npm run db:studio`

### Database
Supabase:
- Dashboard > Database > Tables
- View analytics and logs

---

## 🔐 SECURITY CHECKLIST

Before going live:

- ✅ All environment variables in Vercel (not in code!)
- ✅ .env in .gitignore
- ✅ Google OAuth configured correctly
- ✅ Database has strong password
- ✅ NEXTAUTH_SECRET is random and secure
- ✅ Rate limiting configured (future)
- ✅ No API keys in client-side code

---

## 🎯 NEXT STEPS

After successful deployment:

1. **Create SuperAdmin Account**
   - Sign in with Google
   - Manually update in database:
   ```sql
   UPDATE "User" SET "isSuperAdmin" = true WHERE email = 'your@email.com';
   ```

2. **Test Full Flow**
   - Create test store
   - Add test products
   - View public storefront
   - Test WhatsApp links

3. **Add First Users**
   - Share signup link
   - Monitor trial conversions
   - Manual activation for Premium users

4. **Marketing**
   - Share on social media
   - List on Product Hunt
   - Indonesian startup communities

---

## 📞 SUPPORT

Stuck? Check:
- Next.js docs: https://nextjs.org/docs
- Prisma docs: https://www.prisma.io/docs
- NextAuth docs: https://next-auth.js.org
- Vercel docs: https://vercel.com/docs

---

## 🎉 SUCCESS!

Jika semua steps berhasil, Anda sekarang punya:

✅ Live SaaS platform di Vercel
✅ Working authentication
✅ Multi-tenant store system
✅ Public landing page
✅ Production database
✅ SSL/HTTPS automatic
✅ CI/CD via GitHub

**SELAMAT! 🚀 Platform dibeli.my.id sudah LIVE!**

---

**Estimated Time**: 30-60 minutes (tergantung setup Google OAuth)
