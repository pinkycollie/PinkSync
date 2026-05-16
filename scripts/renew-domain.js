#!/usr/bin/env node

/**
 * PinkSync Domain Renewal Script
 * Automatically renew pinksync.io and configure Cloudflare
 * 
 * Usage: node scripts/renew-domain.js [options]
 * 
 * Options:
 *   --skip-renew         Skip domain renewal
 *   --skip-nameservers   Skip nameserver update
 *   --skip-dns-config    Skip DNS configuration
 *   --verify-only        Only verify DNS propagation
 */

require('dotenv').config();
const DomainManager = require('../vercel-cloudflare-domain-manager');

const parseArgs = (args) => {
  const opts = {
    renew: !args.includes('--skip-renew'),
    updateNameservers: !args.includes('--skip-nameservers'),
    configureDNS: !args.includes('--skip-dns-config'),
    verifyOnly: args.includes('--verify-only'),
  };
  return opts;
};

async function main() {
  const args = process.argv.slice(2);
  const options = parseArgs(args);

  try {
    const manager = new DomainManager({
      domain: process.env.DOMAIN || 'pinksync.io',
      vercelToken: process.env.VERCEL_TOKEN,
      cloudflareToken: process.env.CLOUDFLARE_API_TOKEN,
      cloudflareZoneId: process.env.CLOUDFLARE_ZONE_ID,
    });

    if (options.verifyOnly) {
      await manager.verifyDNSPropagation();
    } else {
      await manager.setup(options);
    }

    console.log('\n✅ Domain management completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Domain management failed:', error.message);
    process.exit(1);
  }
}

main();
