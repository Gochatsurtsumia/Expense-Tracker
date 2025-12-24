import React, { useState, useEffect } from "react";
import { categoriesAPI } from "../services/api";
import { useAuth } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ name: "", type: "expense" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await categoriesAPI.getAll();
      setCategories(response.data.data);
    } catch (error) {
      setError("Failed to fetch categories");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      if (editingId) {
        await categoriesAPI.update(editingId, formData);
      } else {
        await categoriesAPI.create(formData);
      }
      setFormData({ name: "", type: "expense" });
      setShowForm(false);
      setEditingId(null);
      fetchCategories();
    } catch (error) {
      setError(error.response?.data?.message || "Operation failed");
    }
  };

  const handleEdit = (category) => {
    setFormData({ name: category.name, type: category.type });
    setEditingId(category._id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this category?")) {
      try {
        await categoriesAPI.delete(id);
        fetchCategories();
      } catch (error) {
        setError(error.response?.data?.message || "Delete failed");
      }
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

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
        <Link
          to="/categories"
          style={{ ...styles.navLink, ...styles.activeLink }}
        >
          Categories
        </Link>
        <Link to="/transactions" style={styles.navLink}>
          Transactions
        </Link>
      </div>

      {/* Main Content */}
      <div style={styles.content}>
        <div style={styles.contentHeader}>
          <h2>Categories</h2>
          <button
            onClick={() => {
              setShowForm(!showForm);
              setEditingId(null);
              setFormData({ name: "", type: "expense" });
            }}
            style={styles.addBtn}
          >
            {showForm ? "Cancel" : "+ Add Category"}
          </button>
        </div>

        {error && <div style={styles.error}>{error}</div>}

        {/* Form */}
        {showForm && (
          <div style={styles.card}>
            <h3>{editingId ? "Edit Category" : "New Category"}</h3>
            <form onSubmit={handleSubmit} style={styles.form}>
              <div style={styles.formGroup}>
                <label>Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  required
                  style={styles.input}
                  placeholder="e.g., Food, Transport, Salary"
                />
              </div>
              <div style={styles.formGroup}>
                <label>Type</label>
                <select
                  value={formData.type}
                  onChange={(e) =>
                    setFormData({ ...formData, type: e.target.value })
                  }
                  style={styles.input}
                >
                  <option value="expense">Expense</option>
                  <option value="income">Income</option>
                  <option value="both">Both</option>
                </select>
              </div>
              <button type="submit" style={styles.submitBtn}>
                {editingId ? "Update" : "Create"}
              </button>
            </form>
          </div>
        )}

        {/* Categories List */}
        <div style={styles.card}>
          {categories.length === 0 ? (
            <p style={styles.noData}>
              No categories yet. Create one to get started!
            </p>
          ) : (
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Name</th>
                  <th style={styles.th}>Type</th>
                  <th style={styles.th}>Created</th>
                  <th style={styles.th}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {categories.map((category) => (
                  <tr key={category._id} style={styles.tr}>
                    <td style={styles.td}>{category.name}</td>
                    <td style={styles.td}>
                      <span
                        style={{
                          ...styles.badge,
                          backgroundColor:
                            category.type === "income"
                              ? "#d4edda"
                              : category.type === "expense"
                              ? "#f8d7da"
                              : "#d1ecf1",
                          color:
                            category.type === "income"
                              ? "#155724"
                              : category.type === "expense"
                              ? "#721c24"
                              : "#0c5460",
                        }}
                      >
                        {category.type}
                      </span>
                    </td>
                    <td style={styles.td}>
                      {new Date(category.createdAt).toLocaleDateString()}
                    </td>
                    <td style={styles.td}>
                      <button
                        onClick={() => handleEdit(category)}
                        style={styles.editBtn}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(category._id)}
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
  },
  activeLink: {
    backgroundColor: "#007bff",
    color: "white",
  },
  content: {
    backgroundColor: "white",
    padding: "2rem",
    borderRadius: "8px",
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
  },
  contentHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "2rem",
  },
  addBtn: {
    padding: "0.75rem 1.5rem",
    backgroundColor: "#28a745",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "1rem",
  },
  card: {
    backgroundColor: "#f8f9fa",
    padding: "1.5rem",
    borderRadius: "8px",
    marginBottom: "1.5rem",
  },
  form: {
    marginTop: "1rem",
  },
  formGroup: {
    marginBottom: "1rem",
  },
  input: {
    width: "100%",
    padding: "0.5rem",
    border: "1px solid #ddd",
    borderRadius: "4px",
    fontSize: "1rem",
    marginTop: "0.25rem",
  },
  submitBtn: {
    padding: "0.75rem 1.5rem",
    backgroundColor: "#007bff",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "1rem",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
  },
  th: {
    textAlign: "left",
    padding: "1rem",
    borderBottom: "2px solid #dee2e6",
    fontWeight: "600",
  },
  tr: {
    borderBottom: "1px solid #dee2e6",
  },
  td: {
    padding: "1rem",
  },
  badge: {
    padding: "0.25rem 0.75rem",
    borderRadius: "12px",
    fontSize: "0.875rem",
    fontWeight: "500",
  },
  editBtn: {
    padding: "0.5rem 1rem",
    backgroundColor: "#ffc107",
    color: "#000",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    marginRight: "0.5rem",
  },
  deleteBtn: {
    padding: "0.5rem 1rem",
    backgroundColor: "#dc3545",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
  error: {
    backgroundColor: "#f8d7da",
    color: "#721c24",
    padding: "1rem",
    borderRadius: "4px",
    marginBottom: "1rem",
  },
  noData: {
    textAlign: "center",
    color: "#666",
    padding: "2rem",
  },
  loading: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "100vh",
    fontSize: "1.5rem",
  },
};

export default Categories;
