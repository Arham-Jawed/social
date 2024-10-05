import Post from "../models/post.model.js";
import User from "../models/user.model.js";
import Notification from "../models/notification.model.js";
import UploadOnCloud from "../utils/upload.js";
import DeleteFromCloud from "../utils/delete.js";

export const createPost = async (req, res) => {
  const { text } = req.body;
  let { img } = req.body;
  const userId = req.user._id;
  if (!text && !img) {
    return res.status(404).json({
      success: false,
      message: "Please provide text or image",
    });
  }
  try {
    const user = await User.findById(userId).select("-password");
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    if (img) {
      const url = await UploadOnCloud(img);
      img = url;
    }
    const post = new Post({
      user: user._id,
      text,
      img,
    });
    user.posts.push(post._id);
    await user.save();
    await post.save();
    return res.status(201).json({
      success: true,
      message: "Post created successfully",
      post,
    });
  } catch (e) {
    console.log(`Internal Error While Creating A Post :: ${e.message}`);
    return res.status(500).json({
      success: false,
      message: e.message,
    });
  }
};

export const deletePost = async (req, res) => {
  const { id } = req.params;
  const userId = req.user._id;
  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    const post = await Post.findById(id);
    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }
    if (post.user.toString() !== userId.toString()) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized to delete this post",
      });
    }
    if (post.img) {
      const imgId = post.img.split("/").pop().split(".")[0];
      await DeleteFromCloud(imgId);
    }

    await User.findByIdAndUpdate(userId, {
      $pull: { posts: post._id },
    });

    await Post.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,
      message: "Post deleted successfully",
    });
  } catch (e) {
    console.log(`Internal Error While Deleting A Post :: ${e.message}`);
    return res.status(500).json({
      success: false,
      message: e.message,
    });
  }
};

export const getPostById = async (req, res) => {
  const { id } = req.params;
  const userId = req.user._id;
  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    const post = await Post.findById(id).populate({
      path: "user",
      select: "-password",
    });
    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }
    return res.status(200).json({
      success: true,
      post,
    });
  } catch (e) {
    console.log(`Internal Error While Getting A Post :: ${e.message}`);
    return res.status(500).json({
      success: false,
      message: e.message,
    });
  }
};

export const commentOnPost = async (req, res) => {
  const { text } = req.body;
  const { id } = req.params;
  const userId = req.user._id;
  if (!text) {
    return res.status(404).json({
      success: false,
      message: "Please provide comment text",
    });
  }
  try {
    const post = await Post.findById(id);
    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }
    const user = await User.findById(userId).select("-password");
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    const comment = {
      user: user._id,
      text,
    };
    post.comments.push(comment);
    await post.save();
    return res.status(201).json({
      success: true,
      message: "Comment created successfully",
      post,
    });
  } catch (e) {
    console.log(`Internal Error While Commenting On A Post :: ${e.message}`);
    return res.status(500).json({
      success: false,
      message: e.message,
    });
  }
};

export const likeUnlikePost = async (req, res) => {
  const { id } = req.params;
  const userId = req.user._id;
  try {
    const post = await Post.findById(id);
    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }
    const alreadyLiked = post.likes.includes(userId);

    if (alreadyLiked) {
      // Unlike
      await Post.findByIdAndUpdate(id, { $pull: { likes: userId } });
      await User.findByIdAndUpdate(userId, { $pull: { likedPost: post._id } });
      await Notification.findOneAndDelete({
        type: "like",
        from: userId,
        to: post.user,
      });
      return res.status(200).json({
        success: true,
        message: "Post unliked successfully",
      });
    } else {
      //Like
      await Post.findByIdAndUpdate(id, { $push: { likes: userId } });
      await User.findByIdAndUpdate(userId, { $push: { likedPost: post._id } });
      const notification = new Notification({
        type: "like",
        from: userId,
        to: post.user,
      });
      await notification.save();
      return res.status(201).json({
        success: true,
        message: "Post liked successfully",
      });
    }
  } catch (e) {
    console.log(`Internal Error While Liking/Unliking A Post :: ${e.message}`);
    return res.status(500).json({
      success: false,
      message: e.message,
    });
  }
};

export const getAllPosts = async (_, res) => {
  try {
    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .populate({
        path: "user",
        select: "-password",
      })
      .populate({
        path: "comments.user",
        select: "-password",
      });

    if (posts.length === 0) {
      return res.status(200).json({
        success: true,
        message: "No posts found",
        posts: [],
      });
    }
    return res.status(200).json({
      success: true,
      message: "Posts fetched successfully",
      posts,
    });
  } catch (e) {
    console.log(`Internal Error While Liking/Unliking A Post :: ${e.message}`);
    return res.status(500).json({
      success: false,
      message: e.message,
    });
  }
};

export const getLikedPost = async (req, res) => {
  const { id: userId } = req.params;
  try {
    const user = await User.findById(userId).select("-password");
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const LikedPost = await Post.find({
      _id: { $in: user.likedPost },
    })
      .populate({
        path: "user",
        select: "-password",
      })
      .populate({
        path: "comments.user",
        select: "-password",
      });

    if (LikedPost.length === 0) {
      return res.status(200).json({
        success: true,
        message: "No liked posts found",
        posts: [],
      });
    }

    return res.status(200).json({
      success: true,
      message: "Liked posts fetched successfully",
      posts: LikedPost,
    });
  } catch (e) {
    console.log(`Internal Error While Getting Liked Posts :: ${e.message}`);
    return res.status(500).json({
      success: false,
      message: e.message,
    });
  }
};

export const getFollowingPost = async (req, res) => {
  const userId = req.user._id;
  try {
    const user = await User.findById(userId).select("-password");
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    const FollowingPost = await Post.find({
      user: { $in: user.following },
    })
      .populate({
        path: "user",
        select: "-password",
      })
      .populate({
        path: "comments.user",
        select: "-password",
      });

    if (FollowingPost.length === 0) {
      return res.status(200).json({
        success: true,
        message: "No posts found",
        posts: [],
      });
    }

    return res.status(200).json({
      success: true,
      message: "Following posts fetched successfully",
      posts: FollowingPost,
    });
  } catch (e) {
    console.log(`Internal Error While Getting Following Posts :: ${e.message}`);
    return res.status(500).json({
      success: false,
      message: e.message,
    });
  }
};

export const getUserPosts = async (req, res) => {
  const { username } = req.params;
  try {
    const user = await User.findOne({ username }).select("-password");
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const UserPosts = await Post.find({ user: user._id })
      .sort({
        createdAt: -1,
      })
      .populate({
        path: "user",
        select: "-password",
      })
      .populate({
        path: "comments.user",
        select: "-password",
      });

    if (UserPosts.length === 0) {
      return res.status(200).json({
        success: true,
        message: "No posts found",
        posts: [],
      });
    }
    return res.status(200).json({
      success: true,
      message: "User posts fetched successfully",
      posts: UserPosts,
    });
  } catch (e) {
    console.log(`Internal Error While Getting User Posts :: ${e.message}`);
    return res.status(500).json({
      success: false,
      message: e.message,
    });
  }
};
