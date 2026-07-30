// backend/src/routes/notificationRoutes.js
import express from 'express';
import {
  getNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  getUnreadCountEndpoint
} from '../controllers/notificationController.js';

const router = express.Router();

// Get all notifications for a user
router.get('/:userId', getNotifications);

// Get unread count for a user
router.get('/:userId/unread-count', getUnreadCountEndpoint);

// Mark a single notification as read
router.put('/:notificationId/read', markAsRead);

// Mark all notifications as read
router.put('/mark-all-read', markAllAsRead);

// Delete a notification
router.delete('/:notificationId', deleteNotification);

// ✅ TEST ROUTE
router.post('/test', async (req, res) => {
  try {
    const { userId, title, message } = req.body;
    const io = req.app.get('io');
    
    console.log('🧪 Sending test notification to user:', userId);
    
    if (!io) {
      console.error('❌ Socket.IO not available');
      return res.status(500).json({ error: 'Socket.IO not available' });
    }
    
    const notification = {
      _id: 'test_' + Date.now(),
      userId: userId,
      type: 'test',
      title: title || '🧪 Test Notification',
      message: message || 'Your notification system is working!',
      data: { test: true },
      read: false,
      createdAt: new Date().toISOString()
    };
    
    // Emit to user's room
    io.to(`user-${userId}`).emit('new-notification', notification);
    
    // Also emit updated count
    io.to(`user-${userId}`).emit('notification-count', 1);
    
    console.log('✅ Test notification sent to user:', userId);
    
    res.json({ 
      success: true, 
      notification,
      message: 'Test notification sent successfully'
    });
  } catch (error) {
    console.error('❌ Error sending test notification:', error);
    res.status(500).json({ error: error.message });
  }
});

export default router;