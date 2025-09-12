# QuickGPT

QuickGPT is a fullstack AI-powered chat and image generation platform built with React (Vite) for the frontend and Express/MongoDB for the backend. It supports user authentication, chat management, AI text/image generation, community image sharing, and credit-based payments via Razorpay.

---

## Project Structure

```
client/    # React + Vite frontend
server/    # Express + MongoDB backend API
```

---

## Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- MongoDB Atlas or local MongoDB
- Razorpay, ImageKit, OpenAI/Gemini API keys

### Setup

#### 1. Backend

```sh
cd server
npm install
# Create .env with required keys:
# MONGODB_URI=...
# JWT_SECRET_KEY=...
# RAZORPAY_KEY_ID=...
# RAZORPAY_KEY_SECRET=...
# IMAGEKIT_PUBLIC_KEY=...
# IMAGEKIT_PRIVATE_KEY=...
# IMAGEKIT_URL_ENDPOINT=...
# GEMINI_API_KEY=...
npm start
```

#### 2. Frontend

```sh
cd client
npm install
# Create .env with:
# VITE_BACKEND_URL=http://localhost:4000
# VITE_RAZORPAY_KEY_ID=...
npm run dev
```

---

## API Endpoints

All endpoints are prefixed with `/api/`.

### User

- `POST /api/user/register` – Register new user
- `POST /api/user/login` – Login user
- `GET /api/user/data` – Get current user (auth required)
- `POST /api/user/logout` – Logout user (auth required)
- `GET /api/user/published-images` – Get published images

### Chat

- `GET /api/chat/create` – Create new chat (auth required)
- `GET /api/chat/get` – Get all chats (auth required)
- `POST /api/chat/delete` – Delete chat (auth required)

### Message

- `POST /api/message/text` – Send text message (auth required)
- `POST /api/message/image` – Generate image (auth required)

### Credits & Payments

- `GET /api/credit/plan` – Get available credit plans
- `POST /api/credit/purchase` – Initiate plan purchase (auth required)
- `POST /api/credit/create-order` – Create Razorpay order (auth required)
- `POST /api/credit/verify-order` – Verify payment and update credits (auth required)

---

## Frontend Features

- **Login/Register** – Secure authentication
- **Chat** – AI-powered text and image generation
- **Sidebar** – Recent chats, theme toggle, credits, community images
- **Credits** – Purchase credits via Razorpay
- **Community** – Browse published images
- **Dark/Light Mode** – Theme switcher

---

## Environment Variables

### Backend (`server/.env`)

```
MONGODB_URI=your_mongodb_uri
JWT_SECRET_KEY=your_jwt_secret
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
IMAGEKIT_PUBLIC_KEY=your_imagekit_public_key
IMAGEKIT_PRIVATE_KEY=your_imagekit_private_key
IMAGEKIT_URL_ENDPOINT=your_imagekit_url_endpoint
GEMINI_API_KEY=your_gemini_api_key
```

### Frontend (`client/.env`)

```
VITE_BACKEND_URL=http://localhost:3000
VITE_RAZORPAY_KEY_ID=your_razorpay_key_id
```

---

## Deployment

- **Vercel**: Both client and server have `vercel.json` for deployment.
- **Environment variables** must be set in Vercel dashboard.

---

## License

MIT

---

## Author

QuickGPT Team

