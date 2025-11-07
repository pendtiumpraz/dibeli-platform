# 🛍️ dibeli.my.id - SaaS Multi-Tenant Online Shop Platform

> Build a professional online store in 10 minutes with customizable templates, Google Drive storage, and WhatsApp integration.

## 🎯 Project Overview

**dibeli.my.id** is a comprehensive SaaS platform that enables anyone to create beautiful online stores without technical knowledge. The platform features:

- ✅ **Multi-tenant architecture** - Complete data isolation per user
- ✅ **Template marketplace** - Buy, sell & create custom templates
- ✅ **Google Drive storage** - Zero hosting costs with OAuth integration
- ✅ **WhatsApp-first** - Direct customer communication
- ✅ **Freemium model** - 14-day trial → Premium → Unlimited
- ✅ **SuperAdmin activation** - Manual quality control
- ✅ **Store directory** - Public marketplace of all stores
- ✅ **Full customization** - Colors, fonts, layouts (Premium)

---

## 🏗️ Tech Stack

### Frontend
- **Next.js 14** (App Router)
- **TypeScript** (Type-safe development)
- **Tailwind CSS** (Utility-first styling)
- **Radix UI** (Accessible components)
- **Framer Motion** (Smooth animations)

### Backend
- **Next.js API Routes** (Server-side logic)
- **Prisma** (Type-safe ORM)
- **PostgreSQL** (Primary database)
- **NextAuth.js** (Authentication)

### Integrations
- **Google OAuth** (User authentication)
- **Google Drive API** (Image storage)
- **WhatsApp API** (Order management)

### Infrastructure
- **Vercel** (Hosting & deployment)
- **Supabase/Neon** (Database hosting)

---

## 📂 Project Structure

```
dibeli-platform/
├── prisma/
│   └── schema.prisma          # Database schema
├── src/
│   ├── app/                   # Next.js App Router
│   │   ├── (auth)/           # Authentication pages
│   │   ├── (dashboard)/      # User dashboard
│   │   ├── (superadmin)/     # SuperAdmin panel
│   │   ├── toko/[slug]/      # Public store pages
│   │   ├── templates/        # Template marketplace
│   │   ├── api/              # API routes
│   │   ├── layout.tsx
│   │   ├── page.tsx          # Landing page
│   │   └── globals.css
│   ├── components/
│   │   ├── templates/        # Template components
│   │   │   ├── cards/        # Product card templates
│   │   │   ├── headers/      # Header templates
│   │   │   ├── footers/      # Footer templates
│   │   │   └── modals/       # Modal templates
│   │   ├── ui/               # Shadcn UI components
│   │   └── shared/           # Shared components
│   ├── lib/
│   │   ├── prisma.ts         # Prisma client
│   │   ├── auth.ts           # NextAuth config
│   │   ├── permissions.ts    # Authorization logic
│   │   ├── utils.ts          # Utility functions
│   │   └── google-drive.ts   # Drive integration
│   └── types/                # TypeScript types
├── public/                    # Static assets
├── .env.example              # Environment variables template
├── package.json
├── tsconfig.json
├── tailwind.config.ts
└── next.config.js
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ installed
- PostgreSQL database (or Supabase/Neon account)
- Google Cloud project (for OAuth & Drive API)

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/dibeli-platform.git
cd dibeli-platform
```

2. **Install dependencies**
```bash
npm install
```

3. **Setup environment variables**
```bash
cp .env.example .env
```

Edit `.env` and fill in your credentials:
```env
DATABASE_URL="postgresql://..."
NEXTAUTH_SECRET="generate-with: openssl rand -base64 32"
NEXTAUTH_URL="http://localhost:3000"
GOOGLE_CLIENT_ID="your-google-oauth-id"
GOOGLE_CLIENT_SECRET="your-google-oauth-secret"
```

4. **Setup database**
```bash
npm run db:push
```

5. **Run development server**
```bash
npm run dev
```

Visit `http://localhost:3000` 🎉

---

## 💰 Business Model

### Pricing Tiers

| Feature | Free Trial | Premium | Unlimited |
|---------|-----------|---------|-----------|
| Duration | 14 days | Monthly | Monthly |
| Price | Free | Rp 49k | Rp 149k |
| Products | 3 max | Unlimited | Unlimited |
| Templates | 1 style | All | All |
| Colors | ❌ | ✅ | ✅ |
| Branding | Platform | Removed | Removed |
| Domain | Subdomain | Subdomain | Custom |
| Stores | 1 | 1 | 3 |

### Revenue Streams

1. **Subscriptions** (Primary)
   - Premium: Rp 49k/month
   - Unlimited: Rp 149k/month

2. **Template Marketplace** (New!)
   - 25-30% commission on template sales
   - Featured listing fees

3. **Pro Creator Plan**
   - Rp 99k/month for template creators
   - Lower commission rates

---

## 🎨 Template System

### Template Categories

The platform supports unlimited template categories:

- **Headers** - Navigation bars, menus
- **Hero Sections** - Landing page heroes
- **Product Cards** - Product display cards (30+ styles included!)
- **Product Modals** - Detail views
- **Footers** - Footer designs
- **Sections** - About, features, testimonials, etc.
- **Forms** - Contact, newsletter, order forms
- **Galleries** - Image galleries, carousels
- **Widgets** - Chat, WhatsApp, social share
- **Custom** - Users can create new categories!

### User-Generated Templates

Users can:
- ✅ Create custom templates (HTML/CSS/JS)
- ✅ Upload to marketplace
- ✅ Sell templates for passive income
- ✅ Earn from each sale (75% revenue share)

### SuperAdmin Template Management

SuperAdmins can:
- ✅ Upload official templates
- ✅ Review community templates
- ✅ Feature high-quality templates
- ✅ Set quality ratings

---

## 🗄️ Database Schema

See `prisma/schema.prisma` for the complete database schema.

Key models:
- **User** - User accounts & authentication
- **Store** - Store data & configuration
- **Product** - Products in stores
- **Template** - Template library
- **StoreTemplate** - Applied templates per store
- **TemplatePurchase** - Marketplace transactions

---

## 🔐 Authentication & Authorization

### User Tiers

```typescript
enum UserTier {
  TRIAL      // 14-day trial
  FREE       // Trial expired
  PREMIUM    // Rp 49k/month
  UNLIMITED  // Rp 149k/month
}
```

### Permission System

```typescript
checkPermission(user.tier, 'color_customization')
// Returns: true for PREMIUM/UNLIMITED, false for TRIAL/FREE
```

### SuperAdmin Activation

Premium activation requires manual approval:
1. User requests upgrade
2. Submits payment proof
3. SuperAdmin reviews
4. Manually activates account
5. Premium features unlocked

---

## 🌐 Landing Page Features

### Store Directory

All published stores are showcased on the homepage:

- **Featured Stores** - Curated by SuperAdmin
- **Top Stores** - Ranked by views (7-day period)
- **New Stores** - Recently launched
- **Browse by Category** - Filter by business type
- **Search & Filter** - Find specific stores

### Store Cards

Each store displays:
- Hero section preview screenshot
- Store name, logo, tagline
- Location, product count
- View count, rating
- Badges (New, Top, Verified, Featured)

---

## 📱 Store Features

### For Store Owners

- ✅ Easy product management
- ✅ Drag & drop image upload (to Google Drive)
- ✅ Template selection & customization
- ✅ Color picker (Premium)
- ✅ Category organization
- ✅ WhatsApp integration per product
- ✅ Real-time preview
- ✅ Mobile responsive (automatic)
- ✅ SEO settings
- ✅ Analytics dashboard

### For Customers

- ✅ Beautiful storefront
- ✅ Fast loading
- ✅ Mobile-friendly
- ✅ Direct WhatsApp ordering
- ✅ Image galleries
- ✅ Category filtering
- ✅ Search functionality

---

## 🚀 Deployment

### Vercel Deployment

1. Push to GitHub
2. Import to Vercel
3. Add environment variables
4. Deploy!

### Database Setup

Use **Supabase** (recommended) or **Neon**:
1. Create PostgreSQL database
2. Copy connection string
3. Add to `DATABASE_URL` in Vercel
4. Run `npm run db:push` to create tables

### Google OAuth Setup

1. Go to Google Cloud Console
2. Create OAuth 2.0 credentials
3. Add authorized redirect: `https://yourdomain.com/api/auth/callback/google`
4. Add Drive API scope
5. Copy Client ID & Secret

---

## 📊 Development Roadmap

### ✅ Phase 1: Foundation (Week 1-2)
- [x] Project setup
- [x] Database schema
- [x] Basic structure
- [ ] Authentication
- [ ] User dashboard

### 🚧 Phase 2: Core Features (Week 3-6)
- [ ] Store creation flow
- [ ] Product CRUD
- [ ] Google Drive integration
- [ ] Template picker UI
- [ ] Color customization

### 📅 Phase 3: Templates (Week 7-10)
- [ ] Template system
- [ ] 30+ official templates
- [ ] Template upload form
- [ ] Live preview generator
- [ ] Template marketplace

### 📅 Phase 4: Premium (Week 11-12)
- [ ] Upgrade request system
- [ ] SuperAdmin panel
- [ ] Manual activation
- [ ] Payment tracking
- [ ] Analytics

### 📅 Phase 5: Launch (Week 13-14)
- [ ] Public storefront
- [ ] Landing page
- [ ] Store directory
- [ ] SEO optimization
- [ ] Beta launch! 🚀

---

## 🤝 Contributing

This is a private project. If you have access and want to contribute:

1. Create a feature branch
2. Make your changes
3. Submit a pull request
4. Wait for review

---

## 📄 License

Proprietary - All rights reserved

---

## 👥 Team

- **Product Lead** - Business & strategy
- **Tech Lead** - Architecture & development
- **Design Lead** - UI/UX & templates

---

## 📞 Support

- **Email**: hello@dibeli.my.id
- **WhatsApp**: +62 xxx-xxxx-xxxx
- **Documentation**: https://docs.dibeli.my.id

---

## 🎉 Status

**Current Status**: 🚧 UNDER CONSTRUCTION

**Version**: 1.0.0 (MVP)  
**Last Updated**: November 2024  
**Next Milestone**: Authentication & Dashboard

---

**Built with ❤️ in Indonesia**
