import userModel from "../model/user.model.js";
import jwt from "jsonwebtoken";
import { sendEmail } from "../services/mail.services.js";

export async function register(req, res) {
  console.log("Register API hit");

  const { username, email, password } = req.body;

  // Check if user already exists
  const existingUser = await userModel.findOne({
    $or: [{ email }, { username }],
  });

  if (existingUser) {
    return res.status(400).json({
      success: false,
      message: existingUser.email === email
        ? 'User with this Email already registered'
        : 'Username already taken',
      err: "user already exist"
    });
  }

  // Create new user
  const newUser = await new userModel({
    username,
    email,
    password,
  });

  const emailVerificationToken = jwt.sign({
    email: email,

  }, process.env.JWT_SECRET, { expiresIn: "7d" });




  await newUser.save();
  // Save user to database


  // Generate JWT token
  //     const token = jwt.sign(
  //       { id: newUser._id, email: newUser.email },
  //       process.env.JWT_SECRET || 'your-secret-key',
  //       { expiresIn: '7d' }
  //     );

  try {
    await sendEmail({

      to: email,
      subject: "Welcome to perplexity",
      html: `
<p>Hi ${username}</p>

<p>Thank you for registering at <strong>Perplexity</strong>.</p>

<p>We are excited to see you.</p>

<p>Please verify your email by clicking this link below:</p>

<a href="http://localhost:3000/api/auth/verifyemail?token=${emailVerificationToken}">
Verify Email
</a>

<p>Best regards,<br>
The Perplexity Team</p>
`
    })

    console.log("MAIL SENT SUCCESSFULLY");
  } catch (error) {
    console.log("MAIL ERROR:", error);
  }

  res.status(201).json({
    success: true,
    message: 'User registered successfully',
    data: {
      id: newUser._id,
      username: newUser.username,
      email: newUser.email,
    },
  });
  //   } catch (error) {
  //     console.error('Registration error:', error);
  //     res.status(500).json({
  //       success: false,
  //       message: 'An error occurred during registration',
  //       error: error.message,
  //     });
  //   }
}


export async function verifyemail(req, res) {

  const { token } = req.query;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await userModel.findOne({ email: decoded.email })

    if (!user) {
      return res.status(400).json({
        message: "Invalid Token",
        success: false,
        err: "user not found"
      })
    }

    user.verified = true;

    await user.save();

    const html = `<h1>Email verified succesfully</h1>
      <p>Your email has been verified .You can now log in to your account</p>
      <a href="http://localhost:5173/login">Go to Login</a>`

    return res.send(html);
  }
  catch (err) {
    return res.status(400).json({
      message: "Invalid token",
      success: false,
      err: err.message
    })

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


  res.cookie("token", token)

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
    secure: false,      // true in production with HTTPS
    sameSite: "lax",
  });

  res.status(200).json({
    message: "Logout Successful",
  });

}






