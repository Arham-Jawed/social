import User from "../models/user.model.js";
import Notification from "../models/notification.model.js";
import bcrypt from "bcryptjs";
import UploadOnCloud from "../utils/upload.js";
import DeleteFromCloud from "../utils/delete.js";

export const getUserProfile = async (req, res) => {
  const { username } = req.params;
  try {
    const user = await User.findOne({ username }).select("-password").populate({
      path: "posts",
    });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    return res.status(200).json({
      success: true,
      message: "User Profile Fetched Successfully",
      user,
    });
  } catch (e) {
    console.error(
      `Internal Error While Getting A User Profile :: ${e.message}`
    );
    return res.status(500).json({
      success: false,
      message: e.message,
    });
  }
};

export const followUnfollowUser = async (req, res) => {
  const { id } = req.params;
  try {
    const UserToBeModified = await User.findById(id).select("-password");
    const currentUser = await User.findById(req.user._id).select("-password");

    if (!UserToBeModified || !currentUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const isFollowing = currentUser.following.includes(UserToBeModified._id);

    if (id === req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Cannot follow yourself",
      });
    }

    if (isFollowing) {
      await User.findByIdAndUpdate(id, { $pull: { followers: req.user._id } });
      await User.findByIdAndUpdate(req.user._id, { $pull: { following: id } });
      await Notification.findOneAndDelete({
        type: "follow",
        from: req.user._id,
        to: UserToBeModified._id,
      });
      return res.status(200).json({
        success: true,
        message: "User Unfollowed Successfully",
      });
    } else {
      await User.findByIdAndUpdate(id, { $push: { followers: req.user._id } });
      await User.findByIdAndUpdate(req.user._id, { $push: { following: id } });
      const newNotification = new Notification({
        type: "follow",
        from: req.user._id,
        to: UserToBeModified._id,
      });
      await newNotification.save();
      return res.status(200).json({
        success: true,
        message: "User Followed Successfully",
      });
    }
  } catch (e) {
    console.error(
      `Internal Error While Follow Unfollow A User :: ${e.message}`
    );
    return res.status(500).json({
      success: false,
      message: e.message,
    });
  }
};

export const getSuggestedUsers = async (req, res) => {
  try {
    const userId = req.user._id;
    const UserFollowedByMe = await User.findById(userId).select("following");

    const users = await User.aggregate([
      {
        $match: {
          _id: { $ne: userId },
        },
      },
      {
        $sample: { size: 5 },
      },
    ]);

    const filteredUser = users.filter(
      (user) => !UserFollowedByMe.following.includes(user._id)
    );

    const suggestedUsers = filteredUser.slice(0, 4);
    suggestedUsers.forEach((user) => (user.password = null));

    return res.status(201).json({
      success: true,
      message: "Suggested Users Fetched Successfully",
      suggestedUsers,
    });
  } catch (e) {
    console.error(
      `Internal Error While Getting Suggested Users :: ${e.message}`
    );
    return res.status(500).json({
      success: false,
      message: e.message,
    });
  }
};

export const updateUser = async (req, res) => {
  const { name, email, password, currentPassword, bio, link } = req.body;
  console.log(bio);
  let { profileImg, coverImg } = req.body;
  const userId = req.user._id;
  try {
    console.log(profileImg);
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if ((!password && currentPassword) || (password && !currentPassword)) {
      return res.status(401).json({
        success: false,
        message: "Both Password And Current Password Are Required",
      });
    }

    if (password && currentPassword) {
      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch) {
        return res.status(401).json({
          success: false,
          message: "Incorrect current password",
        });
      }
      if (password.length < 6) {
        return res.status(400).json({
          success: false,
          message: "Password should be at least 6 characters long",
        });
      }
      const hashedPassword = await bcrypt.hash(password, 10);
      user.password = hashedPassword;
    }

    if (profileImg) {
      if (user.profileImg) {
        const oldImgId = user.profileImg.split("/").pop().split(".")[0];
        await DeleteFromCloud(oldImgId);
      }
      const url = await UploadOnCloud(profileImg);
      user.profileImg = url;
      await user.save();
    }

    if (coverImg) {
      if (user.coverImg) {
        const oldImgId = user.coverImg.split("/").pop().split(".")[0];
        await DeleteFromCloud(oldImgId);
      }
      const coverUrl = await UploadOnCloud(coverImg);
      user.coverImg = coverUrl;
      await user.save();
    }

    console.log(bio);

    user.name = name ? name : user.name;
    user.email = email ? email : user.email;
    user.bio = bio ? bio : user.bio;
    user.link = link ? link : user.link;
    await user.save();

    return res.status(201).json({
      success: true,
      message: "User Profile Updated Successfully",
      user,
    });
  } catch (e) {
    console.error(
      `Internal Error While Updating User's Profile :: ${e.message}`
    );
    return res.status(500).json({
      success: false,
      message: e.message,
    });
  }
};
