# 💰 MoneyTrail

A modern, full-stack expense tracking application with a sleek dark mode dashboard. Track your income, expenses, and visualize your spending habits with beautiful charts.

![MoneyTrail Dashboard](https://img.shields.io/badge/Status-Live-brightgreen) ![License](https://img.shields.io/badge/License-MIT-blue) ![React](https://img.shields.io/badge/React-18-61DAFB?logo=react) ![Node.js](https://img.shields.io/badge/Node.js-18+-339933?logo=node.js) ![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?logo=mongodb)

## 🌐 Live Demo

- **Frontend:** [expense-tracker013.netlify.app](https://expense-tracker013.netlify.app)
- **Backend API:** [expense-tracker-7ov4.onrender.com](https://expense-tracker-7ov4.onrender.com)

## ✨ Features

- 🔐 **User Authentication** — Secure JWT-based login and registration
- 📊 **Interactive Dashboard** — Visualize spending with pie charts and trend lines
- 💳 **Transaction Management** — Add, edit, and delete income/expenses
- 🏷️ **Custom Categories** — Create personalized categories for better organization
- 🌙 **Dark Mode UI** — Modern, eye-friendly dark theme
- 📱 **Responsive Design** — Works seamlessly on desktop and mobile
- 🔍 **Filter & Search** — Quickly find transactions by type or category

## 🛠️ Tech Stack

**Frontend:**
- React 18
- React Router v6
- Recharts (data visualization)
- Vite (build tool)
- CSS3 (custom dark theme)

**Backend:**
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT Authentication
- bcrypt (password hashing)

**Deployment:**
- Frontend: Netlify
- Backend: Render
- Database: MongoDB Atlas

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- MongoDB Atlas account (or local MongoDB)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Gochatsurtsumia/MoneyTrail.git
   cd MoneyTrail
   ```

2. **Set up the backend**
   ```bash
   cd backend
   npm install
   ```

   Create a `.env` file in the `backend` folder:
   ```env
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_secret_key
   NODE_ENV=development
   ```

   Start the backend server:
   ```bash
   npm run dev
   ```

3. **Set up the frontend**
   ```bash
   cd frontend
   npm install
   ```

   Create a `.env` file in the `frontend` folder:
   ```env
   VITE_API_URL=http://localhost:5000/api
   ```

   Start the frontend:
   ```bash
   npm run dev
   ```

4. **Open your browser**
   
   Visit `http://localhost:5173`

## 📁 Project Structure

```
MoneyTrail/
├── backend/
│   ├── src/
│   │   ├── config/        # Database configuration
│   │   ├── controllers/   # Route controllers
│   │   ├── middleware/    # Auth middleware
│   │   ├── models/        # Mongoose models
│   │   ├── routes/        # API routes
│   │   ├── services/      # Business logic
│   │   └── utils/         # Helper functions
│   ├── server.js          # Entry point
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── context/       # Auth context
│   │   ├── pages/         # Page components
│   │   ├── services/      # API service
│   │   └── App.jsx        # Main app component
│   ├── index.css          # Global styles
│   └── package.json
│
└── README.md
```

## 📡 API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | User login |
| GET | `/api/auth/me` | Get current user |

### Transactions
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/transactions` | Get all transactions |
| POST | `/api/transactions` | Create transaction |
| PUT | `/api/transactions/:id` | Update transaction |
| DELETE | `/api/transactions/:id` | Delete transaction |

### Categories
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/categories` | Get all categories |
| POST | `/api/categories` | Create category |
| PUT | `/api/categories/:id` | Update category |
| DELETE | `/api/categories/:id` | Delete category |

### Analytics
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/analytics/summary` | Get income/expense summary |
| GET | `/api/analytics/by-category` | Get spending by category |
| GET | `/api/analytics/monthly-trend` | Get monthly trends |

## 🎨 Screenshots

### Dashboard
Dark mode dashboard with summary cards and interactive charts.

### Transactions
Filter and manage all your transactions in one place.

### Categories
Create custom categories for income and expenses.

## 🤝 Contributing

Contributions are welcome! Feel free to:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.

## 👤 Author

**Gocha Tsurtsumia**
- GitHub: [@Gochatsurtsumia](https://github.com/Gochatsurtsumia)

---

⭐ Star this repo if you found it helpful!
