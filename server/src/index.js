require("dotenv").config();

const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const supabase = require("./db_config");
const userRoutes = require("../routes/user.routes");

const app = express();
const port = process.env.PORT;
const baseURL = process.env.BASE_URL;

// Define allowed origins
const allowedOrigins = [
  "https://inventory-system-blond-chi.vercel.app", // Your Vercel frontend
  "http://localhost:3000", // For local development
  "http://localhost:5173", // For Vite local development
];

// Add BASE_URL if it exists and is different
if (process.env.BASE_URL && !allowedOrigins.includes(process.env.BASE_URL)) {
  allowedOrigins.push(process.env.BASE_URL);
}

app.use(
  cors({
    // origin: [baseURL, "https://inventory-system-blond-chi.vercel.app"],
    // credentials: true,
    // methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    // allowedHeaders: ["Content-Type", "Authorization"],
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);

      if (allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        console.log("Blocked by CORS:", origin);
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "Cookie"],
    exposedHeaders: ["Set-Cookie"],
  })
);

app.use(express.json());
app.use(cookieParser());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

//routes
app.use("/api/v1", userRoutes);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
