# LifeOS Deployment Guide: Hosting on Render & Vercel (Free Tier)

This guide walks you through deploying your LifeOS application to the cloud for free using **Render** (for the Node.js/Express API backend) and **Vercel** (for the React/Vite frontend), connected to your existing cloud **MongoDB Atlas** database.

---

## Prerequisites
1. **GitHub Repository**: Push your workspace folder (`TODO`) to a GitHub repository. The repository structure should contain the `frontend` and `backend` folders at the root.
2. **MongoDB Atlas URI**: You already have your connection string:
   `mongodb+srv://nagaraj:8nJs1CeFjGon8S3P@cluster0.yatypy4.mongodb.net/lifeos`

---

## Step 1: Push Your Code to GitHub

Open a terminal in your project root directory (`TODO`) and run:
```bash
git init
git add .
git commit -m "Prepping for deployment"
# Rename branch to main if needed
git branch -M main
# Link your GitHub repository
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
git push -u origin main
```

---

## Step 2: Deploy the Backend on Render (Free)

Render is excellent for hosting Express APIs. It offers a free tier for Web Services.

1. **Sign Up / Log In**: Go to [Render](https://render.com/) and log in using your GitHub account.
2. **Create a New Web Service**:
   - Click the **New +** button and select **Web Service**.
   - Select your connected GitHub repository containing the LifeOS project.
3. **Configure the Service**:
   - **Name**: `lifeos-backend`
   - **Root Directory**: `backend` *(CRITICAL: Tells Render to build from the backend folder)*
   - **Environment**: `Node`
   - **Region**: Choose the region closest to you.
   - **Branch**: `main`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start` *(Runs `node src/server.js` defined in package.json)*
   - **Instance Type**: Select **Free** ($0/month).
4. **Configure Environment Variables**:
   - Click the **Advanced** tab or go to **Environment** after creation.
   - Add the following environment variable:
     - **Key**: `MONGODB_URI`
     - **Value**: `mongodb+srv://nagaraj:8nJs1CeFjGon8S3P@cluster0.yatypy4.mongodb.net/lifeos?retryWrites=true&w=majority` *(Replace URL query details if required)*
5. **Deploy**: Click **Create Web Service**. Render will install node packages, connect to MongoDB, and launch your server.
6. **Note Your Backend URL**: Once successfully deployed, Render will show your live backend URL at the top left of the dashboard (e.g. `https://lifeos-backend.onrender.com`).

---

## Step 3: Seed the MongoDB Database (Optional)

If your cloud database is fresh and empty, you need to populate initial motivational quotes and achievements. You can trigger this using your Render console or running it locally once pointing to the cloud DB:

### Option A: Trigger on Render
Go to your Render Web Service dashboard, click **Shell**, and run:
```bash
npm run seed
```

### Option B: Run Locally
Open a terminal in `backend/` on your computer, set `MONGODB_URI` temporarily to your Atlas URL, and run:
```bash
npm run seed
```

---

## Step 4: Deploy the Frontend on Vercel (Free)

Vercel is optimized for static sites and Single Page Applications like React/Vite.

1. **Sign Up / Log In**: Go to [Vercel](https://vercel.com/) and log in using your GitHub account.
2. **Import Repository**:
   - Click **Add New** -> **Project**.
   - Find and select your GitHub repository.
3. **Configure the Deployment Settings**:
   - **Project Name**: `lifeos-dashboard`
   - **Framework Preset**: `Vite` *(Vercel will detect Vite automatically)*
   - **Root Directory**: Click **Edit** next to Root Directory and select the `frontend` folder.
   - **Build and Development Settings**: Keep defaults (Build Command: `npm run build`, Output Directory: `dist`).
4. **Set Environment Variables**:
   - Expand the **Environment Variables** section.
   - Add the following environment variable:
     - **Key**: `VITE_API_BASE_URL`
     - **Value**: `https://lifeos-backend.onrender.com/api` *(CRITICAL: Replace with your actual Render URL followed by `/api`)*
5. **Deploy**: Click **Deploy**. Vercel will build your static files and deploy them to a global CDN.
6. **Access App**: Vercel will provide a live domain (e.g. `https://lifeos-dashboard.vercel.app`). Open it, and you're ready to use your hosted LifeOS dashboard!

---

## Troubleshooting & Free-Tier Cold Starts
- **Backend Delay**: Render's free tier puts backend servers to sleep after 15 minutes of inactivity. When you load the frontend for the first time, it might take 30–50 seconds for the backend to wake up and fetch your dashboard data. This is normal on free hosting plans.
- **Routing issues**: If you refresh a page (like `/calendar` or `/goals`) on Vercel and get a `404 Not Found` error, Vercel needs a routing rewrite configuration. To fix this, create a file named `vercel.json` inside the `frontend/` directory with this content:
  ```json
  {
    "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
  }
  ```
  And push it to GitHub.
