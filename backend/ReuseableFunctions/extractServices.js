export const extractServiceFromResponse = (responseText, userServices) => {
    if (!responseText || typeof responseText !== 'string') {
      console.error('Invalid response text:', responseText);
      return "Invalid response from Gemini.";
    }
  
    if (!Array.isArray(userServices) || userServices.length === 0) {
      console.error('No services provided in userServices:', userServices);
      return "No services provided.";
    }
  
    // Find the first service from the list that appears in the response text
    const foundService = userServices.find(service => responseText.toLowerCase().includes(service.toLowerCase()));
  
    if (foundService) {
      return foundService; // Return the matched service
    } else {
      console.log('No matching services found in response text');
      return "No service found"; // Return a default message if no service is found
    }
  };
  