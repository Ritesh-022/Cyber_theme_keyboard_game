# CYBERTYPE

Cyber-Tradition aesthetic keyboard typing game with full auth + social system.

## Stack
- **Backend**: Node.js, Express, MongoDB, JWT
- **Frontend**: React, React Router

## Setup

### Backend
```bash
cd backend
npm install
# Fill in .env values
npm run dev
```

### Frontend
```bash
cd frontend
npm install
npm start
```

## .env (backend)
```
MONGO_URI=mongodb://localhost:27017/cybertype
JWT_SECRET=your_secret_here
FRONTEND_URL=http://localhost:3000
```

## Time-Based Themes
| Time | Theme | Color |
|------|-------|-------|
| 5–8am | Dawn Protocol | Amber |
| 9–4pm | Day Cycle | Cyan |
| 5–7pm | Dusk Shift | Purple |
| 8pm–4am | Night Mode | Neon Green |

## API Routes
| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| POST | /auth/signup | ❌ | Email signup |
| POST | /auth/login | ❌ | Email login |
| GET | /user/me | ✅ | Get own profile |
| GET | /user/search?q= | ✅ | Search users |
| POST | /user/friend-request | ✅ | Send friend request |
| POST | /user/friend-accept | ✅ | Accept friend request |
| POST | /user/stats | ✅ | Update MPM/accuracy |
