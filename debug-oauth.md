# 🐛 OAuth Debug Checklist

## Check 1: Vercel Environment Variables

Go to: https://vercel.com/pendtiumpraz/dibeli-platform/settings/environment-variables

**Verify EXACTLY these values:**

```
NEXTAUTH_URL
Value: https://dibeli-platform.vercel.app
Environment: Production ✓ (ONLY Production, NOT Preview/Development!)

GOOGLE_CLIENT_ID
Value: 1031782040891-e1ehj2dv3h43g2q20dino4dhcv597ona.apps.googleusercontent.com
Environment: Production ✓ Preview ✓ Development ✓

GOOGLE_CLIENT_SECRET
Value: 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
Environment: Production ✓ Preview ✓ Development ✓
```

**CRITICAL**: NEXTAUTH_URL must be EXACTLY `https://dibeli-platform.vercel.app` (no trailing slash!)

---

## Check 2: Google Console Redirect URI

Go to: https://console.cloud.google.com/apis/credentials

Click: OAuth Client ID (1031782040891...)

**Authorized redirect URIs must include:**
```
https://dibeli-platform.vercel.app/api/auth/callback/google
```

EXACT MATCH - no extra spaces, no trailing slash!

---

## Check 3: Google Console OAuth Consent

Go to: https://console.cloud.google.com/apis/credentials/consent

**Publishing status:**
✓ Status: "In production" or "Published"

**OAuth Scopes must include:**
✓ .../auth/userinfo.email
✓ .../auth/userinfo.profile  
✓ openid

---

## Check 4: Vercel Deployment Status

Go to: https://vercel.com/pendtiumpraz/dibeli-platform/deployments

**Latest deployment:**
✓ Status: Ready (green checkmark)
✓ No build errors

**If failed:**
- Check build logs
- Redeploy

---

## Check 5: Full Error Message

Go to: https://vercel.com/pendtiumpraz/dibeli-platform/logs

**Filter by: Error**

Look for complete error message. Should look like:

```
[next-auth][error][OAUTH_CALLBACK_ERROR]
{
  "error": "access_denied",
  "error_description": "..."
}
```

**Copy the FULL error message!**
