const apiRequest = async (url, options = {}) => {
  const token = localStorage.getItem("jwtToken");
  const headers = {
    ...options.headers,
    Authorization: `Bearer ${token}`,
  };
  const response = await fetch(url, { ...options, headers });
  // Handle the response
};
