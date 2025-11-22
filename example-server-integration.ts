/**
 * Example: How to integrate Fruitful into your Express.js server
 * 
 * This file demonstrates how to add Fruitful endpoints to an existing Express app.
 */

import FruitfulIntegration from './fruitful-integration.js';
import type { Express } from 'express';

export async function addFruitfulRoutes(app: Express) {
  // Initialize the Fruitful integration
  const fruitful = new FruitfulIntegration({ enableLogging: true });
  await fruitful.initialize();

  // Health check endpoint
  app.get('/api/fruitful/health', fruitful.expressHealthMiddleware());

  // Get all brands or filter by category
  app.get('/api/fruitful/brands', fruitful.expressBrandsMiddleware());

  // Get PayPal button ID for specific tier
  app.get('/api/fruitful/payment/:tier', (req, res) => {
    const tier = req.params.tier;
    const buttonId = fruitful.getPayPalButton(tier);
    
    if (!buttonId) {
      return res.status(404).json({ error: `Payment tier "${tier}" not found` });
    }

    res.json({ 
      tier, 
      buttonId,
      paypalUrl: `https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=${buttonId}`
    });
  });

  // Get all available payment tiers
  app.get('/api/fruitful/payment-tiers', (req, res) => {
    res.json({
      starter: fruitful.getPayPalButton('starter'),
      pro: fruitful.getPayPalButton('pro'),
      enterprise: fruitful.getPayPalButton('enterprise'),
      banimal: fruitful.getPayPalButton('banimal')
    });
  });

  // Get specific API key (for server-side use only)
  app.get('/api/fruitful/config/:service', (req, res) => {
    const service = req.params.service;
    const apiKey = fruitful.getApiKey(service);
    
    if (!apiKey) {
      return res.status(404).json({ error: `Service "${service}" not found` });
    }

    // Never send full API keys to client - just confirm it exists
    res.json({ 
      service, 
      configured: !!apiKey,
      preview: apiKey.substring(0, 10) + '...'
    });
  });

  console.log('✓ Fruitful South Africa routes added successfully');
  return fruitful;
}
