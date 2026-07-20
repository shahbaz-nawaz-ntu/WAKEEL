// backend/src/routes/clientRoutes.js
import express from 'express';
import Client from '../models/Client.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// GET all clients
router.get('/', authenticateToken, async (req, res) => {
  try {
    console.log('👥 Fetching all clients...');
    const clients = await Client.find({ userId: req.user.id }).sort({ createdAt: -1 });
    console.log(`👥 Found ${clients.length} clients`);
    
    const formattedClients = clients.map(client => {
      const obj = client.toJSON();
      return {
        ...obj,
        id: obj._id.toString()
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
    const client = await Client.findOne({ 
      _id: req.params.id, 
      userId: req.user.id 
    });
    if (!client) {
      return res.status(404).json({ success: false, error: 'Client not found' });
    }
    const obj = client.toJSON();
    res.json({ 
      success: true, 
      data: {
        ...obj,
        id: obj._id.toString()
      }
    });
  } catch (error) {
    console.error('❌ Error fetching client:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// ✅ FIXED: POST new client with proper ID generation
router.post('/', authenticateToken, async (req, res) => {
  try {
    console.log('👤 Creating new client with data:', req.body);
    
    // ✅ Generate client ID - find the highest existing client ID
    let clientId = req.body.clientId;
    
    if (!clientId) {
      // Find the highest client ID number
      const lastClient = await Client.findOne({})
        .sort({ clientId: -1 })
        .select('clientId');
      
      let nextNumber = 1;
      if (lastClient && lastClient.clientId) {
        // Extract the number from CLI-XXXX
        const match = lastClient.clientId.match(/CLI-(\d+)/);
        if (match) {
          nextNumber = parseInt(match[1]) + 1;
        }
      }
      
      clientId = `CLI-${String(nextNumber).padStart(4, '0')}`;
    }
    
    console.log('📋 Generated Client ID:', clientId);
    
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
    };
    
    const newClient = new Client(clientData);
    const savedClient = await newClient.save();
    console.log('✅ Client created:', savedClient._id, 'with ID:', savedClient.clientId);
    
    const obj = savedClient.toJSON();
    const formattedClient = {
      ...obj,
      id: obj._id.toString()
    };
    
    res.status(201).json({ 
      success: true, 
      data: formattedClient 
    });
  } catch (error) {
    console.error('❌ Error creating client:', error);
    
    // ✅ Handle duplicate key error specifically
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

// PUT update client
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const clientId = req.params.id;
    console.log(`📝 Updating client: ${clientId}`);
    
    const existingClient = await Client.findOne({ 
      _id: clientId, 
      userId: req.user.id 
    });
    if (!existingClient) {
      return res.status(404).json({ 
        success: false, 
        error: 'Client not found' 
      });
    }
    
    const updateData = {
      name: req.body.name || existingClient.name,
      email: req.body.email || existingClient.email,
      phone: req.body.phone || existingClient.phone,
      address: req.body.address || existingClient.address,
      city: req.body.city || existingClient.city,
      state: req.body.state || existingClient.state,
      zipCode: req.body.zipCode || existingClient.zipCode,
      country: req.body.country || existingClient.country,
      company: req.body.company || existingClient.company,
      type: req.body.type || existingClient.type,
      status: req.body.status || existingClient.status,
      notes: req.body.notes !== undefined ? req.body.notes : existingClient.notes,
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
    
    const obj = updatedClient.toJSON();
    const formattedClient = {
      ...obj,
      id: obj._id.toString()
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
    console.log('🗑️ Deleting client:', req.params.id);
    const deletedClient = await Client.findOneAndDelete({ 
      _id: req.params.id, 
      userId: req.user.id 
    });
    if (!deletedClient) {
      return res.status(404).json({ success: false, error: 'Client not found' });
    }
    console.log('✅ Client deleted:', deletedClient._id);
    res.json({ success: true, data: { id: req.params.id } });
  } catch (error) {
    console.error('❌ Error deleting client:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;