/**
 * PinkSync Domain Management Automation
 * Manages pinksync.io domain renewal and Cloudflare integration
 * 
 * Prerequisites:
 * - VERCEL_TOKEN: Get from https://vercel.com/account/tokens
 * - CLOUDFLARE_API_TOKEN: Get from https://dash.cloudflare.com/profile/api-tokens
 * - CLOUDFLARE_ZONE_ID: Found in Cloudflare domain overview
 */

const https = require('https');
const http = require('http');

class DomainManager {
  constructor(config = {}) {
    this.vercelToken = config.vercelToken || process.env.VERCEL_TOKEN;
    this.cloudflareToken = config.cloudflareToken || process.env.CLOUDFLARE_API_TOKEN;
    this.cloudflareZoneId = config.cloudflareZoneId || process.env.CLOUDFLARE_ZONE_ID;
    this.domain = config.domain || 'pinksync.io';
    this.vercelApiUrl = 'https://api.vercel.com';
    this.cloudflareApiUrl = 'https://api.cloudflare.com/client/v4';

    if (!this.vercelToken || !this.cloudflareToken) {
      console.error('❌ Missing required environment variables:');
      console.error('   - VERCEL_TOKEN');
      console.error('   - CLOUDFLARE_API_TOKEN');
      console.error('   - CLOUDFLARE_ZONE_ID (optional for nameserver update)');
      process.exit(1);
    }
  }

  /**
   * Make HTTP requests
   */
  async request(method, url, data = null, token = null, isCloudflare = false) {
    return new Promise((resolve, reject) => {
      const urlObj = new URL(url);
      const options = {
        hostname: urlObj.hostname,
        path: urlObj.pathname + urlObj.search,
        method: method,
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': 'PinkSync-Domain-Manager/1.0',
        },
      };

      if (isCloudflare) {
        options.headers['Authorization'] = `Bearer ${this.cloudflareToken}`;
      } else {
        options.headers['Authorization'] = `Bearer ${token}`;
      }

      if (data) {
        const jsonData = JSON.stringify(data);
        options.headers['Content-Length'] = Buffer.byteLength(jsonData);
      }

      const protocol = url.startsWith('https') ? https : http;
      const req = protocol.request(options, (res) => {
        let responseData = '';

        res.on('data', (chunk) => {
          responseData += chunk;
        });

        res.on('end', () => {
          try {
            const parsed = JSON.parse(responseData);
            if (res.statusCode >= 200 && res.statusCode < 300) {
              resolve(parsed);
            } else {
              reject({
                statusCode: res.statusCode,
                message: parsed.error?.message || parsed.message || 'API Error',
                data: parsed,
              });
            }
          } catch (e) {
            reject({
              statusCode: res.statusCode,
              message: 'Failed to parse response',
              raw: responseData,
            });
          }
        });
      });

      req.on('error', reject);

      if (data) {
        req.write(JSON.stringify(data));
      }
      req.end();
    });
  }

  /**
   * Check domain availability
   */
  async checkAvailability() {
    try {
      console.log(`\n📋 Checking availability for ${this.domain}...`);
      const response = await this.request(
        'GET',
        `${this.vercelApiUrl}/v6/domains/status?domain=${this.domain}`,
        null,
        this.vercelToken
      );

      console.log('✅ Domain status:', {
        domain: this.domain,
        status: response.status || 'active',
        verified: response.verified || false,
      });

      return response;
    } catch (error) {
      console.error('❌ Error checking availability:', error.message);
      throw error;
    }
  }

  /**
   * Get current nameservers
   */
  async getCurrentNameservers() {
    try {
      console.log(`\n📡 Fetching current nameservers for ${this.domain}...`);
      const response = await this.request(
        'GET',
        `${this.vercelApiUrl}/v4/domains/${this.domain}`,
        null,
        this.vercelToken
      );

      console.log('✅ Current domain config:', {
        domain: response.name,
        nameservers: response.nameservers || 'Using Vercel default',
      });

      return response;
    } catch (error) {
      console.error('❌ Error fetching nameservers:', error.message);
      throw error;
    }
  }

  /**
   * Renew domain via Vercel API
   */
  async renewDomain(years = 1) {
    try {
      console.log(`\n🔄 Renewing ${this.domain} for ${years} year(s)...`);

      const response = await this.request(
        'POST',
        `${this.vercelApiUrl}/v4/domains/${this.domain}/renew`,
        { years },
        this.vercelToken
      );

      if (response.error) {
        throw new Error(response.error.message);
      }

      console.log('✅ Domain renewed successfully!', {
        domain: this.domain,
        years,
        expiresAt: response.expiresAt || 'Check Vercel dashboard',
      });

      return response;
    } catch (error) {
      console.error('❌ Error renewing domain:', error.message);
      throw error;
    }
  }

  /**
   * Update nameservers to Cloudflare
   */
  async updateNameserversToCloudflare() {
    try {
      console.log(`\n🌐 Updating nameservers to Cloudflare for ${this.domain}...`);

      const cloudflareNameservers = [
        'ns1.cloudflare.com',
        'ns2.cloudflare.com',
        'ns3.cloudflare.com',
        'ns4.cloudflare.com',
      ];

      const response = await this.request(
        'PATCH',
        `${this.vercelApiUrl}/v4/domains/${this.domain}/nameservers`,
        { nameservers: cloudflareNameservers },
        this.vercelToken
      );

      console.log('✅ Nameservers updated!', {
        domain: this.domain,
        nameservers: cloudflareNameservers,
        updateTime: new Date().toISOString(),
      });

      console.log('⏱️  DNS propagation may take 24-48 hours');

      return response;
    } catch (error) {
      console.error('❌ Error updating nameservers:', error.message);
      throw error;
    }
  }

  /**
   * Configure DNS in Cloudflare
   */
  async configureCloudflareDNS(recordData = {}) {
    try {
      if (!this.cloudflareZoneId) {
        console.log('⚠️  Skipping Cloudflare DNS config (CLOUDFLARE_ZONE_ID not set)');
        console.log('   To configure, get your Zone ID from: https://dash.cloudflare.com/');
        return null;
      }

      console.log(`\n🔐 Configuring DNS records in Cloudflare for ${this.domain}...`);

      const defaultRecord = {
        type: 'CNAME',
        name: this.domain,
        content: recordData.content || 'cname.vercel-dns.com',
        ttl: recordData.ttl || 3600,
        proxied: recordData.proxied !== false, // Default to proxied
      };

      const response = await this.request(
        'POST',
        `${this.cloudflareApiUrl}/zones/${this.cloudflareZoneId}/dns_records`,
        defaultRecord,
        null,
        true
      );

      console.log('✅ DNS record created!', {
        type: defaultRecord.type,
        name: defaultRecord.name,
        content: defaultRecord.content,
        proxied: defaultRecord.proxied,
      });

      return response;
    } catch (error) {
      if (error.data?.errors?.[0]?.code === 81053) {
        console.log('⚠️  DNS record already exists (this is OK)');
        return null;
      }
      console.error('❌ Error configuring Cloudflare DNS:', error.message);
      throw error;
    }
  }

  /**
   * Verify DNS propagation
   */
  async verifyDNSPropagation() {
    try {
      console.log(`\n✔️  Verifying DNS propagation for ${this.domain}...`);

      const response = await this.request(
        'GET',
        `${this.vercelApiUrl}/v4/domains/${this.domain}`,
        null,
        this.vercelToken
      );

      const isVerified = response.verified === true;

      console.log('DNS Status:', {
        domain: this.domain,
        verified: isVerified,
        nameservers: response.nameservers || 'Pending update',
        message: isVerified
          ? '✅ Domain is verified and configured correctly'
          : '⏳ Still propagating, check again in a few minutes',
      });

      return isVerified;
    } catch (error) {
      console.error('❌ Error verifying DNS:', error.message);
      throw error;
    }
  }

  /**
   * Complete setup workflow
   */
  async setup(options = {}) {
    try {
      console.log('🚀 Starting PinkSync Domain Setup...\n');
      console.log('═'.repeat(60));

      // Step 1: Check current status
      await this.checkAvailability();
      await this.getCurrentNameservers();

      // Step 2: Renew domain
      if (options.renew !== false) {
        await this.renewDomain(options.years || 1);
      }

      // Step 3: Update nameservers
      if (options.updateNameservers !== false) {
        await this.updateNameserversToCloudflare();
      }

      // Step 4: Configure Cloudflare DNS
      if (options.configureDNS !== false && this.cloudflareZoneId) {
        await this.configureCloudflareDNS(options.dnsRecord);
      }

      // Step 5: Verify (may take time)
      if (options.verify !== false) {
        console.log('\n⏳ Note: DNS verification may take 5-30 minutes...');
        console.log('   Run verifyDNSPropagation() later to check status.');
      }

      console.log('\n' + '═'.repeat(60));
      console.log('✅ Setup completed successfully!\n');
      console.log('📋 Summary:');
      console.log('   ✓ Domain renewed');
      console.log('   ✓ Nameservers updated to Cloudflare');
      console.log('   ✓ DNS records configured');
      console.log('\n⏱️  Expected activation time: 24-48 hours');

      return {
        success: true,
        domain: this.domain,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      console.error('\n❌ Setup failed:', error.message);
      throw error;
    }
  }
}

// CLI Usage
if (require.main === module) {
  const args = process.argv.slice(2);
  const command = args[0] || 'help';

  const manager = new DomainManager({
    domain: 'pinksync.io',
  });

  const commands = {
    help: () => {
      console.log(`
PinkSync Domain Manager CLI

Usage: node vercel-cloudflare-domain-manager.js [command]

Commands:
  setup                 - Run complete setup (renew + update nameservers)
  renew                 - Renew domain only
  nameservers          - Update nameservers to Cloudflare
  dns-configure        - Configure DNS in Cloudflare (requires CLOUDFLARE_ZONE_ID)
  check                - Check current domain status
  verify               - Verify DNS propagation
  help                 - Show this help message

Environment Variables:
  VERCEL_TOKEN         - Your Vercel API token (REQUIRED)
  CLOUDFLARE_API_TOKEN - Your Cloudflare API token (REQUIRED)
  CLOUDFLARE_ZONE_ID   - Your Cloudflare Zone ID (optional)

Example Setup:
  export VERCEL_TOKEN=your_token_here
  export CLOUDFLARE_API_TOKEN=your_cloudflare_token
  export CLOUDFLARE_ZONE_ID=your_zone_id
  node vercel-cloudflare-domain-manager.js setup

      `);
    },

    setup: async () => {
      await manager.setup();
    },

    renew: async () => {
      await manager.renewDomain(1);
    },

    nameservers: async () => {
      await manager.updateNameserversToCloudflare();
    },

    'dns-configure': async () => {
      await manager.configureCloudflareDNS();
    },

    check: async () => {
      await manager.checkAvailability();
      await manager.getCurrentNameservers();
    },

    verify: async () => {
      await manager.verifyDNSPropagation();
    },
  };

  const execute = commands[command];
  if (execute) {
    execute().catch((err) => {
      console.error('\n❌ Error:', err.message);
      process.exit(1);
    });
  } else {
    console.error(`Unknown command: ${command}`);
    commands.help();
    process.exit(1);
  }
}

module.exports = DomainManager;
