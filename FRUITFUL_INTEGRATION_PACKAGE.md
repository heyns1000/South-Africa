# 🎯 Fruitful South Africa - Complete Integration Package

## 📦 What You're Getting

This package allows you to inject the entire Fruitful South Africa ecosystem into **any Replit application** with just a few files and commands.

### Package Contents

✅ **Core Integration Script** (`fruitful-integration.js`)
- Universal JavaScript module that works in any Replit app
- Manages all 12 brand products across 3 categories
- Handles PayPal payments, Google Maps, Spotify, Gemini AI, Xero
- Built-in health checking and validation

✅ **Verification System** (`verify-integration.js`)
- Automated testing to ensure everything works
- Validates all API keys and services
- Checks brand catalog integrity
- Provides detailed diagnostics

✅ **Configuration File** (`fruitful-config.json`)
- Complete service configuration
- Payment tier definitions
- Brand category specifications
- Security settings

✅ **Documentation**
- `INTEGRATION_GUIDE.md` - Complete setup instructions
- `QUICK_START.md` - Fast copy-paste setup (5 minutes)
- `example-usage.md` - Code examples for React and Express
- `example-server-integration.ts` - Ready-to-use Express integration

---

## 🚀 Quick Integration (3 Steps)

### Step 1: Copy Files to New Replit App
```bash
# Copy these 4 files to your new Replit app:
- fruitful-integration.js
- verify-integration.js
- fruitful-config.json
- INTEGRATION_GUIDE.md
```

### Step 2: Install Dependencies
```bash
npm install @paypal/paypal-server-sdk @google/genai express
```

### Step 3: Set Up Secrets in Replit

**Option A: Account-Level Secrets (Recommended - Share across all apps)**
1. Go to Replit Account Settings → Secrets → Account Secrets
2. Add these secrets once:
```
PAYPAL_CLIENT_ID=your_paypal_client_id_here
PAYPAL_CLIENT_SECRET=your_paypal_client_secret_here
GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here
GEMINI_API_KEY=your_gemini_api_key_here
XERO_CLIENT_ID=your_xero_client_id_here
XERO_CLIENT_SECRET=your_xero_client_secret_here
```
3. In each app: Secrets → App Secrets → Link account secrets to app

**Option B: App-Level Secrets (Per app)**
1. In your Replit app: Secrets → App Secrets
2. Add the same secrets listed above

### Verify It Works
```bash
node verify-integration.js
```

Expected output:
```
✓ Integration initialized successfully
✓ All API keys are properly configured
✓ All 12 brands are present
✓ Health check passed
🎉 All tests passed!
```

---

## 💡 How to Use in Your Code

### Express.js Server

```javascript
import express from 'express';
import FruitfulIntegration from './fruitful-integration.js';

const app = express();
const fruitful = new FruitfulIntegration();

await fruitful.initialize();

// Add Fruitful endpoints
app.get('/api/health', fruitful.expressHealthMiddleware());
app.get('/api/brands', fruitful.expressBrandsMiddleware());

app.listen(5000);
```

### React Frontend

```jsx
import { useQuery } from '@tanstack/react-query';

function BrandCatalog() {
  const { data } = useQuery({
    queryKey: ['brands'],
    queryFn: async () => {
      const res = await fetch('/api/brands');
      return res.json();
    }
  });

  return (
    <div>
      {data?.brands.map(brand => (
        <div key={brand.name}>
          <h2>{brand.glyph} {brand.name}</h2>
          <p>{brand.description}</p>
        </div>
      ))}
    </div>
  );
}
```

### PayPal Payment

```javascript
// Get PayPal button ID
const buttonId = fruitful.getPayPalButton('starter'); // or 'pro', 'enterprise'

// Use in HTML form
<form action="https://www.paypal.com/cgi-bin/webscr" method="post">
  <input type="hidden" name="cmd" value="_s-xclick">
  <input type="hidden" name="hosted_button_id" value={buttonId}>
  <button type="submit">Buy Now</button>
</form>
```

---

## 📊 What's Included

### 12 Brand Products

**South African Brands (6)**
- 💳 LoopPay™ - Construction payout system
- 🌱 VeldGroei™ - Ancestral crop seeds
- 🏞️ BoerKraal™ - Land rights management
- 🛠️ PlaasFix™ - Off-grid farm tools
- 🌽 MielieFire™ - Nutrition brand
- 👵 OumaWys™ - Heritage cooking

**Logic & Automation (3)**
- 🧠 OmniLogic™ - AI decision logic
- 🕸️ MineNest™ - Decentralized data storage
- 🛰️ TraceNode™ - Asset tracking

**Sovereign Insurance (3)**
- 👑 CrownGuard™ - High-value asset insurance
- 📉 RiskRebate™ - Dynamic premium reduction
- 🛡️ ClanCover™ - Community risk pooling

### Payment Tiers

- **Starter**: Button ID `YOUR_STARTER_BUTTON_ID`
- **Pro**: Button ID `YOUR_PRO_BUTTON_ID`
- **Enterprise**: Button ID `YOUR_ENTERPRISE_BUTTON_ID`
- **Banimal**: Custom (configure your own)

### External Services

✅ PayPal SDK + Hosted Buttons
✅ Google Maps API
✅ Spotify API
✅ Google Gemini AI
✅ Xero Accounting (OAuth + Webhooks)
✅ ExchangeRate API

---

## 🔍 Testing & Verification

### Run Verification
```bash
node verify-integration.js
```

### Manual API Testing
```bash
# Health check
curl http://localhost:5000/api/fruitful/health

# Get all brands
curl http://localhost:5000/api/fruitful/brands

# Get brands by category
curl http://localhost:5000/api/fruitful/brands?category=sa_brands

# Get PayPal button
curl http://localhost:5000/api/fruitful/payment/starter
```

---

## 📁 File Reference

| File | Purpose | Required |
|------|---------|----------|
| `fruitful-integration.js` | Core integration script | ✅ Yes |
| `verify-integration.js` | Verification tool | Recommended |
| `fruitful-config.json` | Configuration data | Recommended |
| `INTEGRATION_GUIDE.md` | Full documentation | Reference |
| `QUICK_START.md` | Fast setup guide | Reference |
| `example-usage.md` | Code examples | Reference |
| `example-server-integration.ts` | Express.js example | Optional |

---

## 🎯 Success Criteria

After integration, you should have:

1. ✅ All 12 brands accessible via API
2. ✅ PayPal payment buttons working for all tiers
3. ✅ Health check endpoint responding
4. ✅ All external services configured
5. ✅ Verification script passes all tests

---

## 🔧 Troubleshooting

### "Integration initialization failed"
→ Run `node verify-integration.js` for diagnostics

### "Missing API key" errors
→ Check Replit Secrets are linked to your app

### Brands not loading
→ Verify `fruitful.getBrands()` returns 12 items

### PayPal buttons not working
→ Check button IDs match expected values

### Need help?
→ See `INTEGRATION_GUIDE.md` for detailed troubleshooting

---

## 📖 Documentation

- **Quick Start**: `QUICK_START.md` - 5-minute setup
- **Full Guide**: `INTEGRATION_GUIDE.md` - Complete instructions
- **Examples**: `example-usage.md` - Code samples
- **Config**: `fruitful-config.json` - All settings

---

## ✨ Benefits

- **Reusable**: Copy to unlimited Replit apps
- **Centralized**: Update secrets once in Account-level settings
- **Verified**: Built-in testing ensures it works
- **Complete**: All 12 brands + all payment tiers + all APIs
- **Documented**: Comprehensive guides and examples
- **Production-Ready**: Used in live Fruitful South Africa Dashboard

---

## 🚀 Next Steps

1. Copy the 4 core files to your new Replit app
2. Run `npm install` for dependencies
3. Set up Replit secrets (account or app level)
4. Run `node verify-integration.js`
5. Start using the API endpoints!

**That's it! Your Fruitful South Africa integration is ready to use.**
