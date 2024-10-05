import User from "../models/user.model.js";
import Notification from "../models/notification.model.js";

export const getAllNotifications = async (req, res) => {
  const userId = req.user._id;
  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    const notifications = await Notification.find({
      to: userId,
    }).populate({
      path: "from",
      select: "username profileImg",
    });

    await Notification.updateMany({ to: userId }, { read: true });

    if (notifications.length === 0) {
      return res.status(200).json({
        success: true,
        message: "No notifications found",
        notifications: [],
      });
    }

    return res.status(200).json({
      success: true,
      message: "Notifications fetched successfully",
      notifications,
    });
  } catch (e) {
    console.log(
      `Internal Error While Getting All The Notifications :: ${e.message}`
    );
    return res.status(500).json({
      success: false,
      message: e.message,
    });
  }
};

export const deleteNotifications = async (req, res) => {
  const userId = req.user._id;
  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    await Notification.deleteMany({ to: user._id });
    return res.status(200).json({
      success: true,
      message: "Notifications deleted successfully",
    });
  } catch (e) {
    console.error(
      `Internal Error While Deleting Notifications :: ${e.message}`
    );
    return res.status(500).json({
      success: false,
      message: e.message,
    });
  }
};

export const deleteNotification = async (req, res) => {
  const userId = req.user._id;
  const notificationId = req.params.id;
  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    const notification = await Notification.findById(notificationId);
    if (!notification) {
      return res.status(404).json({
        success: false,
        message: "Notification not found",
      });
    }
    if (notification.to.toString() !== userId.toString()) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to delete this notification",
      });
    }
    await Notification.findByIdAndDelete(notificationId);
    return res.status(200).json({
      success: true,
      message: "Notification deleted successfully",
    });
  } catch (e) {
    console.error(
      `Internal Error While Deleting A Specific Notification :: ${e.message}`
    );
    return res.status(500).json({
      success: false,
      message: e.message,
    });
  }
};
