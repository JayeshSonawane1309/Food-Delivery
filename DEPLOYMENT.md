# Deployment Guide (Render)

This project is now configured for deployment on Render. Since this is a full-stack application with three parts (Backend, Frontend, Admin), follow these steps to deploy each service.

## 1. Backend (Web Service)
- **Root Directory:** `backend`
- **Environment:** `Node`
- **Build Command:** `npm install`
- **Start Command:** `node server.js` (or `npm start`)
- **Required Environment Variables:**
  - `PORT`: 4000 (Render sets this automatically, but you can specify)
  - `MONGODB_URI`: Your MongoDB connection string
  - `JWT_SECRET`: A random secret string
  - `STRIPE_SECRET_KEY`: Your Stripe secret key
  - `SENDGRID_API_KEY`: Your SendGrid API key
  - `SENDER_EMAIL`: Your verified SendGrid sender email

## 2. Frontend (Static Site)
- **Root Directory:** `frontend`
- **Build Command:** `npm install && npm run build`
- **Publish Directory:** `dist`
- **Required Environment Variables:**
  - `VITE_BACKEND_URL`: The URL of your deployed Backend service (e.g., `https://your-backend.onrender.com`)

## 3. Admin (Static Site)
- **Root Directory:** `admin`
- **Build Command:** `npm install && npm run build`
- **Publish Directory:** `dist`
- **Required Environment Variables:**
  - `VITE_BACKEND_URL`: The URL of your deployed Backend service (e.g., `https://your-backend.onrender.com`)

## 4. Important: Handling Routing (Redirects)
Since this project uses **React Router**, you must configure Render's Static Sites correctly. Otherwise, if you refresh the page on `/cart` or `/myorders`, you will get a 404 error.
- Go to your Frontend and Admin settings on Render.
- Find the **Redirects/Rewrites** section.
- Add a new rule:
  - **Source:** `/*`
  - **Destination:** `/index.html`
  - **Action:** `Rewrite`

---

### Security & File Cleanup
- I have added a `.gitignore` file in the root. This ensures that your `.env` (secrets) and the large `node_modules` folder are **not** pushed to GitHub. Make sure your GitHub repository remains private if you keep any sensitive data.
- **Local Development:** If the app stops working locally, ensure you have the `.env` files in `frontend/`, `admin/`, and `backend/`. I have created these for you with `localhost:4000` defaults.

### Important Notes for Free Tier
- **Images:** The current system stores food images in the local `backend/uploads` folder. On Render's free tier, these files are deleted every time the server restarts. For a permanent solution, consider switching to a service like **Cloudinary** for image storage.
- **Spin-up Time:** Free services on Render "sleep" after inactivity. The first request to the backend might take 30-60 seconds to wake up.
