// backend/src/routes/clientRoutes.js
import express from 'express';
import Client from '../models/Client.js';
import { authenticateToken } from '../middleware/auth.js';
import {
  getClients,
  getClient,
  createClient,
  updateClient,
  patchClient,
  deleteClient,
  getClientStats,
} from '../controllers/clientController.js';

const router = express.Router();

// ✅ Debug middleware
router.use((req, res, next) => {
  console.log(`🔍 ${req.method} /api/clients${req.path}`);
  console.log('📝 Headers:', req.headers);
  console.log('📝 Body:', req.body);
  next();
});

// GET all clients
router.get('/', authenticateToken, async (req, res) => {
  try {
    console.log('👥 Fetching all clients...');
    console.log('📝 User ID:', req.user.id);
    
    // ✅ Use both userId and createdBy for compatibility
    const clients = await Client.find({ 
      $or: [
        { userId: req.user.id },
        { createdBy: req.user.id }
      ]
    }).sort({ createdAt: -1 });
    
    console.log(`👥 Found ${clients.length} clients`);
    
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
    console.error('❌ Error fetching clients:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// GET single client
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const clientId = req.params.id;
    console.log(`📝 GET client: ${clientId}`);
    console.log('📝 User ID:', req.user.id);
    
    // ✅ Use both userId and createdBy
    const client = await Client.findOne({ 
      _id: clientId, 
      $or: [
        { userId: req.user.id },
        { createdBy: req.user.id }
      ]
    });
    
    if (!client) {
      return res.status(404).json({ success: false, error: 'Client not found' });
    }
    
    const obj = client.toJSON ? client.toJSON() : client;
    res.json({ 
      success: true, 
      data: {
        ...obj,
        id: obj._id ? obj._id.toString() : obj.id
      }
    });
  } catch (error) {
    console.error('❌ Error fetching client:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// POST new client
router.post('/', authenticateToken, async (req, res) => {
  try {
    console.log('👤 Creating new client with data:', req.body);
    console.log('📝 User ID:', req.user.id);
    
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
    
    console.log('📋 Generated Client ID:', clientId);
    
    // ✅ Create client with both userId and createdBy
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
      userId: req.user.id,
      createdBy: req.user.id, // ✅ Add both for compatibility
    };
    
    const newClient = new Client(clientData);
    const savedClient = await newClient.save();
    console.log('✅ Client created:', savedClient._id, 'with ID:', savedClient.clientId);
    
    const obj = savedClient.toJSON ? savedClient.toJSON() : savedClient;
    const formattedClient = {
      ...obj,
      id: obj._id ? obj._id.toString() : obj.id
    };
    
    res.status(201).json({ 
      success: true, 
      data: formattedClient 
    });
  } catch (error) {
    console.error('❌ Error creating client:', error);
    
    if (error.code === 11000) {
      return res.status(400).json({ 
        success: false, 
        error: 'A client with this ID already exists. Please try again.' 
      });
    }
    
    res.status(400).json({ 
      success: false, 
      error: error.message 
    });
  }
});

// ✅ ENHANCED: PATCH update client
router.patch('/:id', authenticateToken, async (req, res) => {
  try {
    const clientId = req.params.id;
    console.log(`📝 PATCH updating client: ${clientId}`);
    console.log('📝 Request body:', JSON.stringify(req.body, null, 2));
    console.log('📝 User ID:', req.user.id);
    
    // Validate ID format
    if (!clientId || clientId === 'undefined' || clientId === 'null' || clientId.length < 10) {
      console.error('❌ Invalid client ID:', clientId);
      return res.status(400).json({ 
        success: false, 
        error: 'Invalid client ID format. ID must be a valid MongoDB ObjectId.' 
      });
    }
    
    // ✅ Check if client exists - use both userId and createdBy
    let existingClient;
    try {
      existingClient = await Client.findOne({ 
        _id: clientId, 
        $or: [
          { userId: req.user.id },
          { createdBy: req.user.id }
        ]
      });
    } catch (findError) {
      console.error('❌ Error finding client:', findError);
      return res.status(400).json({ 
        success: false, 
        error: 'Invalid client ID format' 
      });
    }
    
    if (!existingClient) {
      console.log('❌ Client not found for user:', req.user.id);
      return res.status(404).json({ 
        success: false, 
        error: 'Client not found or you do not have permission' 
      });
    }
    
    console.log('✅ Found client:', existingClient._id, existingClient.name);
    
    // ✅ Only update fields that are provided
    const updateData = {};
    const allowedFields = ['name', 'email', 'phone', 'address', 'city', 'state', 'zipCode', 
                          'country', 'company', 'type', 'status', 'notes'];
    
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
    
    // Always update the updatedAt timestamp
    updateData.updatedAt = new Date();
    
    // If no fields to update, return the existing client
    if (!hasUpdates) {
      console.log('📝 No fields to update, returning existing client');
      const obj = existingClient.toJSON ? existingClient.toJSON() : existingClient;
      return res.json({ 
        success: true, 
        data: {
          ...obj,
          id: obj._id ? obj._id.toString() : obj.id
        },
        message: 'No changes made'
      });
    }
    
    console.log('📝 Update data:', JSON.stringify(updateData, null, 2));
    
    // ✅ Update the client
    const updatedClient = await Client.findByIdAndUpdate(
      clientId,
      updateData,
      { 
        new: true, 
        runValidators: true
      }
    );
    
    if (!updatedClient) {
      console.error('❌ Client not found after update');
      return res.status(404).json({ 
        success: false, 
        error: 'Client not found after update' 
      });
    }
    
    console.log('✅ Client updated successfully:', updatedClient._id);
    
    const obj = updatedClient.toJSON ? updatedClient.toJSON() : updatedClient;
    const formattedClient = {
      ...obj,
      id: obj._id ? obj._id.toString() : obj.id
    };
    
    res.json({ 
      success: true, 
      data: formattedClient,
      message: 'Client updated successfully'
    });
  } catch (error) {
    console.error('❌ Error PATCH updating client:', error);
    console.error('❌ Error stack:', error.stack);
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ 
        success: false, 
        error: errors.join(', '),
        details: error.errors
      });
    }
    
    // Handle duplicate key errors
    if (error.code === 11000) {
      return res.status(400).json({ 
        success: false, 
        error: 'A client with this information already exists.' 
      });
    }
    
    // Handle CastError (invalid ObjectId)
    if (error.name === 'CastError') {
      return res.status(400).json({ 
        success: false, 
        error: 'Invalid client ID format' 
      });
    }
    
    res.status(400).json({ 
      success: false, 
      error: error.message || 'Failed to update client'
    });
  }
});

// PUT update client (full update)
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const clientId = req.params.id;
    console.log(`📝 PUT updating client: ${clientId}`);
    console.log('📝 Request body:', JSON.stringify(req.body, null, 2));
    
    // Validate ID format
    if (!clientId || clientId === 'undefined' || clientId === 'null' || clientId.length < 10) {
      return res.status(400).json({ 
        success: false, 
        error: 'Invalid client ID format' 
      });
    }
    
    // ✅ Use both userId and createdBy
    const existingClient = await Client.findOne({ 
      _id: clientId, 
      $or: [
        { userId: req.user.id },
        { createdBy: req.user.id }
      ]
    });
    
    if (!existingClient) {
      return res.status(404).json({ 
        success: false, 
        error: 'Client not found' 
      });
    }
    
    // ✅ Remove ID fields from update
    const { _id, id, clientId: cid, createdBy, userId, ...cleanData } = req.body;
    
    const updateData = {
      name: cleanData.name || existingClient.name,
      email: cleanData.email || existingClient.email,
      phone: cleanData.phone || existingClient.phone,
      address: cleanData.address || existingClient.address,
      city: cleanData.city || existingClient.city,
      state: cleanData.state || existingClient.state,
      zipCode: cleanData.zipCode || existingClient.zipCode,
      country: cleanData.country || existingClient.country,
      company: cleanData.company || existingClient.company,
      type: cleanData.type || existingClient.type,
      status: cleanData.status || existingClient.status,
      notes: cleanData.notes !== undefined ? cleanData.notes : existingClient.notes,
      updatedAt: new Date()
    };
    
    const updatedClient = await Client.findByIdAndUpdate(
      clientId,
      updateData,
      { new: true, runValidators: true }
    );
    
    if (!updatedClient) {
      return res.status(404).json({ 
        success: false, 
        error: 'Client not found after update' 
      });
    }
    
    console.log('✅ Client updated successfully:', updatedClient._id);
    
    const obj = updatedClient.toJSON ? updatedClient.toJSON() : updatedClient;
    const formattedClient = {
      ...obj,
      id: obj._id ? obj._id.toString() : obj.id
    };
    
    res.json({ 
      success: true, 
      data: formattedClient,
      message: 'Client updated successfully'
    });
  } catch (error) {
    console.error('❌ Error updating client:', error);
    res.status(400).json({ 
      success: false, 
      error: error.message 
    });
  }
});

// DELETE client
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const clientId = req.params.id;
    console.log('🗑️ Deleting client:', clientId);
    
    // ✅ Use both userId and createdBy
    const deletedClient = await Client.findOneAndDelete({ 
      _id: clientId, 
      $or: [
        { userId: req.user.id },
        { createdBy: req.user.id }
      ]
    });
    
    if (!deletedClient) {
      return res.status(404).json({ success: false, error: 'Client not found' });
    }
    console.log('✅ Client deleted:', deletedClient._id);
    res.json({ success: true, data: { id: clientId } });
  } catch (error) {
    console.error('❌ Error deleting client:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;