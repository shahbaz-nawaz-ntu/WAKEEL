// src/hooks/useProceedings.js - EMERGENCY FIX
import { useState, useCallback, useEffect } from 'react';
import toast from 'react-hot-toast';

let API_URL = import.meta.env.VITE_API_URL || '/api';
if (API_URL && API_URL !== '/api' && !API_URL.endsWith('/api')) {
  API_URL = `${API_URL.replace(/\/+$/, '')}/api`;
}

export const useProceedings = () => {
  const [proceedings, setProceedings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const getAuthHeader = () => {
    const token = localStorage.getItem('auth_token') || localStorage.getItem('token');
    const headers = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'ngrok-skip-browser-warning': 'true',
    };
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    return { headers };
  };

  // ============================================
  // fetchProceedings - EMERGENCY FIX ✅
  // ============================================
  const fetchProceedings = useCallback(async () => {
    console.log('📋 FETCHING PROCEEDINGS - STARTED');
    
    setLoading(true);
    setError(null);
    
    try {
      console.log('📋 Calling API:', `${API_URL}/proceedings`);
      const response = await fetch(`${API_URL}/proceedings`, {
        method: 'GET',
        ...getAuthHeader(),
      });

      console.log('📋 Response status:', response.status);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('📋 Response data:', data);

      let proceedingsData = [];
      if (data.success && data.data) {
        proceedingsData = data.data;
      } else if (Array.isArray(data)) {
        proceedingsData = data;
      } else if (data.data && Array.isArray(data.data)) {
        proceedingsData = data.data;
      } else {
        console.warn('⚠️ Unexpected response format:', data);
        proceedingsData = [];
      }

      console.log('✅ Extracted:', proceedingsData.length, 'proceedings');

      // Format each proceeding
      const formatted = proceedingsData.map(item => {
        let caseId = null;
        if (item.caseId) {
          if (typeof item.caseId === 'string') {
            caseId = item.caseId;
          } else if (typeof item.caseId === 'object') {
            caseId = item.caseId._id || item.caseId.id || null;
          }
        }
        if (!caseId && item.case) {
          if (typeof item.case === 'string') {
            caseId = item.case;
          } else if (typeof item.case === 'object') {
            caseId = item.case._id || item.case.id || null;
          }
        }
        
        return {
          ...item,
          id: item.id || item._id,
          caseId: caseId || item.caseId
        };
      });
      
      console.log('✅ Formatted:', formatted.length, 'proceedings');
      
      // ✅ UPDATE STATE
      setProceedings(formatted);
      console.log('✅ State updated with', formatted.length, 'proceedings');
      
      return { success: true, data: formatted };
      
    } catch (err) {
      console.error('❌ Error fetching proceedings:', err);
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
      console.log('📋 FETCHING PROCEEDINGS - ENDED');
    }
  }, []);

  // ============================================
  // fetchProceedingsByCase
  // ============================================
  const fetchProceedingsByCase = useCallback(async (caseId) => {
    setLoading(true);
    setError(null);
    try {
      console.log(`📋 Fetching proceedings for case: ${caseId}`);
      const response = await fetch(`${API_URL}/proceedings/case/${caseId}`, {
        method: 'GET',
        ...getAuthHeader(),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('📋 Case proceedings response:', data);

      let proceedingsData = [];
      if (data.success && data.data) {
        proceedingsData = data.data;
      } else if (Array.isArray(data)) {
        proceedingsData = data;
      } else if (data.data && Array.isArray(data.data)) {
        proceedingsData = data.data;
      }

      const formatted = proceedingsData.map(item => ({
        ...item,
        id: item.id || item._id,
        caseId: item.caseId?._id || item.caseId || caseId
      }));
      
      setProceedings(formatted);
      return { success: true, data: formatted };
      
    } catch (err) {
      console.error('❌ Error fetching case proceedings:', err);
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, []);

  // ============================================
  // addProceeding
  // ============================================
  const addProceeding = useCallback(async (proceedingData) => {
    setLoading(true);
    setError(null);
    try {
      console.log('📝 Adding new proceeding:', proceedingData);
      
      if (!proceedingData.caseId) {
        throw new Error('Case ID is required');
      }
      
      const response = await fetch(`${API_URL}/proceedings`, {
        method: 'POST',
        ...getAuthHeader(),
        body: JSON.stringify(proceedingData),
      });

      const result = await response.json();
      console.log('📝 Add proceeding response:', result);

      let newProceeding = result.success ? result.data : result;
      
      if (!newProceeding || !newProceeding._id) {
        throw new Error('Invalid response format');
      }

      let caseId = newProceeding.caseId;
      if (caseId && typeof caseId === 'object') {
        caseId = caseId._id || caseId.id || proceedingData.caseId;
      }
      
      const formattedProceeding = {
        ...newProceeding,
        id: newProceeding.id || newProceeding._id,
        caseId: caseId || proceedingData.caseId
      };
      
      setProceedings(prev => {
        const exists = prev.some(p => p.id === formattedProceeding.id || p._id === formattedProceeding._id);
        if (exists) {
          console.log('⚠️ Proceeding already exists, updating instead');
          return prev.map(p => (p.id === formattedProceeding.id || p._id === formattedProceeding._id) ? formattedProceeding : p);
        }
        console.log('✅ Adding new proceeding to state');
        return [formattedProceeding, ...prev];
      });
      
      console.log('✅ Proceeding added successfully');
      toast.success('Proceeding added successfully! ✅');
      return { success: true, data: formattedProceeding };
      
    } catch (err) {
      console.error('❌ Add proceeding error:', err);
      toast.error(err.message || 'Failed to add proceeding');
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, []);

  // ============================================
  // updateProceeding
  // ============================================
  const updateProceeding = useCallback(async (id, updatedData) => {
    setLoading(true);
    setError(null);
    try {
      console.log(`📝 Updating proceeding: ${id}`);
      
      const response = await fetch(`${API_URL}/proceedings/${id}`, {
        method: 'PUT',
        ...getAuthHeader(),
        body: JSON.stringify(updatedData),
      });

      const result = await response.json();
      console.log('📝 Update proceeding response:', result);

      let updated = result.success ? result.data : result;
      
      if (!updated || !updated._id) {
        throw new Error('Invalid response format');
      }

      const formatted = {
        ...updated,
        id: updated.id || updated._id,
        caseId: updated.caseId?._id || updated.caseId
      };
      
      setProceedings(prev => prev.map(item => 
        (item.id === id || item._id === id) ? formatted : item
      ));
      
      console.log('✅ Proceeding updated:', formatted);
      toast.success('Proceeding updated! 📝');
      return { success: true, data: formatted };
      
    } catch (err) {
      console.error('❌ Update proceeding error:', err);
      toast.error(err.message || 'Failed to update proceeding');
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, []);

  // ============================================
  // deleteProceeding
  // ============================================
  const deleteProceeding = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      console.log(`🗑️ Deleting proceeding: ${id}`);
      
      const response = await fetch(`${API_URL}/proceedings/${id}`, {
        method: 'DELETE',
        ...getAuthHeader(),
      });

      const result = await response.json();
      console.log('🗑️ Delete proceeding response:', result);

      if (result.success !== false) {
        setProceedings(prev => prev.filter(item => (item.id !== id && item._id !== id)));
        console.log('✅ Proceeding deleted:', id);
        toast.success('Proceeding deleted! 🗑️');
        return { success: true };
      }
      
      throw new Error(result.error || 'Failed to delete proceeding');
      
    } catch (err) {
      console.error('❌ Delete proceeding error:', err);
      toast.error(err.message || 'Failed to delete proceeding');
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, []);

  // ============================================
  // updateProceedingStatus
  // ============================================
  const updateProceedingStatus = useCallback(async (id, status) => {
    setLoading(true);
    setError(null);
    try {
      console.log(`📝 Updating proceeding status: ${id} → ${status}`);
      
      const response = await fetch(`${API_URL}/proceedings/${id}/status`, {
        method: 'PATCH',
        ...getAuthHeader(),
        body: JSON.stringify({ status }),
      });

      const result = await response.json();
      console.log('📝 Status update response:', result);

      if (result.success && result.data) {
        const updated = {
          ...result.data,
          id: result.data.id || result.data._id,
          caseId: result.data.caseId?._id || result.data.caseId
        };
        setProceedings(prev => prev.map(item => 
          (item.id === id || item._id === id) ? updated : item
        ));
        console.log('✅ Proceeding status updated:', updated);
        toast.success(`Status updated to ${status}`);
        return { success: true, data: updated };
      }
      toast.error(result.error || 'Failed to update status');
      return { success: false, error: result.error || 'Failed to update status' };
    } catch (err) {
      console.error('❌ Status update error:', err);
      toast.error('Failed to update status');
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, []);

  // ============================================
  // uploadDocument
  // ============================================
  const uploadDocument = useCallback(async (proceedingId, docType, file) => {
    setLoading(true);
    setError(null);
    try {
      console.log(`📤 Uploading ${docType} document to proceeding: ${proceedingId}`);
      
      const formData = new FormData();
      formData.append('file', file);
      
      const token = localStorage.getItem('auth_token') || localStorage.getItem('token');
      const response = await fetch(`${API_URL}/proceedings/${proceedingId}/documents/${docType}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      const result = await response.json();
      console.log('📤 Upload response:', result);

      if (result.success && result.data) {
        setProceedings(prev => prev.map(item => 
          (item.id === proceedingId || item._id === proceedingId) ? result.data : item
        ));
        console.log('✅ Document uploaded successfully');
        toast.success(`Document uploaded to ${docType}! 📄`);
        return { success: true, data: result.data, document: result.document };
      }
      toast.error(result.error || 'Failed to upload document');
      return { success: false, error: result.error || 'Failed to upload document' };
    } catch (err) {
      console.error('❌ Upload document error:', err);
      toast.error('Upload failed');
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, []);

  // ============================================
  // deleteDocument
  // ============================================
  const deleteDocument = useCallback(async (proceedingId, docType, docIndex) => {
    setLoading(true);
    setError(null);
    try {
      console.log(`🗑️ Deleting document ${docIndex} from ${docType}`);
      
      const response = await fetch(`${API_URL}/proceedings/${proceedingId}/documents/${docType}/${docIndex}`, {
        method: 'DELETE',
        ...getAuthHeader(),
      });

      const result = await response.json();
      console.log('🗑️ Delete response:', result);

      if (result.success && result.data) {
        setProceedings(prev => prev.map(item => 
          (item.id === proceedingId || item._id === proceedingId) ? result.data : item
        ));
        console.log('✅ Document deleted successfully');
        toast.success('Document deleted! 🗑️');
        return { success: true, data: result.data };
      }
      toast.error(result.error || 'Failed to delete document');
      return { success: false, error: result.error || 'Failed to delete document' };
    } catch (err) {
      console.error('❌ Delete document error:', err);
      toast.error('Delete failed');
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, []);

  // ============================================
  // viewDocument
  // ============================================
  const viewDocument = useCallback((proceedingId, docType, docIndex) => {
    const token = localStorage.getItem('auth_token') || localStorage.getItem('token');
    
    if (!token) {
      toast.error('Please login first');
      return;
    }
    
    console.log(`📄 Viewing document: ${docType}[${docIndex}] from proceeding ${proceedingId}`);
    
    const url = `${API_URL}/proceedings/${proceedingId}/documents/${docType}/${docIndex}/file?token=${token}`;
    window.open(url, '_blank');
    toast.success('📄 Opening document...');
  }, []);

  // ============================================
  // Auto-fetch on mount
  // ============================================
  useEffect(() => {
    let mounted = true;
    
    const fetchData = async () => {
      if (mounted) {
        console.log('📋 Auto-fetching proceedings on mount...');
        await fetchProceedings();
      }
    };
    
    fetchData();
    
    return () => {
      mounted = false;
    };
  }, [fetchProceedings]);

  // ============================================
  // Debug effect
  // ============================================
  useEffect(() => {
    console.log('📊 useProceedings - State updated:', proceedings.length, 'items');
    if (proceedings.length > 0) {
      console.log('📊 First proceeding caseId:', proceedings[0]?.caseId);
    }
  }, [proceedings]);

  return {
    proceedings,
    loading,
    error,
    fetchProceedings,
    fetchProceedingsByCase,
    addProceeding,
    updateProceeding,
    updateProceedingStatus,
    deleteProceeding,
    uploadDocument,
    deleteDocument,
    viewDocument,
  };
};