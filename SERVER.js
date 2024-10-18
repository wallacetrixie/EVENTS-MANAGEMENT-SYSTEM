const express = require("express");
const mysql = require("mysql");
const session = require("express-session");
const bcrypt = require("bcrypt");
const bodyParser = require("body-parser");
const path = require("path");
const app = express();
const http = require("http");
const server = http.createServer(app);
const port = 5011;
const router = express.Router();

const saltRounds = 10; // Bcrypt salt rounds for hashing passwords

app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());


app.use(
  session({
    secret: "85N?_[}fj8hgg%66>>*5AA23SUSS^^68288DH@@__99D9w22h8YYu8h  777",
    resave: true,
    saveUninitialized: false,
    cookie: { secure: false },
  })
);

// MySQL connection setup
const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "plan",
});

connection.connect((err) => {
  if (err) {
    throw err;
  }
  console.log("Connected to MySQL database");
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "/homepage.html"));
});

// Sign-up Route (hashing passwords before storing)
app.post("/signup", (req, res) => {
  const { name, email, password, confirm_password } = req.body;

  // Check if passwords match
  if (password !== confirm_password) {
    res.send(
      '<script>alert("Passwords do not match, try again.");window.location.href="/login.html";</script>'
    );
    return;
  }

  // Hash the password before storing in the database
  bcrypt.hash(password, saltRounds, (err, hashedPassword) => {
    if (err) {
      console.error("Error hashing password", err);
      res.status(500).send("Error hashing password");
      return;
    }

    // Insert user data into the database with hashed password
    const data = { name, email, password: hashedPassword };
    connection.query("INSERT INTO login_details SET ?", data, (err, result) => {
      if (err) {
        console.error("Error occurred while signing up", err);
        res.status(500).send("Error occurred while signing up");
        return;
      }
      console.log("Sign-up was successful");
      res.redirect("/login.html");
    });
  });
});
//getting users events from the database

app.get("/api/events", (req, res) => {
  if (!req.session.user) {
    res.status(401).json({ error: "User not logged in" });
    return;
  }

  const userId = req.session.user.id;
  const query = "SELECT * FROM event_details WHERE user_id = ?";
  connection.query(query, [userId], (err, results) => {
    if (err) {
      console.error("Error fetching event details", err);
      res.status(500).json({ error: "Failed to fetch event details" });
      return;
    }
    res.json(results);
  });
});




// Login Route (comparing hashed passwords and establishing session)
app.post("/login", (req, res) => {
  const { email, password } = req.body;

  // Query to find the user by email
  const query = "SELECT * FROM login_details WHERE email = ?";
  connection.query(query, [email], (err, results) => {
    if (err) {
      console.error("Error occurred during login", err.stack);
      res.send(
        '<script>alert("Error occurred, please try again.");window.location.href="/login.html";</script>'
      );
      return;
    }

    // If user found, compare the passwords
    if (results.length > 0) {
      const user = results[0];

      // Compare provided password with the stored hashed password
      bcrypt.compare(password, user.password, (err, isMatch) => {
        if (err) {
          console.error("Error comparing passwords", err);
          res.status(500).send("Error comparing passwords");
          return;
        }

        if (isMatch) {
          // Passwords match, establish session
          req.session.user = {
            id: user.id,
            email: user.email,
            name: user.name,
          };

          // Redirect to homepage
          res.redirect("/homepage.html");
        } else {
          // Passwords don't match
          res.send(
            '<script>alert("Invalid email or password, please try again.");window.location.href="/login.html";</script>'
          );
        }
      });
    } else {
      // No user found with that email
      res.send(
        '<script>alert("Invalid email or password, please try again.");window.location.href="/login.html";</script>'
      );
    }
  });
});

// Middleware to protect routes
function isAuthenticated(req, res, next) {
  if (req.session.user) {
    return next();
  } else {
    res.redirect("/login.html");
  }
}

// Protected route: Serve homepage only if authenticated
app.get("/homepage.html", isAuthenticated, (req, res) => {
  res.sendFile(path.join(__dirname, "public", "homepage.html"));
});
// Posting event details to the database
app.post("/submit-event-details", (req, res) => {
  const { eventName, date, time, location,  budget, number } = req.body;
  const userId = req.session.user.id; // Get the user ID from the session

  // Ensure user ID is available before proceeding
  if (!userId) {
    res.status(400).send("User not logged in");
    return;
  }

  const data = {
    eventName,
    date,
    time,
    location,
    budget,
    number,
    user_id: userId,
  };

  connection.query("INSERT INTO event_details SET ?", data, (err, result) => {
    if (err) {
      console.error("Error submitting event details", err);
      res.status(500).send("Error submitting event details");
      return;
    }
    console.log("Event details successfully submitted");
    res.redirect("/events.html");
  });
});

// Route to get the logged-in user's name and display in the events page
app.get("/get-username", isAuthenticated, (req, res) => {
  if (req.session.user && req.session.user.name) {
    res.json({ name: req.session.user.name });
  } else {
    res.status(401).json({ error: "User not logged in" });
  }
});


// Assuming Express is set up
app.put('/update-events', (req, res) => {
    const eventId = req.body.id; // Get event ID from request body
    const updatedEvent = {
        name: req.body.name,
        date: req.body.date,
        time: req.body.time,
        location: req.body.location,
        number: req.body.number,
        budget: req.body.budget,
    };

    // Logic to update event in the database (e.g., using MySQL)
    const query = "UPDATE event_details SET eventName=?, date=?, time=?, location=?, number=?, budget=? WHERE eventId=?";
    
    connection.query(query, [updatedEvent.name, updatedEvent.date, updatedEvent.time, updatedEvent.location, updatedEvent.number, updatedEvent.budget, eventId], (err, result) => {
        if (err) {
            console.error(err);
            res.status(500).send('Error updating event');
        } else {
            res.status(200).send('Event updated successfully');
        }
    });
});



// Logout Route
app.get("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error("Error logging out", err);
      res.status(500).send("Error logging out");
      return;
    }

    res.redirect("/login.html");
  });
});



// DELETE route to remove a user by ID
app.delete('/delete-event/:eventId', (req, res) => {
  const { eventId } = req.params;
  const query = 'DELETE FROM event_details WHERE eventId = ?';
  connection.query(query, [eventId], (err, result) => {
    if (err) {
      res.status(500).send('Error deleting user');
    } else {
      res.send('User deleted');
    }
  });
});


app.post("/set-reminder", (req, res) => {
  const {reminderMethod, reminderTime } = req.body; // Get eventId as well

  const data = {
    reminder_method: reminderMethod,
    reminder_time: reminderTime,
  };

  connection.query("INSERT INTO reminders SET ?", data, (err, result) => {
    if (err) {
      console.error("Error setting reminder", err);
      return;
    }
    console.log("Reminder set successfully");
    res.redirect("/events.html");
  });
});
