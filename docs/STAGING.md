# Staging & Preview Environments

## GitHub Pages Staging

### Main Staging URL
https://pinkycollie.github.io/PinkSync/

Automatically deploys on every push to `main` or `staging` branch.

### PR Previews
Each pull request gets its own preview:
- **URL Pattern:** `https://pinkycollie.github.io/PinkSync/previews/pr-{NUMBER}/`
- **Example:** PR #42 → https://pinkycollie.github.io/PinkSync/previews/pr-42/

### Creating Snapshots

Create named snapshots for specific testing:

```bash
# Via GitHub Actions UI
# Go to: Actions → Deploy to GitHub Pages (Staging) → Run workflow
# Enter snapshot name: "v0.1.0-beta" or "feature-deafauth-integration"
```

Snapshot metadata is saved in `SNAPSHOT.txt` at the preview URL.

## Testing Checklist

Before promoting staging to production:

- [ ] Test all navigation routes
- [ ] Verify DeafAuth integration works
- [ ] Check PinkSync API connections
- [ ] Test accessibility features
- [ ] Validate responsive design (mobile/tablet/desktop)
- [ ] Check all external links
- [ ] Test with real VR intake data
- [ ] Verify SSL/security headers

## Promoting to Production

Once staging looks good:

1. **Tag the release:**
   ```bash
   git tag -a v1.0.0 -m "Release v1.0.0"
   git push origin v1.0.0
   ```

2. **Deploy to production domains:**
   - Trigger production deploy workflow
   - Or use Vercel/Google Cloud Run for auto-deploy

3. **Verify production:**
   - Check mbtq.dev
   - Check 360magicians.com
   - Check vr4deaf.org

## Environment Comparison

| Feature | Staging (GitHub Pages) | Production |
|---------|----------------------|------------|
| URL | pinkycollie.github.io/PinkSync | sync.mbtq.dev |
| Deploy | Auto on push | Manual/tagged release |
| API | Staging API | Production API |
| Auth | Staging DeafAuth | Production DeafAuth |
| Database | Test data | Real user data |
| SSL | GitHub's cert | Let's Encrypt |
| Purpose | Preview & test | Live users |

## Known Limitations

GitHub Pages staging has some limitations:

- **Static export only** - No server-side rendering
- **No API routes** - Must use external API
- **No dynamic routing** - Some Next.js features unavailable
- **Cold start** - First load may be slow

For full testing of SSR features, use Vercel preview deployments instead.
