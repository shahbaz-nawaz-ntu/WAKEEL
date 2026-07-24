// src/hooks/useCases.js
import { useState, useCallback, useEffect } from 'react';

// ✅ FIX: Use relative URL for development with proxy
// or use environment variable for production
const API_URL = import.meta.env.VITE_API_URL || '/api';

export const useCases = () => {
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Helper to get auth header
  const getAuthHeader = () => {
    const token = localStorage.getItem('auth_token') || localStorage.getItem('token');
    console.log('🔑 Token:', token ? 'Present' : 'Missing');
    
    // ✅ FIX: Return proper headers object for fetch
    const headers = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    return { headers };
  };

  // Fetch all cases
  const fetchCases = useCallback(async (params = {}) => {
    setLoading(true);
    setError(null);
    try {
      const queryString = new URLSearchParams(params).toString();
      const url = `${API_URL}/cases${queryString ? `?${queryString}` : ''}`;
      console.log('📡 Fetching cases from:', url);
      
      // ✅ FIX: Add mode: 'cors' and credentials
      const response = await fetch(url, {
        method: 'GET',
        ...getAuthHeader(),
        mode: 'cors',
        credentials: 'include',
      });

      console.log('📡 Response status:', response.status);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('📦 Response data:', data);

      if (data.success && data.data) {
        console.log('✅ Cases loaded:', data.data.length, 'cases');
        const formattedCases = data.data.map(c => ({
          ...c,
          id: c.id || c._id
        }));
        setCases(formattedCases);
        return { success: true, data: formattedCases };
      }
      
      throw new Error(data.error || 'Failed to fetch cases');
    } catch (err) {
      console.error('❌ Error fetching cases:', err);
      const errorMsg = err.message || 'Failed to fetch cases';
      setError(errorMsg);
      
      // Try test route as fallback
      try {
        console.log('🔄 Trying test route...');
        const testResponse = await fetch(`${API_URL}/test/cases`, {
          method: 'GET',
          mode: 'cors',
          credentials: 'include',
        });
        const testData = await testResponse.json();
        if (testData.success && testData.data) {
          console.log('✅ Test route loaded:', testData.data.length, 'cases');
          const formattedCases = testData.data.map(c => ({
            ...c,
            id: c.id || c._id
          }));
          setCases(formattedCases);
          return { success: true, data: formattedCases };
        }
      } catch (testErr) {
        console.error('❌ Test route also failed:', testErr);
      }
      
      // Use dummy data as last resort
      const dummyCases = getDummyCases();
      setCases(dummyCases);
      return { success: false, error: errorMsg, data: dummyCases };
    } finally {
      setLoading(false);
    }
  }, []);

  // ✅ NEW: Fetch a single case by ID
  const fetchCaseById = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      console.log(`📡 Fetching case by ID: ${id}`);
      const url = `${API_URL}/cases/${id}`;
      
      const response = await fetch(url, {
        method: 'GET',
        ...getAuthHeader(),
        mode: 'cors',
        credentials: 'include',
      });

      console.log('📡 Response status:', response.status);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('📦 Case data:', data);

      if (data.success && data.data) {
        const formattedCase = {
          ...data.data,
          id: data.data.id || data.data._id
        };
        return { success: true, data: formattedCase };
      }
      
      throw new Error(data.error || 'Failed to fetch case');
    } catch (err) {
      console.error('❌ Error fetching case:', err);
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, []);

  // Auto-fetch on mount
  useEffect(() => {
    console.log('🔄 useCases mounted - fetching cases...');
    fetchCases();
  }, [fetchCases]);

  // ✅ FIXED: Add case
  const addCase = useCallback(async (caseData) => {
    setLoading(true);
    setError(null);
    try {
      console.log('📤 Adding new case:', caseData);
      
      const response = await fetch(`${API_URL}/cases`, {
        method: 'POST',
        ...getAuthHeader(),
        body: JSON.stringify(caseData),
        mode: 'cors',
        credentials: 'include',
      });

      const result = await response.json();
      console.log('📦 Add case response:', result);

      if (result.success && result.data) {
        const newCase = {
          ...result.data,
          id: result.data.id || result.data._id
        };
        
        setCases(prev => [newCase, ...prev]);
        console.log('✅ Case added successfully:', newCase);
        return { success: true, data: newCase };
      } else {
        console.error('❌ Add case failed:', result.error);
        return { success: false, error: result.error || 'Failed to add case' };
      }
    } catch (err) {
      const errorMsg = err.message || 'Failed to add case';
      console.error('❌ Add case error:', err);
      setError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  }, []);

  // ✅ FIXED: Update case
  const updateCase = useCallback(async (id, updatedData) => {
    setLoading(true);
    setError(null);
    try {
      console.log(`📤 Updating case: ${id}`);
      console.log('📤 Update data:', updatedData);
      
      // Clean up the data - remove any undefined values
      const cleanData = {};
      Object.keys(updatedData).forEach(key => {
        if (updatedData[key] !== undefined && updatedData[key] !== null) {
          cleanData[key] = updatedData[key];
        }
      });
      
      console.log('📤 Clean data:', cleanData);
      
      const response = await fetch(`${API_URL}/cases/${id}`, {
        method: 'PUT',
        ...getAuthHeader(),
        body: JSON.stringify(cleanData),
        mode: 'cors',
        credentials: 'include',
      });

      console.log('📡 Response status:', response.status);
      
      const result = await response.json();
      console.log('📦 Update response:', result);

      if (result.success && result.data) {
        const updatedCase = {
          ...result.data,
          id: result.data.id || result.data._id
        };
        
        // Update the cases array
        setCases(prev => {
          const newCases = prev.map(c => 
            (c.id === id || c._id === id) ? updatedCase : c
          );
          console.log('📊 Updated cases array:', newCases.length, 'cases');
          return newCases;
        });
        
        console.log('✅ Case updated:', updatedCase);
        return { success: true, data: updatedCase };
      } else {
        console.error('❌ Update failed:', result.error);
        return { success: false, error: result.error || 'Failed to update case' };
      }
    } catch (err) {
      const errorMsg = err.message || 'Failed to update case';
      console.error('❌ Update error:', err);
      setError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  }, []);

  // Delete case
  const deleteCase = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      console.log('🗑️ Deleting case:', id);
      
      const response = await fetch(`${API_URL}/cases/${id}`, {
        method: 'DELETE',
        ...getAuthHeader(),
        mode: 'cors',
        credentials: 'include',
      });

      const result = await response.json();
      console.log('📦 Delete response:', result);

      if (result.success) {
        setCases(prev => prev.filter(c => (c.id !== id && c._id !== id)));
        console.log('✅ Case deleted:', id);
        return { success: true };
      }
      return { success: false, error: result.error || 'Failed to delete case' };
    } catch (err) {
      const errorMsg = err.message || 'Failed to delete case';
      console.error('❌ Delete error:', err);
      setError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  }, []);

  // Update case status
  const updateCaseStatus = useCallback(async (id, status) => {
    setLoading(true);
    setError(null);
    try {
      console.log(`📤 Updating status for case: ${id} → ${status}`);
      
      const response = await fetch(`${API_URL}/cases/${id}/status`, {
        method: 'PATCH',
        ...getAuthHeader(),
        body: JSON.stringify({ status }),
        mode: 'cors',
        credentials: 'include',
      });

      const result = await response.json();
      console.log('📦 Status update response:', result);

      if (result.success && result.data) {
        const updatedCase = {
          ...result.data,
          id: result.data.id || result.data._id
        };
        
        setCases(prev => prev.map(c => 
          (c.id === id || c._id === id) ? updatedCase : c
        ));
        console.log('✅ Status updated for case:', id, '→', status);
        return { success: true, data: updatedCase };
      }
      return { success: false, error: result.error || 'Failed to update status' };
    } catch (err) {
      const errorMsg = err.message || 'Failed to update status';
      console.error('❌ Status update error:', err);
      setError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  }, []);

  // Get case statistics
  const getStats = useCallback(() => {
    const total = cases.length;
    const active = cases.filter(c => c.status === 'active').length;
    const pending = cases.filter(c => c.status === 'pending').length;
    const closed = cases.filter(c => c.status === 'closed').length;
    return { total, active, pending, closed };
  }, [cases]);

  // Dummy data
  const getDummyCases = () => {
    return [
      {
        id: '1',
        _id: '1',
        caseNumber: '2024-CV-0001',
        caseTitle: 'Smith vs. Johnson Construction',
        title: 'Smith vs. Johnson Construction',
        status: 'active',
        priority: 'High',
        caseType: 'Civil',
        description: 'Contract dispute between two parties',
        date: '2024-01-15',
        amount: '$250,000',
        assignedTo: 'John Doe',
        party: 'Plaintiff',
        hearings: 2,
        documentsCount: 5,
        judge: 'Hon. Sarah Williams',
        attorneys: 'Plaintiff: Robert Miller | Defendant: Jessica Brown',
        location: 'Superior Court',
        court: 'District Court',
        nexthearing: '2024-08-20',
        remarks: 'Pre-trial conference scheduled.',
        createdAt: '2024-01-15T10:00:00Z',
        updatedAt: '2024-06-20T14:30:00Z'
      },
      {
        id: '2',
        _id: '2',
        caseNumber: '2024-CV-0002',
        caseTitle: 'Williams vs. State',
        title: 'Williams vs. State',
        status: 'pending',
        priority: 'Medium',
        caseType: 'Criminal',
        description: 'Criminal case involving theft',
        date: '2024-02-20',
        amount: 'N/A',
        assignedTo: 'Jane Smith',
        party: 'Defendant',
        hearings: 1,
        documentsCount: 3,
        judge: 'Hon. Michael Chen',
        attorneys: 'Public Defender: David Kim | Prosecutor: Lisa Park',
        location: 'Criminal Court',
        court: 'Superior Court',
        nexthearing: '2024-07-15',
        remarks: 'Awaiting evidence disclosure.',
        createdAt: '2024-02-20T09:30:00Z',
        updatedAt: '2024-06-10T11:20:00Z'
      }
    ];
  };

  return {
    cases,
    loading,
    error,
    fetchCases,
    fetchCaseById, // ✅ NEW: Added this
    addCase,
    updateCase,
    deleteCase,
    updateCaseStatus,
    getStats,
  };
};