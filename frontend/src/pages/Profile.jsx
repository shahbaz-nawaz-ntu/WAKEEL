// src/pages/Profile.jsx
import React, { useState, useEffect } from 'react';
import { 
  FaUser, FaEnvelope, FaPhone, FaBuilding, FaMapMarkerAlt, 
  FaEdit, FaSave, FaTimes, FaCamera, FaBriefcase, FaCalendarAlt, 
  FaArrowLeft, FaSpinner
} from 'react-icons/fa';
import toast from 'react-hot-toast';

const Profile = ({ onNavigate, onUserUpdate }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    address: '',
    role: '',
  });

  // ============================================
  // FETCH USER DATA FROM API
  // ============================================
  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('auth_token') || localStorage.getItem('token');
      
      if (!token) {
        toast.error('Please login again');
        window.location.href = '/login';
        return;
      }

      const response = await fetch('https://2a95-2400-adc7-2918-d000-8cfe-551d-492d-ed50.ngrok-free.app/api/auth/me', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (data.success) {
        setUser(data.data);
        setFormData({
          name: data.data.name || '',
          email: data.data.email || '',
          phone: data.data.phone || '',
          company: data.data.company || '',
          address: data.data.address || '',
          role: data.data.role || '',
        });
        localStorage.setItem('user', JSON.stringify(data.data));
        if (onUserUpdate) {
          onUserUpdate(data.data);
        }
        window.dispatchEvent(new CustomEvent('userUpdated', { 
          detail: data.data 
        }));
      } else {
        toast.error('Failed to load profile data');
        const localUser = localStorage.getItem('user');
        if (localUser) {
          const parsedUser = JSON.parse(localUser);
          setUser(parsedUser);
          setFormData({
            name: parsedUser.name || '',
            email: parsedUser.email || '',
            phone: parsedUser.phone || '',
            company: parsedUser.company || '',
            address: parsedUser.address || '',
            role: parsedUser.role || '',
          });
        }
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      const localUser = localStorage.getItem('user');
      if (localUser) {
        const parsedUser = JSON.parse(localUser);
        setUser(parsedUser);
        setFormData({
          name: parsedUser.name || '',
          email: parsedUser.email || '',
          phone: parsedUser.phone || '',
          company: parsedUser.company || '',
          address: parsedUser.address || '',
          role: parsedUser.role || '',
        });
      }
    } finally {
      setLoading(false);
    }
  };

  // ============================================
  // NAVIGATION
  // ============================================
  const handleNavigate = (page) => {
    console.log('🔘 Navigating to:', page);
    if (onNavigate) {
      onNavigate(page);
    } else {
      window.location.href = `/${page}`;
    }
  };

  const goBack = () => {
    handleNavigate('dashboard');
  };

  // ============================================
  // PROFILE FUNCTIONS
  // ============================================
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const token = localStorage.getItem('auth_token') || localStorage.getItem('token');
      
      if (!token) {
        toast.error('Please login again');
        return;
      }

      const updateData = {
        name: formData.name,
        phone: formData.phone,
        company: formData.company,
        address: formData.address,
        role: formData.role,
      };

      console.log('📤 Updating profile with:', updateData);

      const response = await fetch('https://2a95-2400-adc7-2918-d000-8cfe-551d-492d-ed50.ngrok-free.app/api/auth/profile', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      });

      const data = await response.json();

      console.log('📥 Server response:', data);

      if (data.success) {
        const updatedUser = {
          ...user,
          name: data.data.name || formData.name,
          phone: data.data.phone || formData.phone,
          company: data.data.company || formData.company,
          address: data.data.address || formData.address,
          role: data.data.role || formData.role,
          email: user.email,
        };
        
        setUser(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));
        
        if (onUserUpdate) {
          onUserUpdate(updatedUser);
        }
        
        window.dispatchEvent(new CustomEvent('userUpdated', { 
          detail: updatedUser 
        }));
        
        setIsEditing(false);
        toast.success('✅ Profile updated successfully!');
      } else {
        toast.error(data.error || 'Failed to update profile');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Network error. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setFormData({
      name: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || '',
      company: user?.company || '',
      address: user?.address || '',
      role: user?.role || '',
    });
    toast.info('📝 Changes cancelled');
  };

  const handleEditProfile = () => {
    setIsEditing(true);
    toast.info('✏️ Edit mode enabled');
  };

  const handleChangeAvatar = () => {
    toast.info('📸 Avatar upload feature coming soon!');
  };

  // ============================================
  // GET USER INITIALS
  // ============================================
  const getUserInitials = () => {
    if (!user) return 'U';
    const name = user.name || 'User';
    const parts = name.split(' ');
    if (parts.length >= 2) {
      return parts[0][0] + parts[1][0];
    }
    return name.substring(0, 2).toUpperCase();
  };

  const getDisplayName = () => {
    return user?.name || user?.email || 'User';
  };

  // ============================================
  // LOADING STATE
  // ============================================
  if (loading) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-[#F8FAFC]">
        <div className="flex flex-col items-center gap-4">
          <FaSpinner className="text-4xl text-[#0F4C75] animate-spin" />
          <p className="text-[#6B7280]">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-[#F8FAFC]">
        <div className="text-center">
          <p className="text-red-500 mb-4">Failed to load profile</p>
          <button
            onClick={fetchUserData}
            className="px-4 py-2 bg-[#3282B8] text-white rounded-lg hover:bg-[#0F4C75] transition-colors cursor-pointer"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-[#F8FAFC] p-4 md:p-6">
      <div className="w-full max-w-full">
        {/* Back Button */}
        <button
          onClick={goBack}
          className="flex items-center gap-2 text-[#6B7280] hover:text-[#0F4C75] transition-colors mb-4 group cursor-pointer"
        >
          <FaArrowLeft className="text-sm group-hover:-translate-x-1 transition-transform" />
          Back to Dashboard
        </button>

        {/* No Card - Full Width */}
        <div className="w-full">
          {/* Top Accent Bar - Full Width */}
          <div className="h-1.5 bg-gradient-to-r from-[#1B262C] via-[#0F4C75] to-[#3282B8] rounded-t-2xl"></div>

          <div className="p-6 w-full">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
              <div>
                <h2 className="text-2xl font-bold text-[#1B262C]">
                  {isEditing ? 'Edit Profile' : 'Profile'}
                </h2>
                <p className="text-sm text-[#6B7280] mt-0.5">
                  {isEditing ? 'Update your personal information' : 'Manage your personal information'}
                </p>
              </div>
              {!isEditing ? (
                <button
                  onClick={handleEditProfile}
                  className="flex items-center gap-2 px-4 py-2.5 bg-[#3282B8]/10 text-[#0F4C75] border border-[#3282B8]/30 rounded-xl hover:bg-[#3282B8]/20 transition-all duration-200 font-medium cursor-pointer"
                >
                  <FaEdit className="text-sm" />
                  Edit Profile
                </button>
              ) : (
                <div className="flex gap-2">
                  <button
                    onClick={handleCancel}
                    className="px-4 py-2.5 bg-[#F0F4F8] text-[#1B262C] border border-[#BBE1FA] rounded-xl hover:bg-[#BBE1FA]/50 transition-all duration-200 font-medium cursor-pointer"
                  >
                    <FaTimes className="inline mr-1.5" /> Cancel
                  </button>
                  <button
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="px-4 py-2.5 bg-gradient-to-r from-[#0F4C75] to-[#3282B8] text-white rounded-xl font-medium hover:shadow-lg hover:shadow-[#0F4C75]/30 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                  >
                    {isSubmitting ? (
                      <>
                        <FaSpinner className="inline animate-spin mr-1.5" /> Saving...
                      </>
                    ) : (
                      <>
                        <FaSave className="inline mr-1.5" /> Save Changes
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>

            {/* Profile Content - Full Width No Card */}
            <div className="w-full">
              {/* Avatar & Name - Full Width */}
              <div className="flex items-center gap-6 mb-6 p-4 bg-white/50 rounded-xl border border-[#BBE1FA]">
                <div className="relative">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#0F4C75] to-[#3282B8] flex items-center justify-center text-white text-3xl font-bold shadow-lg shadow-[#0F4C75]/25">
                    {getUserInitials()}
                  </div>
                  {isEditing && (
                    <button 
                      onClick={handleChangeAvatar}
                      className="absolute bottom-0 right-0 p-1.5 bg-white rounded-full border border-[#3282B8] hover:bg-[#3282B8]/10 transition-colors shadow-sm cursor-pointer"
                    >
                      <FaCamera className="text-xs text-[#0F4C75]" />
                    </button>
                  )}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-[#1B262C]">{getDisplayName()}</h3>
                  <p className="text-sm text-[#0F4C75] font-medium">{user.role || 'User'}</p>
                  <p className="text-xs text-[#6B7280] mt-1 flex items-center gap-1.5">
                    <FaCalendarAlt className="text-[10px] text-[#0F4C75]" />
                    Member since {user.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : 'N/A'}
                  </p>
                </div>
              </div>

              {/* Profile Info Grid - Full Width */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="p-4 bg-white rounded-xl border border-[#BBE1FA]">
                  <p className="text-xs text-[#6B7280] flex items-center gap-1.5">
                    <FaUser className="text-[10px] text-[#0F4C75]" /> Full Name
                  </p>
                  {isEditing ? (
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full mt-1 px-3 py-2 bg-[#F0F4F8] border border-[#BBE1FA] rounded-lg text-[#1B262C] text-sm focus:border-[#3282B8] focus:ring-4 focus:ring-[#3282B8]/10 focus:outline-none transition-all"
                      placeholder="Enter your full name"
                    />
                  ) : (
                    <p className="text-sm text-[#1B262C] font-medium">{user.name || 'N/A'}</p>
                  )}
                </div>

                <div className="p-4 bg-white rounded-xl border border-[#BBE1FA]">
                  <p className="text-xs text-[#6B7280] flex items-center gap-1.5">
                    <FaEnvelope className="text-[10px] text-[#0F4C75]" /> Email Address
                  </p>
                  {isEditing ? (
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      className="w-full mt-1 px-3 py-2 bg-[#F0F4F8] border border-[#BBE1FA] rounded-lg text-[#6B7280] text-sm cursor-not-allowed"
                      disabled
                    />
                  ) : (
                    <p className="text-sm text-[#1B262C] font-medium">{user.email || 'N/A'}</p>
                  )}
                  {isEditing && (
                    <p className="text-[10px] text-[#6B7280] mt-1">Email cannot be changed</p>
                  )}
                </div>

                <div className="p-4 bg-white rounded-xl border border-[#BBE1FA]">
                  <p className="text-xs text-[#6B7280] flex items-center gap-1.5">
                    <FaPhone className="text-[10px] text-[#0F4C75]" /> Phone Number
                  </p>
                  {isEditing ? (
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full mt-1 px-3 py-2 bg-[#F0F4F8] border border-[#BBE1FA] rounded-lg text-[#1B262C] text-sm focus:border-[#3282B8] focus:ring-4 focus:ring-[#3282B8]/10 focus:outline-none transition-all"
                      placeholder="Enter your phone number"
                    />
                  ) : (
                    <p className="text-sm text-[#1B262C] font-medium">{user.phone || 'N/A'}</p>
                  )}
                </div>

                <div className="p-4 bg-white rounded-xl border border-[#BBE1FA]">
                  <p className="text-xs text-[#6B7280] flex items-center gap-1.5">
                    <FaBriefcase className="text-[10px] text-[#0F4C75]" /> Role / Position
                  </p>
                  {isEditing ? (
                    <select
                      name="role"
                      value={formData.role}
                      onChange={handleInputChange}
                      className="w-full mt-1 px-3 py-2 bg-[#F0F4F8] border border-[#BBE1FA] rounded-lg text-[#1B262C] text-sm focus:border-[#3282B8] focus:ring-4 focus:ring-[#3282B8]/10 focus:outline-none transition-all"
                    >
                      <option value="Admin">Admin</option>
                      <option value="Senior Attorney">Senior Attorney</option>
                      <option value="Attorney">Attorney</option>
                      <option value="Paralegal">Paralegal</option>
                      <option value="Client">Client</option>
                    </select>
                  ) : (
                    <p className="text-sm text-[#1B262C] font-medium">{user.role || 'N/A'}</p>
                  )}
                </div>

                <div className="p-4 bg-white rounded-xl border border-[#BBE1FA]">
                  <p className="text-xs text-[#6B7280] flex items-center gap-1.5">
                    <FaBuilding className="text-[10px] text-[#0F4C75]" /> Company / Firm
                  </p>
                  {isEditing ? (
                    <input
                      type="text"
                      name="company"
                      value={formData.company}
                      onChange={handleInputChange}
                      className="w-full mt-1 px-3 py-2 bg-[#F0F4F8] border border-[#BBE1FA] rounded-lg text-[#1B262C] text-sm focus:border-[#3282B8] focus:ring-4 focus:ring-[#3282B8]/10 focus:outline-none transition-all"
                      placeholder="Enter your company name"
                    />
                  ) : (
                    <p className="text-sm text-[#1B262C] font-medium">{user.company || 'N/A'}</p>
                  )}
                </div>

                <div className="p-4 bg-white rounded-xl border border-[#BBE1FA]">
                  <p className="text-xs text-[#6B7280] flex items-center gap-1.5">
                    <FaMapMarkerAlt className="text-[10px] text-[#0F4C75]" /> Address
                  </p>
                  {isEditing ? (
                    <textarea
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      rows="2"
                      className="w-full mt-1 px-3 py-2 bg-[#F0F4F8] border border-[#BBE1FA] rounded-lg text-[#1B262C] text-sm focus:border-[#3282B8] focus:ring-4 focus:ring-[#3282B8]/10 focus:outline-none transition-all"
                      placeholder="Enter your address"
                    />
                  ) : (
                    <p className="text-sm text-[#1B262C] font-medium">{user.address || 'N/A'}</p>
                  )}
                </div>
              </div>

              {/* Edit Mode Hint */}
              {isEditing && (
                <div className="mt-4 p-3 bg-[#3282B8]/5 rounded-xl border border-[#3282B8]/20 text-center w-full">
                  <p className="text-xs text-[#6B7280]">
                    <span className="text-[#0F4C75] font-medium">✏️ Edit Mode:</span> Update your information and click "Save Changes"
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;