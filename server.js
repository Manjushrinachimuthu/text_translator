const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");
const db = require("./node_db");

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const frontendPath = path.join(__dirname, "../../frontend");
app.use(express.static(frontendPath));

app.get("/", (req, res) => res.sendFile(path.join(frontendPath, "index.html")));


// ------------------ SIGNUP ------------------
app.post("/signup", (req, res) => {
  const { first_name, last_name, username, email, password } = req.body;

  if (!first_name || !last_name || !username || !email || !password)
    return res.status(400).json({ error: "All fields are required" });

  const query = "INSERT INTO users (first_name, last_name, username, email, password) VALUES (?, ?, ?, ?, ?)";

  db.query(query, [first_name, last_name, username, email, password], (err, result) => {
    if (err) return res.status(500).json({ error: "Username or email may already exist" });

    res.json({ message: "Signup successful", userId: result.insertId });
  });
});


// ------------------ LOGIN ------------------
app.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password)
    return res.status(400).json({ error: "Username and password required" });

  const query = "SELECT * FROM users WHERE username = ? AND password = ?";

  db.query(query, [username, password], (err, results) => {
    if (err) return res.status(500).json({ error: "Database error" });

    if (results.length === 0)
      return res.status(401).json({ error: "Invalid username or password" });

    res.json({ message: "Login successful", user: results[0] });
  });
});


// ------------------ SAVE HISTORY ------------------
app.post("/api/history", (req, res) => {
  const { username, email, input_text, translated_text, source_language, target_language } = req.body;

  if (!username || !email || !input_text || !translated_text || !target_language)
    return res.status(400).json({ error: "Missing required fields" });

  const query = `
        INSERT INTO history (username, email, input_text, translated_text, source_language, target_language)
        VALUES (?, ?, ?, ?, ?, ?)
    `;

  db.query(
    query,
    [username, email, input_text, translated_text, source_language || "English", target_language],
    (err, result) => {
      if (err) return res.status(500).json({ error: "Database error" });

      res.json({ message: "History saved", historyId: result.insertId });
    }
  );
});


// ------------------ GET HISTORY ------------------
app.get("/api/history", (req, res) => {
  const { username, email } = req.query;

  if (!username || !email)
    return res.status(400).json({ error: "Missing username or email" });

  const query = "SELECT * FROM history WHERE username = ? AND email = ? ORDER BY timestamp DESC";

  db.query(query, [username, email], (err, results) => {
    if (err) return res.status(500).json({ error: "Database error" });
    res.json(results);
  });
});


const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
