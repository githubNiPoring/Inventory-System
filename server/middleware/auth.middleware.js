require("dotenv").config();
const supabase = require("../src/db_config");
const jwt = require("jsonwebtoken");

const auth = async (req, res, next) => {
  const token =
    req.signedCookies?.token ||
    req.cookies?.token ||
    req.headers["authorization"]?.split(" ")[1];

  if (!token) {
    return res.status(401).json({
      message: "You are not authorized to access this route 1",
      success: false,
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { data: user, error } = await supabase
      .from("users")
      .select("id")
      .eq("id", decoded.id);

    if (error || !user || user.length === 0) {
      return res.status(401).json({
        message: "You are not authorized to access this route 2",
        success: false,
      });
    }

    req.user = user[0];
    next();
  } catch (error) {
    return res.status(500).json({
      message: "You are not authorized to access this route 3",
      details: error.message,
      success: false,
    });
  }
};

module.exports = { auth };
