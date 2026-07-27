// backend/src/controllers/partyController.js
import Party from '../models/Party.js';

// ✅ GET ALL PARTIES
export const getParties = async (req, res) => {
  try {
    console.log('📋 Fetching parties for user:', req.user?._id);
    
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

// ✅ GET PARTIES BY CASE
export const getPartiesByCase = async (req, res) => {
  try {
    const { caseId } = req.params;
    console.log(`📋 Fetching parties for case: ${caseId}`);
    
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: 'Unauthorized - User not found'
      });
    }
    
    const parties = await Party.find({ 
      caseId, 
      userId: req.user._id 
    }).sort({ createdAt: -1 });
    
    console.log(`✅ Found ${parties.length} parties for case`);
    
    res.status(200).json({
      success: true,
      data: parties
    });
  } catch (error) {
    console.error('❌ Error fetching parties by case:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// ✅ CREATE PARTY
export const createParty = async (req, res) => {
  try {
    console.log('📝 Creating party with data:', req.body);
    console.log('👤 User:', req.user);
    
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: 'Unauthorized - User not found'
      });
    }
    
    const { type, name, phone, email, cnic, address, createdBy, caseId } = req.body;
    
    if (!type || !name) {
      return res.status(400).json({
        success: false,
        error: 'Type and Name are required'
      });
    }
    
    const party = new Party({
      type,
      name,
      phone: phone || '-',
      email: email || '-',
      cnic: cnic || '-',
      address: address || '-',
      createdBy: createdBy || 'Current User',
      userId: req.user?._id || null,  // ✅ FIX: req.user available hai toh use karein
      caseId: caseId || null
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
    
    const { type, name, phone, email, cnic, address, createdBy, caseId } = req.body;
    
    if (type) party.type = type;
    if (name) party.name = name;
    if (phone) party.phone = phone;
    if (email) party.email = email;
    if (cnic) party.cnic = cnic;
    if (address) party.address = address;
    if (createdBy) party.createdBy = createdBy;
    if (caseId !== undefined) party.caseId = caseId;
    
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