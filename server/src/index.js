require("dotenv").config();

const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const supabase = require("./db_config");
const userRoutes = require("../routes/user.routes");

const app = express();
const port = process.env.PORT;
const baseURL = process.env.BASE_URL;

app.use(
  cors({
    origin: [baseURL, "https://inventory-management-system-chi-six.vercel.app"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());
app.use(cookieParser(process.env.JWT_SECRET));

app.get("/", (req, res) => {
  res.send("Hello World!");
});

//routes
app.use("/api/v1", userRoutes);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
