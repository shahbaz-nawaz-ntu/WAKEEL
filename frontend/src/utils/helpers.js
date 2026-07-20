export const generateId = () => {
  return Math.random().toString(36).substr(2, 9);
};

export const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

export const truncateText = (text, maxLength = 100) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substr(0, maxLength) + '...';
};

export const getStatusColor = (status) => {
  const colors = {
    active: 'green',
    pending: 'yellow',
    closed: 'gray',
  };
  return colors[status] || 'gray';
};

export const getStatusIcon = (status) => {
  const icons = {
    active: '🟢',
    pending: '🟡',
    closed: '⚪',
  };
  return icons[status] || '⚪';
};