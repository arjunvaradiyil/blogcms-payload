// server.js

const express = require("express");
const db = require("./db");
const cors = require("cors");

const app = express();
const port = 3000;
app.use(cors());
app.use(express.json());

app.post("/blogs", (req, res) => {
  const { title, content } = req.body;

  const sql = "INSERT INTO blogs (title, content) VALUES (?, ?)";
  const params = [title, content];

  db.run(sql, params, function (err) {
    if (err) {
      return res.status(400).json({ error: err.message });
    }
    res.status(201).json({ id: this.lastID });
  });
});

// Get all blogs
app.get("/blogs", (req, res) => {
  const sql = "SELECT * FROM blogs";
  db.all(sql, [], (err, rows) => {
    if (err) {
      return res.status(400).json({ error: err.message });
    }
    res.json(rows);
  });
});

// Get a single blog by ID
app.get("/blogs/:id", (req, res) => {
  const { id } = req.params;

  const sql = "SELECT * FROM blogs WHERE id = ?";
  const params = [id];

  db.get(sql, params, (err, row) => {
    if (err) {
      return res.status(400).json({ error: err.message });
    }
    if (!row) {
      return res.status(404).json({ error: "Blog not found" });
    }
    res.json(row);
  });
});

// Update a blog
app.put("/blogs/:id", (req, res) => {
  const { id } = req.params;
  const { title, content } = req.body;

  const sql = "UPDATE blogs SET title = ?, content = ? WHERE id = ?";
  const params = [title, content, id];

  db.run(sql, params, function (err) {
    if (err) {
      return res.status(400).json({ error: err.message });
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: "Blog not found" });
    }
    res.json({ updated: this.changes });
  });
});

// Delete a blog
app.delete("/blogs/:id", (req, res) => {
  const { id } = req.params;

  const sql = "DELETE FROM blogs WHERE id = ?";
  const params = [id];

  db.run(sql, params, function (err) {
    if (err) {
      return res.status(400).json({ error: err.message });
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: "Blog not found" });
    }
    res.json({ deleted: this.changes });
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
