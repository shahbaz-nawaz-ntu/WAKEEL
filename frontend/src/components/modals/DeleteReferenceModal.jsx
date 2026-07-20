// src/components/modals/DeleteReferenceModal.jsx
import React from 'react';
import { FaTimes, FaTrash, FaExclamationTriangle, FaBook } from 'react-icons/fa';

const DeleteReferenceModal = ({ isOpen, onClose, onConfirm, reference }) => {
  if (!isOpen || !reference) return null;

  return (
    <div className="fixed inset-0 bg-[#1B262C]/70 backdrop-blur-sm z-[80] flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border-2 border-[#EF4444] p-6 animate-in fade-in zoom-in duration-200">
        
        <div className="flex flex-col items-center text-center">
          {/* Icon */}
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#EF4444]/20 to-[#DC2626]/20 flex items-center justify-center mb-4 border-4 border-[#EF4444]/30">
            <FaBook className="text-[#EF4444] text-4xl" />
          </div>
          
          <h3 className="text-2xl font-bold text-[#1B262C] mb-2">Delete Reference Case?</h3>
          <p className="text-[#6B7280] mb-1">
            Are you sure you want to delete
          </p>
          <p className="text-lg font-semibold text-[#1B262C] mb-2">
            "{reference.title}"
          </p>
          
          <div className="w-full bg-[#F0F4F8] rounded-lg p-3 mb-4 text-left">
            <p className="text-xs text-[#6B7280]">Case Number</p>
            <p className="text-sm font-medium text-[#1B262C]">{reference.caseNumber || 'N/A'}</p>
            <p className="text-xs text-[#6B7280] mt-2">Citation</p>
            <p className="text-sm font-medium text-[#1B262C]">{reference.citation || 'N/A'}</p>
          </div>
          
          <p className="text-sm text-[#6B7280] mb-6">
            This action <span className="text-[#EF4444] font-bold">cannot be undone</span>. 
            All data associated with this reference case will be permanently removed.
          </p>
          
          <div className="flex gap-3 w-full">
            <button
              onClick={onConfirm}
              className="flex-1 px-4 py-3 text-sm font-medium bg-gradient-to-r from-[#EF4444] to-[#DC2626] text-white rounded-xl hover:shadow-lg hover:shadow-[#EF4444]/30 transition-all"
            >
              <FaTrash className="inline mr-2" /> Yes, Delete
            </button>
            <button
              onClick={onClose}
              className="flex-1 px-4 py-3 text-sm font-medium bg-[#F0F4F8] text-[#1B262C] border border-[#BBE1FA] rounded-xl hover:bg-[#BBE1FA] transition-all"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteReferenceModal;