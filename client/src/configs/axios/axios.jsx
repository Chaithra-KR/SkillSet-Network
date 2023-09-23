import axios from 'axios';
import { useSelector } from 'react-redux';

const seekerBaseUrl = "/";
const companyBaseUrl = "/company";
const adminBaseUrl = "/admin";

const createAxiosClient = (baseURL) => {
  const client = axios.create({
    baseURL,
    timeout: 4000,
    timeoutErrorMessage: "Request Timeout , Please Try Again",
  });
  return client;
};

const attachToken = (req, token) => {
  let authToken = localStorage.getItem(token);
  if (authToken) {
    req.headers.Authorization = `Bearer ${authToken}`;
  }
  return req;
};

const seekerAxiosInstance = createAxiosClient(seekerBaseUrl);
seekerAxiosInstance.interceptors.request.use(async (req) => {
  const modifiedReq = attachToken(req, "seekerToken");
  return modifiedReq;
});

const companyAxiosInstance = createAxiosClient(companyBaseUrl);
companyAxiosInstance.interceptors.request.use(async (req) => {
  const modifiedReq = attachToken(req, "companyToken");
  return modifiedReq;
});

const adminAxiosInstance = createAxiosClient(adminBaseUrl);
adminAxiosInstance.interceptors.request.use(async (req) => {
  const modifiedReq = attachToken(req, "adminToken");
  return modifiedReq;
});

export { seekerAxiosInstance, companyAxiosInstance, adminAxiosInstance };
