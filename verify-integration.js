#!/usr/bin/env node
/**
 * Fruitful South Africa - Integration Verification Script
 * 
 * Run this script to verify that your integration is properly configured.
 * 
 * Usage: node verify-integration.js
 */

import FruitfulIntegration from './fruitful-integration.js';

// ANSI color codes for terminal output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function header(text) {
  log('\n' + '='.repeat(60), 'cyan');
  log(text, 'cyan');
  log('='.repeat(60), 'cyan');
}

async function runVerification() {
  header('Fruitful South Africa Integration Verification');
  
  let passedTests = 0;
  let totalTests = 0;

  // Test 1: Integration Initialization
  totalTests++;
  log('\n[Test 1] Initializing integration...', 'blue');
  try {
    const integration = new FruitfulIntegration({ enableLogging: true });
    await integration.initialize();
    log('✓ Integration initialized successfully', 'green');
    passedTests++;

    // Test 2: API Keys Validation
    totalTests++;
    log('\n[Test 2] Validating API keys...', 'blue');
    const requiredKeys = [
      { name: 'PayPal Client ID', value: integration.apiKeys.paypal.clientId },
      { name: 'Google Maps', value: integration.apiKeys.googleMaps },
      { name: 'Spotify', value: integration.apiKeys.spotify },
      { name: 'Gemini AI', value: integration.apiKeys.gemini },
      { name: 'Xero Client ID', value: integration.apiKeys.xero.clientId },
      { name: 'ExchangeRate API', value: integration.apiKeys.exchangeRate }
    ];

    let allKeysValid = true;
    for (const key of requiredKeys) {
      if (!key.value || key.value.includes('YOUR_') || key.value === 'demo-secret-key') {
        log(`  ⚠ ${key.name}: Not configured or using placeholder`, 'yellow');
        allKeysValid = false;
      } else {
        log(`  ✓ ${key.name}: Configured`, 'green');
      }
    }

    if (allKeysValid) {
      log('✓ All API keys are properly configured', 'green');
      passedTests++;
    } else {
      log('⚠ Some API keys are missing or using placeholders', 'yellow');
    }

    // Test 3: PayPal Button IDs
    totalTests++;
    log('\n[Test 3] Checking PayPal payment buttons...', 'blue');
    const buttons = integration.apiKeys.paypal.buttons;
    const buttonTests = [
      { name: 'Starter', id: buttons.starter, expected: null },
      { name: 'Pro', id: buttons.pro, expected: null },
      { name: 'Enterprise', id: buttons.enterprise, expected: null },
      { name: 'Banimal', id: buttons.banimal, expected: null }
    ];

    let allButtonsValid = true;
    for (const btn of buttonTests) {
      if (btn.expected && btn.id === btn.expected) {
        log(`  ✓ ${btn.name} Package: ${btn.id}`, 'green');
      } else if (btn.id && !btn.id.includes('YOUR_')) {
        log(`  ✓ ${btn.name} Package: ${btn.id}`, 'green');
      } else {
        log(`  ⚠ ${btn.name} Package: Not configured`, 'yellow');
        allButtonsValid = false;
      }
    }

    if (allButtonsValid) {
      passedTests++;
    }

    // Test 4: Brand Catalog
    totalTests++;
    log('\n[Test 4] Verifying brand catalog...', 'blue');
    const allBrands = integration.getBrands();
    const saBrands = integration.getBrands('sa_brands');
    const logicBrands = integration.getBrands('logic_brands');
    const insuranceBrands = integration.getBrands('insurance_brands');

    log(`  Total brands: ${allBrands.length}`, 'cyan');
    log(`  South African Brands: ${saBrands.length}`, 'cyan');
    log(`  Logic & Automation: ${logicBrands.length}`, 'cyan');
    log(`  Sovereign Insurance: ${insuranceBrands.length}`, 'cyan');

    if (allBrands.length === 12 && saBrands.length === 6 && logicBrands.length === 3 && insuranceBrands.length === 3) {
      log('✓ All 12 brands are present and categorized correctly', 'green');
      passedTests++;
    } else {
      log('✗ Brand catalog is incomplete or misconfigured', 'red');
    }

    // Test 5: Health Check
    totalTests++;
    log('\n[Test 5] Running health check...', 'blue');
    const health = await integration.healthCheck();
    
    log(`  Environment: ${health.environment}`, 'cyan');
    log(`  Initialized: ${health.initialized}`, 'cyan');
    log(`  Timestamp: ${health.timestamp}`, 'cyan');
    
    const serviceStatus = Object.entries(health.services).map(([name, status]) => {
      const icon = status ? '✓' : '✗';
      const color = status ? 'green' : 'red';
      log(`  ${icon} ${name}: ${status ? 'Active' : 'Inactive'}`, color);
      return status;
    });

    if (serviceStatus.every(s => s)) {
      log('✓ Health check passed', 'green');
      passedTests++;
    } else {
      log('⚠ Some services are not active', 'yellow');
    }

    // Test 6: Environment Variables
    totalTests++;
    log('\n[Test 6] Checking environment variables...', 'blue');
    const envVars = [
      'PAYPAL_CLIENT_ID',
      'GOOGLE_MAPS_API_KEY',
      'GEMINI_API_KEY',
      'XERO_CLIENT_ID'
    ];

    let envVarsSet = 0;
    for (const varName of envVars) {
      if (process.env[varName]) {
        log(`  ✓ ${varName} is set`, 'green');
        envVarsSet++;
      } else {
        log(`  ⚠ ${varName} not set (using fallback)`, 'yellow');
      }
    }

    if (envVarsSet >= 2) {
      passedTests++;
    }

    // Final Summary
    header('Verification Summary');
    const percentage = Math.round((passedTests / totalTests) * 100);
    
    log(`\nTests Passed: ${passedTests}/${totalTests} (${percentage}%)`, 'cyan');
    
    if (passedTests === totalTests) {
      log('\n🎉 All tests passed! Your integration is fully configured.', 'green');
      process.exit(0);
    } else if (passedTests >= totalTests * 0.7) {
      log('\n⚠ Integration is functional but some optional features need configuration.', 'yellow');
      process.exit(0);
    } else {
      log('\n⚠ Integration needs attention. Please review the warnings above.', 'yellow');
      process.exit(1);
    }

  } catch (error) {
    log(`\n✗ Integration verification failed: ${error.message}`, 'red');
    console.error(error);
    process.exit(1);
  }
}

// Run verification
runVerification();
