// backend/src/controllers/clientController.js
import Client from '../models/Client.js';
import logger from '../utils/logger.js';

// @desc    Get all clients
// @route   GET /api/clients
// @access  Private
export const getClients = async (req, res) => {
  try {
    const { status, search } = req.query;
    
    // ✅ FIXED: Use correct field name - check both userId and createdBy
    let query = { 
      $or: [
        { createdBy: req.user.id },
        { userId: req.user.id }
      ]
    };
    
    if (status) query.status = status;
    
    if (search) {
      query.$and = [
        {
          $or: [
            { name: { $regex: search, $options: 'i' } },
            { email: { $regex: search, $options: 'i' } },
            { company: { $regex: search, $options: 'i' } },
          ]
        }
      ];
    }
    
    const clients = await Client.find(query)
      .populate('createdBy', 'name email')
      .populate('cases', 'caseTitle caseNumber status')
      .sort({ createdAt: -1 });
    
    // ✅ Format clients to include id field
    const formattedClients = clients.map(client => {
      const obj = client.toJSON ? client.toJSON() : client;
      return {
        ...obj,
        id: obj._id ? obj._id.toString() : obj.id
      };
    });
    
    res.json({ 
      success: true, 
      count: formattedClients.length, 
      data: formattedClients 
    });
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
      $or: [
        { createdBy: req.user.id },
        { userId: req.user.id }
      ]
    })
      .populate('createdBy', 'name email')
      .populate('cases', 'caseTitle caseNumber status priority amount');
    
    if (!client) {
      return res.status(404).json({ success: false, error: 'Client not found' });
    }
    
    const obj = client.toJSON ? client.toJSON() : client;
    const formattedClient = {
      ...obj,
      id: obj._id ? obj._id.toString() : obj.id
    };
    
    res.json({ success: true, data: formattedClient });
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
    // ✅ Generate client ID if not provided
    let clientId = req.body.clientId;
    
    if (!clientId) {
      const lastClient = await Client.findOne({})
        .sort({ clientId: -1 })
        .select('clientId');
      
      let nextNumber = 1;
      if (lastClient && lastClient.clientId) {
        const match = lastClient.clientId.match(/CLI-(\d+)/);
        if (match) {
          nextNumber = parseInt(match[1]) + 1;
        }
      }
      
      clientId = `CLI-${String(nextNumber).padStart(4, '0')}`;
    }
    
    // ✅ Create client with both userId and createdBy for compatibility
    const clientData = {
      clientId: clientId,
      name: req.body.name || 'Unnamed Client',
      email: req.body.email || '',
      phone: req.body.phone || '',
      address: req.body.address || '',
      city: req.body.city || '',
      state: req.body.state || '',
      zipCode: req.body.zipCode || '',
      country: req.body.country || '',
      company: req.body.company || '',
      type: req.body.type || 'Individual',
      status: req.body.status || 'active',
      notes: req.body.notes || '',
      createdBy: req.user.id,
      userId: req.user.id, // ✅ Add both fields for compatibility
    };
    
    const client = await Client.create(clientData);
    
    logger.info(`Client created: ${client.name} by ${req.user.email}`);
    
    const obj = client.toJSON ? client.toJSON() : client;
    const formattedClient = {
      ...obj,
      id: obj._id ? obj._id.toString() : obj.id
    };
    
    res.status(201).json({ success: true, data: formattedClient });
  } catch (error) {
    logger.error(`Create client error: ${error}`);
    
    if (error.code === 11000) {
      return res.status(400).json({ 
        success: false, 
        error: 'A client with this ID already exists.' 
      });
    }
    
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Update a client (PUT - full update)
// @route   PUT /api/clients/:id
// @access  Private
export const updateClient = async (req, res) => {
  try {
    console.log(`📝 PUT updating client: ${req.params.id}`);
    console.log('📝 Request body:', req.body);
    
    const client = await Client.findOne({ 
      _id: req.params.id, 
      $or: [
        { createdBy: req.user.id },
        { userId: req.user.id }
      ]
    });
    
    if (!client) {
      return res.status(404).json({ success: false, error: 'Client not found' });
    }

    // ✅ Remove ID fields from update data
    const { _id, id, clientId, createdBy, userId, ...updateData } = req.body;
    
    // ✅ Add updatedAt
    updateData.updatedAt = new Date();
    
    const updatedClient = await Client.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );
    
    if (!updatedClient) {
      return res.status(404).json({ success: false, error: 'Client not found after update' });
    }
    
    logger.info(`Client updated: ${updatedClient.name}`);
    
    const obj = updatedClient.toJSON ? updatedClient.toJSON() : updatedClient;
    const formattedClient = {
      ...obj,
      id: obj._id ? obj._id.toString() : obj.id
    };
    
    res.json({ success: true, data: formattedClient });
  } catch (error) {
    logger.error(`Update client error: ${error}`);
    
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ 
        success: false, 
        error: errors.join(', ') 
      });
    }
    
    res.status(500).json({ success: false, error: error.message });
  }
};

// ✅ ADDED: PATCH update client (partial update)
// @desc    Partial update a client
// @route   PATCH /api/clients/:id
// @access  Private
export const patchClient = async (req, res) => {
  try {
    console.log(`📝 PATCH updating client: ${req.params.id}`);
    console.log('📝 Request body:', req.body);
    
    const client = await Client.findOne({ 
      _id: req.params.id, 
      $or: [
        { createdBy: req.user.id },
        { userId: req.user.id }
      ]
    });
    
    if (!client) {
      return res.status(404).json({ success: false, error: 'Client not found' });
    }

    // ✅ Only update fields that are provided
    const allowedFields = ['name', 'email', 'phone', 'address', 'city', 'state', 'zipCode', 
                          'country', 'company', 'type', 'status', 'notes'];
    
    const updateData = {};
    let hasUpdates = false;
    
    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) {
        if (field === 'notes') {
          updateData[field] = req.body[field] || '';
          hasUpdates = true;
        } else if (req.body[field] !== null && req.body[field] !== '') {
          updateData[field] = req.body[field];
          hasUpdates = true;
        }
      }
    });
    
    // Add updatedAt
    updateData.updatedAt = new Date();
    
    if (!hasUpdates) {
      const obj = client.toJSON ? client.toJSON() : client;
      const formattedClient = {
        ...obj,
        id: obj._id ? obj._id.toString() : obj.id
      };
      return res.json({ 
        success: true, 
        data: formattedClient,
        message: 'No changes made'
      });
    }
    
    console.log('📝 Update data:', updateData);
    
    const updatedClient = await Client.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );
    
    if (!updatedClient) {
      return res.status(404).json({ success: false, error: 'Client not found after update' });
    }
    
    logger.info(`Client updated via PATCH: ${updatedClient.name}`);
    
    const obj = updatedClient.toJSON ? updatedClient.toJSON() : updatedClient;
    const formattedClient = {
      ...obj,
      id: obj._id ? obj._id.toString() : obj.id
    };
    
    res.json({ success: true, data: formattedClient });
  } catch (error) {
    logger.error(`Patch client error: ${error}`);
    
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ 
        success: false, 
        error: errors.join(', ') 
      });
    }
    
    if (error.code === 11000) {
      return res.status(400).json({ 
        success: false, 
        error: 'A client with this information already exists.' 
      });
    }
    
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
      $or: [
        { createdBy: req.user.id },
        { userId: req.user.id }
      ]
    });
    
    if (!client) {
      return res.status(404).json({ success: false, error: 'Client not found' });
    }

    await client.deleteOne();
    
    logger.info(`Client deleted: ${client.name}`);
    
    res.json({ success: true, data: { id: req.params.id } });
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
    const clients = await Client.find({ 
      $or: [
        { createdBy: req.user.id },
        { userId: req.user.id }
      ]
    });
    
    const total = clients.length;
    const active = clients.filter(c => c.status === 'active').length;
    const inactive = clients.filter(c => c.status === 'inactive').length;
    const archived = clients.filter(c => c.status === 'archived').length;
    
    res.json({
      success: true,
      data: {
        total,
        active,
        inactive,
        archived,
      },
    });
  } catch (error) {
    logger.error(`Get client stats error: ${error}`);
    res.status(500).json({ success: false, error: error.message });
  }
};