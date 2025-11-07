# 🚀 QUICKSTART GUIDE

## ⚡ Get Running in 5 Minutes

### Step 1: Install Dependencies (2 minutes)

```bash
cd D:\github\dibeli-platform
npm install
```

This will install all required packages including Next.js, Prisma, TypeScript, Tailwind, etc.

---

### Step 2: Setup Environment Variables (1 minute)

1. Copy the example env file:
```bash
copy .env.example .env
```

2. Edit `.env` and add **minimal config** to get started:

```env
# Temporary local database (we'll setup later)
DATABASE_URL="file:./dev.db"

# Generate secret (run this in PowerShell):
# node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
NEXTAUTH_SECRET="your-secret-here"

NEXTAUTH_URL="http://localhost:3000"

# We'll add Google OAuth later
```

---

### Step 3: Initialize Database (1 minute)

```bash
npm run db:push
```

This creates all database tables from the Prisma schema.

---

### Step 4: Start Development Server (30 seconds)

```bash
npm run dev
```

Open: **http://localhost:3000** 🎉

---

## 🎯 What You'll See

You'll see a **temporary landing page** with:
- dibeli.my.id branding
- "Under Construction" message
- Links to Dashboard and Templates (not yet functional)

---

## 📋 Next Steps (In Order)

### Immediate (Next Session):
1. ✅ **Setup Google OAuth**
   - Go to: https://console.cloud.google.com
   - Create OAuth 2.0 credentials
   - Enable Google Drive API
   - Add credentials to `.env`

2. ✅ **Build Authentication**
   - NextAuth.js configuration
   - Login/Signup pages
   - Protected routes
   - Session management

3. ✅ **Create User Dashboard**
   - Dashboard layout
   - Store creation form
   - Product management UI
   - Settings page

### Short-term (Week 1-2):
4. ✅ **Google Drive Integration**
   - OAuth flow for Drive access
   - Upload images to user's Drive
   - Generate shareable links
   - Display images in store

5. ✅ **Product Management**
   - Add product form
   - Image upload
   - Edit/Delete products
   - Categories

6. ✅ **Template Picker**
   - Browse 30+ templates
   - Preview template
   - Apply to store
   - Save selection

### Medium-term (Week 3-4):
7. ✅ **Storefront (Public)**
   - Dynamic route: `/toko/[slug]`
   - Render selected templates
   - Display products
   - WhatsApp buttons

8. ✅ **Landing Page (Store Directory)**
   - Featured stores
   - Top stores by views
   - New stores
   - Search & filter

9. ✅ **Color Customization (Premium)**
   - Color picker UI
   - Real-time preview
   - Save custom colors
   - Apply to templates

### Long-term (Week 5+):
10. ✅ **Template Marketplace**
    - Browse templates
    - Template upload form
    - Purchase flow
    - Creator dashboard

11. ✅ **SuperAdmin Panel**
    - User management
    - Activation requests
    - Template review
    - Analytics

---

## 🛠️ Development Tips

### Hot Reload
Any changes to code will auto-reload. Just save and refresh!

### Database Changes
After modifying `prisma/schema.prisma`:
```bash
npm run db:push
```

### View Database
To browse your database:
```bash
npm run db:studio
```
Opens Prisma Studio at http://localhost:5555

### Type Safety
TypeScript will catch errors. Check the terminal for any red errors!

### Styling
- Uses Tailwind CSS (utility classes)
- Custom components in `/src/components/ui`
- Global styles in `/src/app/globals.css`

---

## 📁 Key Files to Know

| File | Purpose |
|------|---------|
| `src/app/page.tsx` | Homepage (landing page) |
| `src/app/layout.tsx` | Root layout (wraps all pages) |
| `src/app/globals.css` | Global CSS styles |
| `prisma/schema.prisma` | Database schema |
| `src/lib/prisma.ts` | Database client |
| `src/lib/utils.ts` | Utility functions |
| `src/lib/permissions.ts` | Authorization logic |

---

## 🐛 Troubleshooting

### Port 3000 already in use?
```bash
# Kill the process or use a different port:
npm run dev -- -p 3001
```

### Database errors?
```bash
# Reset database:
rm prisma/dev.db
npm run db:push
```

### Module not found?
```bash
# Reinstall dependencies:
rm -rf node_modules
npm install
```

---

## 🎓 Learning Resources

### Next.js 14
- Docs: https://nextjs.org/docs
- App Router: https://nextjs.org/docs/app

### Prisma
- Docs: https://www.prisma.io/docs
- Schema: https://www.prisma.io/docs/concepts/components/prisma-schema

### Tailwind CSS
- Docs: https://tailwindcss.com/docs
- Cheat Sheet: https://nerdcave.com/tailwind-cheat-sheet

---

## ✅ Checklist for First Session

- [ ] Dependencies installed
- [ ] .env configured
- [ ] Database initialized
- [ ] Dev server running
- [ ] Saw landing page
- [ ] Prisma Studio works
- [ ] Ready for next step!

---

## 💬 Need Help?

1. Check the main `README.md`
2. Review architecture docs in `js-interaction` folder
3. Check Prisma/Next.js docs
4. Ask for help!

---

**You're all set! Happy coding! 🚀**

Next step: Setup Google OAuth and build authentication!
