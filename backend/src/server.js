require("dotenv").config();
const express = require("express");
const connectDB = require("./config/db");

const app = express();
connectDB();
const cors = require("cors");

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/categories", require("./routes/categoryRoutes"));
app.use("/api/transactions", require("./routes/transactionRoutes"));
app.use("/api/analytics", require("./routes/analyticsRoutes"));

app.get("/", (req, res) => {
  res.json({ message: "api is running" });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`server runs on ${PORT}`);
});
