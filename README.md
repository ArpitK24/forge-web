# forge-web

The waitlist site for [Forge](https://github.com/ArpitK24/forge), a context engine for code, in your terminal.

- `index.html` is the static page, with no build step.
- `api/waitlist.js` is a Vercel function. It saves signups to Supabase.
- `supabase/waitlist.sql` creates the `waitlist` table. Run it once.

## Deploy
1. Import this repo in Vercel, with Framework Preset set to Other.
2. Go to Vercel → Storage → Supabase and connect a project. This adds `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY`.
3. Run `supabase/waitlist.sql` in the Supabase SQL Editor, then redeploy.

To export signups, open Supabase → Table Editor → waitlist and use Export CSV.
