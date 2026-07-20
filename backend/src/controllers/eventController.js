import Event from '../models/Event.js';
import logger from '../utils/logger.js';

// @desc    Get all events
// @route   GET /api/events
// @access  Private
export const getEvents = async (req, res) => {
  try {
    const { type, startDate, endDate, caseId } = req.query;
    
    let query = { createdBy: req.user.id };
    
    if (type) query.type = type;
    if (caseId) query.caseId = caseId;
    
    if (startDate && endDate) {
      query.date = { $gte: startDate, $lte: endDate };
    } else if (startDate) {
      query.date = { $gte: startDate };
    } else if (endDate) {
      query.date = { $lte: endDate };
    }
    
    const events = await Event.find(query)
      .populate('createdBy', 'name email')
      .populate('caseRef', 'caseTitle caseNumber')
      .populate('clientRef', 'name email')
      .sort({ date: 1 });
    
    res.json({ success: true, count: events.length, data: events });
  } catch (error) {
    logger.error(`Get events error: ${error}`);
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Get single event
// @route   GET /api/events/:id
// @access  Private
export const getEvent = async (req, res) => {
  try {
    const event = await Event.findOne({ 
      _id: req.params.id, 
      createdBy: req.user.id 
    })
      .populate('createdBy', 'name email')
      .populate('caseRef', 'caseTitle caseNumber')
      .populate('clientRef', 'name email');
    
    if (!event) {
      return res.status(404).json({ success: false, error: 'Event not found' });
    }
    
    res.json({ success: true, data: event });
  } catch (error) {
    logger.error(`Get event error: ${error}`);
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Create an event
// @route   POST /api/events
// @access  Private
export const createEvent = async (req, res) => {
  try {
    const eventData = {
      ...req.body,
      createdBy: req.user.id,
    };
    
    const event = await Event.create(eventData);
    
    logger.info(`Event created: ${event.title} by ${req.user.email}`);
    
    res.status(201).json({ success: true, data: event });
  } catch (error) {
    logger.error(`Create event error: ${error}`);
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Update an event
// @route   PUT /api/events/:id
// @access  Private
export const updateEvent = async (req, res) => {
  try {
    const event = await Event.findOne({ 
      _id: req.params.id, 
      createdBy: req.user.id 
    });
    
    if (!event) {
      return res.status(404).json({ success: false, error: 'Event not found' });
    }

    const updatedEvent = await Event.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: Date.now() },
      { new: true, runValidators: true }
    );
    
    logger.info(`Event updated: ${updatedEvent.title}`);
    
    res.json({ success: true, data: updatedEvent });
  } catch (error) {
    logger.error(`Update event error: ${error}`);
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Delete an event
// @route   DELETE /api/events/:id
// @access  Private
export const deleteEvent = async (req, res) => {
  try {
    const event = await Event.findOne({ 
      _id: req.params.id, 
      createdBy: req.user.id 
    });
    
    if (!event) {
      return res.status(404).json({ success: false, error: 'Event not found' });
    }

    await event.deleteOne();
    
    logger.info(`Event deleted: ${event.title}`);
    
    res.json({ success: true, data: {} });
  } catch (error) {
    logger.error(`Delete event error: ${error}`);
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Mark event as completed
// @route   PATCH /api/events/:id/complete
// @access  Private
export const completeEvent = async (req, res) => {
  try {
    const event = await Event.findOne({ 
      _id: req.params.id, 
      createdBy: req.user.id 
    });
    
    if (!event) {
      return res.status(404).json({ success: false, error: 'Event not found' });
    }

    event.isCompleted = !event.isCompleted;
    event.updatedAt = Date.now();
    await event.save();
    
    logger.info(`Event completed status toggled: ${event.title}`);
    
    res.json({ success: true, data: event });
  } catch (error) {
    logger.error(`Complete event error: ${error}`);
    res.status(500).json({ success: false, error: error.message });
  }
};