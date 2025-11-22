/**
 * Fruitful South Africa - Universal Integration Script
 * 
 * This script can be injected into any Replit application to enable
 * the full Fruitful South Africa ecosystem integration.
 * 
 * Usage:
 *   const FruitfulIntegration = require('./fruitful-integration');
 *   const integration = new FruitfulIntegration();
 *   await integration.initialize();
 */

class FruitfulIntegration {
  constructor(config = {}) {
    this.config = {
      environment: process.env.NODE_ENV || 'development',
      enableLogging: config.enableLogging !== false,
      ...config
    };

    // Core API Keys (from environment variables with safe fallbacks)
    this.apiKeys = {
      paypal: {
        clientId: process.env.PAYPAL_CLIENT_ID || 'YOUR_PAYPAL_CLIENT_ID_HERE',
        clientSecret: process.env.PAYPAL_CLIENT_SECRET || 'YOUR_PAYPAL_CLIENT_SECRET_HERE',
        buttons: {
          starter: process.env.PAYPAL_STARTER_BUTTON || 'YOUR_STARTER_BUTTON_ID_HERE',
          pro: process.env.PAYPAL_PRO_BUTTON || 'YOUR_PRO_BUTTON_ID_HERE',
          enterprise: process.env.PAYPAL_ENTERPRISE_BUTTON || 'YOUR_ENTERPRISE_BUTTON_ID_HERE',
          banimal: process.env.PAYPAL_BANIMAL_BUTTON || 'YOUR_BANIMAL_BUTTON_ID_HERE'
        }
      },
      googleMaps: process.env.GOOGLE_MAPS_API_KEY || 'YOUR_GOOGLE_MAPS_API_KEY_HERE',
      spotify: process.env.SPOTIFY_TOKEN || 'YOUR_SPOTIFY_TOKEN_HERE',
      gemini: process.env.GEMINI_API_KEY || 'YOUR_GEMINI_API_KEY_HERE',
      xero: {
        clientId: process.env.XERO_CLIENT_ID || 'YOUR_XERO_CLIENT_ID_HERE',
        clientSecret: process.env.XERO_CLIENT_SECRET || 'YOUR_XERO_CLIENT_SECRET_HERE',
        redirectUri: process.env.XERO_REDIRECT_URI || 'YOUR_XERO_REDIRECT_URI_HERE',
        webhookKey: process.env.XERO_WEBHOOK_KEY || 'YOUR_XERO_WEBHOOK_KEY_HERE'
      },
      exchangeRate: process.env.EXCHANGE_RATE_API_KEY || 'YOUR_EXCHANGE_RATE_API_KEY_HERE'
    };

    // Brand Catalog (12 products across 3 categories)
    this.brands = {
      sa_brands: [
        {
          name: 'LoopPay™',
          glyph: '💳',
          description: 'Construction-grade payout loop for RSA-based contractor networks.',
          pricing: { master: 6500, monthly: 92, masterPartner: 5200, monthlyPartner: 75 },
          tagline: 'Real-time settlement for the build economy.'
        },
        {
          name: 'VeldGroei™',
          glyph: '🌱',
          description: 'Ancestral crop seed packs and soil tablets.',
          pricing: { master: 3200, monthly: 45, masterPartner: 2500, monthlyPartner: 35 },
          tagline: 'Securing local sovereignty over food genetics.'
        },
        {
          name: 'BoerKraal™',
          glyph: '🏞️',
          description: 'Family land rights management and digital mapping.',
          pricing: { master: 7800, monthly: 110, masterPartner: 6500, monthlyPartner: 90 },
          tagline: 'Digitally anchoring legacy farms.'
        },
        {
          name: 'PlaasFix™',
          glyph: '🛠️',
          description: 'Durable, off-grid rural tools and farm repair kits.',
          pricing: { master: 4100, monthly: 55, masterPartner: 3300, monthlyPartner: 45 },
          tagline: 'Resilience, built to last.'
        },
        {
          name: 'MielieFire™',
          glyph: '🌽',
          description: 'Meal-based nutrition brand focused on mielie.',
          pricing: { master: 2900, monthly: 38, masterPartner: 2300, monthlyPartner: 30 },
          tagline: 'Tradition, combined with survival.'
        },
        {
          name: 'OumaWys™',
          glyph: '👵',
          description: 'Heritage cooking and preservation line.',
          pricing: { master: 3500, monthly: 48, masterPartner: 2800, monthlyPartner: 40 },
          tagline: 'Heritage cooking for the modern clan.'
        }
      ],
      logic_brands: [
        {
          name: 'OmniLogic™',
          glyph: '🧠',
          description: 'Primary AI for systemic reasoning and decision logic.',
          pricing: { master: 15000, monthly: 250, royalty: 15 },
          tagline: 'The thinking core of the sovereign grid.'
        },
        {
          name: 'MineNest™',
          glyph: '🕸️',
          description: 'Decentralized data storage and application mesh for mining operations.',
          pricing: { master: 12000, monthly: 180, royalty: 12 },
          tagline: 'Host anything, anywhere, without the cloud.'
        },
        {
          name: 'TraceNode™',
          glyph: '🛰️',
          description: 'Atom-level tracking for assets, data, and signals.',
          pricing: { master: 10500, monthly: 150, royalty: 11 },
          tagline: 'If it moves, TraceNode sees it.'
        }
      ],
      insurance_brands: [
        {
          name: 'CrownGuard™',
          glyph: '👑',
          description: 'Sovereign insurance layer for high-value assets and scrolls.',
          pricing: { master: 25000, monthly: 450, royalty: 18 },
          tagline: 'Protecting what is truly yours.'
        },
        {
          name: 'RiskRebate™',
          glyph: '📉',
          description: 'Dynamic premium reduction system based on risk-lowering behavior.',
          pricing: { master: 18000, monthly: 220, royalty: 14 },
          tagline: 'Your premium decreases as your sovereignty increases.'
        },
        {
          name: 'ClanCover™',
          glyph: '🛡️',
          description: 'Community-based risk pooling for clans and vendor groups.',
          pricing: { master: 15000, monthly: 180, royalty: 12 },
          tagline: 'The clan protects its own.'
        }
      ]
    };

    this.initialized = false;
  }

  /**
   * Initialize the integration
   */
  async initialize() {
    if (this.initialized) {
      this.log('Integration already initialized');
      return true;
    }

    this.log('Initializing Fruitful South Africa Integration...');

    try {
      // Validate API keys
      this.validateApiKeys();

      // Initialize services
      await this.initializePayPal();
      await this.initializeGemini();
      
      this.initialized = true;
      this.log('✓ Integration initialized successfully');
      return true;
    } catch (error) {
      this.log(`✗ Integration initialization failed: ${error.message}`, 'error');
      throw error;
    }
  }

  /**
   * Validate that all required API keys are present
   */
  validateApiKeys() {
    const required = [
      { key: 'paypal.clientId', value: this.apiKeys.paypal.clientId },
      { key: 'googleMaps', value: this.apiKeys.googleMaps },
      { key: 'gemini', value: this.apiKeys.gemini },
      { key: 'xero.clientId', value: this.apiKeys.xero.clientId }
    ];

    // Check for missing or placeholder values
    const isPlaceholder = (value) => !value || value.includes('YOUR_') || value.includes('_HERE');
    const missing = required.filter(({ value }) => isPlaceholder(value));
    
    if (missing.length > 0) {
      this.log(`Warning: Missing or placeholder API keys: ${missing.map(m => m.key).join(', ')}`, 'warn');
    }

    this.log(`✓ API key validation complete (${required.length - missing.length}/${required.length} configured)`);
  }

  /**
   * Initialize PayPal SDK
   */
  async initializePayPal() {
    // Check if PayPal SDK is available
    try {
      await import('@paypal/paypal-server-sdk');
      this.log('✓ PayPal SDK loaded');
      return true;
    } catch (error) {
      this.log('⚠ PayPal SDK not installed. Install with: npm install @paypal/paypal-server-sdk', 'warn');
      return false;
    }
  }

  /**
   * Initialize Gemini AI
   */
  async initializeGemini() {
    try {
      const { GoogleGenAI } = await import('@google/genai');
      this.geminiClient = new GoogleGenAI({ apiKey: this.apiKeys.gemini });
      this.log('✓ Gemini AI initialized');
      return true;
    } catch (error) {
      this.log('⚠ Gemini AI SDK not installed. Install with: npm install @google/genai', 'warn');
      return false;
    }
  }

  /**
   * Get all brands or filter by category
   */
  getBrands(category = null) {
    if (!category) {
      return [
        ...this.brands.sa_brands,
        ...this.brands.logic_brands,
        ...this.brands.insurance_brands
      ];
    }
    return this.brands[category] || [];
  }

  /**
   * Get PayPal button ID for a specific package tier
   */
  getPayPalButton(tier = 'starter') {
    return this.apiKeys.paypal.buttons[tier] || null;
  }

  /**
   * Get API key for a specific service
   */
  getApiKey(service) {
    const keyMap = {
      'paypal': this.apiKeys.paypal.clientId,
      'google_maps': this.apiKeys.googleMaps,
      'spotify': this.apiKeys.spotify,
      'gemini': this.apiKeys.gemini,
      'xero': this.apiKeys.xero.clientId,
      'exchange_rate': this.apiKeys.exchangeRate
    };
    return keyMap[service] || null;
  }

  /**
   * Health check - verify integration is working
   */
  async healthCheck() {
    const status = {
      initialized: this.initialized,
      timestamp: new Date().toISOString(),
      services: {
        paypal: !!this.apiKeys.paypal.clientId,
        googleMaps: !!this.apiKeys.googleMaps,
        spotify: !!this.apiKeys.spotify,
        gemini: !!this.apiKeys.gemini,
        xero: !!this.apiKeys.xero.clientId,
        exchangeRate: !!this.apiKeys.exchangeRate
      },
      brandCount: this.getBrands().length,
      environment: this.config.environment
    };

    return status;
  }

  /**
   * Express.js middleware for health endpoint
   */
  expressHealthMiddleware() {
    return async (req, res) => {
      const health = await this.healthCheck();
      res.json(health);
    };
  }

  /**
   * Express.js middleware for brands endpoint
   */
  expressBrandsMiddleware() {
    return (req, res) => {
      const category = req.query.category || null;
      const brands = this.getBrands(category);
      res.json({ brands, total: brands.length });
    };
  }

  /**
   * Logging utility
   */
  log(message, level = 'info') {
    if (!this.config.enableLogging && level !== 'error') return;
    
    const prefix = {
      info: '[Fruitful]',
      warn: '[Fruitful WARNING]',
      error: '[Fruitful ERROR]'
    }[level] || '[Fruitful]';

    console.log(`${prefix} ${message}`);
  }
}

// Export for ES modules
export default FruitfulIntegration;

// Export for browser
if (typeof window !== 'undefined') {
  window.FruitfulIntegration = FruitfulIntegration;
}
