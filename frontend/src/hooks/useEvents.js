// src/hooks/useEvents.js
import { useState, useCallback, useEffect } from 'react';
import toast from 'react-hot-toast';

// ✅ FIX: Use relative URL for development with proxy
const API_URL = '/api';

const dummyEvents = [
  {
    id: 'e1',
    title: 'Smith v. Johnson - Hearing',
    date: '2026-03-20',
    time: '10:00',
    type: 'hearing',
    location: 'Federal Court, Room 301',
    description: 'Initial hearing for Smith v. Johnson case',
    caseId: '1',
    status: 'scheduled',
  },
  {
    id: 'e2',
    title: 'State v. Williams - Motion Hearing',
    date: '2026-04-15',
    time: '14:30',
    type: 'hearing',
    location: 'State Court, Room 205',
    description: 'Motion to dismiss hearing',
    caseId: '2',
    status: 'scheduled',
  },
  {
    id: 'e3',
    title: 'Brown v. City of LA - Pre-trial Conference',
    date: '2026-02-28',
    time: '09:30',
    type: 'conference',
    location: 'Federal Court, Conference Room A',
    description: 'Pre-trial conference for civil rights case',
    caseId: '3',
    status: 'completed',
  },
];

export const useEvents = () => {
  const [events, setEvents] = useState([]);
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

  // ============================================
  // FETCH EVENTS
  // ============================================
  const fetchEvents = useCallback(async (filters = {}) => {
    setLoading(true);
    setError(null);
    
    try {
      const params = new URLSearchParams(filters).toString();
      const url = `${API_URL}/events${params ? `?${params}` : ''}`;
      console.log('📅 Fetching events from:', url);
      
      const response = await fetch(url, {
        method: 'GET',
        ...getAuthHeader(),
      });

      console.log('📅 Response status:', response.status);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('📅 Response data:', data);
      
      if (data.success && data.data && data.data.length > 0) {
        const formattedEvents = data.data.map(event => ({
          ...event,
          id: event.id || event._id
        }));
        setEvents(formattedEvents);
        return { success: true, data: formattedEvents };
      }
      
      // Use dummy data as fallback
      console.log('📅 Using dummy event data');
      setEvents(dummyEvents);
      return { success: true, data: dummyEvents };
      
    } catch (err) {
      console.error('❌ Error fetching events:', err);
      const errorMsg = err.message || 'Failed to fetch events';
      setError(errorMsg);
      
      // Use dummy data as fallback
      console.log('📅 API error, using dummy event data');
      setEvents(dummyEvents);
      
      if (!errorMsg.includes('Too many requests')) {
        toast.error('Using offline event data');
      }
      return { success: true, data: dummyEvents };
    } finally {
      setLoading(false);
    }
  }, []);

  // ============================================
  // ADD EVENT
  // ============================================
  const addEvent = useCallback(async (eventData) => {
    setLoading(true);
    setError(null);
    try {
      console.log('📅 Adding new event:', eventData);
      
      const response = await fetch(`${API_URL}/events`, {
        method: 'POST',
        ...getAuthHeader(),
        body: JSON.stringify(eventData),
      });

      const result = await response.json();
      console.log('📅 Add event response:', result);

      if (result.success && result.data) {
        const newEvent = {
          ...result.data,
          id: result.data.id || result.data._id
        };
        setEvents(prev => [newEvent, ...prev]);
        toast.success('Event added successfully! ✅');
        return { success: true, data: newEvent };
      }
      
      // If API fails, add locally
      const tempEvent = {
        ...eventData,
        id: 'temp-' + Date.now(),
        status: 'scheduled',
      };
      setEvents(prev => [tempEvent, ...prev]);
      toast.success('Event added locally! 📅');
      return { success: true, data: tempEvent };
      
    } catch (err) {
      console.error('❌ Add event error:', err);
      
      // Add locally even if API fails
      const tempEvent = {
        ...eventData,
        id: 'temp-' + Date.now(),
        status: 'scheduled',
      };
      setEvents(prev => [tempEvent, ...prev]);
      toast.success('Event added locally! 📅');
      return { success: true, data: tempEvent };
    } finally {
      setLoading(false);
    }
  }, []);

  // ============================================
  // UPDATE EVENT
  // ============================================
  const updateEvent = useCallback(async (id, updatedData) => {
    setLoading(true);
    setError(null);
    try {
      console.log(`📅 Updating event: ${id}`);
      
      const response = await fetch(`${API_URL}/events/${id}`, {
        method: 'PUT',
        ...getAuthHeader(),
        body: JSON.stringify(updatedData),
      });

      const result = await response.json();
      console.log('📅 Update event response:', result);

      if (result.success && result.data) {
        const updatedEvent = {
          ...result.data,
          id: result.data.id || result.data._id
        };
        setEvents(prev => prev.map(event => 
          (event.id === id || event._id === id) ? updatedEvent : event
        ));
        toast.success('Event updated! ✅');
        return { success: true, data: updatedEvent };
      }
      
      // Update locally if API fails
      setEvents(prev => prev.map(event => 
        (event.id === id || event._id === id) ? { ...event, ...updatedData } : event
      ));
      toast.success('Event updated locally! 📅');
      return { success: true, data: { ...updatedData, id } };
      
    } catch (err) {
      console.error('❌ Update event error:', err);
      
      // Update locally if API fails
      setEvents(prev => prev.map(event => 
        (event.id === id || event._id === id) ? { ...event, ...updatedData } : event
      ));
      toast.success('Event updated locally! 📅');
      return { success: true, data: { ...updatedData, id } };
    } finally {
      setLoading(false);
    }
  }, []);

  // ============================================
  // DELETE EVENT
  // ============================================
  const deleteEvent = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      console.log(`🗑️ Deleting event: ${id}`);
      
      const response = await fetch(`${API_URL}/events/${id}`, {
        method: 'DELETE',
        ...getAuthHeader(),
      });

      const result = await response.json();
      console.log('🗑️ Delete event response:', result);

      if (result.success) {
        setEvents(prev => prev.filter(event => (event.id !== id && event._id !== id)));
        toast.success('Event deleted! 🗑️');
        return { success: true };
      }
      
      // Delete locally if API fails
      setEvents(prev => prev.filter(event => (event.id !== id && event._id !== id)));
      toast.success('Event deleted locally! 🗑️');
      return { success: true };
      
    } catch (err) {
      console.error('❌ Delete event error:', err);
      
      // Delete locally if API fails
      setEvents(prev => prev.filter(event => (event.id !== id && event._id !== id)));
      toast.success('Event deleted locally! 🗑️');
      return { success: true };
    } finally {
      setLoading(false);
    }
  }, []);

  // ============================================
  // GET EVENT BY ID
  // ============================================
  const getEvent = useCallback((id) => {
    return events.find(event => event.id === id || event._id === id);
  }, [events]);

  // ============================================
  // GET EVENTS BY CASE
  // ============================================
  const getEventsByCase = useCallback((caseId) => {
    return events.filter(event => event.caseId === caseId);
  }, [events]);

  // ============================================
  // AUTO-FETCH ON MOUNT
  // ============================================
  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  return {
    events,
    loading,
    error,
    fetchEvents,
    addEvent,
    updateEvent,
    deleteEvent,
    getEvent,
    getEventsByCase,
  };
};