import userModel from "../model/user.model.js";
import jwt from "jsonwebtoken";
import { sendEmail } from "../services/mail.services.js";

export async function register(req, res) {
  try {
    console.log("Register API hit");

    const { username, email, password } = req.body;

    const existingUser = await userModel.findOne({
      $or: [{ email }, { username }],
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message:
          existingUser.email === email
            ? "User with this Email already registered"
            : "Username already taken",
      });
    }

    // Create verification token containing user details
    const emailVerificationToken = jwt.sign(
      {
        username,
        email,
        password,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    // Send verification email FIRST
    await sendEmail({
      to: email,
      subject: "Verify your Perplexity account",
      html: `
        <h2>Hi ${username}</h2>

        <p>Thank you for registering at <strong>Perplexity</strong>.</p>

        <p>Please verify your email by clicking the button below:</p>

        <a href="https://mern-perplexity.onrender.com/api/auth/verifyemail?token=${emailVerificationToken}">
          Verify Email
        </a>

        <p>This link will expire in 15 minutes.</p>
      `,
    });

    console.log("Verification email sent successfully");

    // IMPORTANT:
    // User is NOT saved to database here

    return res.status(200).json({
      success: true,
      message:
        "Verification email sent. Please verify your email to complete registration.",
    });

  } catch (err) {
    console.log("REGISTER ERROR:", err);

    return res.status(500).json({
      success: false,
      message: "Unable to send verification email",
      error: err.message,
    });
  }
}



export async function verifyemail(req, res) {
  const { token } = req.query;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const existingUser = await userModel.findOne({
      $or: [
        { email: decoded.email },
        { username: decoded.username }
      ]
    });

    if (existingUser) {
      return res.status(400).send("User already registered.");
    }

    // NOW create user in database
    const newUser = new userModel({
      username: decoded.username,
      email: decoded.email,
      password: decoded.password,
      verified: true,
    });

    await newUser.save();

    const html = `
      <h1>Email Verified Successfully! 🎉</h1>

      <p>Your email has been verified successfully.</p>

      <p>Your account has now been created.</p>

      <a href="https://mern-perplexity-kohl.vercel.app/login">
        Go to Login
      </a>
    `;

    return res.send(html);

  } catch (err) {
    console.log("VERIFY ERROR:", err);

    return res.status(400).json({
      message: "Invalid or expired verification link",
      success: false,
      err: err.message,
    });
  }
}


export async function VerifyLogin(req, res) {

  const { email, password } = req.body

  const user = await userModel.findOne({ email }).select("+password")

  if (!user) {
    return res.status(400).json({
      message: "user not found by this email and password",
      success: false,
      err: "Incorrect email"
    })
  }

  const isPasswordMatch = await user.matchPassword(password);
  if (!isPasswordMatch) {
    return res.status(400).json({
      message: "Incorrect email or password",
      success: false,
      err: "Incorrect password"
    })
  }

  if (!user.verified) {
    return res.status(400).json({
      message: "Please verify your email before logging in",
      success: false,
      err: "Email not verified"
    })
  }

  const token = jwt.sign({
    id: user._id,
    user: user.username,

  }, process.env.JWT_SECRET, { expiresIn: '7d' })


  res.cookie("token", token, {
    httpOnly: true,
    secure: true,
    sameSite: "None"
});

  res.status(200).json({
    message: "Login successfully",
    success: true,
    user: {
      id: user._id,
      username: user.username,
      email: user.email
    }
  })
  console.log(token);


};
export async function getMe(req, res) {
  const userId = req.user.id;

  const user = await userModel.findById(userId).select("-password")

  if (!user) {
    return res.status(400).json({
      message: "User not found  ",
      success: false,
      err: "user not found"
    })
  }

  return res.status(200).json({
    success: true,
    user
  });




}

export async function logout(req, res) {

  res.clearCookie("token", {
    httpOnly: true,
    secure: true,      // true in production with HTTPS
    sameSite: "None",
  });

  res.status(200).json({
    message: "Logout Successful",
  });

}






