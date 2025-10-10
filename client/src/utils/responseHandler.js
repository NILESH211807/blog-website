export const handleResponse = (response) => {
    const success = response?.data?.success || response?.success || false;
    const message = response?.data?.message || response?.message || 'Something went wrong';
    const data = response?.data?.data || response?.data || null;

    return { success, message, data };
};