import axios from './axios';
import {API_URL} from '../constants/auth';

export const setTokenToDataBase = token => {
  console.log('ACTION', token);
  axios
    .patch(`${API_URL}/auth/ios/firebase`, {
      token,
    })
    .catch(e => console.log('errr set token', e.response.data));
};
