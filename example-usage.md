# Fruitful Integration - Usage Examples

## Server-Side Usage

### Adding to Your Express Server

```typescript
import express from 'express';
import { addFruitfulRoutes } from './example-server-integration';

const app = express();

// Add Fruitful routes
await addFruitfulRoutes(app);

app.listen(5000, () => {
  console.log('Server with Fruitful integration running on port 5000');
});
```

### Available Endpoints After Integration

Once integrated, your app will have these endpoints:

- `GET /api/fruitful/health` - Health check and status
- `GET /api/fruitful/brands` - Get all 12 brands
- `GET /api/fruitful/brands?category=sa_brands` - Filter by category
- `GET /api/fruitful/payment/:tier` - Get PayPal button for tier (starter/pro/enterprise)
- `GET /api/fruitful/payment-tiers` - Get all payment button IDs
- `GET /api/fruitful/config/:service` - Check if service is configured

## Frontend Usage

### React Component Example

```tsx
import { useState, useEffect } from 'react';

function BrandCatalog() {
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/fruitful/brands')
      .then(res => res.json())
      .then(data => {
        setBrands(data.brands);
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Loading brands...</div>;

  return (
    <div>
      <h1>Fruitful South Africa - Brand Catalog</h1>
      {brands.map(brand => (
        <div key={brand.name}>
          <h2>{brand.glyph} {brand.name}</h2>
          <p>{brand.description}</p>
          <p>{brand.tagline}</p>
        </div>
      ))}
    </div>
  );
}
```

### PayPal Payment Button Example

```tsx
function PaymentButton({ tier = 'starter' }) {
  const [buttonId, setButtonId] = useState('');

  useEffect(() => {
    fetch(`/api/fruitful/payment/${tier}`)
      .then(res => res.json())
      .then(data => setButtonId(data.buttonId));
  }, [tier]);

  if (!buttonId) return null;

  return (
    <form action="https://www.paypal.com/cgi-bin/webscr" method="post" target="_top">
      <input type="hidden" name="cmd" value="_s-xclick" />
      <input type="hidden" name="hosted_button_id" value={buttonId} />
      <button type="submit">
        Purchase {tier.charAt(0).toUpperCase() + tier.slice(1)} Package
      </button>
    </form>
  );
}

// Usage:
<PaymentButton tier="starter" />
<PaymentButton tier="pro" />
<PaymentButton tier="enterprise" />
```

### TanStack Query Example

```typescript
import { useQuery } from '@tanstack/react-query';

function useBrands(category?: string) {
  return useQuery({
    queryKey: category ? ['fruitful-brands', category] : ['fruitful-brands'],
    queryFn: async () => {
      const url = category 
        ? `/api/fruitful/brands?category=${category}`
        : '/api/fruitful/brands';
      const res = await fetch(url);
      return res.json();
    }
  });
}

// Usage in component:
function SABrands() {
  const { data, isLoading } = useBrands('sa_brands');
  
  if (isLoading) return <div>Loading...</div>;
  
  return (
    <div>
      <h2>South African Brands ({data.total})</h2>
      {data.brands.map(brand => (
        <BrandCard key={brand.name} brand={brand} />
      ))}
    </div>
  );
}
```

## Testing the Integration

### Manual Testing

```bash
# Health check
curl http://localhost:5000/api/fruitful/health

# Get all brands
curl http://localhost:5000/api/fruitful/brands

# Get South African brands only
curl http://localhost:5000/api/fruitful/brands?category=sa_brands

# Get PayPal button for starter package
curl http://localhost:5000/api/fruitful/payment/starter

# Get all payment tiers
curl http://localhost:5000/api/fruitful/payment-tiers
```

### Automated Verification

```bash
# Run the verification script
node verify-integration.js

# Expected output:
# ✓ Integration initialized successfully
# ✓ All API keys are properly configured
# ✓ All PayPal payment buttons configured
# ✓ All 12 brands are present and categorized correctly
# ✓ Health check passed
# 🎉 All tests passed!
```

## Environment Variables

The integration automatically uses these environment variables if set:

```env
# PayPal
PAYPAL_CLIENT_ID=your_client_id_here
PAYPAL_CLIENT_SECRET=your_secret_here

# Google Services
GOOGLE_MAPS_API_KEY=your_key_here
GEMINI_API_KEY=your_key_here

# Spotify
SPOTIFY_TOKEN=your_token_here

# Xero Accounting
XERO_CLIENT_ID=your_client_id_here
XERO_CLIENT_SECRET=your_secret_here
XERO_REDIRECT_URI=your_redirect_uri_here
XERO_WEBHOOK_KEY=your_webhook_key_here

# Exchange Rate API
EXCHANGE_RATE_API_KEY=your_key_here
```

**Best Practice**: Use Replit's Account-level Secrets to set these once and share across all your apps.

## Brand Categories

### South African Brands (6 products)
- LoopPay™ - Construction payout system
- VeldGroei™ - Crop seeds and soil
- BoerKraal™ - Land rights management
- PlaasFix™ - Farm tools and repair kits
- MielieFire™ - Nutrition brand
- OumaWys™ - Heritage cooking

### Logic & Automation (3 products)
- OmniLogic™ - AI decision logic
- MineNest™ - Decentralized data storage
- TraceNode™ - Asset tracking

### Sovereign Insurance (3 products)
- CrownGuard™ - High-value asset insurance
- RiskRebate™ - Dynamic premium reduction
- ClanCover™ - Community risk pooling

## Payment Tiers

- **Starter**: R92/month - Basic access
- **Pro**: R180/month - Full logic & automation access
- **Enterprise**: R450/month - Complete ecosystem with insurance

## Support

- Run verification: `node verify-integration.js`
- Check health: `GET /api/fruitful/health`
- Full docs: `INTEGRATION_GUIDE.md`
