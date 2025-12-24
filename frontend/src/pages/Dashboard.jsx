import React, { useState, useEffect } from "react";
import { analyticsAPI } from "../services/api";
import {
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { useAuth } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";

const Dashboard = () => {
  const [summary, setSummary] = useState(null);
  const [categoryData, setCategoryData] = useState([]);
  const [trendData, setTrendData] = useState([]);
  const [loading, setLoading] = useState(true);

  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [summaryRes, categoryRes, trendRes] = await Promise.all([
        analyticsAPI.getSummary(),
        analyticsAPI.getByCategory({ type: "expense" }),
        analyticsAPI.getMonthlyTrend({ months: 6 }),
      ]);

      setSummary(summaryRes.data.data);
      setCategoryData(categoryRes.data.data);
      setTrendData(trendRes.data.data);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  if (loading) {
    return <div style={styles.loading}>Loading dashboard...</div>;
  }

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"];

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <h1>Expense Tracker</h1>
        <div style={styles.headerRight}>
          <span style={styles.username}>Welcome, {user?.name}</span>
          <button onClick={handleLogout} style={styles.logoutBtn}>
            Logout
          </button>
        </div>
      </div>

      {/* Navigation */}
      <div style={styles.nav}>
        <Link to="/dashboard" style={styles.navLink}>
          Dashboard
        </Link>
        <Link to="/categories" style={styles.navLink}>
          Categories
        </Link>
        <Link to="/transactions" style={styles.navLink}>
          Transactions
        </Link>
      </div>

      {/* Summary Cards */}
      <div style={styles.summaryGrid}>
        <div style={{ ...styles.card, ...styles.incomeCard }}>
          <h3>Total Income</h3>
          <p style={styles.amount}>${summary?.totalIncome || 0}</p>
          <small>{summary?.incomeCount || 0} transactions</small>
        </div>
        <div style={{ ...styles.card, ...styles.expenseCard }}>
          <h3>Total Expenses</h3>
          <p style={styles.amount}>${summary?.totalExpense || 0}</p>
          <small>{summary?.expenseCount || 0} transactions</small>
        </div>
        <div style={{ ...styles.card, ...styles.savingsCard }}>
          <h3>Net Savings</h3>
          <p style={styles.amount}>${summary?.netSavings || 0}</p>
          <small>Income - Expenses</small>
        </div>
      </div>

      {/* Charts */}
      <div style={styles.chartsGrid}>
        {/* Spending by Category */}
        <div style={styles.card}>
          <h3>Spending by Category</h3>
          {categoryData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryData}
                  dataKey="total"
                  nameKey="category"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label={(entry) => `${entry.category}: ${entry.percentage}%`}
                >
                  {categoryData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <p style={styles.noData}>No expense data available</p>
          )}
        </div>

        {/* Monthly Trend */}
        <div style={styles.card}>
          <h3>Monthly Trend</h3>
          {trendData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="income"
                  stroke="#00C49F"
                  strokeWidth={2}
                />
                <Line
                  type="monotone"
                  dataKey="expense"
                  stroke="#FF8042"
                  strokeWidth={2}
                />
                <Line
                  type="monotone"
                  dataKey="net"
                  stroke="#0088FE"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <p style={styles.noData}>No trend data available</p>
          )}
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    padding: "1rem",
    maxWidth: "1400px",
    margin: "0 auto",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "2rem",
    padding: "1rem",
    backgroundColor: "white",
    borderRadius: "8px",
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
  },
  headerRight: {
    display: "flex",
    alignItems: "center",
    gap: "1rem",
  },
  username: {
    fontWeight: "500",
  },
  logoutBtn: {
    padding: "0.5rem 1rem",
    backgroundColor: "#dc3545",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
  nav: {
    display: "flex",
    gap: "1rem",
    marginBottom: "2rem",
    padding: "1rem",
    backgroundColor: "white",
    borderRadius: "8px",
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
  },
  navLink: {
    padding: "0.5rem 1rem",
    textDecoration: "none",
    color: "#007bff",
    borderRadius: "4px",
    transition: "background-color 0.2s",
  },
  summaryGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
    gap: "1rem",
    marginBottom: "2rem",
  },
  card: {
    backgroundColor: "white",
    padding: "1.5rem",
    borderRadius: "8px",
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
  },
  incomeCard: {
    borderLeft: "4px solid #00C49F",
  },
  expenseCard: {
    borderLeft: "4px solid #FF8042",
  },
  savingsCard: {
    borderLeft: "4px solid #0088FE",
  },
  amount: {
    fontSize: "2rem",
    fontWeight: "bold",
    margin: "0.5rem 0",
  },
  chartsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))",
    gap: "1rem",
  },
  loading: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "100vh",
    fontSize: "1.5rem",
  },
  noData: {
    textAlign: "center",
    color: "#666",
    padding: "2rem",
  },
};

export default Dashboard;
