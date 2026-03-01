# 📊 Dynamic Portfolio Dashboard

A full-stack real-time stock portfolio dashboard built using **React (TypeScript) + Node.js + Express**, integrated with **Yahoo Finance** for live financial data.

---

## 🚀 Features

- 📈 Real-time CMP (Current Market Price)
- 💰 Investment, Present Value, Gain/Loss auto-calculated
- 📊 Sector-wise grouping with summaries
- 📉 Sector Allocation Pie Chart
- 📊 Sector Gain/Loss Bar Chart
- 🔁 Auto-refresh every 15 seconds
- ⚡ Backend caching for performance
- 🛡 Proper error handling
- 🌐 Render deployment ready

---

## 🏗 Tech Stack

### Frontend
- React + TypeScript
- Tailwind CSS
- Recharts
- Axios

### Backend
- Node.js
- Express.js
- yahoo-finance2
- NodeCache
- Axios

---

## 📂 Project Structure

```
project-root/
│
├── backend/
│   ├── server.js
│   ├── package.json
│   └── data/
│       └── portfolio.json
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── services/
│   │   └── types/
│   ├── package.json
│   └── .env
│
└── README.md
```

---

## ⚙️ Environment Variables

### Backend (.env)

```
PORT=5000
CLIENT_URL=http://localhost:5173
```

### Frontend (.env)

```
VITE_API_URL=http://localhost:5000
```

---

## 🔄 Data Flow Architecture

```
Yahoo Finance API
        ↓
Backend (Express + Caching + Calculations)
        ↓
REST API (/api/portfolio)
        ↓
React Hook (usePortfolio)
        ↓
Dashboard Components
```

---

## 🧠 Backend Responsibilities

- Fetch CMP, PE Ratio, EPS from Yahoo Finance
- Calculate:
  - Investment
  - Present Value
  - Gain/Loss
  - Gain %
  - Portfolio %
- Generate sector summary
- Cache API responses
- Return structured aggregated JSON

---

## 🖥 Frontend Responsibilities

- Display summary cards
- Render sector charts
- Show portfolio table
- Auto-refresh data every 15 seconds
- Handle loading & error states safely

---

## 📦 API Response Format

```json
{
  "totalInvestment": 500000,
  "totalPresentValue": 545000,
  "totalGainLoss": 45000,
  "stocks": [],
  "sectorSummary": {}
}
```

---

## 🔁 Auto Refresh Logic

```
setInterval(() => {
  loadData(false)
}, 15000)
```

---

## ⚡ Performance Optimizations

- In-memory caching (NodeCache)
- Aggregation moved to backend
- Defensive rendering
- Optimized re-renders
- Silent background refresh

---

## 🛡 Error Handling Strategy

### Backend
- try/catch for API calls
- Fallback values if API fails
- Safe numeric formatting

### Frontend
- Loading spinner
- Error message UI
- Default states to prevent crashes

---

## 🌐 Deployment

### Backend (Render)

- Connect GitHub repository
- Set environment variables
- Use `npm start`
- Ensure server uses `process.env.PORT`

### Frontend (Vercel / Netlify)

- Set `VITE_API_URL` to deployed backend URL
- Build and deploy

---

## 🧩 Technical Challenges & Solutions

### 1. No Official Yahoo API
Used `yahoo-finance2` unofficial library with proper error handling.

### 2. Rate Limiting
Implemented in-memory caching.

### 3. Data Transformation
Moved all financial calculations to backend.

### 4. Real-Time Updates
Implemented polling using setInterval.

### 5. Preventing UI Crashes
Used defensive programming and safe state defaults.

---

## 🧪 How to Run Locally

### Backend

```
cd backend
npm install
npm run dev
```

### Frontend

```
cd frontend
npm install
npm run dev
```

---

## 🎯 Production Readiness

- Clean architecture
- Backend aggregation logic
- API optimization
- Deployment configuration
- Error-safe UI
- Scalable structure

---

## 👨‍💻 Author

Dibya Ranjan  
Frontend Developer

---

## 📄 License

This project is for educational and demonstration purposes.