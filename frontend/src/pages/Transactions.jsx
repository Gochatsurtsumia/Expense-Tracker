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
    return <div style={styles.loading}>Loading...</div>;
  }

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
        <Link
          to="/transactions"
          style={{ ...styles.navLink, ...styles.activeLink }}
        >
          Transactions
        </Link>
      </div>

      {/* Main Content */}
      <div style={styles.content}>
        <div style={styles.contentHeader}>
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
            style={styles.addBtn}
          >
            {showForm ? "Cancel" : "+ Add Transaction"}
          </button>
        </div>

        {error && <div style={styles.error}>{error}</div>}

        {/* Filters */}
        <div style={styles.card}>
          <h3>Filters</h3>
          <div style={styles.filterGrid}>
            <div style={styles.formGroup}>
              <label>Type</label>
              <select
                value={filters.type}
                onChange={(e) =>
                  setFilters({ ...filters, type: e.target.value })
                }
                style={styles.input}
              >
                <option value="">All</option>
                <option value="income">Income</option>
                <option value="expense">Expense</option>
              </select>
            </div>
            <div style={styles.formGroup}>
              <label>Category</label>
              <select
                value={filters.category}
                onChange={(e) =>
                  setFilters({ ...filters, category: e.target.value })
                }
                style={styles.input}
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
              <button onClick={handleFilter} style={styles.filterBtn}>
                Apply Filters
              </button>
            </div>
          </div>
        </div>

        {/* Form */}
        {showForm && (
          <div style={styles.card}>
            <h3>{editingId ? "Edit Transaction" : "New Transaction"}</h3>
            <form onSubmit={handleSubmit} style={styles.form}>
              <div style={styles.formGrid}>
                <div style={styles.formGroup}>
                  <label>Type</label>
                  <select
                    value={formData.type}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        type: e.target.value,
                        category: "",
                      })
                    }
                    style={styles.input}
                    required
                  >
                    <option value="expense">Expense</option>
                    <option value="income">Income</option>
                  </select>
                </div>
                <div style={styles.formGroup}>
                  <label>Amount</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0.01"
                    value={formData.amount}
                    onChange={(e) =>
                      setFormData({ ...formData, amount: e.target.value })
                    }
                    required
                    style={styles.input}
                    placeholder="0.00"
                  />
                </div>
                <div style={styles.formGroup}>
                  <label>Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({ ...formData, category: e.target.value })
                    }
                    style={styles.input}
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
                <div style={styles.formGroup}>
                  <label>Date</label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) =>
                      setFormData({ ...formData, date: e.target.value })
                    }
                    required
                    style={styles.input}
                  />
                </div>
              </div>
              <div style={styles.formGroup}>
                <label>Description (Optional)</label>
                <input
                  type="text"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  style={styles.input}
                  placeholder="e.g., Lunch at restaurant"
                />
              </div>
              <button type="submit" style={styles.submitBtn}>
                {editingId ? "Update" : "Create"}
              </button>
            </form>
          </div>
        )}

        {/* Transactions List */}
        <div style={styles.card}>
          {transactions.length === 0 ? (
            <p style={styles.noData}>
              No transactions yet. Create one to get started!
            </p>
          ) : (
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Date</th>
                  <th style={styles.th}>Type</th>
                  <th style={styles.th}>Category</th>
                  <th style={styles.th}>Description</th>
                  <th style={styles.th}>Amount</th>
                  <th style={styles.th}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((transaction) => (
                  <tr key={transaction._id} style={styles.tr}>
                    <td style={styles.td}>
                      {new Date(transaction.date).toLocaleDateString()}
                    </td>
                    <td style={styles.td}>
                      <span
                        style={{
                          ...styles.badge,
                          backgroundColor:
                            transaction.type === "income"
                              ? "#d4edda"
                              : "#f8d7da",
                          color:
                            transaction.type === "income"
                              ? "#155724"
                              : "#721c24",
                        }}
                      >
                        {transaction.type}
                      </span>
                    </td>
                    <td style={styles.td}>{transaction.category.name}</td>
                    <td style={styles.td}>{transaction.description || "-"}</td>
                    <td
                      style={{
                        ...styles.td,
                        fontWeight: "bold",
                        color:
                          transaction.type === "income" ? "#28a745" : "#dc3545",
                      }}
                    >
                      {transaction.type === "income" ? "+" : "-"}$
                      {transaction.amount}
                    </td>
                    <td style={styles.td}>
                      <button
                        onClick={() => handleEdit(transaction)}
                        style={styles.editBtn}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(transaction._id)}
                        style={styles.deleteBtn}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Summary */}
        {transactions.length > 0 && (
          <div style={styles.summary}>
            <div style={styles.summaryItem}>
              <strong>Total Income:</strong>{" "}
              <span style={{ color: "#28a745" }}>
                +$
                {transactions
                  .filter((t) => t.type === "income")
                  .reduce((sum, t) => sum + t.amount, 0)
                  .toFixed(2)}
              </span>
            </div>
            <div style={styles.summaryItem}>
              <strong>Total Expenses:</strong>{" "}
              <span style={{ color: "#dc3545" }}>
                -$
                {transactions
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
