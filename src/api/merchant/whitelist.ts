
// Whitelist API functionality
export const addToWhitelist = async (merchantId: string, entry: { type: 'ip' | 'domain', value: string }) => {
  try {
    // This is a placeholder for actual whitelist API implementation
    console.log('Whitelist entry added for merchant:', merchantId, entry);
    return { success: true, message: 'Entry added to whitelist' };
  } catch (error) {
    console.error('Whitelist error:', error);
    return { success: false, message: 'Failed to add entry to whitelist' };
  }
};

export const getWhitelistEntries = async (merchantId: string) => {
  try {
    // This is a placeholder
    return { 
      entries: [
        { id: '1', type: 'ip', value: '192.168.1.1', createdAt: new Date().toISOString() },
        { id: '2', type: 'domain', value: 'example.com', createdAt: new Date().toISOString() }
      ]
    };
  } catch (error) {
    console.error('Get whitelist error:', error);
    return { success: false, message: 'Failed to fetch whitelist entries' };
  }
};
