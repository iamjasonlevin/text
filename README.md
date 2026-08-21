# Notes

A public iMessage thread. Text the Sendblue number from your iPhone; the site mirrors those notes as blue bubbles.

## Setup

1. Log in to Sendblue (email `jasonmichaellevin@gmail.com`):

```bash
sendblue login
```

2. Write API credentials into `.env.local`:

```bash
npm run setup
```

3. In `.env.local`, set `ALLOWED_FROM_NUMBERS` to your personal iPhone number in E.164 (`+1…`). Only texts from that number are published.

4. Verify yourself as a contact (required on the free plan), then text the Sendblue number once:

```bash
sendblue add-contact +1YOURNUMBER
sendblue lines
```

5. Run the site:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Add `?preview=1` to see the iMessage chrome with sample notes.

## Webhook

Sendblue cannot reach `localhost`. Use a tunnel while developing:

```bash
npx cloudflared tunnel --url http://localhost:3000
# or: npx ngrok http 3000
```

Then:

```bash
sendblue webhooks add https://YOUR-TUNNEL/api/webhook --type receive
```

After you deploy, point the webhook at `https://YOUR-DOMAIN/api/webhook`.

## Deploy

Set the same env vars on Vercel. Sendblue API calls must come from the server — they are already confined to `/api/messages` and `/api/webhook`.
