import axios from './axios';
import {API_URL} from '../constants/auth';

export const setTokenToDataBase = token =>
  axios
    .patch(`${API_URL}/auth/ios/firebase`, {
      token,
    })
    .then(rest => console.log('JHJHJHHJ', rest))
    .catch(e => {
      console.log('errr', e.response.data);
    });
