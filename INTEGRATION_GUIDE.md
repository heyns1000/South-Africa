# Fruitful South Africa - Complete Integration Guide

## Overview
This guide provides everything you need to integrate the Fruitful South Africa system into any Replit application.

## Quick Setup (3 Steps)

### Step 1: Set Up Replit Account-Level Secrets
1. Go to your Replit account settings
2. Navigate to "Secrets" → "Account Secrets" tab
3. Add these secrets (they'll be available across ALL your Replit apps):

```
PAYPAL_CLIENT_ID=your_paypal_client_id_here
PAYPAL_CLIENT_SECRET=your_paypal_client_secret_here
GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here
SPOTIFY_TOKEN=your_spotify_token_here
GEMINI_API_KEY=your_gemini_api_key_here
XERO_CLIENT_ID=your_xero_client_id_here
XERO_CLIENT_SECRET=your_xero_client_secret_here
XERO_REDIRECT_URI=your_xero_redirect_uri_here
XERO_WEBHOOK_KEY=your_xero_webhook_key_here
EXCHANGE_RATE_API_KEY=your_exchange_rate_api_key_here
```

### Step 2: Copy Integration Files
Copy these files into your new Replit app:
- `fruitful-integration.js` - Main integration script
- `fruitful-config.json` - Configuration file
- `verify-integration.js` - Verification script

### Step 3: Link Secrets to Your App
1. In your new Replit app, open "Secrets" → "App Secrets" tab
2. Check all the account-level secrets you created
3. Click "Link to this App"

## Integration Components

### PayPal Payment Tiers
- **Starter Package**: Button ID `YOUR_STARTER_BUTTON_ID`
- **Pro Package**: Button ID `YOUR_PRO_BUTTON_ID`
- **Enterprise Package**: Button ID `YOUR_ENTERPRISE_BUTTON_ID`
- **Banimal Plan**: Button ID (needs to be configured)

### Supported Services
✅ PayPal (SDK + Hosted Buttons)
✅ Google Maps API
✅ Spotify API
✅ Gemini AI
✅ Xero Accounting (OAuth + Webhooks)
✅ ExchangeRate-API

## Verification

After setup, run the verification script:
```bash
node verify-integration.js
```

This will check:
- ✓ All environment variables are set
- ✓ API keys are valid format
- ✓ PayPal SDK initializes correctly
- ✓ All payment buttons are configured
- ✓ Health check endpoint responds

## Brand Catalog (12 Products)

### South African Brands (6)
1. **LoopPay™** - Construction payout loop
2. **VeldGroei™** - Ancestral crop seeds
3. **BoerKraal™** - Land rights management
4. **PlaasFix™** - Off-grid farm tools
5. **MielieFire™** - Nutrition brand
6. **OumaWys™** - Heritage cooking

### Logic & Automation (3)
7. **OmniLogic™** - AI decision logic
8. **MineNest™** - Decentralized data storage
9. **TraceNode™** - Asset tracking

### Sovereign Insurance (3)
10. **CrownGuard™** - High-value asset insurance
11. **RiskRebate™** - Dynamic premium reduction
12. **ClanCover™** - Community risk pooling

## Support

If you encounter issues:
1. Run `node verify-integration.js` to diagnose
2. Check that all secrets are linked in "App Secrets" tab
3. Verify environment variables with `printenv | grep -E "(PAYPAL|GOOGLE|SPOTIFY|GEMINI|XERO|EXCHANGE)"`
