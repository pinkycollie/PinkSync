# PinkSync Template: Deno Fresh + DeafAUTH

Quick start template for building a Deno Fresh application with DeafAUTH integration.

## Quick Start

```bash
# 1. Create new Deno Fresh project
deno run -A -r https://fresh.deno.dev my-app
cd my-app

# 2. Copy DeafAUTH files
cp -r /path/to/PinkSync/deno-deafauth ./

# 3. Create API routes
mkdir -p routes/api/auth

# 4. Copy route templates from this directory
cp login.ts routes/api/auth/
cp preferences.ts routes/api/auth/
cp logout.ts routes/api/auth/

# 5. Run the app
deno task start
```

## File Structure

```
my-app/
├── deno-deafauth/          # DeafAUTH service
│   ├── mod.ts
│   ├── types.ts
│   ├── routes.ts
│   └── ...
├── routes/
│   ├── api/
│   │   └── auth/
│   │       ├── login.ts
│   │       ├── preferences.ts
│   │       └── logout.ts
│   └── index.tsx
└── deno.json
```

## Next Steps

1. Configure database (Deno KV or Supabase)
2. Update CORS settings
3. Deploy to Deno Deploy
4. Configure browser extension to use your API

## Features Included

- ✅ User authentication
- ✅ Preference management
- ✅ Token-based sessions
- ✅ Browser extension compatible
- ✅ Production ready

## Deployment

```bash
# Deploy to Deno Deploy
deployctl deploy --project=my-app
```

See the main PinkSync documentation for detailed deployment instructions.
