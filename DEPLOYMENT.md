# 🚀 Deployment Guide: Vercel & Render

This guide walks you through deploying your **3D Scroll Portfolio & Admin Terminal** to production.

To ensure the best performance and persistent reliability, the recommended deployment architecture is:
1. **Frontend (React)**: Hosted on **Vercel** (global CDN, fast HMR compiles, excellent SPA routing fallback support).
2. **Backend (Express API)**: Hosted on **Render** (as a persistent Node.js Web Service, perfect for keep-alive MongoDB Atlas connections and Nodemailer pipelines).

---

## 🛠️ Phase 1: Deploy Backend to **Render**

Render is perfect for hosting your Express REST API as a persistent service.

### Step 1: Connect your Repository
1. Sign in to your [Render Dashboard](https://dashboard.render.com).
2. Click **New +** and select **Web Service**.
3. Link your GitHub account and select your **`3DPortfolio`** repository.

### Step 2: Configure Web Service Settings
Fill in the following details:
- **Name**: `portfolio-backend` (or custom name)
- **Region**: Select the region closest to your target audience.
- **Branch**: `main`
- **Root Directory**: `server` *(Crucial: This points Render to your Express backend folder)*
- **Runtime**: `Node`
- **Build Command**: `npm install`
- **Start Command**: `node server.js`
- **Instance Type**: Select **Free** (or your preferred tier).

### Step 3: Add Environment Variables
Click **Advanced** -> **Add Environment Variable** and enter the variables from your local `.env`:

| Key | Value | Description |
|-----|-------|-------------|
| `PORT` | `10000` | Port Render automatically binds to. |
| `MONGO_URI` | `mongodb+srv://...` | Your MongoDB Atlas connection string. |
| `JWT_SECRET` | `your_super_secret_jwt_key` | Secret key used for signing JWT tokens. |
| `EMAIL_SERVICE` | `gmail` | Nodemailer provider. |
| `EMAIL_USER` | `phulkeshwarmahto9@gmail.com` | Destination inbox for direct report notifications. |
| `EMAIL_PASS` | `your_gmail_app_password` | Your 16-character Google App Password (not standard account password). |
| `GEMINI_API_KEY` | `your_gemini_api_key` | Google AI API Key for message polishing. |
| `NODE_ENV` | `production` | Enables production optimizations. |
| `CLIENT_URL` | `https://your-portfolio-client.vercel.app` | Your Vercel frontend URL (add this *after* deploying frontend). |

### Step 4: Deploy
Click **Deploy Web Service**.
Once the build completes and says `Status: Live`, copy your Render Service URL (e.g., `https://portfolio-backend.onrender.com`).

---

## 💻 Phase 2: Deploy Frontend to **Vercel**

Vercel is the premier platform for hosting React applications.

### Step 1: Connect your Repository
1. Go to your [Vercel Dashboard](https://vercel.com/dashboard).
2. Click **Add New** -> **Project**.
3. Import your **`3DPortfolio`** repository.

### Step 2: Configure Build Settings
Fill in the following details:
- **Framework Preset**: `Vite` (automatically detected)
- **Root Directory**: `client` *(Crucial: This points Vercel to your React client folder)*
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`

### Step 3: Add Environment Variables
Add a single frontend environment variable to point Vite to your backend:

| Key | Value | Description |
|-----|-------|-------------|
| `VITE_API_URL` | `https://portfolio-backend.onrender.com` | Copy and paste your **Render Web Service URL** here (no trailing slash). |

### Step 4: Deploy
Click **Deploy**.
Once the deployment succeeds, Vercel will give you a production domain (e.g., `https://3d-portfolio.vercel.app`).

### Step 5: Final Cross-Linking (CORS Approval)
To prevent CORS blockages:
1. Go back to your **Render Web Service Settings**.
2. Update the `CLIENT_URL` environment variable value to your **Vercel Production Domain** (e.g., `https://3d-portfolio.vercel.app`).
3. Render will automatically redeploy the backend with the new allowed CORS domain.

---

## ⚡ Alternative Option: Full-Stack Deployment on **Vercel**

Since your repository contains a `server/vercel.json` and a `client/vercel.json`, you can alternatively deploy **both** client and server to Vercel as two separate Vercel Projects.

### 1. Deploy Frontend (Vercel)
- Follow the Vercel steps above, setting **Root Directory** to `client` and `VITE_API_URL` to your backend Vercel endpoint.

### 2. Deploy Backend (Vercel)
- Create a second Vercel Project.
- Point the **Root Directory** to `server`.
- Vercel will automatically read `server/vercel.json` and configure it as a Serverless function.
- Add all backend `.env` variables under **Environment Variables** in Vercel.
- Deploy, copy the backend URL, and set it as `VITE_API_URL` in your frontend project.

---

## 🔒 Post-Deployment Checklist

1. **Verify Database Connectivity**:
   - Open your deployed frontend, navigate to the contact form, and send a message.
   - Access `/admin` on your production site, log in with `phulkeshwar`, and confirm you see the sent message in your Inbox tab.
2. **Verify AI Polisher**:
   - Write a draft message and click **Polish with Gemini**. Confirm the text gets refined.
3. **Verify Email Dispatch**:
   - Confirm that you receive a direct notification email in `phulkeshwarmahto9@gmail.com` when a contact form is submitted.
