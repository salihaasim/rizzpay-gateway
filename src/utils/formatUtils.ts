
export const generateTransactionId = (): string => {
  return Math.floor(1000 + Math.random() * 9000).toString();
};

export const formatDate = (): string => {
  const now = new Date();
  const hours = now.getHours();
  const minutes = now.getMinutes().toString().padStart(2, '0');
  const ampm = hours >= 12 ? 'PM' : 'AM';
  const formattedHours = (hours % 12) || 12;
  
  return `Today, ${formattedHours}:${minutes} ${ampm}`;
};

export const generateAuthorizationCode = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};
