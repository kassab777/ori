import type { AxiosRequestConfig } from 'axios';

import axios from 'axios';

import { CONFIG } from 'src/config-global';

// ----------------------------------------------------------------------

const axiosInstance = axios.create({ baseURL: CONFIG.site.serverUrl });

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject((error.response && error.response.data) || 'Something went wrong!')
);

export default axiosInstance;

// ----------------------------------------------------------------------

export const fetcher = async (args: string | [string, AxiosRequestConfig]) => {
  try {
    const [url, config] = Array.isArray(args) ? args : [args];

    const res = await axiosInstance.get(url, { ...config });

    return res.data;
  } catch (error) {
    console.error('Failed to fetch:', error);
    throw error;
  }
};

// ----------------------------------------------------------------------

export const endpoints = {
  auth: {
    me: '/api/dashboard/me',
    signIn: '/api/auth/login',
    signUp: '/api/auth/sign-up',
  },
  serviceGroup: {
    service: {
      list: '/api/dashboard/service',
      details: '/api/dashboard/service',
      new: '/api/dashboard/service',
      edit: '/api/dashboard/service',
      delete: '/api/dashboard/service',
      subService: '/api/dashboard/getSubservicesByServiceId',
    },
    subService: {
      list: '/api/dashboard/sub-service',
      details: '/api/dashboard/sub-service',
      new: '/api/dashboard/sub-service',
      edit: '/api/dashboard/sub-service',
      delete: '/api/dashboard/sub-service',
    },
    subServiceOption: {
      list: '/api/dashboard/option',
      new: '/api/dashboard/option',
      edit: '/api/dashboard/option',
      delete: '/api/dashboard/option',
    },
    coupon: {
      list: '/api/dashboard/coupons',
      details: '/api/dashboard/coupons',
      new: '/api/dashboard/coupons',
      edit: '/api/dashboard/coupons',
      delete: '/api/dashboard/coupons',
    },
  },
  pageGroup: {
    question: {
      list: '/api/dashboard/questions',
      details: '/api/dashboard/questions',
      new: '/api/dashboard/questions',
      edit: '/api/dashboard/questions',
      delete: '/api/dashboard/questions',
    },
    aboutUs: {
      details: '/api/dashboard/about_us',
      edit: '/api/dashboard/about_us',
    },
    privacy: {
      details: '/api/dashboard/privacies',
      edit: '/api/dashboard/privacies',
    },
    term: {
      details: '/api/dashboard/terms',
      edit: '/api/dashboard/terms',
    },
  },
  user: {
    list: '/api/dashboard/users',
    details: '/api/dashboard/users',
    new: '/api/dashboard/users',
    edit: '/api/dashboard/users',
    delete: '/api/dashboard/users',
    // 
    count: '/api/dashboard/getUserCount',
  },
  role: {
    list: '/api/dashboard/roles',
    details: '/api/dashboard/roles',
    new: '/api/dashboard/roles',
    edit: '/api/dashboard/roles',
    delete: '/api/dashboard/roles',
  },
  setting: {
    details: '/api/dashboard/setting',
    edit: '/api/dashboard/setting',
  },
};
