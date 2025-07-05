const express = require("express");
const cors = require("cors");
const app = express();
const adminRoutes = require("./routes/adminRoutes");

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/admin", adminRoutes);
const productRoutes = require("./routes/productRoutes");
app.use("/api/products", productRoutes);  // 👈 THIS enables /api/products/add

const PORT = 5000;
app.listen(PORT, () => console.log(`🚀 Server running at http://localhost:${PORT}`));
