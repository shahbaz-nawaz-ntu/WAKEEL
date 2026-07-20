import React, { useState, useEffect } from 'react';
import { 
  FaCalendarAlt, FaClock, FaMapMarkerAlt, 
  FaChevronLeft, FaChevronRight, FaFileAlt,
  FaUsers, FaGavel, FaCircle, FaPlusCircle,
  FaTimes, FaEdit, FaTrash, FaSave, FaSpinner,
  FaSync
} from 'react-icons/fa';
import { toast } from 'react-hot-toast';

const CalendarView = ({ events = [], onAddEvent, onEditEvent, onDeleteEvent }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showAddEventModal, setShowAddEventModal] = useState(false);
  const [showEditEventModal, setShowEditEventModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [localEvents, setLocalEvents] = useState(events);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Update local events when prop changes
  useEffect(() => {
    console.log('📅 CalendarView - Events received:', events);
    console.log('📅 CalendarView - Events count:', events?.length || 0);
    setLocalEvents(events || []);
  }, [events]);

  const [formData, setFormData] = useState({
    title: '',
    date: new Date().toISOString().split('T')[0],
    time: '10:00',
    type: 'hearing',
    location: '',
    description: '',
    caseId: '',
  });

  const eventTypes = [
    { value: 'hearing', label: 'Hearing', icon: FaGavel, color: 'emerald' },
    { value: 'meeting', label: 'Meeting', icon: FaUsers, color: 'blue' },
    { value: 'deposition', label: 'Deposition', icon: FaFileAlt, color: 'amber' },
    { value: 'conference', label: 'Conference', icon: FaCalendarAlt, color: 'purple' },
  ];

  // ============================================
  // API HELPERS
  // ============================================

  const getAuthHeader = () => {
    const token = localStorage.getItem('auth_token') || localStorage.getItem('token');
    return {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    };
  };

  // ============================================
  // REFRESH EVENTS FROM BACKEND
  // ============================================

  const refreshEvents = async () => {
    setIsRefreshing(true);
    try {
      const token = localStorage.getItem('auth_token') || localStorage.getItem('token');
      if (!token) {
        toast.error('Please login to refresh events');
        return;
      }

      const response = await fetch('https://2a95-2400-adc7-2918-d000-8cfe-551d-492d-ed50.ngrok-free.app/api/events', {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      const data = await response.json();
      
      if (data.success) {
        setLocalEvents(data.data || []);
        toast.success(`✅ Refreshed ${data.data?.length || 0} events`);
        return data.data;
      } else {
        toast.error('Failed to refresh events');
        return [];
      }
    } catch (error) {
      console.error('❌ Refresh error:', error);
      toast.error('Failed to refresh events');
      return [];
    } finally {
      setIsRefreshing(false);
    }
  };

  // ============================================
  // API CALLS
  // ============================================

  const createEvent = async (eventData) => {
    setIsSubmitting(true);
    try {
      const token = localStorage.getItem('auth_token') || localStorage.getItem('token');
      if (!token) {
        toast.error('Please login to create events');
        return { success: false };
      }

      const response = await fetch('https://2a95-2400-adc7-2918-d000-8cfe-551d-492d-ed50.ngrok-free.app/api/events', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(eventData),
      });

      const data = await response.json();

      if (data.success) {
        toast.success('✅ Event created successfully!');
        // Update local state
        setLocalEvents(prev => [data.data, ...prev]);
        if (onAddEvent) {
          onAddEvent(data.data);
        }
        return { success: true, data: data.data };
      } else {
        toast.error(data.error || 'Failed to create event');
        return { success: false, error: data.error };
      }
    } catch (error) {
      console.error('❌ Create event error:', error);
      toast.error('Failed to create event');
      return { success: false, error: error.message };
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateEvent = async (id, eventData) => {
    setIsSubmitting(true);
    try {
      const token = localStorage.getItem('auth_token') || localStorage.getItem('token');
      if (!token) {
        toast.error('Please login to update events');
        return { success: false };
      }

      const response = await fetch(`https://2a95-2400-adc7-2918-d000-8cfe-551d-492d-ed50.ngrok-free.app/api/events/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(eventData),
      });

      const data = await response.json();

      if (data.success) {
        toast.success('✅ Event updated successfully!');
        setLocalEvents(prev => prev.map(e => 
          (e.id === id || e._id === id) ? data.data : e
        ));
        if (onEditEvent) {
          onEditEvent(data.data);
        }
        return { success: true, data: data.data };
      } else {
        toast.error(data.error || 'Failed to update event');
        return { success: false, error: data.error };
      }
    } catch (error) {
      console.error('❌ Update event error:', error);
      toast.error('Failed to update event');
      return { success: false, error: error.message };
    } finally {
      setIsSubmitting(false);
    }
  };

  const deleteEvent = async (id) => {
    setIsDeleting(true);
    try {
      const token = localStorage.getItem('auth_token') || localStorage.getItem('token');
      if (!token) {
        toast.error('Please login to delete events');
        return { success: false };
      }

      const response = await fetch(`https://2a95-2400-adc7-2918-d000-8cfe-551d-492d-ed50.ngrok-free.app/api/events/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (data.success) {
        toast.success('✅ Event deleted successfully!');
        setLocalEvents(prev => prev.filter(e => (e.id !== id && e._id !== id)));
        if (onDeleteEvent) {
          onDeleteEvent(id);
        }
        return { success: true };
      } else {
        toast.error(data.error || 'Failed to delete event');
        return { success: false, error: data.error };
      }
    } catch (error) {
      console.error('❌ Delete event error:', error);
      toast.error('Failed to delete event');
      return { success: false, error: error.message };
    } finally {
      setIsDeleting(false);
    }
  };

  // ============================================
  // CALENDAR HELPERS
  // ============================================

  const getDaysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const getEventsForDay = (day) => {
    return localEvents.filter(event => {
      if (!event || !event.date) return false;
      const eventDate = new Date(event.date);
      return eventDate.getDate() === day &&
             eventDate.getMonth() === currentDate.getMonth() &&
             eventDate.getFullYear() === currentDate.getFullYear();
    });
  };

  const getEventTypeColor = (type) => {
    const colors = {
      hearing: 'border-[#3282B8] bg-[#3282B8]/10 text-[#1B262C]',
      meeting: 'border-[#0F4C75] bg-[#0F4C75]/10 text-[#1B262C]',
      deposition: 'border-[#F59E0B] bg-[#F59E0B]/10 text-[#1B262C]',
      conference: 'border-[#8B5CF6] bg-[#8B5CF6]/10 text-[#1B262C]',
    };
    return colors[type] || 'border-[#BBE1FA] bg-[#F0F4F8] text-[#6B7280]';
  };

  const getEventTypeIcon = (type) => {
    const icons = {
      hearing: <FaGavel className="text-xs" />,
      meeting: <FaUsers className="text-xs" />,
      deposition: <FaFileAlt className="text-xs" />,
      conference: <FaCalendarAlt className="text-xs" />,
    };
    return icons[type] || <FaCircle className="text-xs" />;
  };

  const getEventTypeLabel = (type) => {
    const types = {
      hearing: 'Hearing',
      meeting: 'Meeting',
      deposition: 'Deposition',
      conference: 'Conference',
    };
    return types[type] || type;
  };

  const changeMonth = (delta) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() + delta);
    setCurrentDate(newDate);
  };

  // ============================================
  // EVENT HANDLERS
  // ============================================

  const handleAddEvent = async (e) => {
    e.preventDefault();
    
    if (!formData.title || !formData.date || !formData.time) {
      toast.error('Please fill in all required fields');
      return;
    }

    const eventData = {
      title: formData.title,
      date: formData.date,
      time: formData.time,
      type: formData.type,
      location: formData.location || '',
      description: formData.description || '',
      caseId: formData.caseId || '',
    };

    const result = await createEvent(eventData);
    
    if (result.success) {
      setShowAddEventModal(false);
      setFormData({
        title: '',
        date: new Date().toISOString().split('T')[0],
        time: '10:00',
        type: 'hearing',
        location: '',
        description: '',
        caseId: '',
      });
    }
  };

  const handleEditEvent = async (e) => {
    e.preventDefault();
    
    if (!selectedEvent) return;

    const eventData = {
      title: formData.title || selectedEvent.title,
      date: formData.date || selectedEvent.date,
      time: formData.time || selectedEvent.time,
      type: formData.type || selectedEvent.type,
      location: formData.location || selectedEvent.location || '',
      description: formData.description || selectedEvent.description || '',
      caseId: formData.caseId || selectedEvent.caseId || '',
    };

    const result = await updateEvent(selectedEvent.id || selectedEvent._id, eventData);
    
    if (result.success) {
      setShowEditEventModal(false);
      setSelectedEvent(null);
      setFormData({
        title: '',
        date: new Date().toISOString().split('T')[0],
        time: '10:00',
        type: 'hearing',
        location: '',
        description: '',
        caseId: '',
      });
    }
  };

  const handleDeleteEvent = async () => {
    if (!selectedEvent) return;
    
    if (window.confirm('Are you sure you want to delete this event?')) {
      const result = await deleteEvent(selectedEvent.id || selectedEvent._id);
      if (result.success) {
        setSelectedEvent(null);
      }
    }
  };

  const handleRefresh = async () => {
    await refreshEvents();
  };

  // ============================================
  // RENDER DAYS
  // ============================================

  const renderDays = () => {
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);
    const days = [];

    for (let i = 0; i < firstDay; i++) {
      days.push(
        <div key={`empty-${i}`} className="h-full min-h-[60px] sm:min-h-[80px] border border-[#BBE1FA]/50 rounded-lg bg-[#F0F4F8]/20"></div>
      );
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const dayEvents = getEventsForDay(day);
      const isToday = new Date().getDate() === day && 
                     new Date().getMonth() === currentDate.getMonth() &&
                     new Date().getFullYear() === currentDate.getFullYear();

      days.push(
        <div 
          key={day} 
          className={`min-h-[60px] sm:min-h-[80px] border rounded-lg p-1 sm:p-2 transition-all duration-300 cursor-pointer ${
            isToday ? 'border-[#3282B8] bg-[#3282B8]/10 shadow-lg shadow-[#0F4C75]/20' : 'border-[#BBE1FA] bg-white hover:bg-[#3282B8]/5 hover:border-[#3282B8]'
          }`}
        >
          <div className={`text-xs sm:text-sm font-medium ${isToday ? 'text-[#3282B8]' : 'text-[#1B262C]'}`}>
            {day}
          </div>
          <div className="mt-0.5 sm:mt-1 space-y-0.5 sm:space-y-1">
            {dayEvents.slice(0, 2).map((event, idx) => {
              const eventId = event.id || event._id;
              return (
                <div 
                  key={eventId || idx}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedEvent(event);
                  }}
                  className={`text-[8px] sm:text-[10px] p-0.5 sm:p-1 rounded border-l-2 ${getEventTypeColor(event.type)} truncate hover:opacity-80 transition-colors cursor-pointer shadow-sm`}
                >
                  <span className="flex items-center gap-0.5 sm:gap-1">
                    {getEventTypeIcon(event.type)}
                    <span className="hidden xs:inline">{event.title}</span>
                    <span className="xs:hidden">{event.title?.substring(0, 6) || 'Event'}</span>
                  </span>
                </div>
              );
            })}
            {dayEvents.length > 2 && (
              <div className="text-[8px] sm:text-[10px] text-[#9CA3AF] text-center">
                +{dayEvents.length - 2} more
              </div>
            )}
          </div>
        </div>
      );
    }

    return days;
  };

  // ============================================
  // MODALS
  // ============================================

  // Add Event Modal
  const AddEventModal = () => {
    if (!showAddEventModal) return null;

    return (
      <div className="fixed inset-0 bg-[#1B262C]/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowAddEventModal(false)}>
        <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-premium-lg p-6 relative border border-[#3282B8]" onClick={(e) => e.stopPropagation()}>
          <button 
            onClick={() => setShowAddEventModal(false)}
            className="absolute top-4 right-4 p-2 text-[#9CA3AF] hover:text-[#1B262C] hover:bg-[#F0F4F8] rounded-lg transition-colors"
          >
            <FaTimes className="text-xl" />
          </button>
          
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 gradient-accent rounded-xl shadow-lg shadow-[#0F4C75]/25">
                <FaCalendarAlt className="text-white text-xl" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-[#1B262C]">Add New Event</h3>
                <p className="text-xs text-[#6B7280]">Schedule a new event</p>
              </div>
            </div>

            <form onSubmit={handleAddEvent} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#1B262C] mb-1">Event Title *</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-2.5 bg-[#F0F4F8] border border-[#BBE1FA] rounded-lg text-[#1B262C] placeholder:text-[#9CA3AF] focus:border-[#3282B8] focus:ring-4 focus:ring-[#3282B8]/10 focus:outline-none transition-all"
                  placeholder="Enter event title"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#1B262C] mb-1">Date *</label>
                  <input
                    type="date"
                    required
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full px-4 py-2.5 bg-[#F0F4F8] border border-[#BBE1FA] rounded-lg text-[#1B262C] focus:border-[#3282B8] focus:ring-4 focus:ring-[#3282B8]/10 focus:outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#1B262C] mb-1">Time *</label>
                  <input
                    type="time"
                    required
                    value={formData.time}
                    onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                    className="w-full px-4 py-2.5 bg-[#F0F4F8] border border-[#BBE1FA] rounded-lg text-[#1B262C] focus:border-[#3282B8] focus:ring-4 focus:ring-[#3282B8]/10 focus:outline-none transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#1B262C] mb-1">Event Type</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className="w-full px-4 py-2.5 bg-[#F0F4F8] border border-[#BBE1FA] rounded-lg text-[#1B262C] focus:border-[#3282B8] focus:ring-4 focus:ring-[#3282B8]/10 focus:outline-none transition-all"
                >
                  {eventTypes.map((type) => (
                    <option key={type.value} value={type.value}>{type.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#1B262C] mb-1">Location</label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full px-4 py-2.5 bg-[#F0F4F8] border border-[#BBE1FA] rounded-lg text-[#1B262C] placeholder:text-[#9CA3AF] focus:border-[#3282B8] focus:ring-4 focus:ring-[#3282B8]/10 focus:outline-none transition-all"
                  placeholder="Enter location"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#1B262C] mb-1">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-2.5 bg-[#F0F4F8] border border-[#BBE1FA] rounded-lg text-[#1B262C] placeholder:text-[#9CA3AF] focus:border-[#3282B8] focus:ring-4 focus:ring-[#3282B8]/10 focus:outline-none transition-all"
                  rows="3"
                  placeholder="Enter event description"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#1B262C] mb-1">Case ID (Optional)</label>
                <input
                  type="text"
                  value={formData.caseId}
                  onChange={(e) => setFormData({ ...formData, caseId: e.target.value })}
                  className="w-full px-4 py-2.5 bg-[#F0F4F8] border border-[#BBE1FA] rounded-lg text-[#1B262C] placeholder:text-[#9CA3AF] focus:border-[#3282B8] focus:ring-4 focus:ring-[#3282B8]/10 focus:outline-none transition-all"
                  placeholder="Enter case ID"
                />
              </div>

              <div className="flex gap-3 pt-4 border-t border-[#BBE1FA]">
                <button
                  type="button"
                  onClick={() => setShowAddEventModal(false)}
                  className="flex-1 px-4 py-2.5 bg-[#F0F4F8] text-[#1B262C] rounded-lg hover:bg-[#BBE1FA] transition-colors font-medium"
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 px-4 py-2.5 btn-primary font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <FaSpinner className="inline mr-2 animate-spin" /> Creating...
                    </>
                  ) : (
                    <>
                      <FaSave className="inline mr-2" /> Add Event
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  };

  // Edit Event Modal
  const EditEventModal = () => {
    if (!showEditEventModal || !selectedEvent) return null;

    return (
      <div className="fixed inset-0 bg-[#1B262C]/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowEditEventModal(false)}>
        <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-premium-lg p-6 relative border border-[#3282B8]" onClick={(e) => e.stopPropagation()}>
          <button 
            onClick={() => setShowEditEventModal(false)}
            className="absolute top-4 right-4 p-2 text-[#9CA3AF] hover:text-[#1B262C] hover:bg-[#F0F4F8] rounded-lg transition-colors"
          >
            <FaTimes className="text-xl" />
          </button>
          
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 gradient-accent rounded-xl shadow-lg shadow-[#0F4C75]/25">
                <FaEdit className="text-white text-xl" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-[#1B262C]">Edit Event</h3>
                <p className="text-xs text-[#6B7280]">Update event details</p>
              </div>
            </div>

            <form onSubmit={handleEditEvent} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#1B262C] mb-1">Event Title *</label>
                <input
                  type="text"
                  required
                  value={formData.title || selectedEvent.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-2.5 bg-[#F0F4F8] border border-[#BBE1FA] rounded-lg text-[#1B262C] placeholder:text-[#9CA3AF] focus:border-[#3282B8] focus:ring-4 focus:ring-[#3282B8]/10 focus:outline-none transition-all"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#1B262C] mb-1">Date *</label>
                  <input
                    type="date"
                    required
                    value={formData.date || selectedEvent.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full px-4 py-2.5 bg-[#F0F4F8] border border-[#BBE1FA] rounded-lg text-[#1B262C] focus:border-[#3282B8] focus:ring-4 focus:ring-[#3282B8]/10 focus:outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#1B262C] mb-1">Time *</label>
                  <input
                    type="time"
                    required
                    value={formData.time || selectedEvent.time}
                    onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                    className="w-full px-4 py-2.5 bg-[#F0F4F8] border border-[#BBE1FA] rounded-lg text-[#1B262C] focus:border-[#3282B8] focus:ring-4 focus:ring-[#3282B8]/10 focus:outline-none transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#1B262C] mb-1">Event Type</label>
                <select
                  value={formData.type || selectedEvent.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className="w-full px-4 py-2.5 bg-[#F0F4F8] border border-[#BBE1FA] rounded-lg text-[#1B262C] focus:border-[#3282B8] focus:ring-4 focus:ring-[#3282B8]/10 focus:outline-none transition-all"
                >
                  {eventTypes.map((type) => (
                    <option key={type.value} value={type.value}>{type.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#1B262C] mb-1">Location</label>
                <input
                  type="text"
                  value={formData.location || selectedEvent.location || ''}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full px-4 py-2.5 bg-[#F0F4F8] border border-[#BBE1FA] rounded-lg text-[#1B262C] placeholder:text-[#9CA3AF] focus:border-[#3282B8] focus:ring-4 focus:ring-[#3282B8]/10 focus:outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#1B262C] mb-1">Description</label>
                <textarea
                  value={formData.description || selectedEvent.description || ''}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-2.5 bg-[#F0F4F8] border border-[#BBE1FA] rounded-lg text-[#1B262C] placeholder:text-[#9CA3AF] focus:border-[#3282B8] focus:ring-4 focus:ring-[#3282B8]/10 focus:outline-none transition-all"
                  rows="3"
                />
              </div>

              <div className="flex gap-3 pt-4 border-t border-[#BBE1FA]">
                <button
                  type="button"
                  onClick={() => {
                    setShowEditEventModal(false);
                    setSelectedEvent(null);
                  }}
                  className="flex-1 px-4 py-2.5 bg-[#F0F4F8] text-[#1B262C] rounded-lg hover:bg-[#BBE1FA] transition-colors font-medium"
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 px-4 py-2.5 btn-primary font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <FaSpinner className="inline mr-2 animate-spin" /> Updating...
                    </>
                  ) : (
                    <>
                      <FaSave className="inline mr-2" /> Update Event
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  };

  // Event Details Modal
  const EventDetailsModal = () => {
    if (!selectedEvent || showEditEventModal) return null;

    const eventType = eventTypes.find(t => t.value === selectedEvent.type);

    return (
      <div className="fixed inset-0 bg-[#1B262C]/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setSelectedEvent(null)}>
        <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-premium-lg p-6 relative border border-[#3282B8]" onClick={(e) => e.stopPropagation()}>
          <button 
            onClick={() => setSelectedEvent(null)}
            className="absolute top-4 right-4 p-2 text-[#9CA3AF] hover:text-[#1B262C] hover:bg-[#F0F4F8] rounded-lg transition-colors"
          >
            <FaTimes className="text-xl" />
          </button>
          
          <div className="space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-xl font-bold text-[#1B262C]">{selectedEvent.title}</h3>
                <div className="flex items-center gap-3 mt-1">
                  {selectedEvent.caseId && (
                    <span className="text-xs text-[#6B7280]">Case #{selectedEvent.caseId}</span>
                  )}
                  <span className={`text-xs px-2 py-0.5 rounded-full border ${getEventTypeColor(selectedEvent.type)}`}>
                    {getEventTypeLabel(selectedEvent.type)}
                  </span>
                </div>
              </div>
              {eventType && (
                <div className="p-2 gradient-accent rounded-xl shadow-lg shadow-[#0F4C75]/25">
                  {React.createElement(eventType.icon, { className: 'text-white text-xl' })}
                </div>
              )}
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm text-[#1B262C]">
                <FaCalendarAlt className="text-[#0F4C75]" />
                <span>{new Date(selectedEvent.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                <span className="text-[#9CA3AF]">at</span>
                <FaClock className="text-[#0F4C75] ml-2" />
                <span>{selectedEvent.time}</span>
              </div>
              {selectedEvent.location && (
                <div className="flex items-center gap-3 text-sm text-[#1B262C]">
                  <FaMapMarkerAlt className="text-[#0F4C75]" />
                  <span>{selectedEvent.location}</span>
                </div>
              )}
              {selectedEvent.description && (
                <div className="p-3 bg-[#3282B8]/5 rounded-lg border border-[#3282B8]/30">
                  <p className="text-xs text-[#6B7280] mb-1">Description</p>
                  <p className="text-sm text-[#1B262C]">{selectedEvent.description}</p>
                </div>
              )}
            </div>

            <div className="flex gap-3 pt-3 border-t border-[#BBE1FA]">
              <button
                onClick={() => {
                  setFormData({
                    title: selectedEvent.title,
                    date: selectedEvent.date,
                    time: selectedEvent.time,
                    type: selectedEvent.type,
                    location: selectedEvent.location || '',
                    description: selectedEvent.description || '',
                    caseId: selectedEvent.caseId || '',
                  });
                  setShowEditEventModal(true);
                }}
                className="flex-1 px-4 py-2 bg-[#3282B8]/10 text-[#0F4C75] border border-[#3282B8]/30 rounded-lg hover:bg-[#3282B8]/20 transition-colors font-medium"
              >
                <FaEdit className="inline mr-2" /> Edit
              </button>
              <button
                onClick={handleDeleteEvent}
                disabled={isDeleting}
                className="flex-1 px-4 py-2 bg-[#EF4444]/10 text-[#EF4444] border border-[#EF4444]/30 rounded-lg hover:bg-[#EF4444]/20 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isDeleting ? (
                  <FaSpinner className="inline mr-2 animate-spin" />
                ) : (
                  <FaTrash className="inline mr-2" />
                )}
                Delete
              </button>
              <button
                onClick={() => setSelectedEvent(null)}
                className="flex-1 px-4 py-2 bg-[#F0F4F8] text-[#1B262C] border border-[#BBE1FA] rounded-lg hover:bg-[#BBE1FA] transition-colors font-medium"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // ============================================
  // MAIN RENDER - FULL WIDTH & HEIGHT
  // ============================================
  return (
    <div className="w-full h-full bg-white rounded-2xl border border-[#BBE1FA] shadow-premium p-3 sm:p-4 md:p-6 hover:shadow-premium-lg transition-shadow flex flex-col">
      {/* Calendar Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 mb-3 sm:mb-4 flex-shrink-0">
        <div>
          <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-[#1B262C]">Calendar</h2>
          <p className="text-xs sm:text-sm text-[#6B7280] mt-0.5 sm:mt-1">
            {localEvents?.length || 0} events scheduled
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 bg-[#3282B8]/10 text-[#0F4C75] border border-[#3282B8]/30 rounded-lg hover:bg-[#3282B8]/20 transition-colors text-xs sm:text-sm font-medium"
          >
            <FaSync className={`text-xs sm:text-sm ${isRefreshing ? 'animate-spin' : ''}`} />
            <span className="hidden xs:inline">{isRefreshing ? 'Refreshing...' : 'Refresh'}</span>
          </button>
          <button 
            onClick={() => setShowAddEventModal(true)}
            className="flex items-center gap-2 btn-primary px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium flex-shrink-0"
          >
            <FaPlusCircle className="text-xs sm:text-sm" />
            <span className="hidden xs:inline">Add Event</span>
            <span className="xs:hidden">Add</span>
          </button>
        </div>
      </div>

      {/* Month Navigation */}
      <div className="flex items-center justify-between mb-2 sm:mb-3 flex-shrink-0">
        <button 
          onClick={() => changeMonth(-1)}
          className="p-1.5 sm:p-2 text-[#9CA3AF] hover:text-[#0F4C75] hover:bg-[#3282B8]/10 rounded-xl transition-all duration-200"
        >
          <FaChevronLeft className="text-xs sm:text-sm" />
        </button>
        <h3 className="text-sm sm:text-base md:text-lg font-semibold text-[#1B262C]">
          {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
        </h3>
        <button 
          onClick={() => changeMonth(1)}
          className="p-1.5 sm:p-2 text-[#9CA3AF] hover:text-[#0F4C75] hover:bg-[#3282B8]/10 rounded-xl transition-all duration-200"
        >
          <FaChevronRight className="text-xs sm:text-sm" />
        </button>
      </div>

      {/* Day Names */}
      <div className="grid grid-cols-7 gap-0.5 sm:gap-1 mb-1 sm:mb-2 flex-shrink-0">
        {dayNames.map((day, index) => (
          <div key={index} className="text-center text-[9px] sm:text-xs font-medium text-[#6B7280] py-1 sm:py-2">
            <span className="hidden xs:inline">{day}</span>
            <span className="xs:hidden">{day.substring(0, 1)}</span>
          </div>
        ))}
      </div>

      {/* Calendar Grid - Fills remaining space */}
      <div className="grid grid-cols-7 gap-0.5 sm:gap-1 flex-1">
        {renderDays()}
      </div>

      {/* Modals */}
      <AddEventModal />
      <EditEventModal />
      <EventDetailsModal />
    </div>
  );
};

export default CalendarView;