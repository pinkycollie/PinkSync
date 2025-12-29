# Branch Deployment Examples

This document provides step-by-step examples of deploying different types of branches to GitHub Pages.

## Example 1: Deploying a New Service

Let's create and deploy a new microservice for video transcription.

### Step 1: Create the Branch

```bash
# Create and checkout new branch
git checkout -b service-video-transcription

# Create the service directory
mkdir -p services/video-transcription

# Add a basic service file
cat > services/video-transcription/index.ts << 'EOF'
/**
 * Video Transcription Service
 * Provides real-time video transcription for deaf users
 */

export interface TranscriptionConfig {
  language: string;
  accuracy: 'high' | 'medium' | 'low';
  realtime: boolean;
}

export class VideoTranscriptionService {
  async transcribe(videoUrl: string, config: TranscriptionConfig) {
    // Transcription logic here
    return {
      text: "Sample transcription",
      confidence: 0.95,
      timestamp: new Date()
    };
  }
}
EOF
```

### Step 2: Deploy

```bash
# Add and commit your changes
git add .
git commit -m "Add video transcription service"

# Push to trigger deployment
git push origin service-video-transcription

# OR use the helper script
npm run deploy:branch
```

### Step 3: Access Your Deployment

Your service is now live at:
```
https://pinkycollie.github.io/PinkSync/service-video-transcription/
```

Check deployment status:
```
https://github.com/pinkycollie/PinkSync/actions/workflows/branch-pages.yml
```

---

## Example 2: Deploying an API Endpoint

Let's create and deploy an API for interpreter booking.

### Step 1: Create the Branch

```bash
# Create API branch
git checkout -b api-booking

# Create API route
mkdir -p app/api/booking
cat > app/api/booking/route.ts << 'EOF'
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const body = await request.json();
  
  return NextResponse.json({
    success: true,
    bookingId: 'book-' + Date.now(),
    message: 'Interpreter booking created'
  });
}

export async function GET(request: NextRequest) {
  return NextResponse.json({
    bookings: [],
    count: 0
  });
}
EOF
```

### Step 2: Deploy

```bash
# Commit and push
git add .
git commit -m "Add booking API endpoint"
git push origin api-booking
```

### Step 3: Test Your API

Once deployed, access at:
```
https://pinkycollie.github.io/PinkSync/api-booking/
```

---

## Example 3: Deploying a Tool

Let's create and deploy a QR code scanner tool.

### Step 1: Create the Branch

```bash
# Create tool branch
git checkout -b tool-qr-scanner

# Create tool page
mkdir -p app/tools/qr-scanner
cat > app/tools/qr-scanner/page.tsx << 'EOF'
'use client';

import { useState } from 'react';

export default function QRScanner() {
  const [result, setResult] = useState('');
  
  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-4">QR Code Scanner</h1>
      <p className="mb-4">Scan QR codes to access sign language content</p>
      
      <div className="border-2 border-dashed border-gray-300 p-8 text-center">
        <p>Camera preview would go here</p>
      </div>
      
      {result && (
        <div className="mt-4 p-4 bg-green-100 rounded">
          <p className="font-bold">Scanned Result:</p>
          <p>{result}</p>
        </div>
      )}
    </div>
  );
}
EOF
```

### Step 2: Deploy

```bash
git add .
git commit -m "Add QR scanner tool"
npm run deploy:branch
```

### Step 3: Use Your Tool

Access at:
```
https://pinkycollie.github.io/PinkSync/tool-qr-scanner/
```

---

## Example 4: Deploying a Feature Branch

Let's deploy a new feature for sign language video filters.

### Step 1: Create Feature Branch

```bash
# Create feature branch
git checkout -b feat-video-filters

# Add feature component
mkdir -p components/video-filters
cat > components/video-filters/FilterPanel.tsx << 'EOF'
'use client';

interface Filter {
  id: string;
  name: string;
  description: string;
}

const filters: Filter[] = [
  { id: 'contrast', name: 'High Contrast', description: 'Increase video contrast' },
  { id: 'brightness', name: 'Brightness', description: 'Adjust brightness' },
  { id: 'zoom', name: 'Sign Language Zoom', description: 'Focus on signer' }
];

export function FilterPanel() {
  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Video Filters</h2>
      <div className="space-y-2">
        {filters.map(filter => (
          <div key={filter.id} className="border p-3 rounded">
            <h3 className="font-semibold">{filter.name}</h3>
            <p className="text-sm text-gray-600">{filter.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
EOF
```

### Step 2: Deploy

```bash
git add .
git commit -m "Add video filter feature"
git push origin feat-video-filters
```

### Step 3: Preview Feature

View at:
```
https://pinkycollie.github.io/PinkSync/feat-video-filters/
```

---

## Example 5: Multi-Service Integration Branch

Let's create an integration branch that combines multiple services.

### Step 1: Create Integration Branch

```bash
# Create integration branch
git checkout -b integrated-deaf-calling

# Create integration hub
mkdir -p app/integrations/deaf-calling
cat > app/integrations/deaf-calling/page.tsx << 'EOF'
'use client';

export default function DeafCallingHub() {
  const services = [
    { name: 'Video Call', status: 'active', port: 3070 },
    { name: 'Interpreter', status: 'active', port: 3090 },
    { name: 'Transcription', status: 'active', port: 3100 },
    { name: 'Sign Language', status: 'active', port: 3080 }
  ];
  
  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">Deaf Calling Integration Hub</h1>
      
      <div className="grid grid-cols-2 gap-4">
        {services.map(service => (
          <div key={service.name} className="border rounded p-4">
            <h3 className="font-bold">{service.name}</h3>
            <p className="text-sm text-gray-600">Port: {service.port}</p>
            <span className={`inline-block px-2 py-1 rounded text-xs ${
              service.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}>
              {service.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
EOF
```

### Step 2: Deploy

```bash
git add .
git commit -m "Add deaf calling integration hub"
git push origin integrated-deaf-calling
```

### Step 3: Access Integration

Available at:
```
https://pinkycollie.github.io/PinkSync/integrated-deaf-calling/
```

---

## Common Deployment Patterns

### Pattern 1: Rapid Prototyping

```bash
# Create quick prototype
git checkout -b feat-prototype-xyz
# Make changes
git add . && git commit -m "Prototype"
git push origin feat-prototype-xyz
# Share URL with team immediately
```

### Pattern 2: A/B Testing

```bash
# Version A
git checkout -b feat-ui-version-a
# Build version A
git push origin feat-ui-version-a

# Version B
git checkout -b feat-ui-version-b
# Build version B
git push origin feat-ui-version-b

# Compare:
# https://pinkycollie.github.io/PinkSync/feat-ui-version-a/
# https://pinkycollie.github.io/PinkSync/feat-ui-version-b/
```

### Pattern 3: Service Isolation Testing

```bash
# Test service in isolation
git checkout -b service-test-deafauth
# Isolate and test DeafAuth
git push origin service-test-deafauth

# Test without affecting main staging
```

### Pattern 4: Client Demos

```bash
# Create demo branch for client presentation
git checkout -b demo-client-abc
# Polish for presentation
git push origin demo-client-abc

# Send stable URL to client:
# https://pinkycollie.github.io/PinkSync/demo-client-abc/
```

---

## Troubleshooting Common Issues

### Issue: Build Fails

**Solution:**
```bash
# Test build locally first
NODE_ENV=staging npm run build

# If successful, then push
git push origin your-branch
```

### Issue: Assets Not Loading

**Problem:** CSS/JS/images return 404

**Solution:** Check that paths are relative, not absolute
```tsx
// ✗ Wrong
<img src="/images/logo.png" />

// ✓ Correct (relative paths work with basePath)
<img src="./images/logo.png" />
<img src="images/logo.png" />
```

### Issue: Branch Not Deploying

**Solution:** Verify branch name matches pattern
```bash
# Check current branch
git branch --show-current

# If it doesn't match, rename it
git branch -m new-name service-new-name
```

---

## Advanced: Custom Deployment Configuration

### Deploy with Custom Environment Variables

Edit `.github/workflows/branch-pages.yml` to add branch-specific env vars:

```yaml
- name: Build for branch deployment
  run: NODE_ENV=staging npm run build
  env:
    NEXT_PUBLIC_PLATFORM_ENV: staging
    NEXT_PUBLIC_BRANCH_NAME: ${{ steps.branch.outputs.name }}
    # Add your custom variables here
    NEXT_PUBLIC_CUSTOM_VAR: "value"
```

### Deploy with Branch-Specific Features

```typescript
// In your code, detect branch
const branchName = process.env.NEXT_PUBLIC_BRANCH_NAME;

if (branchName === 'service-experimental') {
  // Enable experimental features
}
```

---

## Best Practices Summary

1. ✅ **Use descriptive branch names** following patterns
2. ✅ **Test build locally** before pushing
3. ✅ **Use relative paths** for assets
4. ✅ **Document your branch** in a README
5. ✅ **Clean up old branches** after merging
6. ✅ **Share deployment URLs** with team for review
7. ✅ **Monitor Actions tab** for deployment status

---

## Quick Command Reference

```bash
# Create and deploy new service
git checkout -b service-my-service
# ... make changes ...
npm run deploy:branch

# Check deployment status
# Visit: https://github.com/pinkycollie/PinkSync/actions

# View your deployment
# Visit: https://pinkycollie.github.io/PinkSync/service-my-service/

# Update deployment
git add . && git commit -m "Update"
git push origin service-my-service

# Delete branch deployment (manual)
# Remove folder from gh-pages branch
```

---

**Happy Deploying! 🚀**

Every branch is a deployable microservice!
