import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import generateTokenAndSetCookie from "../utils/token.js";

export const Register = async (req, res) => {
  const { username, name, email, password } = req.body;
  if (!username || !name || !email || !password) {
    return res.status(404).json({
      success: false,
      message: "Please fill all fields",
    });
  }
  if (password.length < 6) {
    return res.status(404).json({
      success: false,
      message: "Password should be at least 6 characters long",
    });
  }
  try {
    const existingUser = await User.findOne({
      $or: [{ username }, { email }],
    });
    if (existingUser) {
      return res.status(404).json({
        success: false,
        message: "Username or Email already exists",
      });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      name,
      username,
      email,
      password: hashedPassword,
    });
    if (user) {
      generateTokenAndSetCookie(user._id, res);
      await user.save();
      return res.status(201).json({
        success: true,
        message: "User registered successfully",
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          followers: user.followers,
          following: user.following,
          profileImg: user.profileImg,
          coverImg: user.coverImg,
        },
      });
    }
  } catch (e) {
    console.error(`Internal Error While Registering A User :: ${e.message}`);
    return res.status(500).json({
      success: false,
      message: e.message,
    });
  }
};

export const Login = async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(404).json({
      success: false,
      message: "Please fill all fields",
    });
  }
  if (password.length < 6) {
    return res.status(404).json({
      success: false,
      message: "Password should be at least 6 characters long",
    });
  }
  try {
    const user = await User.findOne({ username });
    const isPasswordCorrect = await bcrypt.compare(
      password,
      user?.password || ""
    );
    if (!isPasswordCorrect) {
      return res.status(404).json({
        success: false,
        message: "Username Or Password Is Incorrect",
      });
    }
    generateTokenAndSetCookie(user._id, res);
    return res.status(200).json({
      success: true,
      message: "User logged in successfully",
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        followers: user.followers,
        following: user.following,
        profileImg: user.profileImg,
        coverImg: user.coverImg,
      },
    });
  } catch (e) {
    console.error(`Internal Error While Login A User :: ${e.message}`);
    return res.status(500).json({
      success: false,
      message: e.message,
    });
  }
};

export const Logout = async (_, res) => {
  try {
    res.cookie("jwt", "", { maxAge: 0 });
    return res.status(200).json({
      success: true,
      message: "User logged out successfully",
    });
  } catch (e) {
    console.error(`Internal Error While Logout A User :: ${e.message}`);
    return res.status(500).json({
      success: false,
      message: e.message,
    });
  }
};

export const GetMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    if (!user) {
      return res.status(404).json({
        error: "User Not Found",
      });
    }
    return res.status(201).json({
      success: true,
      message: "User Fetched Successfully",
      user,
    });
  } catch (e) {
    console.error(`Internal Error While Getting A User :: ${e.message}`);
    return res.status(500).json({
      success: false,
      message: e.message,
    });
  }
};
