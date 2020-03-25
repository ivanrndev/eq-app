import axios from 'axios';
import {API_URL} from '../constants/auth';
import AsyncStorage from '@react-native-community/async-storage';

const BASE_URL = API_URL;

const apiClient = axios.create();
apiClient.defaults.baseURL = BASE_URL;

apiClient.interceptors.request.use(async function(request) {
  const token = await AsyncStorage.getItem('token');
  if (token) {
    request.headers.authorization = `Bearer ${token}`;
  }
  return request;
});

apiClient.interceptors.response.use(
  function(response) {
    return response;
  },
  function(error) {
    const data = error.response;
    if (data.status === 401 || data.status === 403) {
    }
    return Promise.reject(error);
  },
);

export default apiClient;
