const db = require("../config/db");
const calculateDistance = require("../utils/distanceCalculator");

const addSchool = (req, res) => {
  const { name, address, latitude, longitude } = req.body;

  // Validate input
  if (!name || !address || !latitude || !longitude) {
    return res.status(400).json({
      message: "All fields are required name, addresss, latitude, longitude",
    });
  }

  const query =
    "INSERT INTO schools (name, address, latitude, longitude) VALUES (?, ?, ?, ?)";
  db.query(query, [name, address, latitude, longitude], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Error adding school" });
    }
    res
      .status(201)
      .json({ message: "School added successfully", id: result.insertId });
  });
};

const listSchools = (req, res) => {
  const { latitude, longitude } = req.query;

  if (!latitude || !longitude) {
    return res
      .status(400)
      .json({ message: "Latitude and longitude are required" });
  }

  const query = "SELECT * FROM schools";
  db.query(query, (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Error fetching schools" });
    }

    // Calculate distance for each school
    const schoolsWithDistance = results.map((school) => ({
      ...school,
      distance: calculateDistance(
        latitude,
        longitude,
        school.latitude,
        school.longitude
      ),
    }));

    // Sort schools by distance
    schoolsWithDistance.sort((a, b) => a.distance - b.distance);

    res.status(200).json(schoolsWithDistance);
  });
};

module.exports = { addSchool, listSchools };
