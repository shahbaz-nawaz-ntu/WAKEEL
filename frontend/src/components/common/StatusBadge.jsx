import React from 'react';
import { AlertCircle, Clock, CheckCircle } from 'lucide-react';

const StatusBadge = ({ status }) => {
  const config = {
    'pending': { label: 'Pending', color: 'bg-amber-100 text-amber-800', icon: AlertCircle },
    'in-progress': { label: 'In Progress', color: 'bg-blue-100 text-blue-800', icon: Clock },
    'completed': { label: 'Completed', color: 'bg-green-100 text-green-800', icon: CheckCircle }
  };

  const statusConfig = config[status] || config['pending'];
  const Icon = statusConfig.icon;

  return (
    <span className={`px-3 py-1 rounded-full text-xs font-medium inline-flex items-center gap-1.5 ${statusConfig.color}`}>
      <Icon className="w-3 h-3" />
      {statusConfig.label}
    </span>
  );
};

export default StatusBadge;