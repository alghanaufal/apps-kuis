const express = require("express"); // import module express
const mongoose = require("mongoose"); // import module mongoose untuk koneksi dengna mongod
const bcrypt = require("bcrypt"); // import module bcrypt untuk mengenkripsi password
const jwt = require("jsonwebtoken"); // import module jwt untuk autentikasi berbasis token
const cors = require("cors"); // middleware untuk mengatur cross origin resource sharing
const fetch = require("node-fetch"); // untuk mengambil API dari opentdb
require("dotenv").config(); // membuat config env
// konfigurasi server
const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET;

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
// membuat model mongodb
const userSchema = new mongoose.Schema({
  username: String,
  password: String,
  results: [{ score: Number, date: { type: Date, default: Date.now } }],
});
const User = mongoose.model("User", userSchema);

// Middleware untuk frontend dapat mengakses server
app.use(cors());
app.use(express.json());

// Authentication Middleware
const authenticateJWT = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.sendStatus(401);
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

// Routes
// register 
app.post("/api/register", async (req, res) => {
  const { username, password } = req.body;
  const existingUser = await User.findOne({ username });
  if (existingUser) return res.status(400).json({ message: "Username already exists" });
  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = new User({ username, password: hashedPassword });
  await newUser.save();
  res.status(201).json({ message: "User registered successfully" });
});
// login
app.post("/api/login", async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });
  if (!user) return res.status(400).json({ message: "Invalid username or password" });
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) return res.status(400).json({ message: "Invalid username or password" });
  const token = jwt.sign({ username: user.username }, JWT_SECRET, { expiresIn: "1h" });
  res.json({ token });
});
// quiz
app.get("/api/quiz", async (req, res) => {
  try {
    // connect to API opentdb
    const response = await fetch("https://opentdb.com/api.php?amount=10&category=18&difficulty=easy&type=multiple");
    const data = await response.json();
    res.json(data.results);
  } catch (error) {
    res.status(500).json({ message: "Error fetching quiz data" });
  }
});
// result
app.post("/api/save-result", authenticateJWT, async (req, res) => {
  const { score } = req.body;
  const user = await User.findOne({ username: req.user.username });
  if (!user) return res.status(404).json({ message: "User not found" });
  user.results.push({ score });
  await user.save();
  res.status(200).json({ message: "Result saved successfully" });
});
// get username user yang login
app.get("/api/user", authenticateJWT, async (req, res) => {
  const user = await User.findOne({ username: req.user.username });
  if (!user) return res.status(404).json({ message: "User not found" });
  res.json({ username: user.username });
});
// menjalankan server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
