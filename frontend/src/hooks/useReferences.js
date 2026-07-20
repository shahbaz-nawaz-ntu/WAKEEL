// src/hooks/useReferences.js
import { useState, useCallback, useEffect } from 'react';

const API_URL = 'https://2a95-2400-adc7-2918-d000-8cfe-551d-492d-ed50.ngrok-free.app/api';

export const useReferences = () => {
  const [references, setReferences] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const getAuthHeader = () => {
    const token = localStorage.getItem('auth_token') || localStorage.getItem('token');
    return {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    };
  };

  const fetchReferences = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      console.log('📚 Fetching references...');
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
        setReferences(data.data);
        return { success: true, data: data.data };
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
        setReferences(prev => [result.data, ...prev]);
        toast.success('✅ Reference case added successfully!');
        return { success: true, data: result.data };
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
        setReferences(prev => prev.map(r => 
          (r.id === id || r._id === id) ? result.data : r
        ));
        toast.success('✅ Reference updated successfully!');
        return { success: true, data: result.data };
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