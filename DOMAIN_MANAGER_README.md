# PinkSync Domain Manager

Automated domain renewal and Cloudflare integration for **pinksync.io** using Vercel's Registrar API.

## 🎯 Features

- ✅ Automated domain renewal via Vercel API
- ✅ Automatic nameserver update to Cloudflare
- ✅ DNS record configuration in Cloudflare
- ✅ DNS propagation verification
- ✅ CLI & Programmatic API
- ✅ Error handling and retry logic
- ✅ Detailed logging

## 📋 Prerequisites

1. **Vercel Token**
   - Go to: https://vercel.com/account/tokens
   - Create a token with domain permissions
   - Copy your token

2. **Cloudflare Account**
   - Create account: https://dash.cloudflare.com
   - Add `pinksync.io` domain
   - Get API Token: https://dash.cloudflare.com/profile/api-tokens
   - Create token with `Zone.DNS:Edit` permissions
   - Copy Zone ID from domain overview

3. **Node.js**
   ```bash
   # Check if installed
   node --version  # Requires v14+
   ```

## 🚀 Quick Setup

### 1. Clone & Install

```bash
git clone <repo-url>
cd pinksync
npm install
```

### 2. Configure Environment

```bash
# Copy example to .env
cp .env.example .env

# Edit .env with your tokens
nano .env  # or your preferred editor
```

Add your credentials:
```env
VERCEL_TOKEN=your_vercel_token_here
CLOUDFLARE_API_TOKEN=your_cloudflare_token_here
CLOUDFLARE_ZONE_ID=your_zone_id_here
DOMAIN=pinksync.io
```

### 3. Run Setup

```bash
# One-command setup (renew + update nameservers + configure DNS)
npm run setup

# Or run individual steps
npm run renew          # Renew domain only
npm run verify        # Check DNS propagation
npm run check         # Check current status
```

## 📖 Usage

### CLI Commands

```bash
# Show help
node vercel-cloudflare-domain-manager.js help

# Complete setup
node vercel-cloudflare-domain-manager.js setup

# Check domain status
node vercel-cloudflare-domain-manager.js check

# Renew domain
node vercel-cloudflare-domain-manager.js renew

# Update nameservers
node vercel-cloudflare-domain-manager.js nameservers

# Configure Cloudflare DNS
node vercel-cloudflare-domain-manager.js dns-configure

# Verify DNS
node vercel-cloudflare-domain-manager.js verify
```

### Programmatic Usage

```javascript
const DomainManager = require('./vercel-cloudflare-domain-manager');

const manager = new DomainManager({
  domain: 'pinksync.io',
  vercelToken: 'your_token',
  cloudflareToken: 'your_token',
  cloudflareZoneId: 'your_zone_id',
});

// Complete setup
await manager.setup({
  renew: true,
  updateNameservers: true,
  configureDNS: true,
  years: 1,
});

// Or individual operations
await manager.checkAvailability();
await manager.getCurrentNameservers();
await manager.renewDomain(1);
await manager.updateNameserversToCloudflare();
await manager.configureCloudflareDNS({
  content: 'your-vercel-deployment.vercel.app',
});
await manager.verifyDNSPropagation();
```

## 🔄 Workflow

### Step 1: Check Status
```bash
npm run check
```
Output:
```
✅ Domain status: active
📡 Current nameservers: Vercel default
```

### Step 2: Renew Domain
```bash
npm run renew
```
Output:
```
🔄 Renewing pinksync.io for 1 year(s)...
✅ Domain renewed successfully!
```

### Step 3: Update Nameservers
```bash
npm run setup
```
Output:
```
🌐 Updating nameservers to Cloudflare...
✅ Nameservers updated!
⏱️  DNS propagation may take 24-48 hours
```

### Step 4: Verify Propagation
```bash
# Check immediately (may show pending)
npm run verify

# Check after 24-48 hours
npm run verify
# Output:
# ✓ Domain is verified and configured correctly
```

## 🎯 Wednesday Setup Timeline

| Time | Task | Command |
|------|------|---------|
| 9 AM | Check status | `npm run check` |
| 10 AM | Renew domain | `npm run renew` |
| 11 AM | Update nameservers | `npm run setup` |
| 2 PM | Initial verify | `npm run verify` |
| Next day | Final verify | `npm run verify` |

## 📊 Expected Output

```
🚀 Starting PinkSync Domain Setup...

════════════════════════════════════════════════════════

📋 Checking availability for pinksync.io...
✅ Domain status: {
  domain: 'pinksync.io',
  status: 'active',
  verified: true
}

📡 Fetching current nameservers for pinksync.io...
✅ Current domain config: {
  domain: 'pinksync.io',
  nameservers: [ 'ns1.vercel.com', 'ns2.vercel.com' ]
}

🔄 Renewing pinksync.io for 1 year(s)...
✅ Domain renewed successfully! {
  domain: 'pinksync.io',
  years: 1,
  expiresAt: '2025-12-15'
}

🌐 Updating nameservers to Cloudflare...
✅ Nameservers updated! {
  domain: 'pinksync.io',
  nameservers: [
    'ns1.cloudflare.com',
    'ns2.cloudflare.com',
    'ns3.cloudflare.com',
    'ns4.cloudflare.com'
  ],
  updateTime: '2024-12-15T10:30:00Z'
}

🔐 Configuring DNS records in Cloudflare...
✅ DNS record created! {
  type: 'CNAME',
  name: 'pinksync.io',
  content: 'cname.vercel-dns.com',
  proxied: true
}

════════════════════════════════════════════════════════
✅ Setup completed successfully!

📋 Summary:
   ✓ Domain renewed
   ✓ Nameservers updated to Cloudflare
   ✓ DNS records configured

⏱️  Expected activation time: 24-48 hours
```

## 🔐 Security

- **Never commit `.env` file** - use `.env.example`
- Tokens are environment variables only
- Each API call is authenticated
- Consider using secret management for production

## 🐛 Troubleshooting

### "Missing required environment variables"
```bash
# Make sure you have .env file
ls -la .env

# Check all required variables are set
cat .env | grep VERCEL_TOKEN
cat .env | grep CLOUDFLARE_API_TOKEN
cat .env | grep CLOUDFLARE_ZONE_ID
```

### "401 Unauthorized"
- Verify your tokens are correct
- Tokens may have expired, generate new ones
- Check token permissions (should have domain/DNS permissions)

### "DNS not propagating"
- Wait 24-48 hours (normal propagation time)
- Verify nameservers in Vercel dashboard match Cloudflare's
- Check Cloudflare DNS records are created

### "Already exists" DNS record error
- This is normal if record already exists
- You can safely re-run the command

## 📝 API Reference

### `checkAvailability()`
Check if domain is available and active
```javascript
const status = await manager.checkAvailability();
// Returns: { status: 'active', verified: boolean, ... }
```

### `renewDomain(years)`
Renew domain for specified years
```javascript
const result = await manager.renewDomain(1);
// Returns: { expiresAt: '2025-12-15', ... }
```

### `updateNameserversToCloudflare()`
Update nameservers to Cloudflare's
```javascript
const result = await manager.updateNameserversToCloudflare();
// Returns: { domain: 'pinksync.io', nameservers: [...] }
```

### `configureCloudflareDNS(recordData)`
Add DNS record in Cloudflare
```javascript
const result = await manager.configureCloudflareDNS({
  content: 'your-app.vercel.app',
  proxied: true
});
```

### `verifyDNSPropagation()`
Check if DNS has propagated
```javascript
const isVerified = await manager.verifyDNSPropagation();
// Returns: boolean
```

### `setup(options)`
Run complete setup workflow
```javascript
const result = await manager.setup({
  renew: true,
  updateNameservers: true,
  configureDNS: true,
  years: 1
});
```

## 📦 Files Included

```
.
├── vercel-cloudflare-domain-manager.js  # Main manager class
├── scripts/
│   └── renew-domain.js                  # Convenience script
├── .env.example                         # Configuration template
├── package.json                         # Dependencies
└── README.md                            # This file
```

## 🔄 Automation (Optional)

Run on schedule with cron:

```bash
# Renew every Tuesday at 9 AM
0 9 * * 2 /usr/bin/node /path/to/scripts/renew-domain.js

# Verify every Friday at 9 AM
0 9 * * 5 /usr/bin/node /path/to/scripts/renew-domain.js --verify-only
```

## 📞 Support

For issues:
1. Check troubleshooting section above
2. Review API tokens are correct
3. Verify network connectivity
4. Check Vercel/Cloudflare status pages

## 📄 License

MIT

## 🎉 Summary

You now have:
- ✅ Automated domain renewal script
- ✅ Cloudflare integration
- ✅ CLI & programmatic APIs
- ✅ Detailed logging & error handling
- ✅ Ready for Wednesday launch
