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
    return <div className="loading">Loading dashboard...</div>;
  }

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"];

  return (
    <div className="page-container">
      {/* Header */}
      <div className="header">
        <h1>Expense Tracker</h1>
        <div className="header-right">
          <span className="username">Welcome, {user?.name}</span>
          <button onClick={handleLogout} className="logout-btn">
            Logout
          </button>
        </div>
      </div>

      {/* Navigation */}
      <nav className="nav">
        <Link to="/dashboard" className="nav-link active">
          Dashboard
        </Link>
        <Link to="/categories" className="nav-link">
          Categories
        </Link>
        <Link to="/transactions" className="nav-link">
          Transactions
        </Link>
      </nav>

      {/* Summary Cards */}
      <div className="summary-grid">
        <div className="summary-card income">
          <h3>Total Income</h3>
          <p className="amount">${summary?.totalIncome || 0}</p>
          <small>{summary?.incomeCount || 0} transactions</small>
        </div>
        <div className="summary-card expense">
          <h3>Total Expenses</h3>
          <p className="amount">${summary?.totalExpense || 0}</p>
          <small>{summary?.expenseCount || 0} transactions</small>
        </div>
        <div className="summary-card savings">
          <h3>Net Savings</h3>
          <p className="amount">${summary?.netSavings || 0}</p>
          <small>Income - Expenses</small>
        </div>
      </div>

      {/* Charts */}
      <div className="charts-grid">
        {/* Spending by Category */}
        <div className="chart-card">
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
            <p className="no-data">No expense data available</p>
          )}
        </div>

        {/* Monthly Trend */}
        <div className="chart-card">
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
            <p className="no-data">No trend data available</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
