const mysql = require("mysql");

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "9893",
  database: "tmdbuser",
});

db.connect((err) => {
  if (err) throw err;
  console.log("MySQL Connected successfully...");
});

module.exports = db;
