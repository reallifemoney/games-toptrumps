# Top Funds — live multiplayer Top Trumps

A browser game version of your "Top Funds" card deck. One person hosts, shares
a 4-letter room code, and everyone else joins from their own device. Built
with React + Vite, synced in real time with Firebase Realtime Database.

## 1. Create a Firebase project

1. Go to https://console.firebase.google.com and click **Add project**.
   Give it any name (e.g. `top-funds-trumps`) — you can skip Google Analytics.
2. Once created, click the **</> (Web)** icon to register a web app. Give it
   a nickname and click **Register app**. You'll be shown a `firebaseConfig`
   object — keep this page open, you'll need the values in step 3.
3. In the left sidebar, go to **Build → Realtime Database → Create Database**.
   Choose any location, and start in **test mode** for now (you'll lock it
   down in step 5).

## 2. Install dependencies

```bash
npm install
```

## 3. Add your Firebase config

Copy `.env.example` to `.env` and fill in the values from step 1's
`firebaseConfig` object:

```
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_DATABASE_URL=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_STORAGE_BUCKET=...
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...
```

`.env` is already in `.gitignore` so it won't be committed.

## 4. Run it locally

```bash
npm run dev
```

Open the printed localhost URL, host a game in one tab, join in another to
test.

## 5. Lock down the database rules

Test mode leaves your database open to anyone for 30 days, then locks it
completely. For a workshop tool this is a reasonable, low-stakes trade-off,
but it's worth tightening a little. In Firebase console →
**Realtime Database → Rules**, paste:

```json
{
  "rules": {
    "rooms": {
      "$roomCode": {
        ".read": true,
        ".write": true
      }
    }
  }
}
```

This keeps access scoped to the `rooms` path only (rather than wide open),
which is enough for a temporary workshop game with no personal data stored.
Don't put anything sensitive in room names or player names.

## 6. Push to GitHub

```bash
git init
git add .
git commit -m "Top Funds multiplayer game"
git branch -M main
git remote add origin https://github.com/<your-username>/<your-repo>.git
git push -u origin main
```

## 7. Deploy it somewhere your course participants can reach

**Vercel (easiest)**
1. Go to https://vercel.com, sign in with GitHub, **Import** this repo.
2. In the project's Environment Variables settings, add the same 7
   `VITE_FIREBASE_...` values from your `.env`.
3. Deploy — Vercel auto-detects Vite. You'll get a URL like
   `top-funds-trumps.vercel.app` to share before each workshop.

**Netlify** works the same way (import repo, add env vars, deploy).

**GitHub Pages** works too, but needs a small tweak to `vite.config.js`
(a `base` path matching your repo name) and building with
`npm run build` then publishing the `dist` folder — ask me if you want
that variant instead.

## Editing the card deck

All 10 fund cards live in the `CARDS` array near the top of `src/App.jsx`.
Copy the pattern to add more from your physical deck, or adjust any stat.
