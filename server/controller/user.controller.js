require("dotenv").config();
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");

const { createSecretToken } = require("../utils/secret.token");
const sendEmail = require("../utils/send.mail");
const supabase = require("../src/db_config");

// Add this to your user routes (backend)
const checkAuth = async (req, res) => {
  try {
    // Check for token in Authorization header first, then fallback to cookies
    let token = null;

    // Check Authorization header (Bearer token)
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.substring(7); // Remove 'Bearer ' prefix
    }

    // Fallback to cookies if no Bearer token found
    if (!token) {
      token = req.cookies.token;
    }

    if (!token) {
      return res.status(401).json({
        message: "No token provided",
        success: false,
        authenticated: false,
      });
    }

    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Token verified for user:", decoded.id);

    // Optionally get user data
    const { data: userData, error } = await supabase
      .from("users")
      .select("id, email, firstname")
      .eq("id", decoded.id)
      .single();

    if (error) {
      console.error("Database error:", error);
      return res.status(401).json({
        message: "User not found",
        success: false,
        authenticated: false,
      });
    }

    console.log("User authenticated successfully:", userData.email);

    res.status(200).json({
      message: "Authenticated",
      success: true,
      authenticated: true,
      user: userData,
    });
  } catch (error) {
    console.error("CheckAuth error:", error.message);
    res.status(401).json({
      message: "Invalid token",
      success: false,
      authenticated: false,
      error: error.message,
    });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Invalid Credentials", success: false });
    }

    const { data } = await supabase
      .from("users")
      .select("id, password, vStatus, email, firstname")
      .eq("email", email);

    if (data.length === 0) {
      return res.status(400).json({
        message: "Either email or password is incorrect",
        success: false,
      });
    }

    if (!data[0].vStatus) {
      try {
        await supabase.from("token").delete().eq("userId", data[0].id);

        const { data: tokenData, error: tokenError } = await supabase
          .from("token")
          .insert([
            {
              userId: data[0].id,
              token: crypto.randomBytes(32).toString("hex"),
              expiresAt: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
            },
          ])
          .select();

        if (tokenError || !tokenData || tokenData.length === 0) {
          return res.status(500).json({
            message: "Failed to create verification token",
            error: tokenError?.message,
            success: false,
          });
        }

        const baseURL = process.env.BASE_URL;
        const url = `${baseURL}/${data[0].id}/verify/${tokenData[0].token}`;

        await sendEmail(
          data[0].email,
          "Verify Email",
          `Hello ${data[0].firstname}, Please verify your email by clicking on the link below: \n\n ${url}`
        );

        return res.status(400).json({
          message: "An email was sent to your account please verify",
          success: false,
        });
      } catch (error) {
        res.status(400).json({
          message: "Email not verified",
          error: error.message,
          success: false,
        });
      }
    }

    const auth = await bcrypt.compare(password, data[0].password);
    if (!auth) {
      return res.status(400).json({
        message: "Either email or password is incorrect",
        success: false,
      });
    }

    const token = createSecretToken(data[0].id);
    // console.log("Login attempt from origin:", req.headers.origin);
    // console.log("Cookie being set:", token);
    // res.cookie("token", token, {
    //   httpOnly: process.env.NODE_ENV === "production" ? true : false,
    //   secure: process.env.NODE_ENV === "production" ? true : false,
    //   sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
    //   expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
    // });

    res.status(200).json({
      message: "Logged in successfully",
      success: true,
      token,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error logging in",
      details: error.message,
      success: false,
    });
  }
};

const signup = async (req, res) => {
  try {
    const { firstname, lastname, email, password } = req.body;
    let existingUser = await supabase
      .from("users")
      .select("id")
      .eq("email", email);

    if (existingUser.data.length > 0) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    const hashedpassword = await bcrypt.hash(password, 10);

    const { data: userData, error: userError } = await supabase
      .from("users")
      .insert([{ firstname, lastname, email, password: hashedpassword }])
      .select();

    if (userError) {
      return res.status(500).json({
        message: "Failed to create user",
        error: userError.message,
      });
    }

    // Add safety check
    if (!userData || userData.length === 0) {
      return res.status(500).json({
        message: "User created but no data returned",
        error: "No user data returned from insert",
      });
    }

    const expirationTime = new Date(Date.now() + 60 * 60 * 1000);

    const { data: tokenData, error: tokenError } = await supabase
      .from("token")
      .insert([
        {
          userId: userData[0].id,
          token: crypto.randomBytes(32).toString("hex"),
          expiresAt: expirationTime.toISOString(),
        },
      ])
      .select();

    if (tokenError) {
      return res.status(500).json({
        message: "Failed to create verification token",
        error: tokenError.message,
      });
    }

    if (!tokenData || tokenData.length === 0) {
      return res.status(500).json({
        message: "Token created but no data returned",
        error: "No token data returned from insert",
      });
    }

    const baseURL = process.env.BASE_URL;

    const url = `${baseURL}/${userData[0].id}/verify/${tokenData[0].token}`;

    await sendEmail(
      userData[0].email,
      "Verify Email",
      `Hello ${userData[0].firstname}, Please verify your email by clicking on the link below: \n\n ${url}`
    );

    res.status(201).json({
      message:
        "Verification email sent! Please check your inbox to verify your account.",
      success: true,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to create user",
      error: error.message,
    });
  }
};

const verify = async (req, res) => {
  try {
    const user = await supabase
      .from("users")
      .select("id, vStatus, email, firstname")
      .eq("id", req.params.id);

    if (user.data.length === 0) {
      console.log("User not found for verification");
      return res.status(404).json({
        message: "Invalid verification link",
        success: false,
      });
    }

    // Check if user is already verified
    if (user.data[0].vStatus) {
      console.log("User already verified");
      return res.status(200).json({
        message: "Email already verified",
        success: true,
      });
    }

    const token = await supabase
      .from("token")
      .select("token, expiresAt")
      .eq("userId", req.params.id)
      .eq("token", req.params.token);

    if (token.data.length === 0) {
      console.log("Token not found for verification");
      return res.status(400).json({
        message: "Invalid or expired verification link",
        success: false,
      });
    }

    // Check if token has expired
    const now = new Date();
    const expirationTime = new Date(token.data[0].expiresAt);

    if (now > expirationTime) {
      // Token has expired, generate and send a new one
      console.log(
        "Token expired for user:",
        req.params.id,
        "- generating new token"
      );

      // Delete the old expired token
      await supabase.from("token").delete().eq("token", req.params.token);

      try {
        // Generate new token with new expiration
        const newExpirationTime = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

        const { data: newTokenData, error: newTokenError } = await supabase
          .from("token")
          .insert([
            {
              userId: user.data[0].id,
              token: crypto.randomBytes(32).toString("hex"),
              expiresAt: newExpirationTime.toISOString(),
            },
          ])
          .select();

        if (newTokenError) {
          console.error(
            "Failed to create new verification token:",
            newTokenError
          );
          return res.status(500).json({
            message: "Failed to generate new verification link",
            success: false,
          });
        }

        // Send new verification email
        const baseURL = process.env.BASE_URL;
        const newUrl = `${baseURL}/${user.data[0].id}/verify/${newTokenData[0].token}`;

        await sendEmail(
          user.data[0].email,
          "New Verification Link",
          `Hello ${user.data[0].firstname}, Your previous verification link has expired. Please verify your email by clicking on the new link below (valid for 1 hour): \n\n ${newUrl}`
        );

        return res.status(200).json({
          message:
            "Verification link has expired. A new verification email has been sent to your inbox.",
          success: true,
          newEmailSent: true,
        });
      } catch (emailError) {
        console.error("Error sending new verification email:", emailError);
        return res.status(500).json({
          message: "Failed to send new verification email",
          success: false,
        });
      }
    }

    // Token is still valid, proceed with verification
    // Update user verification status
    await supabase
      .from("users")
      .update({ vStatus: true })
      .eq("id", req.params.id);

    // Delete the verification token
    await supabase.from("token").delete().eq("token", req.params.token);

    console.log("User verified successfully:", req.params.id);

    // Send success response
    return res.status(200).json({
      message: "Email verified successfully",
      success: true,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error verifying email",
      details: error.message,
      success: false,
    });
  }
};

const logout = async (req, res) => {
  try {
    console.log("Logout attempt from origin:", req.headers.origin);

    // Clear the cookie by setting it with the same options but with past expiration
    res.cookie("token", "", {
      httpOnly: process.env.NODE_ENV === "production" ? true : false,
      secure: process.env.NODE_ENV === "production" ? true : false,
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      expires: new Date(0), // Set expiration to past date
    });

    // Alternative method - use res.clearCookie
    res.clearCookie("token", {
      httpOnly: process.env.NODE_ENV === "production" ? true : false,
      secure: process.env.NODE_ENV === "production" ? true : false,
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      path: "/", // Make sure to include the path
    });

    console.log("Cookie cleared successfully");

    res.status(200).json({
      message: "Logged out successfully",
      success: true,
    });
  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).json({
      message: "Error logging out",
      success: false,
      error: error.message,
    });
  }
};

module.exports = { checkAuth, login, signup, verify, logout };
