const {
  createCategory,
  getUserCategories,
  updateCategory,
  deleteCategory,
} = require("../services/categoryService");

const create = async (req, res) => {
  try {
    const { name, type } = req.body;

    if (!name || !type) {
      return res.status(400).json({
        success: false,
        message: "Please provide name and type",
      });
    }

    const category = await createCategory(req.user.id, name, type);

    res.status(201).json({
      success: true,
      data: category,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

const getAll = async (req, res) => {
  try {
    const categories = await getUserCategories(req.user.id);

    res.status(200).json({
      success: true,
      count: categories.length,
      data: categories,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const update = async (req, res) => {
  try {
    const { name, type } = req.body;

    if (!name && !type) {
      return res.status(400).json({
        success: false,
        message: "Please provide at least name or type to update",
      });
    }

    const category = await updateCategory(req.params.id, req.user.id, {
      name,
      type,
    });

    res.status(200).json({
      success: true,
      data: category,
    });
  } catch (error) {
    const statusCode = error.message.includes("Not authorized") ? 403 : 400;
    res.status(statusCode).json({
      success: false,
      message: error.message,
    });
  }
};

const remove = async (req, res) => {
  try {
    const result = await deleteCategory(req.params.id, req.user.id);

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    const statusCode = error.message.includes("Not authorized") ? 403 : 400;
    res.status(statusCode).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = { create, getAll, update, remove };
