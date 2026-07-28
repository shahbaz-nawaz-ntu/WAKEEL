// src/hooks/useReferences.js
import { useState, useCallback, useEffect } from 'react';
import toast from 'react-hot-toast';

// ✅ FIX: Use relative URL for development with proxy
// The proxy will forward /api to http://localhost:5000/api
const API_URL = '/api';

export const useReferences = () => {
  const [references, setReferences] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const getAuthHeader = () => {
    const token = localStorage.getItem('auth_token') || localStorage.getItem('token');
    const headers = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    return { headers };
  };

  const fetchReferences = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      console.log('📚 Fetching references from:', `${API_URL}/references`);
      const response = await fetch(`${API_URL}/references`, {
        method: 'GET',
        ...getAuthHeader(),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('📚 Response data:', data);

      if (data.success && data.data) {
        const formattedReferences = data.data.map(ref => ({
          ...ref,
          id: ref.id || ref._id
        }));
        setReferences(formattedReferences);
        return { success: true, data: formattedReferences };
      }
      return { success: false, error: data.error || 'Failed to fetch references' };
    } catch (err) {
      console.error('❌ Error fetching references:', err);
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, []);

  const addReference = useCallback(async (referenceData) => {
    setLoading(true);
    setError(null);
    try {
      console.log('📤 Adding reference:', referenceData);
      
      const response = await fetch(`${API_URL}/references`, {
        method: 'POST',
        ...getAuthHeader(),
        body: JSON.stringify(referenceData),
      });

      const result = await response.json();
      console.log('📤 Add reference response:', result);

      if (result.success && result.data) {
        const newReference = {
          ...result.data,
          id: result.data.id || result.data._id
        };
        setReferences(prev => [newReference, ...prev]);
        toast.success('✅ Reference case added successfully!');
        return { success: true, data: newReference };
      }
      toast.error(result.error || 'Failed to add reference');
      return { success: false, error: result.error || 'Failed to add reference' };
    } catch (err) {
      console.error('❌ Add reference error:', err);
      toast.error('Failed to add reference');
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, []);

  const updateReference = useCallback(async (id, updatedData) => {
    setLoading(true);
    setError(null);
    try {
      console.log(`📝 Updating reference: ${id}`);
      
      const response = await fetch(`${API_URL}/references/${id}`, {
        method: 'PUT',
        ...getAuthHeader(),
        body: JSON.stringify(updatedData),
      });

      const result = await response.json();
      console.log('📝 Update reference response:', result);

      if (result.success && result.data) {
        const updatedReference = {
          ...result.data,
          id: result.data.id || result.data._id
        };
        setReferences(prev => prev.map(r => 
          (r.id === id || r._id === id) ? updatedReference : r
        ));
        toast.success('✅ Reference updated successfully!');
        return { success: true, data: updatedReference };
      }
      toast.error(result.error || 'Failed to update reference');
      return { success: false, error: result.error || 'Failed to update reference' };
    } catch (err) {
      console.error('❌ Update reference error:', err);
      toast.error('Failed to update reference');
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteReference = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      console.log(`🗑️ Deleting reference: ${id}`);
      
      const response = await fetch(`${API_URL}/references/${id}`, {
        method: 'DELETE',
        ...getAuthHeader(),
      });

      const result = await response.json();
      console.log('🗑️ Delete reference response:', result);

      if (result.success) {
        setReferences(prev => prev.filter(r => (r.id !== id && r._id !== id)));
        toast.success('✅ Reference deleted successfully!');
        return { success: true };
      }
      toast.error(result.error || 'Failed to delete reference');
      return { success: false, error: result.error || 'Failed to delete reference' };
    } catch (err) {
      console.error('❌ Delete reference error:', err);
      toast.error('Failed to delete reference');
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, []);

  // Auto-fetch on mount
  useEffect(() => {
    fetchReferences();
  }, [fetchReferences]);

  return {
    references,
    loading,
    error,
    fetchReferences,
    addReference,
    updateReference,
    deleteReference,
  };
};