// src/components/common/SkeletonLoader.jsx
import React from 'react';

const SkeletonLoader = ({ type = 'stats', count = 4 }) => {
  if (type === 'stats') {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        {[...Array(count)].map((_, i) => (
          <div key={i} className="bg-white rounded-xl border border-[#BBE1FA] p-6 shadow-premium animate-pulse">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="h-4 bg-[#E8ECF1] rounded w-20"></div>
                <div className="h-8 bg-[#E8ECF1] rounded w-16 mt-2"></div>
                <div className="h-3 bg-[#E8ECF1] rounded w-24 mt-3"></div>
              </div>
              <div className="w-10 h-10 bg-[#E8ECF1] rounded-xl"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (type === 'card') {
    return (
      <div className="bg-white rounded-xl border border-[#BBE1FA] p-6 shadow-premium animate-pulse">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="h-4 bg-[#E8ECF1] rounded w-24"></div>
            <div className="h-6 bg-[#E8ECF1] rounded w-32 mt-2"></div>
            <div className="h-3 bg-[#E8ECF1] rounded w-20 mt-3"></div>
          </div>
          <div className="w-10 h-10 bg-[#E8ECF1] rounded-xl"></div>
        </div>
      </div>
    );
  }

  if (type === 'list') {
    return (
      <div className="space-y-3 animate-pulse">
        {[...Array(count)].map((_, i) => (
          <div key={i} className="flex items-center gap-4 p-3 bg-[#F0F4F8] rounded-xl border border-[#BBE1FA]">
            <div className="w-10 h-10 bg-[#E8ECF1] rounded-full"></div>
            <div className="flex-1">
              <div className="h-4 bg-[#E8ECF1] rounded w-1/3"></div>
              <div className="h-3 bg-[#E8ECF1] rounded w-1/2 mt-1"></div>
            </div>
            <div className="w-16 h-6 bg-[#E8ECF1] rounded-full"></div>
          </div>
        ))}
      </div>
    );
  }

  // Default skeleton
  return (
    <div className="animate-pulse space-y-4">
      {[...Array(count)].map((_, i) => (
        <div key={i} className="h-12 bg-[#E8ECF1] rounded-xl"></div>
      ))}
    </div>
  );
};

export default SkeletonLoader;