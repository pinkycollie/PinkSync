# Branch-Specific GitHub Pages Deployments

## Overview

Every branch in the PinkSync repository can be automatically deployed to its own GitHub Pages URL. This enables independent deployment and testing of microservices, APIs, tools, and features without affecting the main staging environment.

## 🌐 Branch URL Pattern

Each branch gets its own unique URL following this pattern:

```
https://pinkycollie.github.io/PinkSync/{branch-name}/
```

### Examples

| Branch Name | Deployment URL |
|-------------|---------------|
| `service-deafauth` | https://pinkycollie.github.io/PinkSync/service-deafauth/ |
| `api-interpreter` | https://pinkycollie.github.io/PinkSync/api-interpreter/ |
| `feat-Pinksync-AI` | https://pinkycollie.github.io/PinkSync/feat-Pinksync-AI/ |
| `tool-scanqr` | https://pinkycollie.github.io/PinkSync/tool-scanqr/ |
| `vcode` | https://pinkycollie.github.io/PinkSync/vcode/ |

> **Note:** Branch names with slashes (/) are automatically converted to dashes (-) for URL compatibility.

## 🚀 Automatic Deployment

### Supported Branch Patterns

The following branch name patterns trigger automatic deployment:

- `service-*` - Service branches (microservices)
- `api-*` - API branches
- `tool-*` - Tool branches
- `feat-*` / `feature-*` - Feature branches
- `video-*` - Video processing branches
- `data-*` - Data processing branches
- `integrated-*` - Integration branches
- `QR-Code-*` - QR code system branches
- `admin-*` - Admin branches
- Special branches: `vcode`, `videoized`, `REGISTRATION`

### How It Works

1. **Push to Branch**: Commit and push to any supported branch
   ```bash
   git checkout -b service-my-new-service
   # Make your changes
   git add .
   git commit -m "Add new microservice"
   git push origin service-my-new-service
   ```

2. **Automatic Build**: GitHub Actions automatically:
   - Detects the branch name
   - Creates a branch-specific Next.js configuration
   - Builds the project with the branch-specific base path
   - Deploys to GitHub Pages under `/{branch-name}/`

3. **Access Your Deployment**: Visit your unique URL
   ```
   https://pinkycollie.github.io/PinkSync/service-my-new-service/
   ```

## 🛠️ Manual Deployment

You can manually trigger a deployment via GitHub Actions UI:

1. Go to **Actions** tab in GitHub
2. Select **Branch GitHub Pages Deployment** workflow
3. Click **Run workflow**
4. (Optional) Enter a specific branch name
5. Click **Run workflow** button

## 📋 Branch Metadata

Each deployment includes a `BRANCH_INFO.txt` file with deployment details:

```
Branch: service-my-service
Sanitized: service-my-service
Build Date: 2025-12-15 12:00:00 UTC
Commit: a1b2c3d4e5f6g7h8i9j0
Commit Short: a1b2c3d
Actor: username
Workflow: Branch GitHub Pages Deployment
Run Number: 42
```

Access it at: `https://pinkycollie.github.io/PinkSync/{branch-name}/BRANCH_INFO.txt`

## 🎯 Use Cases

### 1. Microservice Development
Each microservice can have its own deployment for isolated testing:

```bash
# DeafAuth service
git checkout -b service-deafauth
# Develop and test at: /PinkSync/service-deafauth/

# RAG Engine service
git checkout -b service-rag-engine
# Develop and test at: /PinkSync/service-rag-engine/
```

### 2. API Development
API-specific branches for endpoint development:

```bash
git checkout -b api-interpreters
# Test API at: /PinkSync/api-interpreters/
```

### 3. Tool Development
Standalone tools and utilities:

```bash
git checkout -b tool-qr-scanner
# Access tool at: /PinkSync/tool-qr-scanner/
```

### 4. Feature Testing
Test new features independently:

```bash
git checkout -b feat-video-captions
# Preview at: /PinkSync/feat-video-captions/
```

## 🔧 Configuration

### Branch-Specific Next.js Config

Each branch deployment automatically generates a custom `next.config.mjs`:

```javascript
{
  output: 'export',              // Static export for GitHub Pages
  basePath: '/PinkSync/{branch}', // Branch-specific base path
  assetPrefix: '/PinkSync/{branch}/', // Asset prefix
  images: {
    unoptimized: true            // Required for static export
  },
  env: {
    PLATFORM_ENV: 'staging',
    BRANCH_NAME: '{branch-name}',
    API_URL: 'https://api.mbtq.dev',
    AUTH_URL: 'https://auth.mbtq.dev',
  }
}
```

### Environment Variables

Branch deployments use staging environment variables:

- `NEXT_PUBLIC_PLATFORM_ENV`: `staging`
- `NEXT_PUBLIC_BRANCH_NAME`: Current branch name
- `NEXT_PUBLIC_API_URL`: Staging API URL
- `NEXT_PUBLIC_AUTH_URL`: Staging Auth URL

## 📊 Deployment Architecture

```
gh-pages branch
├── / (main staging deployment)
├── previews/
│   ├── pr-1/
│   ├── pr-2/
│   └── ...
├── service-deafauth/
├── service-rag-engine/
├── api-interpreters/
├── tool-qr-scanner/
├── feat-video-captions/
└── ... (all other branches)
```

### Key Features

- **Independent Deployments**: Each branch is completely isolated
- **No Interference**: Branch deployments don't affect main staging
- **Persistent URLs**: URLs remain stable across deployments
- **Keep Files**: Previous branch deployments are preserved
- **Concurrent Builds**: Multiple branches can build simultaneously

## 🔍 Troubleshooting

### Branch Not Deploying

**Issue**: Your branch push didn't trigger a deployment

**Solutions**:
1. Check if your branch name matches a supported pattern
2. Verify the workflow file exists: `.github/workflows/branch-pages.yml`
3. Check the Actions tab for workflow status
4. Manually trigger via workflow_dispatch

### Build Failures

**Issue**: Deployment workflow fails during build

**Solutions**:
1. Check build logs in Actions tab
2. Ensure all dependencies are in `package.json`
3. Test build locally: `NODE_ENV=staging npm run build`
4. Check for TypeScript/ESLint errors

### 404 on Deployment URL

**Issue**: Deployment URL returns 404

**Solutions**:
1. Wait 2-3 minutes for GitHub Pages to propagate
2. Clear browser cache
3. Check if `.nojekyll` file was created
4. Verify `BRANCH_INFO.txt` is accessible

### Assets Not Loading

**Issue**: CSS, JS, or images not loading

**Solutions**:
1. Check browser console for path errors
2. Verify `basePath` and `assetPrefix` are set correctly
3. Ensure paths in code use relative paths (not absolute)
4. Check that image optimization is disabled

## 🔐 Security Considerations

### Access Control
- All branch deployments are public (GitHub Pages limitation)
- Don't include secrets or sensitive data in deployments
- Use environment variables for API keys (server-side only)

### Best Practices
- Use staging/test APIs, never production APIs
- Don't commit `.env` files
- Use placeholder data for testing
- Sanitize any user input in static pages

## 📈 Monitoring & Analytics

### Deployment Status

Check deployment status:
1. Go to **Actions** tab
2. Select **Branch GitHub Pages Deployment**
3. View workflow runs for your branch

### Build Artifacts

Each build includes:
- Static HTML/CSS/JS files
- Branch metadata (`BRANCH_INFO.txt`)
- Build timestamp
- Commit information

## 🌟 Best Practices

### 1. Branch Naming
Use descriptive, lowercase names with hyphens:
- ✅ `service-deafauth-v2`
- ✅ `api-video-processing`
- ✅ `feat-sign-language-detection`
- ❌ `MyNewFeature` (CamelCase)
- ❌ `feature/user-auth` (slashes get converted)

### 2. Testing
Before pushing:
```bash
# Test build locally
NODE_ENV=staging npm run build

# Preview locally
npx serve out -p 3001
```

### 3. Documentation
Add a README in your branch explaining:
- What the branch does
- How to test it
- Link to the GitHub Pages deployment

### 4. Cleanup
When merging or deleting branches:
- Branch deployments remain on GitHub Pages
- Manually remove via `gh-pages` branch if needed
- Consider keeping for historical reference

## 🔄 Workflow Updates

### Modifying the Workflow

To change deployment behavior, edit `.github/workflows/branch-pages.yml`:

```yaml
# Add new branch patterns
on:
  push:
    branches:
      - 'service-*'
      - 'your-custom-pattern-*'
```

### Custom Configuration

For branch-specific customizations:

1. Edit the "Create branch-specific next.config" step
2. Add conditional logic based on branch name
3. Include branch-specific environment variables

## 📚 Additional Resources

- [GitHub Pages Documentation](https://docs.github.com/en/pages)
- [Next.js Static Exports](https://nextjs.org/docs/app/building-your-application/deploying/static-exports)
- [PinkSync Staging Guide](./STAGING.md)
- [Microservices Catalog](../MICROSERVICES_CATALOG.md)

## 🆘 Support

For issues or questions:

1. **Check existing deployments**: [Actions tab](https://github.com/pinkycollie/PinkSync/actions/workflows/branch-pages.yml)
2. **Open an issue**: [GitHub Issues](https://github.com/pinkycollie/PinkSync/issues)
3. **Review workflow logs**: Click on failed workflow runs for details
4. **Ask the team**: Mention in your PR or branch

---

**Happy Deploying! 🚀**

Each branch is now a deployable microservice, ready to test independently!
