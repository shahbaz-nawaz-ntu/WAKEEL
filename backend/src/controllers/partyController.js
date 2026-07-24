// backend/src/controllers/partyController.js
import Party from '../models/Party.js';

// ✅ GET ALL PARTIES
export const getParties = async (req, res) => {
  try {
    console.log('📋 Fetching parties for user:', req.user?._id);
    
    // If no user, return empty array
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: 'Unauthorized - User not found'
      });
    }
    
    const parties = await Party.find({ userId: req.user._id })
      .sort({ createdAt: -1 });
    
    console.log(`✅ Found ${parties.length} parties`);
    
    res.status(200).json({
      success: true,
      data: parties
    });
  } catch (error) {
    console.error('❌ Error fetching parties:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// ✅ CREATE PARTY - FIXED
export const createParty = async (req, res) => {
  try {
    console.log('📝 Creating party with data:', req.body);
    console.log('👤 User:', req.user);
    
    // Check if user exists
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: 'Unauthorized - User not found'
      });
    }
    
    const { type, name, phone, email, cnic, address, createdBy } = req.body;
    
    // Validate required fields
    if (!type || !name) {
      return res.status(400).json({
        success: false,
        error: 'Type and Name are required'
      });
    }
    
    // Create party with userId from authenticated user
    const party = new Party({
      type,
      name,
      phone: phone || '-',
      email: email || '-',
      cnic: cnic || '-',
      address: address || '-',
      createdBy: createdBy || 'Current User',
      userId: req.user._id  // ✅ Use authenticated user's ID
    });
    
    await party.save();
    console.log('✅ Party created:', party);
    
    res.status(201).json({
      success: true,
      data: party
    });
  } catch (error) {
    console.error('❌ Error creating party:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// ✅ UPDATE PARTY
export const updateParty = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`📝 Updating party: ${id}`);
    
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: 'Unauthorized - User not found'
      });
    }
    
    const party = await Party.findOne({ _id: id, userId: req.user._id });
    
    if (!party) {
      return res.status(404).json({
        success: false,
        error: 'Party not found'
      });
    }
    
    const { type, name, phone, email, cnic, address, createdBy } = req.body;
    
    if (type) party.type = type;
    if (name) party.name = name;
    if (phone) party.phone = phone;
    if (email) party.email = email;
    if (cnic) party.cnic = cnic;
    if (address) party.address = address;
    if (createdBy) party.createdBy = createdBy;
    
    await party.save();
    console.log('✅ Party updated:', party);
    
    res.status(200).json({
      success: true,
      data: party
    });
  } catch (error) {
    console.error('❌ Error updating party:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// ✅ DELETE PARTY
export const deleteParty = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`🗑️ Deleting party: ${id}`);
    
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: 'Unauthorized - User not found'
      });
    }
    
    const party = await Party.findOne({ _id: id, userId: req.user._id });
    
    if (!party) {
      return res.status(404).json({
        success: false,
        error: 'Party not found'
      });
    }
    
    await party.deleteOne();
    console.log('✅ Party deleted');
    
    res.status(200).json({
      success: true,
      message: 'Party deleted successfully'
    });
  } catch (error) {
    console.error('❌ Error deleting party:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};