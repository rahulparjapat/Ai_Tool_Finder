# How to Update Your Website (No Coding Required)

This guide is for you, the site owner — not a developer. It explains how to add a new AI tool, write a new blog article, or fix a price, using a simple dashboard instead of touching any code.

---

## The one-time setup (do this once)

Your site now has a built-in "admin dashboard" at `yoursite.com/admin/`. Before you can log in, it needs to be connected to Netlify Identity — a free login system. This takes about 10 minutes, one time only.

### Step 1 — Deploy the site to Netlify (if not already done)
1. Go to [netlify.com](https://netlify.com) and sign up (free) using your GitHub account.
2. Click **"Add new site" → "Import an existing project"** and choose this project's GitHub repository.
3. Build command: `npm run build` — Publish directory: `dist`. Click **Deploy**.

### Step 2 — Turn on Identity (the login system)
1. In your Netlify dashboard, open your site, go to **"Site configuration" → "Identity"**.
2. Click **"Enable Identity"**.
3. Under **Registration preferences**, choose **"Invite only"** (so random people can't sign up on your site).

### Step 3 — Turn on Git Gateway (lets the dashboard save your changes)
1. Still under Identity settings, scroll to **"Services" → "Git Gateway"**.
2. Click **"Enable Git Gateway"**.

### Step 4 — Invite yourself as a user
1. Go to the **"Identity"** tab for your site and click **"Invite users"**.
2. Enter your own email address and send the invite.
3. Check your email, click the invite link, and set a password.

That's it — the one-time setup is done. From now on, you log in at `yoursite.com/admin/` with that email and password, just like any normal website login.

---

## Everyday use — how to actually update things

Go to **`yoursite.com/admin/`** and log in. You'll see a simple dashboard with a few sections on the left: **AI Tools**, **Categories**, **Best-For Roundups**, and **Blog Articles**.

### ➕ Adding a new AI tool
1. Click **"AI Tools"** → **"New Tools"** (or open the existing list and click **"Add"**).
2. Fill in the boxes:
   - **Tool Name** — e.g. `Gamma`
   - **URL Slug** — a short web-address-friendly version, e.g. `gamma` (lowercase, no spaces)
   - **Made By (Company)** — e.g. `Gamma Inc.`
   - **Categories** — which category page it should show up on (must match an existing category's slug, e.g. `presentations`)
   - **One-Sentence Description**, **Pricing**, **Has a Free Plan?**, **Official Website Link**
   - **Pros** / **Cons** — add each point as its own line
   - **Best For** — one sentence on who should use it
3. Click **"Publish"**.
4. Wait 1–2 minutes — your site rebuilds automatically. The new tool now has its own review page, and the site automatically creates "X vs Y" comparison pages against every other tool in the same category — you don't need to do anything extra for that.

### ✏️ Fixing a price or description
1. Click **"AI Tools"**, find the tool in the list, click it to open.
2. Edit the field you want to fix (e.g. **Pricing**).
3. Also update the **Last Updated** box to today's date — this is what makes the "Updated X days ago" text on the live page stay accurate. Only change this when you've actually reviewed or fixed something; leave it alone otherwise.
4. Click **"Publish"**. Live in a couple of minutes.

### 📝 Writing a new blog article
1. Click **"Blog Articles"** → **"New Article"**.
2. Fill in **Title** and **Short Description**.
3. Write the article in the **Article Content** box — it works like a simple word processor (bold, headings, links, etc.).
4. Set the **Publish Date**.
5. Click **"Publish"**.

### 🗑️ Removing something
Open the item, click the **trash/delete icon**, confirm. Publishing after a delete removes it from the live site.

### 👀 Previewing before it goes live
Click **"Save"** instead of "Publish" to save a draft you can come back to later without it appearing on the real site yet.

---

## Good habits

- **One change at a time** feels safest when you're starting out — publish, check the live site, then make the next change.
- **URL Slugs must be unique** and use only lowercase letters, numbers, and hyphens (no spaces, no capital letters) — this is the one technical rule that matters.
- If something looks wrong after publishing, don't panic — every change is saved in your site's history, so nothing is ever truly lost. Let your developer know and it can be rolled back.

---

## If you ever get stuck

This dashboard is a well-known, widely used free tool called **Decap CMS** — if you search "Decap CMS how to [your question]" you'll find help, or you can always come back and ask for help here.
