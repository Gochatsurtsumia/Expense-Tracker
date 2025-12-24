const User = require("../models/User");
const { hashPassword, comparePassword } = require("../utils/hashPassword");
const generateToken = require("../utils/generateToken");

const registerUser = async (name, email, password) => {
  const userExists = await User.findOne({ email });
  if (userExists) {
    throw new Error("User already exists with this email");
  }

  const hashedPassword = await hashPassword(password);

  const user = await User.create({
    name,
    email,
    password: hashedPassword,
  });

  const token = generateToken(user._id);

  return {
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
    },
    token,
  };
};

const loginUser = async (email, password) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error("Invalid email or password");
  }
  const isMatch = await comparePassword(password, user.password);
  if (!isMatch) {
    throw new Error("Invalid email or password");
  }

  const token = generateToken(user._id);

  return {
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
    },
    token,
  };
};

module.exports = { registerUser, loginUser };
