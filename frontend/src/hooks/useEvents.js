// src/hooks/useEvents.js - Add dummy data
import { useState, useEffect } from 'react';
import api from '../services/api';
import toast from 'react-hot-toast';

const dummyEvents = [
  {
    id: 'e1',
    title: 'Smith v. Johnson - Hearing',
    date: '2026-03-20',
    time: '10:00',
    type: 'hearing',
    location: 'Federal Court, Room 301',
    description: 'Initial hearing for Smith v. Johnson case',
  },
  {
    id: 'e2',
    title: 'State v. Williams - Motion Hearing',
    date: '2026-04-15',
    time: '14:30',
    type: 'hearing',
    location: 'State Court, Room 205',
    description: 'Motion to dismiss hearing',
  },
  {
    id: 'e3',
    title: 'Brown v. City of LA - Pre-trial Conference',
    date: '2026-02-28',
    time: '09:30',
    type: 'conference',
    location: 'Federal Court, Conference Room A',
    description: 'Pre-trial conference for civil rights case',
  },
];

export const useEvents = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // ============================================
  // FETCH EVENTS
  // ============================================
  const fetchEvents = async (filters = {}) => {
    setLoading(true);
    setError(null);
    
    try {
      const params = new URLSearchParams(filters).toString();
      const response = await api.get(`/events${params ? `?${params}` : ''}`);
      
      if (response.data.data && response.data.data.length > 0) {
        setEvents(response.data.data);
        return { success: true, data: response.data.data };
      }
      
      console.log('📅 Using dummy event data');
      setEvents(dummyEvents);
      return { success: true, data: dummyEvents };
      
    } catch (err) {
      const errorMsg = err.response?.data?.error || err.message;
      console.log('📅 API error, using dummy event data');
      setEvents(dummyEvents);
      
      if (!errorMsg.includes('Too many requests')) {
        toast.error('Using offline event data');
      }
      return { success: true, data: dummyEvents };
    } finally {
      setLoading(false);
    }
  };

  // ... rest of the functions

  useEffect(() => {
    fetchEvents();
  }, []);

  return {
    events,
    loading,
    error,
    fetchEvents,
    // ... other functions
  };
};