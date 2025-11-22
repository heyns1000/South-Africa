# Fruitful South Africa - Quick Start

## Copy-Paste Setup for New Replit Apps

### Step 1: Install Dependencies
```bash
npm install @paypal/paypal-server-sdk @google/genai firebase express
```

### Step 2: Add Integration Script
1. Copy `fruitful-integration.js` to your project root
2. Copy `verify-integration.js` to your project root
3. Copy `fruitful-config.json` to your project root

### Step 3: Set Up Replit Account Secrets

Go to Replit Account Settings → Secrets → Account Secrets and add:

```
PAYPAL_CLIENT_ID=your_paypal_client_id_here
PAYPAL_CLIENT_SECRET=your_paypal_client_secret_here
GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here
GEMINI_API_KEY=your_gemini_api_key_here
XERO_CLIENT_ID=your_xero_client_id_here
XERO_CLIENT_SECRET=your_xero_client_secret_here
```

### Step 4: Link Secrets to Your App

In your Replit app: Secrets → App Secrets → Select all account secrets → "Link to this App"

### Step 5: Use in Your Code

#### Express.js Example (ES Modules):
```javascript
import express from 'express';
import FruitfulIntegration from './fruitful-integration.js';

const app = express();
const fruitful = new FruitfulIntegration();

// Initialize
await fruitful.initialize();
console.log('Fruitful integration ready!');

// Add endpoints
app.get('/api/fruitful/health', fruitful.expressHealthMiddleware());
app.get('/api/fruitful/brands', fruitful.expressBrandsMiddleware());

// Get specific data
app.get('/api/fruitful/payment/:tier', (req, res) => {
  const buttonId = fruitful.getPayPalButton(req.params.tier);
  res.json({ tier: req.params.tier, buttonId });
});

app.listen(5000, () => {
  console.log('Server running on port 5000');
});
```

#### React Frontend Example:
```javascript
// Fetch all brands
fetch('/api/brands')
  .then(res => res.json())
  .then(data => console.log(data.brands));

// Fetch brands by category
fetch('/api/brands?category=sa_brands')
  .then(res => res.json())
  .then(data => console.log(data.brands));

// Health check
fetch('/api/health')
  .then(res => res.json())
  .then(status => console.log('Integration status:', status));
```

### Step 6: Verify Setup
```bash
node verify-integration.js
```

You should see:
```
✓ Integration initialized successfully
✓ All API keys are properly configured
✓ All 12 brands are present
✓ Health check passed
🎉 All tests passed!
```

## PayPal Payment Integration

### Get Button ID for Package:
```javascript
const starterButton = fruitful.getPayPalButton('starter');   // YOUR_STARTER_BUTTON_ID
const proButton = fruitful.getPayPalButton('pro');           // YOUR_PRO_BUTTON_ID
const enterpriseButton = fruitful.getPayPalButton('enterprise'); // YOUR_ENTERPRISE_BUTTON_ID
```

### HTML PayPal Button:
```html
<form action="https://www.paypal.com/cgi-bin/webscr" method="post" target="_top">
  <input type="hidden" name="cmd" value="_s-xclick">
  <input type="hidden" name="hosted_button_id" value="YOUR_STARTER_BUTTON_ID">
  <input type="submit" value="Buy Starter Package">
</form>
```

## Troubleshooting

### Error: "Missing API key"
→ Make sure secrets are linked in "App Secrets" tab

### Error: "Integration initialization failed"
→ Run `node verify-integration.js` to diagnose

### Brands not loading
→ Check `fruitful.getBrands()` returns 12 items

### PayPal not working
→ Verify PAYPAL_CLIENT_ID is set correctly

## Support

Full documentation: See `INTEGRATION_GUIDE.md`
Configuration: See `fruitful-config.json`
