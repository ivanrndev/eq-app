import axios from './axios';
import {API_URL} from '../constants/auth';
import messaging from '@react-native-firebase/messaging';

export const setTokenToDataBase = token =>
  axios
    .patch(`${API_URL}/auth/ios/firebase`, {
      token,
    })
    .catch(e => {
      console.log('errr', e.response.data);
    });

export const getFcmToken = async () => {
  const fcmToken = await messaging().getToken();
  if (fcmToken) {
    setTokenToDataBase(fcmToken);
  } else {
    console.log('Failed', 'No token received');
  }
};
