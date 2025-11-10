# 🔧 Gemini API Setup Guide

## Problem
```
API key not valid. Please pass a valid API key.
```

## Solution: Get NEW Gemini API Key

### Step 1: Go to Google AI Studio
```
https://aistudio.google.com/app/apikey
```

### Step 2: Create API Key
1. Click **"Get API key"** or **"Create API key"**
2. Select **"Create API key in new project"** (recommended)
3. Wait for key generation (~10 seconds)
4. Copy the key (starts with `AIza...`)

### Step 3: Enable Gemini API
1. Go to: https://console.cloud.google.com/apis/library/generativelanguage.googleapis.com
2. Select the same project
3. Click **"ENABLE"**
4. Wait for activation (~1 minute)

### Step 4: Save Key in Settings
1. Go to: https://dibeli.my.id/dashboard/settings
2. Paste API key di field "Gemini API Key"
3. Click "Save API Keys"
4. Refresh page

### Step 5: Test
1. Go to Create Product
2. Select "Google Gemini 2.0"
3. Click "1-CLICK GENERATE"
4. Should work now! ✅

## Working Models
Based on testing, these Gemini models work:
- `gemini-1.5-flash` ← Most stable
- `gemini-1.5-pro` ← Best quality
- `gemini-2.0-flash-exp` ← Experimental (if enabled)

## Rate Limits (FREE Tier)
- 15 requests/minute
- 32,000 tokens/minute
- 1,500 requests/day

## Alternative: Use Groq (RECOMMENDED!)
Groq works better with more generous limits:
- ✅ 30 requests/minute (2x Gemini)
- ✅ Super fast (134ms avg)
- ✅ No complex setup

Get Groq API key: https://console.groq.com/keys
