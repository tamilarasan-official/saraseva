const express = require("express");
const cors = require("cors");
require("dotenv").config();
require("./config/db"); // Initialize MySQL connection

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.get("/", (req, res) => {
  res.send("SaralSeva Backend Running");
});

app.use("/api/auth", require("./routes/auth"));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
