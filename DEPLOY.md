# Guardian Bot — Deploy to Railway via GitHub

## Step 1 — Push code to GitHub

1. Go to [github.com/new](https://github.com/new) and create a **new private repository**
2. Copy the repository URL (e.g. `https://github.com/yourname/guardian-bot.git`)
3. In the Replit Shell, run:

```bash
git remote add origin https://github.com/yourname/guardian-bot.git
git add .
git commit -m "Initial Guardian Bot"
git push -u origin main
```

> If it asks for credentials, use your GitHub username and a [Personal Access Token](https://github.com/settings/tokens/new) (check `repo` scope).

---

## Step 2 — Deploy on Railway

1. Go to [railway.app](https://railway.app) and sign up / log in
2. Click **New Project** → **Deploy from GitHub repo**
3. Select your `guardian-bot` repository
4. Railway will detect the `Dockerfile` automatically

### Add Environment Variables in Railway

In your project → **Variables** tab, add:

| Variable | Value |
|---|---|
| `DISCORD_BOT_TOKEN` | Your bot token |
| `DATABASE_URL` | Your PostgreSQL URL (see below) |
| `PORT` | `8080` |

### Add a Database

1. In Railway project → click **+ New** → **Database** → **PostgreSQL**
2. Click on the PostgreSQL service → **Variables** tab
3. Copy `DATABASE_URL` and paste it into your bot service variables

### Run DB Migration

After first deploy, in Railway → your service → **Settings** → add a one-time command:
```
node -e "require('./artifacts/api-server/dist/index.mjs')" 
```
Or SSH in and run `pnpm --filter @workspace/db run push`

---

## Step 3 — Enable Discord Privileged Intents

1. Go to [discord.com/developers/applications](https://discord.com/developers/applications)
2. Select your bot → **Bot** tab
3. Enable all 3 **Privileged Gateway Intents**:
   - ✅ Presence Intent
   - ✅ Server Members Intent  
   - ✅ Message Content Intent
4. Click **Save Changes**

---

## Step 4 — Invite the Bot

Use this URL (replace `YOUR_CLIENT_ID`):

```
https://discord.com/oauth2/authorize?client_id=YOUR_CLIENT_ID&permissions=8&scope=bot%20applications.commands
```

Permission `8` = Administrator (required for antinuke and recovery features).

---

## Keeping Up to Date

Whenever you update the bot on Replit:
```bash
git add .
git commit -m "Update bot"
git push
```
Railway will automatically redeploy.
