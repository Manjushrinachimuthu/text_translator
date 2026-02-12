const express = require("express");
const cors = require("cors");
const db = require("./node_db");

const app = express();
app.use(cors());
app.use(express.json());

// ✅ Create table if not exists (matches your database)
db.query(
  `CREATE TABLE IF NOT EXISTS history (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL,
    email VARCHAR(100) NOT NULL,
    input_text TEXT NOT NULL,
    translated_text TEXT NOT NULL,
    source_language VARCHAR(50) DEFAULT 'English',
    target_language VARCHAR(50) NOT NULL,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
  )`,
  (err) => {
    if (err) console.error("❌ Error creating 'history' table:", err);
    else console.log("✅ 'history' table ready.");
  }
);

// ✅ Save translation (NOW includes source_language)
app.post("/api/history", (req, res) => {
  const {
    username,
    email,
    input_text,
    translated_text,
    source_language,
    target_language
  } = req.body;

  if (!username || !email || !input_text || !translated_text || !target_language) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  db.query(
    `INSERT INTO history 
    (username, email, input_text, translated_text, source_language, target_language)
    VALUES (?, ?, ?, ?, ?, ?)`,
    [
      username,
      email,
      input_text,
      translated_text,
      source_language || "English",
      target_language
    ],
    (err) => {
      if (err) {
        console.error("❌ Error saving history:", err);
        return res.status(500).json({ error: err.message });
      }
      res.json({ message: "✅ History saved successfully!" });
    }
  );
});

// ✅ Get user history
app.get("/api/history", (req, res) => {
  const { username, email } = req.query;

  if (!username || !email) {
    return res.status(400).json({ error: "Username and email required" });
  }

  db.query(
    `SELECT * FROM history 
     WHERE username = ? AND email = ?
     ORDER BY timestamp DESC`,
    [username, email],
    (err, results) => {
      if (err) {
        console.error("❌ Error fetching history:", err);
        return res.status(500).json({ error: err.message });
      }
      res.json(results);
    }
  );
});

app.listen(3000, () => {
  console.log("🚀 History server running at http://localhost:3000");
});
