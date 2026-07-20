// src/hooks/useProceedings.js
import { useState, useCallback, useEffect } from 'react';
import toast from 'react-hot-toast';

const API_URL = 'https://2a95-2400-adc7-2918-d000-8cfe-551d-492d-ed50.ngrok-free.app/api';

export const useProceedings = () => {
  const [proceedings, setProceedings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const getAuthHeader = () => {
    const token = localStorage.getItem('auth_token') || localStorage.getItem('token');
    return {
      headers: {
        'Authorization': token ? `Bearer ${token}` : '',
        'Content-Type': 'application/json',
      },
    };
  };

  // Fetch all proceedings
  const fetchProceedings = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      console.log('📋 Fetching proceedings...');
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

      if (data.success && data.data) {
        console.log('✅ Proceedings loaded:', data.data.length);
        const formatted = data.data.map(item => ({
          ...item,
          id: item.id || item._id
        }));
        setProceedings(formatted);
        return { success: true, data: formatted };
      }
      
      throw new Error(data.error || 'Failed to fetch proceedings');
    } catch (err) {
      console.error('❌ Error fetching proceedings:', err);
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch proceedings for a specific case
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

      if (data.success && data.data) {
        const formatted = data.data.map(item => ({
          ...item,
          id: item.id || item._id
        }));
        setProceedings(formatted);
        return { success: true, data: formatted };
      }
      
      throw new Error(data.error || 'Failed to fetch proceedings');
    } catch (err) {
      console.error('❌ Error fetching case proceedings:', err);
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, []);

  // Add proceeding
  const addProceeding = useCallback(async (proceedingData) => {
    setLoading(true);
    setError(null);
    try {
      console.log('📝 Adding new proceeding:', proceedingData);
      
      const response = await fetch(`${API_URL}/proceedings`, {
        method: 'POST',
        ...getAuthHeader(),
        body: JSON.stringify(proceedingData),
      });

      const result = await response.json();
      console.log('📝 Add proceeding response:', result);

      if (result.success && result.data) {
        const newProceeding = {
          ...result.data,
          id: result.data.id || result.data._id
        };
        setProceedings(prev => [newProceeding, ...prev]);
        console.log('✅ Proceeding added:', newProceeding);
        toast.success('Proceeding added successfully! ✅');
        return { success: true, data: newProceeding };
      }
      toast.error(result.error || 'Failed to add proceeding');
      return { success: false, error: result.error || 'Failed to add proceeding' };
    } catch (err) {
      console.error('❌ Add proceeding error:', err);
      toast.error('Failed to add proceeding');
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, []);

  // Update proceeding
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

      if (result.success && result.data) {
        const updated = {
          ...result.data,
          id: result.data.id || result.data._id
        };
        setProceedings(prev => prev.map(item => 
          (item.id === id || item._id === id) ? updated : item
        ));
        console.log('✅ Proceeding updated:', updated);
        toast.success('Proceeding updated! 📝');
        return { success: true, data: updated };
      }
      toast.error(result.error || 'Failed to update proceeding');
      return { success: false, error: result.error || 'Failed to update proceeding' };
    } catch (err) {
      console.error('❌ Update proceeding error:', err);
      toast.error('Failed to update proceeding');
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, []);

  // Update proceeding status
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
          id: result.data.id || result.data._id
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

  // ✅ UPLOAD DOCUMENT
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

  // ✅ DELETE DOCUMENT
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

  // ✅ VIEW DOCUMENT - FIXED (No toast.info)
  const viewDocument = useCallback((proceedingId, docType, docIndex) => {
    const token = localStorage.getItem('auth_token') || localStorage.getItem('token');
    
    if (!token) {
      toast.error('Please login first');
      return;
    }
    
    console.log(`📄 Viewing document: ${docType}[${docIndex}] from proceeding ${proceedingId}`);
    
    // Open in new tab with token in URL
    const url = `${API_URL}/proceedings/${proceedingId}/documents/${docType}/${docIndex}/file?token=${token}`;
    window.open(url, '_blank');
    toast.success('📄 Opening document...');
  }, []);

  // Delete proceeding
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

      if (result.success) {
        setProceedings(prev => prev.filter(item => (item.id !== id && item._id !== id)));
        console.log('✅ Proceeding deleted:', id);
        toast.success('Proceeding deleted! 🗑️');
        return { success: true };
      }
      toast.error(result.error || 'Failed to delete proceeding');
      return { success: false, error: result.error || 'Failed to delete proceeding' };
    } catch (err) {
      console.error('❌ Delete proceeding error:', err);
      toast.error('Failed to delete proceeding');
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, []);

  // Auto-fetch on mount
  useEffect(() => {
    fetchProceedings();
  }, [fetchProceedings]);

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