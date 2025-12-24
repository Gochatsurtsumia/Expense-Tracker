const Category = require("../models/Category");

const createCategory = async (userId, name, type) => {
  const existingCategory = await Category.findOne({
    user: userId,
    name: { $regex: new RegExp(`^${name}$`, "i") },
  });

  if (existingCategory) {
    throw new Error("Category with this name already exists");
  }

  const category = await Category.create({
    user: userId,
    name,
    type,
  });

  return category;
};

const getUserCategories = async (userId) => {
  const categories = await Category.find({ user: userId }).sort({
    createdAt: -1,
  });
  return categories;
};

const updateCategory = async (categoryId, userId, updates) => {
  const category = await Category.findById(categoryId);

  if (!category) {
    throw new Error("Category not found");
  }

  if (category.user.toString() !== userId) {
    throw new Error("Not authorized to update this category");
  }

  if (updates.name) {
    const existingCategory = await Category.findOne({
      user: userId,
      name: { $regex: new RegExp(`^${updates.name}$`, "i") },
      _id: { $ne: categoryId },
    });

    if (existingCategory) {
      throw new Error("Category with this name already exists");
    }
  }

  if (updates.name) category.name = updates.name;
  if (updates.type) category.type = updates.type;

  await category.save();
  return category;
};

const deleteCategory = async (categoryId, userId) => {
  const category = await Category.findById(categoryId);

  if (!category) {
    throw new Error("Category not found");
  }

  if (category.user.toString() !== userId) {
    throw new Error("Not authorized to delete this category");
  }

  await category.deleteOne();
  return { message: "Category deleted successfully" };
};

module.exports = {
  createCategory,
  getUserCategories,
  updateCategory,
  deleteCategory,
};
