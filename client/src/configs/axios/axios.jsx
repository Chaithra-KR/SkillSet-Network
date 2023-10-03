import axios from 'axios';

// Define your base URLs
const seekerBaseUrl = "/";
const companyBaseUrl = "/company";
const adminBaseUrl = "/admin";

// Create a function to create an Axios instance with common configurations
const createAxiosInstance = (baseURL) => {
  const instance = axios.create({
    baseURL,
    timeout: 4000,
    timeoutErrorMessage: "Request Timeout, Please Try Again",
  });

  // Add an interceptor to attach the token to each request
  instance.interceptors.request.use((config) => {
    const authToken = localStorage.getItem(config.tokenKey); // Use config.tokenKey to specify the token key
    if (authToken) {
      config.headers.Authorization = `Bearer ${authToken}`;
    }
    return config;
  }, (error) => {
    return Promise.reject(error);
  });

  return instance;
};

// Create Axios instances for different parts of your application
const seekerAxiosInstance = createAxiosInstance(seekerBaseUrl);
const companyAxiosInstance = createAxiosInstance(companyBaseUrl);
const adminAxiosInstance = createAxiosInstance(adminBaseUrl);

export { seekerAxiosInstance, companyAxiosInstance, adminAxiosInstance };
