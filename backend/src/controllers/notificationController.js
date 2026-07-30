// backend/src/controllers/notificationController.js
import Notification from '../models/Notification.js';

// Helper function to get IO instance
const getIO = (req) => {
  return req.app.get('io');
};

// Create a notification (can be called from other controllers)
export const createNotification = async (userId, type, title, message, data = {}, req = null) => {
  console.log('📨 createNotification called with:', { userId, type, title });
  
  try {
    const notification = new Notification({
      userId,
      type,
      title,
      message,
      data
    });
    
    await notification.save();
    console.log('✅ Notification saved to database:', notification._id);
    
    // Emit socket event if req is available
    if (req) {
      const io = getIO(req);
      console.log('📡 IO instance:', io ? '✅ Available' : '❌ Not available');
      
      if (io) {
        const roomName = `user-${userId}`;
        console.log(`📡 Emitting to room: ${roomName}`);
        
        io.to(roomName).emit('new-notification', notification);
        console.log('✅ Emitted new-notification event');
        
        const unreadCount = await getUnreadCount(userId);
        io.to(roomName).emit('notification-count', unreadCount);
        console.log('✅ Emitted notification-count event:', unreadCount);
      } else {
        console.error('❌ IO not available in createNotification');
      }
    } else {
      console.log('⚠️ No req object provided, skipping socket emit');
    }
    
    return notification;
  } catch (error) {
    console.error('❌ Error creating notification:', error);
    return null;
  }
};

// Get unread count for a user
export const getUnreadCount = async (userId) => {
  try {
    return await Notification.countDocuments({ userId, read: false });
  } catch (error) {
    console.error('Error getting unread count:', error);
    return 0;
  }
};

// Get all notifications for a user
export const getNotifications = async (req, res) => {
  try {
    const { userId } = req.params;
    const { limit = 50, skip = 0 } = req.query;
    
    const notifications = await Notification.find({ userId })
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip(parseInt(skip));
    
    const unreadCount = await getUnreadCount(userId);
    const total = await Notification.countDocuments({ userId });
    
    res.status(200).json({
      success: true,
      data: notifications,
      unreadCount,
      total,
      hasMore: skip + notifications.length < total
    });
  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Mark a single notification as read
export const markAsRead = async (req, res) => {
  try {
    const { notificationId } = req.params;
    const { userId } = req.body;
    
    if (!userId) {
      return res.status(400).json({
        success: false,
        message: 'userId is required'
      });
    }
    
    const notification = await Notification.findOneAndUpdate(
      { _id: notificationId, userId },
      { read: true },
      { new: true }
    );
    
    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Notification not found'
      });
    }
    
    const unreadCount = await getUnreadCount(userId);
    
    // Emit updated count via socket
    const io = req.app.get('io');
    if (io) {
      io.to(`user-${userId}`).emit('notification-count', unreadCount);
    }
    
    res.status(200).json({
      success: true,
      data: notification,
      unreadCount
    });
  } catch (error) {
    console.error('Error marking notification as read:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Mark all notifications as read
export const markAllAsRead = async (req, res) => {
  try {
    const { userId } = req.body;
    
    if (!userId) {
      return res.status(400).json({
        success: false,
        message: 'userId is required'
      });
    }
    
    const result = await Notification.updateMany(
      { userId, read: false },
      { read: true }
    );
    
    const unreadCount = await getUnreadCount(userId);
    
    // Emit updated count via socket
    const io = req.app.get('io');
    if (io) {
      io.to(`user-${userId}`).emit('notification-count', unreadCount);
    }
    
    res.status(200).json({
      success: true,
      message: `Marked ${result.modifiedCount} notifications as read`,
      unreadCount
    });
  } catch (error) {
    console.error('Error marking all as read:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Delete a notification
export const deleteNotification = async (req, res) => {
  try {
    const { notificationId } = req.params;
    const { userId } = req.body;
    
    if (!userId) {
      return res.status(400).json({
        success: false,
        message: 'userId is required'
      });
    }
    
    const notification = await Notification.findOneAndDelete({
      _id: notificationId,
      userId
    });
    
    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Notification not found'
      });
    }
    
    const unreadCount = await getUnreadCount(userId);
    
    // Emit updated count via socket
    const io = req.app.get('io');
    if (io) {
      io.to(`user-${userId}`).emit('notification-count', unreadCount);
    }
    
    res.status(200).json({
      success: true,
      message: 'Notification deleted',
      unreadCount
    });
  } catch (error) {
    console.error('Error deleting notification:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get unread count only
export const getUnreadCountEndpoint = async (req, res) => {
  try {
    const { userId } = req.params;
    const unreadCount = await getUnreadCount(userId);
    
    res.status(200).json({
      success: true,
      unreadCount
    });
  } catch (error) {
    console.error('Error getting unread count:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};