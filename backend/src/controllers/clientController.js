import Client from '../models/Client.js';
import logger from '../utils/logger.js';

// @desc    Get all clients
// @route   GET /api/clients
// @access  Private
export const getClients = async (req, res) => {
  try {
    const { status, search } = req.query;
    
    let query = { createdBy: req.user.id };
    
    if (status) query.status = status;
    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { company: { $regex: search, $options: 'i' } },
      ];
    }
    
    const clients = await Client.find(query)
      .populate('createdBy', 'name email')
      .populate('cases', 'caseTitle caseNumber status')
      .sort({ createdAt: -1 });
    
    res.json({ success: true, count: clients.length, data: clients });
  } catch (error) {
    logger.error(`Get clients error: ${error}`);
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Get single client
// @route   GET /api/clients/:id
// @access  Private
export const getClient = async (req, res) => {
  try {
    const client = await Client.findOne({ 
      _id: req.params.id, 
      createdBy: req.user.id 
    })
      .populate('createdBy', 'name email')
      .populate('cases', 'caseTitle caseNumber status priority amount');
    
    if (!client) {
      return res.status(404).json({ success: false, error: 'Client not found' });
    }
    
    res.json({ success: true, data: client });
  } catch (error) {
    logger.error(`Get client error: ${error}`);
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Create a client
// @route   POST /api/clients
// @access  Private
export const createClient = async (req, res) => {
  try {
    const clientData = {
      ...req.body,
      createdBy: req.user.id,
    };
    
    const client = await Client.create(clientData);
    
    logger.info(`Client created: ${client.name} by ${req.user.email}`);
    
    res.status(201).json({ success: true, data: client });
  } catch (error) {
    logger.error(`Create client error: ${error}`);
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Update a client
// @route   PUT /api/clients/:id
// @access  Private
export const updateClient = async (req, res) => {
  try {
    const client = await Client.findOne({ 
      _id: req.params.id, 
      createdBy: req.user.id 
    });
    
    if (!client) {
      return res.status(404).json({ success: false, error: 'Client not found' });
    }

    const updatedClient = await Client.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: Date.now() },
      { new: true, runValidators: true }
    );
    
    logger.info(`Client updated: ${updatedClient.name}`);
    
    res.json({ success: true, data: updatedClient });
  } catch (error) {
    logger.error(`Update client error: ${error}`);
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Delete a client
// @route   DELETE /api/clients/:id
// @access  Private
export const deleteClient = async (req, res) => {
  try {
    const client = await Client.findOne({ 
      _id: req.params.id, 
      createdBy: req.user.id 
    });
    
    if (!client) {
      return res.status(404).json({ success: false, error: 'Client not found' });
    }

    await client.deleteOne();
    
    logger.info(`Client deleted: ${client.name}`);
    
    res.json({ success: true, data: {} });
  } catch (error) {
    logger.error(`Delete client error: ${error}`);
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Get client statistics
// @route   GET /api/clients/stats
// @access  Private
export const getClientStats = async (req, res) => {
  try {
    const clients = await Client.find({ createdBy: req.user.id });
    
    const total = clients.length;
    const active = clients.filter(c => c.status === 'active').length;
    const pending = clients.filter(c => c.status === 'pending').length;
    const inactive = clients.filter(c => c.status === 'inactive').length;
    
    res.json({
      success: true,
      data: {
        total,
        active,
        pending,
        inactive,
      },
    });
  } catch (error) {
    logger.error(`Get client stats error: ${error}`);
    res.status(500).json({ success: false, error: error.message });
  }
};