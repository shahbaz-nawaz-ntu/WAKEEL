// src/hooks/useComments.js
import { useState, useCallback, useEffect } from 'react';
import toast from 'react-hot-toast';

let API_URL = import.meta.env.VITE_API_URL || '/api';
if (API_URL && API_URL !== '/api' && !API_URL.endsWith('/api')) {
  API_URL = `${API_URL.replace(/\/+$/, '')}/api`;
}

const useComments = () => {
  const [comments, setComments] = useState([]);
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

  const fetchComments = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      console.log('📋 Fetching comments...');
      const response = await fetch(`${API_URL}/comments`, {
        method: 'GET',
        ...getAuthHeader(),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('📋 Comments response:', data);

      let commentsData = [];
      if (data.success && data.data) {
        commentsData = data.data;
      } else if (Array.isArray(data)) {
        commentsData = data;
      } else if (data.data && Array.isArray(data.data)) {
        commentsData = data.data;
      }

      // ✅ FIX: Direct caseId - no nesting
      const formatted = commentsData.map(item => ({
        ...item,
        id: item.id || item._id,
        caseId: item.caseId || item.case_id || item.case  // ✅ Direct caseId
      }));
      
      setComments(formatted);
      
      // ✅ Store globally
      window.__allComments = formatted;
      console.log('✅ Comments loaded and stored globally:', formatted.length);
      
      return { success: true, data: formatted };
      
    } catch (err) {
      console.error('❌ Error fetching comments:', err);
      setError(err.message);
      setComments([]);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, []);

  const addComment = useCallback(async (data) => {
    setLoading(true);
    setError(null);
    try {
      console.log('📝 Adding comment:', data);
      const response = await fetch(`${API_URL}/comments`, {
        method: 'POST',
        ...getAuthHeader(),
        body: JSON.stringify(data),
      });

      const result = await response.json();
      console.log('📝 Add comment response:', result);

      let newComment = result.success ? result.data : result;
      
      if (!newComment || !newComment._id) {
        throw new Error('Invalid response format');
      }

      const formatted = {
        ...newComment,
        id: newComment.id || newComment._id,
        caseId: newComment.caseId || newComment.case_id || data.caseId  // ✅ Direct caseId
      };
      
      setComments(prev => {
        const exists = prev.some(c => c.id === formatted.id || c._id === formatted._id);
        if (exists) {
          return prev.map(c => (c.id === formatted.id || c._id === formatted._id) ? formatted : c);
        }
        return [formatted, ...prev];
      });
      
      // ✅ Update global
      window.__allComments = [formatted, ...(window.__allComments || [])];
      
      console.log('✅ Comment added:', formatted);
      toast.success('Comment added! 💬');
      return { success: true, data: formatted };
      
    } catch (err) {
      console.error('❌ Add comment error:', err);
      toast.error(err.message || 'Failed to add comment');
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, []);

  const updateComment = useCallback(async (id, data) => {
    setLoading(true);
    setError(null);
    try {
      console.log(`📝 Updating comment: ${id}`);
      const response = await fetch(`${API_URL}/comments/${id}`, {
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
        caseId: updated.caseId || updated.case_id  // ✅ Direct caseId
      };
      
      setComments(prev => prev.map(c => (c.id === id || c._id === id) ? formatted : c));
      
      // ✅ Update global
      window.__allComments = window.__allComments?.map(c => 
        (c.id === id || c._id === id) ? formatted : c
      ) || [];
      
      console.log('✅ Comment updated:', formatted);
      toast.success('Comment updated! 📝');
      return { success: true, data: formatted };
      
    } catch (err) {
      console.error('❌ Update comment error:', err);
      toast.error(err.message || 'Failed to update comment');
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteComment = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      console.log(`🗑️ Deleting comment: ${id}`);
      const response = await fetch(`${API_URL}/comments/${id}`, {
        method: 'DELETE',
        ...getAuthHeader(),
      });

      const result = await response.json();
      console.log('🗑️ Delete comment response:', result);

      if (result.success !== false) {
        setComments(prev => prev.filter(c => c.id !== id && c._id !== id));
        
        // ✅ Update global
        window.__allComments = window.__allComments?.filter(c => 
          c.id !== id && c._id !== id
        ) || [];
        
        console.log('✅ Comment deleted:', id);
        toast.success('Comment deleted! 🗑️');
        return { success: true };
      }
      throw new Error(result.error || 'Failed to delete comment');
      
    } catch (err) {
      console.error('❌ Delete comment error:', err);
      toast.error(err.message || 'Failed to delete comment');
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let mounted = true;
    const fetchData = async () => {
      if (mounted) {
        await fetchComments();
      }
    };
    fetchData();
    return () => { mounted = false; };
  }, [fetchComments]);

  return {
    comments,
    loading,
    error,
    fetchComments,
    addComment,
    updateComment,
    deleteComment,
  };
};

export default useComments;