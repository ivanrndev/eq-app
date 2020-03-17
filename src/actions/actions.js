import AsyncStorage from '@react-native-community/async-storage';
import axios from '../utils/axios';
import {LOGIN_URL} from '../constants/auth.js';
import {
  LOGIN_USER,
  LOGIN_USER_ERROR,
  CHANGE_STATUS_ERROR,
  CHANGE_STATUS_LOAD,
} from '../actions/actionsType.js';

export const userPostFetch = ({email, password}) => dispatch => {
  return axios
    .post(LOGIN_URL, {email, password})
    .then(resp => {
      if (resp.status === 200) {
        AsyncStorage.setItem('token', JSON.stringify(resp.data));
        dispatch({
          type: LOGIN_USER,
          payload: {isLogin: true, isLoad: false},
        });
      }
    })
    .catch(() => {
      dispatch({
        type: LOGIN_USER_ERROR,
        payload: {isError: true, isLoad: false},
      });
    });
};

export const statusError = status => dispatch => {
  dispatch({
    type: CHANGE_STATUS_ERROR,
    payload: {isError: status},
  });
};

export const statusLoad = status => dispatch => {
  dispatch({
    type: CHANGE_STATUS_LOAD,
    payload: {isLoad: status},
  });
};
