// frontend/src/hooks/useParties.js
import { useState, useCallback, useEffect } from 'react';
import toast from 'react-hot-toast';

const API_URL = '/api';

const useParties = () => {
  const [parties, setParties] = useState([]);
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

  const fetchParties = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      console.log('📋 Fetching parties...');
      const response = await fetch(`${API_URL}/parties`, {
        method: 'GET',
        ...getAuthHeader(),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('📋 Parties response:', data);

      let partiesData = [];
      if (data.success && data.data) {
        partiesData = data.data;
      } else if (Array.isArray(data)) {
        partiesData = data;
      } else if (data.data && Array.isArray(data.data)) {
        partiesData = data.data;
      }

      const formatted = partiesData.map(item => ({
        ...item,
        id: item.id || item._id,
        caseId: item.caseId || item.case_id || item.case || null
      }));
      
      setParties(formatted);
      
      // ✅ Store globally
      window.__allParties = formatted;
      console.log('✅ Parties loaded and stored globally:', formatted.length);
      
      return { success: true, data: formatted };
      
    } catch (err) {
      console.error('❌ Error fetching parties:', err);
      setError(err.message);
      setParties([]);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, []);

  const addParty = useCallback(async (data) => {
    setLoading(true);
    setError(null);
    try {
      console.log('📝 Adding party:', data);
      const response = await fetch(`${API_URL}/parties`, {
        method: 'POST',
        ...getAuthHeader(),
        body: JSON.stringify(data),
      });

      const result = await response.json();
      console.log('📝 Add party response:', result);

      let newParty = result.success ? result.data : result;
      
      if (!newParty || !newParty._id) {
        throw new Error('Invalid response format');
      }

      const formatted = {
        ...newParty,
        id: newParty.id || newParty._id,
        caseId: newParty.caseId || newParty.case_id || data.caseId || null
      };
      
      setParties(prev => {
        const exists = prev.some(p => p.id === formatted.id || p._id === formatted._id);
        if (exists) {
          return prev.map(p => (p.id === formatted.id || p._id === formatted._id) ? formatted : p);
        }
        return [formatted, ...prev];
      });
      
      // ✅ Update global
      window.__allParties = [formatted, ...(window.__allParties || [])];
      
      console.log('✅ Party added:', formatted);
      toast.success('Party added! 👤');
      return { success: true, data: formatted };
      
    } catch (err) {
      console.error('❌ Add party error:', err);
      toast.error(err.message || 'Failed to add party');
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, []);

  const updateParty = useCallback(async (id, data) => {
    setLoading(true);
    setError(null);
    try {
      console.log(`📝 Updating party: ${id}`);
      const response = await fetch(`${API_URL}/parties/${id}`, {
        method: 'PUT',
        ...getAuthHeader(),
        body: JSON.stringify(data),
      });

      const result = await response.json();
      let updated = result.success ? result.data : result;
      
      if (!updated || !updated._id) {
        throw new Error('Invalid response format');
      }

      const formatted = {
        ...updated,
        id: updated.id || updated._id,
        caseId: updated.caseId || updated.case_id || null
      };
      
      setParties(prev => prev.map(p => (p.id === id || p._id === id) ? formatted : p));
      
      // ✅ Update global
      window.__allParties = window.__allParties?.map(p => 
        (p.id === id || p._id === id) ? formatted : p
      ) || [];
      
      console.log('✅ Party updated:', formatted);
      toast.success('Party updated! 📝');
      return { success: true, data: formatted };
      
    } catch (err) {
      console.error('❌ Update party error:', err);
      toast.error(err.message || 'Failed to update party');
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteParty = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      console.log(`🗑️ Deleting party: ${id}`);
      const response = await fetch(`${API_URL}/parties/${id}`, {
        method: 'DELETE',
        ...getAuthHeader(),
      });

      const result = await response.json();
      console.log('🗑️ Delete party response:', result);

      if (result.success !== false) {
        setParties(prev => prev.filter(p => p.id !== id && p._id !== id));
        
        // ✅ Update global
        window.__allParties = window.__allParties?.filter(p => 
          p.id !== id && p._id !== id
        ) || [];
        
        console.log('✅ Party deleted:', id);
        toast.success('Party deleted! 🗑️');
        return { success: true };
      }
      throw new Error(result.error || 'Failed to delete party');
      
    } catch (err) {
      console.error('❌ Delete party error:', err);
      toast.error(err.message || 'Failed to delete party');
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let mounted = true;
    const fetchData = async () => {
      if (mounted) {
        await fetchParties();
      }
    };
    fetchData();
    return () => { mounted = false; };
  }, [fetchParties]);

  return {
    parties,
    loading,
    error,
    fetchParties,
    addParty,
    updateParty,
    deleteParty,
  };
};

export default useParties;