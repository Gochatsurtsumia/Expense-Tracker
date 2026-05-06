import React, { useState, useEffect } from "react";
import { transactionsAPI, categoriesAPI } from "../services/api";
import { useAuth } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    amount: "",
    type: "expense",
    category: "",
    date: new Date().toISOString().split("T")[0],
    description: "",
  });
  const [filters, setFilters] = useState({ type: "", category: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchCategories();
    fetchTransactions();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await categoriesAPI.getAll();
      setCategories(response.data.data);
    } catch (error) {
      console.error("Failed to fetch categories");
    }
  };

  const fetchTransactions = async () => {
    try {
      const response = await transactionsAPI.getAll(filters);
      setTransactions(response.data.data);
    } catch (error) {
      setError("Failed to fetch transactions");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      if (editingId) {
        await transactionsAPI.update(editingId, formData);
      } else {
        await transactionsAPI.create(formData);
      }
      setFormData({
        amount: "",
        type: "expense",
        category: "",
        date: new Date().toISOString().split("T")[0],
        description: "",
      });
      setShowForm(false);
      setEditingId(null);
      fetchTransactions();
    } catch (error) {
      setError(error.response?.data?.message || "Operation failed");
    }
  };

  const handleEdit = (transaction) => {
    setFormData({
      amount: transaction.amount,
      type: transaction.type,
      category: transaction.category._id,
      date: new Date(transaction.date).toISOString().split("T")[0],
      description: transaction.description || "",
    });
    setEditingId(transaction._id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this transaction?")) {
      try {
        await transactionsAPI.delete(id);
        fetchTransactions();
      } catch (error) {
        setError(error.response?.data?.message || "Delete failed");
      }
    }
  };

  const handleFilter = () => {
    fetchTransactions();
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const availableCategories = categories.filter(
    (cat) => cat.type === formData.type || cat.type === "both"
  );

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

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
        <Link to="/dashboard" className="nav-link">
          Dashboard
        </Link>
        <Link to="/categories" className="nav-link">
          Categories
        </Link>
        <Link to="/transactions" className="nav-link active">
          Transactions
        </Link>
      </nav>

      {/* Main Content */}
      <div className="content">
        <div className="content-header">
          <h2>Transactions</h2>
          <button
            onClick={() => {
              setShowForm(!showForm);
              setEditingId(null);
              setFormData({
                amount: "",
                type: "expense",
                category: "",
                date: new Date().toISOString().split("T")[0],
                description: "",
              });
            }}
            className="btn btn-primary"
          >
            {showForm ? "Cancel" : "+ Add Transaction"}
          </button>
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        {/* Filters */}
        <div className="card">
          <h3>Filters</h3>
          <div className="filter-grid">
            <div className="form-group">
              <label>Type</label>
              <select
                value={filters.type}
                onChange={(e) => setFilters({ ...filters, type: e.target.value })}
                className="form-control"
              >
                <option value="">All</option>
                <option value="income">Income</option>
                <option value="expense">Expense</option>
              </select>
            </div>
            <div className="form-group">
              <label>Category</label>
              <select
                value={filters.category}
                onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                className="form-control"
              >
                <option value="">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat._id} value={cat._id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
            <div style={{ display: "flex", alignItems: "flex-end" }}>
              <button onClick={handleFilter} className="filter-btn">
                Apply Filters
              </button>
            </div>
          </div>
        </div>

        {/* Form */}
        {showForm && (
          <div className="card">
            <h3>{editingId ? "Edit Transaction" : "New Transaction"}</h3>
            <form onSubmit={handleSubmit} className="form">
              <div className="form-grid">
                <div className="form-group">
                  <label>Type</label>
                  <select
                    value={formData.type}
                    onChange={(e) =>
                      setFormData({ ...formData, type: e.target.value, category: "" })
                    }
                    className="form-control"
                    required
                  >
                    <option value="expense">Expense</option>
                    <option value="income">Income</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Amount</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0.01"
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                    required
                    className="form-control"
                    placeholder="0.00"
                  />
                </div>
                <div className="form-group">
                  <label>Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="form-control"
                    required
                  >
                    <option value="">Select category</option>
                    {availableCategories.map((cat) => (
                      <option key={cat._id} value={cat._id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Date</label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    required
                    className="form-control"
                  />
                </div>
              </div>
              <div className="form-group">
                <label>Description (Optional)</label>
                <input
                  type="text"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="form-control"
                  placeholder="e.g., Lunch at restaurant"
                />
              </div>
              <button type="submit" className="btn btn-primary">
                {editingId ? "Update" : "Create"}
              </button>
            </form>
          </div>
        )}

        {/* Transactions List */}
        <div className="card">
          {transactions.length === 0 ? (
            <p className="no-data">No transactions yet. Create one to get started!</p>
          ) : (
            <div className="table-container">
              <table className="table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Type</th>
                    <th>Category</th>
                    <th>Description</th>
                    <th>Amount</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((transaction) => (
                    <tr key={transaction._id}>
                      <td>{new Date(transaction.date).toLocaleDateString()}</td>
                      <td>
                        <span className={`badge badge-${transaction.type}`}>
                          {transaction.type}
                        </span>
                      </td>
                      <td>{transaction.category.name}</td>
                      <td>{transaction.description || "-"}</td>
                      <td className={transaction.type === "income" ? "text-success font-mono font-bold" : "text-danger font-mono font-bold"}>
                        {transaction.type === "income" ? "+" : "-"}${transaction.amount}
                      </td>
                      <td>
                        <div className="action-buttons">
                          <button
                            onClick={() => handleEdit(transaction)}
                            className="btn btn-ghost btn-sm"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(transaction._id)}
                            className="btn btn-danger btn-sm"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Summary */}
        {transactions.length > 0 && (
          <div className="transaction-summary">
            <div className="summary-item">
              <strong>Total Income:</strong>
              <span className="income-amount">
                +${transactions
                  .filter((t) => t.type === "income")
                  .reduce((sum, t) => sum + t.amount, 0)
                  .toFixed(2)}
              </span>
            </div>
            <div className="summary-item">
              <strong>Total Expenses:</strong>
              <span className="expense-amount">
                -${transactions
                  .filter((t) => t.type === "expense")
                  .reduce((sum, t) => sum + t.amount, 0)
                  .toFixed(2)}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Transactions;
