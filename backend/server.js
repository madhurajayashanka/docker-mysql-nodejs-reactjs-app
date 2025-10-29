const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
app.use(cors());
app.use(bodyParser.json());

// MySQL connection config
const mysqlConfig = {
  host: process.env.DB_HOST || "mysql",
  port: process.env.DB_PORT || "3306",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "pass123",
  database: process.env.DB_NAME || "appdb",
};

let con;

// Try connecting with retry logic (useful when DB takes time to start)
const connectWithRetry = (attempt = 1) => {
  console.log(`Attempting to connect to DB... (try ${attempt})`);
  con = mysql.createConnection(mysqlConfig);

  con.connect((err) => {
    if (err) {
      console.error("❌ DB connection failed:", err.message);
      // Try again after 3 seconds
      setTimeout(() => connectWithRetry(attempt + 1), 3000);
    } else {
      console.log("✅ Connected to MySQL database");
      initDatabase(); // Create DB and table if missing
    }
  });
};

// Initialize DB and table
const initDatabase = () => {
  con.query("CREATE DATABASE IF NOT EXISTS appdb", (err) => {
    if (err) return console.error("Error creating DB:", err.message);
    console.log("✅ Database ensured");

    // Switch to database
    con.changeUser({ database: "appdb" }, (err) => {
      if (err) return console.error("Error switching DB:", err.message);

      con.query(
        `CREATE TABLE IF NOT EXISTS apptb (
          id INT AUTO_INCREMENT PRIMARY KEY,
          name VARCHAR(255)
        )`,
        (err) => {
          if (err) console.error("Error creating table:", err.message);
          else console.log("✅ Table ensured");
        }
      );
    });
  });
};

// Routes
app.get("/user", (req, res) => {
  con.query("SELECT * FROM apptb", (err, results) => {
    if (err) {
      console.error("Error fetching data:", err);
      res.status(500).send("Error retrieving data from database");
    } else {
      res.json(results);
    }
  });
});

app.post("/user", (req, res) => {
  const { data } = req.body;
  con.query("INSERT INTO apptb (name) VALUES (?)", [data], (err, results) => {
    if (err) {
      console.error("Error inserting data:", err);
      res.status(500).send("Error inserting data");
    } else {
      res.json(results);
    }
  });
});

// Start server
app.listen(3000, () => {
  console.log("🚀 Server running on port 3000");
  connectWithRetry(); // Start DB connection with retry logic
});

