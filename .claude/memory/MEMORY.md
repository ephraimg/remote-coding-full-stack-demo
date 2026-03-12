# Project Memory

## Critical Security Rules

1. **NO SECRETS IN CODE** - Ever. Check every file before committing.
   - No IP addresses (use `$EC2_HOST` or placeholder)
   - No XRP addresses (use environment variables)
   - No usernames/passwords
   - No SSH keys
   - No API keys

2. **No Fallback Values** - If env var is missing, fail fast with clear error.

   ```javascript
   // ❌ BAD
   const address = process.env.ADDRESS || "rSomeAddress";

   // ✅ GOOD
   const address = process.env.ADDRESS;
   if (!address) throw new Error("Missing ADDRESS env var");
   ```

## Environment Variables

1. **Two .env Files Required:**
   - `server/.env` - For Express (regular env vars)
   - `client/.env` - For Vite (must use VITE\_ prefix)

2. **Vite Prefix Rule:**
   - Client-side vars MUST start with `VITE_`
   - `VITE_EXAMPLE_XRP_ADDRESS` ✅
   - `EXAMPLE_XRP_ADDRESS` ❌ (not exposed to client)

3. **Required Env Vars:**
   - `VITE_EXAMPLE_XRP_ADDRESS` - React app will crash without it
