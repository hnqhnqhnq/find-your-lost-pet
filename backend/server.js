const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config({ path: "./../config.env" });
const app = require("./app");

// Create DB
const DB = process.env.DATABASE.replace(
  "<PASSWORD>",
  process.env.DATABASE_PASSWORD
);

// Connect to the DB
mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("DB connection successful");
  })
  .catch((err) => {
    console.error("DB connection error:", err);
  });

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  if (process.env.NODE_ENV === "development") {
    console.log(`App running on port ${port}`);
  }
});
