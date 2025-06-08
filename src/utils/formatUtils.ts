
export const generateTransactionId = (): string => {
  // Generate unique transaction ID starting with RP
  const timestamp = Date.now().toString(36); // Base36 timestamp
  const randomPart = Math.random().toString(36).substring(2, 8); // 6 random characters
  return `RP${timestamp}${randomPart}`.toUpperCase();
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
