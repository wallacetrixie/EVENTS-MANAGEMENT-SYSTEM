const express = require("express");
const mysql = require("mysql");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");

const app = express();
app.use(cors());
app.use(bodyParser.json());

// MySQL connection
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "details",
});
app.use(express.static(path.join(__dirname, "public")));
db.connect((err) => {
  if (err) {
    console.log("Database connection error", err);
  } else {
    console.log("Database connected");
  }
});

// POST route to add user details
app.post("/add-user", (req, res) => {
  const { name, age } = req.body;
  const query = "INSERT INTO users (name, age) VALUES (?, ?)";
  db.query(query, [name, age], (err, result) => {
    if (err) {
      res.status(500).send("Error inserting data");
    } else {
      res.send("User added");
    }
  });
});

// GET route to fetch user details
app.get("/users", (req, res) => {
  const query = "SELECT * FROM users";
  db.query(query, (err, results) => {
    if (err) {
      res.status(500).send("Error fetching data");
    } else {
      res.json(results);
    }
  });
});

// DELETE route to remove a user by ID
app.delete('/delete-user/:id', (req, res) => {
  const { id } = req.params;
  const query = 'DELETE FROM users WHERE id = ?';
  db.query(query, [id], (err, result) => {
    if (err) {
      res.status(500).send('Error deleting user');
    } else {
      res.send('User deleted');
    }
  });
});

// PUT route to update user details
app.put('/update-user/:id', (req, res) => {
  const { id } = req.params;
  const { name, age } = req.body;
  const query = 'UPDATE users SET name = ?, age = ? WHERE id = ?';
  db.query(query, [name, age, id], (err, result) => {
    if (err) {
      res.status(500).send('Error updating user');
    } else {
      res.send('User updated');
    }
  });
});


const port = 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
