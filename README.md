# 🌌 Stunning Interactive 3D Scroll Portfolio

A state-of-the-art, single-page, scroll-driven 3D portfolio and professional dashboard built with the **MERN Stack** (MongoDB, Express, React, Node.js), powered by **React Three Fiber (Three.js)** and animated with **GSAP ScrollTrigger**.

This website showcases academic achievements, professional milestones, technical expertise, and personal project showcases with breathtaking visuals and smooth interactive elements.

---

## 🚀 Key Features

### 1. **Cinematic 3D Interactive Background**
- **NASA Earth Globe**: High-resolution NASA textures, bump mapping, specular lighting, cloud overlay rotation, and an atmospheric glow shader.
- **Node-Particle Wireframe Network**: A coexisting cluster of 180 active particles bouncing inside a bounding box with real-time distance calculations for network connection lines.
- **Clipping Prevention**: Physics collision math that pushes floating nodes away from the Earth’s atmosphere to prevent mesh clipping.
- **Super-Responsive Parallax**: Camera positions respond instantly to mouse coordinates with dynamic lerp tracking (`0.06` speed) and custom Earth tilt.

### 2. **GSAP ScrollTrigger Animation Suite**
- **Dynamic Scroll Reveals**: Sections float in one-by-one with staggered entrance overlays.
- **3D Alternating Project Rotations**: Projects fly in from alternating viewport sides with clean `rotateY` transforms.
- **Back-Easing Skills Tags**: Technology pills stagger in with playful elastic eases.
- **Animated Counter Cards**: Stat badges count up dynamically from zero when scrolled into view.

### 3. **🎨 Curated Featured Showcase & Dedicated Projects Sandbox (`/projects`)**
- **Featured Homepage Grid**: Displays top 6 featured enterprise & hackathon builds (*GramBazaar*, *Call.io*, *MedScribe AI*, *NIAMT Racing*, *Striver DSA Tracker*).
- **Glassmorphic "See More Projects" CTA**: Smooth transition leading to the full project repository.
- **Full Showcase Page (`/projects`)**: Dedicated sandbox page listing all 17 projects with:
  - **Instant Search**: Search by project title, description, or technology stack in real time.
  - **Category Filtering**: Filter across `All`, `Full-Stack`, `React`, `Utilities`, and `Calculators`.
  - **3D Styling & GSAP Stagger**: Seamless integration with the 3D canvas and dynamic card entry animations.
  - **Back-to-Portfolio Navigation**: Quick return button to main portfolio sections.

### 4. **📄 High-Resolution Resume Integration**
- Embedded direct download for `PhulkeshwarResume.pdf` (downloadable as `Phulkeshwar_Mahto_Resume.pdf`) across the homepage About section and dedicated `/about` route.

### 5. **✉️ Direct Contact Form & Nodemailer Dispatch**
- **Direct Mailer**: A modern glassmorphic contact form that automatically stores messages in MongoDB and immediately dispatches a direct report notification to the administrator’s inbox using Nodemailer.
- **✨ Gemini AI Message Polisher**: A custom integrated AI tool that allows visitors to submit their rough drafts, sending them to the Gemini API (`/api/ai/improve-message`) to professionally polish and rewrite their message before sending.

### 6. **🔒 Glassmorphic Admin Command Center (`/admin`)**
- Secure administrative route accessible at `/admin`.
- Authenticates using custom administrator credentials with JWT tokens.
- **Dynamic Project CRUD**: View all projects, add new ones (supporting title, badge, links, tech stack), edit existing ones, or delete them. Includes automated DB seeding utilities (`seed-all-projects.js`).
- **Dynamic Skills CRUD**: Add skill entries (category selects, devicon tracking, competency level), edit, or remove entries.
- **Inbox Reader & Direct Email Dispatch**: View incoming contact reports and send direct email replies directly from the dashboard via Nodemailer.

---

## 🛠️ Technical Architecture

### Frontend
- **React (Vite)**: Core framework.
- **React Three Fiber & Drei**: 3D scene construction and animation hooks.
- **GSAP & ScrollTrigger**: Custom scroll timelines and easing structures.
- **Tailwind CSS & Custom Vanilla CSS**: Clean glassmorphism cards, animated Availability rings, text flips (`vertical-lr`), and glowing overlays.
- **Lucide Icons & Devicon**: Premium SVG iconography and technology-specific vector logos.

### Backend
- **Node.js & Express**: High-speed REST API servers.
- **MongoDB & Mongoose**: Flexible NoSQL modeling for dynamic projects, skills, and inbox records.
- **Nodemailer**: Automated notification emails.
- **Gemini Pro (Google Generative AI)**: Context-aware draft improvement model.
- **JWT (JSON Web Tokens) & Bcrypt**: Authenticating admin operations.

---

## 📂 Project Structure

```bash
MyPortfolio/
├── client/              # React (Vite) Frontend
│   ├── src/
│   │   ├── components/  # Reusable UI & 3D Components (ThreeBackground, ProjectsSection, etc.)
│   │   ├── data/        # Shared static data repositories (projects.js)
│   │   ├── pages/       # Page components (Home, Projects, Dashboard)
│   │   ├── index.css    # CSS design system (Glassmorphism, availability rings)
│   │   └── App.jsx      # Route switches & GSAP ScrollTrigger configs
│   └── ...
├── server/              # Express REST API Backend
│   ├── models/          # MongoDB Schema models (User, Project, Skill, Contact)
│   ├── controllers/     # Request controllers (aiController, authController, etc.)
│   ├── utils/           # Nodemailer and Gemini integrations (sendEmail, gemini)
│   └── server.js        # Server initialization & Express application pipeline
└── ...
```

---

## 🔧 Installation & Configuration

### Prerequisites
- **Node.js** (v18 or higher recommended)
- **MongoDB** (Local instance or MongoDB Atlas Connection String)

### Step 1: Clone and Install Dependencies

1. Clone the repository:
   ```bash
   git clone https://github.com/phulkeshwar/3DPortfolio.git
   cd 3DPortfolio
   ```
2. Install frontend dependencies:
   ```bash
   cd client
   npm install
   ```
3. Install backend dependencies:
   ```bash
   cd ../server
   npm install
   ```

### Step 2: Configure Environment Files

1. Create a `.env` file in the `server` directory:
   ```env
   PORT=5001
   MONGO_URI=your_mongodb_atlas_connection_string
   JWT_SECRET=your_super_secret_jwt_key
   
   # Direct Mailer Configuration
   EMAIL_SERVICE=gmail
   EMAIL_USER=phulkeshwarmahto9@gmail.com
   EMAIL_PASS=your_gmail_app_password
   
   # AI Integration
   GEMINI_API_KEY=your_gemini_api_key
   
   # Deployment URLs (Optional)
   BACKEND_URL=http://localhost:5001/
   CLIENT_URL=http://localhost:5174
   ```

*(Note: `.env` is ignored by git to protect your keys and secrets).*

### Step 3: Run the Application

1. **Start the REST API Backend** (runs on port `5001`):
   ```bash
   cd server
   npm run dev
   ```
2. **Start the Frontend Client** (runs on port `5174`):
   ```bash
   cd client
   npm run dev
   ```
3. Access the site in your browser at **`http://localhost:5174`** and the Admin Command Center at **`http://localhost:5174/admin`**.

---

## 🛡️ Admin Access
To manage showcase content dynamically, head to **`/admin`** and log in with your credentials:
- **Username**: `phulkeshwar`
- **Password**: `phulkeshwar@828403`

On successful authentication, the server dynamically creates your verified admin user record in the MongoDB database, returning an authenticated JWT token to authenticate all subsequent CRUD actions.

---

*Built with ❤️ by Phulkeshwar Mahto*
