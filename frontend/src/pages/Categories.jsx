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
        <Link to="/categories" className="nav-link active">
          Categories
        </Link>
        <Link to="/transactions" className="nav-link">
          Transactions
        </Link>
      </nav>

      {/* Main Content */}
      <div className="content">
        <div className="content-header">
          <h2>Categories</h2>
          <button
            onClick={() => {
              setShowForm(!showForm);
              setEditingId(null);
              setFormData({ name: "", type: "expense" });
            }}
            className="btn btn-success"
          >
            {showForm ? "Cancel" : "+ Add Category"}
          </button>
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        {/* Form */}
        {showForm && (
          <div className="card">
            <h3>{editingId ? "Edit Category" : "New Category"}</h3>
            <form onSubmit={handleSubmit} className="form">
              <div className="form-group">
                <label>Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  required
                  className="form-control"
                  placeholder="e.g., Food, Transport, Salary"
                />
              </div>
              <div className="form-group">
                <label>Type</label>
                <select
                  value={formData.type}
                  onChange={(e) =>
                    setFormData({ ...formData, type: e.target.value })
                  }
                  className="form-control"
                >
                  <option value="expense">Expense</option>
                  <option value="income">Income</option>
                  <option value="both">Both</option>
                </select>
              </div>
              <button type="submit" className="btn btn-primary">
                {editingId ? "Update" : "Create"}
              </button>
            </form>
          </div>
        )}

        {/* Categories List */}
        <div className="card">
          {categories.length === 0 ? (
            <p className="no-data">
              No categories yet. Create one to get started!
            </p>
          ) : (
            <div className="table-container">
              <table className="table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Type</th>
                    <th>Created</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {categories.map((category) => (
                    <tr key={category._id}>
                      <td>{category.name}</td>
                      <td>
                        <span
                          className={`badge badge-${
                            category.type === "income"
                              ? "income"
                              : category.type === "expense"
                              ? "expense"
                              : "both"
                          }`}
                        >
                          {category.type}
                        </span>
                      </td>
                      <td>
                        {new Date(category.createdAt).toLocaleDateString()}
                      </td>
                      <td>
                        <div className="action-buttons">
                          <button
                            onClick={() => handleEdit(category)}
                            className="btn btn-sm btn-warning"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(category._id)}
                            className="btn btn-sm btn-danger"
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
      </div>
    </div>
  );
};

export default Categories;
