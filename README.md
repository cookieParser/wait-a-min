# WaitClarity

> Know the wait time before you go.

A crowd-powered platform providing real-time waiting time clarity for public places. Eliminates uncertainty by aggregating community reports and official business updates.

---

## Problem Statement

People accept waiting. They hate uncertainty.

When visiting clinics, restaurants, or government offices, the unknown wait time causes frustration and poor decision-making. WaitClarity solves this by providing real-time, crowd-sourced wait time information.

---

## Features

### For Users (No Login Required)
- **Browse by Category** - Healthcare, Restaurants, Government Offices, Service Centers
- **Real-time Wait Times** - See current estimated wait in minutes
- **Crowd Level Indicators** - Low, Medium, High based on report volume
- **AI-Powered Insights** - Smart analysis like "Peak hours" or "Busier than usual"
- **Submit Reports** - Help others by reporting your wait time

### For Businesses
- **Register Your Location** - Add your business to the platform
- **Update Wait Times** - Official updates pushed in real-time
- **Build Trust** - Transparency improves customer experience
- **Quick-Select Controls** - Update wait times in seconds

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React 18, Vite, Tailwind CSS |
| Backend | Node.js, Express.js |
| Database | MongoDB Atlas |
| Real-time | Socket.io |
| Auth | JWT, bcrypt |
| Icons | Lucide React |

---

## Project Structure

```
wait-time/
├── client/                 # React Frontend
│   ├── src/
│   │   ├── pages/          # Page components
│   │   ├── components/     # Reusable UI components
│   │   ├── lib/            # Utilities (socket, etc.)
│   │   └── index.css       # Global styles
│   └── index.html
├── server/                 # Express Backend
│   ├── controllers/        # Route handlers
│   ├── models/             # MongoDB schemas
│   ├── routes/             # API routes
│   ├── middleware/         # Auth middleware
│   ├── utils/              # AI insights logic
│   └── index.js            # Entry point
└── README.md
```

---

## Getting Started

### Prerequisites
- Node.js 18+
- MongoDB Atlas account (or local MongoDB)

### 1. Clone & Install

```bash
# Server
cd server
npm install

# Client
cd ../client
npm install
```

### 2. Environment Setup

Create `server/.env`:
```env
PORT=5000
MONGO_URI=mongodb+srv://your-connection-string
JWT_SECRET=your-secret-key-here
```

Create `client/.env` (optional):
```env
VITE_API_URL=http://localhost:5000/api
```

### 3. Run Development

```bash
# Terminal 1 - Server
cd server
npm start

# Terminal 2 - Client
cd client
npm run dev
```

### 4. Open App
- Frontend: http://localhost:5173
- API: http://localhost:5000

---

## API Endpoints

### Public
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/places` | List all places (with optional `type` filter) |
| GET | `/api/places/:id` | Get place details with insights |
| POST | `/api/reports` | Submit a wait time report |

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register business + create place |
| POST | `/api/auth/login` | Login, receive JWT token |
| GET | `/api/auth/me` | Get current user (protected) |

### Protected (Business)
| Method | Endpoint | Description |
|--------|----------|-------------|
| PUT | `/api/places/:id/official` | Update official wait time |

---

## Data Logic

### Wait Time Calculation
1. Collect reports from last 2-3 hours
2. Calculate weighted average (recent reports weighted higher)
3. Determine crowd level based on average:
   - < 15 min → Low
   - 15-45 min → Medium
   - > 45 min → High

### Confidence Level
- < 5 reports → Low confidence
- 5-10 reports → Medium confidence
- > 10 reports → High confidence

### AI Insights
Insights are generated heuristically (not ML-based, no invented data):
- Time-based patterns (peak hours for restaurants/clinics)
- Crowd level descriptions
- Data freshness indicators

---

## Deployment

### Frontend (Vercel)
```bash
cd client
npm run build
# Deploy dist/ folder to Vercel
```

### Backend (Render/Railway)
1. Push server code to GitHub
2. Connect to Render/Railway
3. Set environment variables
4. Deploy

---

## Security

- Passwords hashed with bcrypt (10 salt rounds)
- JWT tokens with 7-day expiry
- Protected routes require Bearer token
- CORS configured for production

---

## Contributing

1. Fork the repository
2. Create feature branch
3. Commit changes
4. Open pull request

---

## License

MIT License - Feel free to use for your own projects.

---

**WaitClarity** — Reducing uncertainty, one wait at a time.
