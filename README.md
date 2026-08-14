# Fashion Studio AI – Frontend

Next.js 15 frontend for the AI Fashion Design Platform. Connects to the FastAPI backend via REST API.

## 📁 Folder Structure
fashion-frontend/
├── .env.local.example
├── next.config.js
├── package.json
├── postcss.config.js
├── tailwind.config.js
├── tsconfig.json
├── middleware.ts
├── README.md
└── src/
    ├── app/
    │   ├── api/
    │   │   └── auth/
    │   │       └── session/
    │   │           └── route.ts
    │   ├── dashboard/
    │   │   └── page.tsx
    │   ├── studio/
    │   │   └── [id]/
    │   │       └── page.tsx
    │   ├── globals.css
    │   ├── layout.tsx
    │   └── page.tsx
    ├── components/
    │   ├── auth/
    │   │   ├── FirebaseAuthProvider.tsx
    │   │   └── LoginForm.tsx
    │   ├── canvas/
    │   │   ├── InfiniteCanvas.tsx
    │   │   ├── LayerPanel.tsx
    │   │   └── Toolbar.tsx
    │   ├── chat/
    │   │   └── AIChatSidebar.tsx
    │   └── ui/
    │       ├── button.tsx
    │       ├── card.tsx
    │       ├── dialog.tsx
    │       └── input.tsx
    ├── lib/
    │   ├── api/
    │   │   └── client.ts
    │   ├── firebase/
    │   │   ├── admin.ts
    │   │   └── client.ts
    │   └── store/
    │       └── canvasStore.ts
    └── public/
        └── videos/
            └── preview.mp4


## 🚀 How to Run

### Prerequisites
- Node.js 20+
- Firebase project (Email/Password enabled)
- FastAPI backend running (see backend README)

### Setup
1. Copy `.env.local.example` to `.env.local`
2. Fill in Firebase Client keys and Backend URL
3. Install dependencies:
   ```bash
   npm install

4. Run development server:
   ```bash
   npm run dev

Open http://localhost:3000

5. Deploy to Vercel
    ```bash
    vercel deploy

Set all environment variables in Vercel dashboard.

🎯 Feature Explanations
1. Infinite Canvas (React-Konva)
Pan/Zoom: Scroll to zoom, drag to pan

Layer Selection: Click any shape to select

Transform: Resize/rotate selected layer with handles

Drag: Move layers freely on the canvas

2. Undo/Redo (History Stack)
Zustand middleware tracks every mutation

Each action pushes a deep-cloned snapshot to history

Keyboard shortcuts: Ctrl+Z / Ctrl+Y

Why: Designers need non-linear editing to experiment freely

3. Layer Panel
Z-Index Reorder: Drag layers up/down using grip handle

Visibility Toggle: Show/hide layers (👁/👁‍🗨)

Lock/Unlock: Prevent accidental edits (🔒/🔓)

Quick Actions: Duplicate & Delete on hover

Why: Essential for complex fashion compositions with multiple elements

4. AI Chat Assistant
Natural language interface to the canvas

Sends user message + layer data to FastAPI backend

Executes returned actions (color change, duplicate, generate image)

Why: Lowers the barrier for non-technical fashion designers

5. Auto-Save
Debounced 5-second save to PostgreSQL

Saves the entire canvas state (layers, positions, colors)

Visual indicator shows "Saving..." / "Auto-saved"

Why: Prevents data loss and feels seamless

6. Authentication (Firebase)
Email/Password + Google OAuth

Session cookies (httpOnly, 5-day expiry)

Middleware protects /dashboard and /studio/*

Why: Secure multi-user platform

7. Project Gallery
Grid view of all user projects

Thumbnail previews (auto-generated from canvas)

Click to open in studio

"New Project" creates blank canvas

Why: Essential for retention and organization

🔗 API Client
All backend calls go through src/lib/api/client.ts:

Automatically attaches Firebase ID token as Bearer token

Points to NEXT_PUBLIC_BACKEND_URL

Throws detailed errors from FastAPI responses

Supports all HTTP methods (GET, POST, PATCH, DELETE)

Next Steps: After running, visit /dashboard to see your projects or create a new design. The canvas will auto-save every 5 seconds to your FastAPI backend.