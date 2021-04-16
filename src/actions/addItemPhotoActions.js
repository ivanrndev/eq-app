import AsyncStorage from '@react-native-community/async-storage';
import axios from '../utils/axios';
import {API_URL} from '../constants/auth';
import {
  ADD_PHOTO_TO_ITEM,
  ADD_PHOTO_TO_ITEM_ERROR,
  DELETE_PHOTO_FROM_ITEM,
  DELETE_PHOTO_FROM_ITEM_ERROR,
  SET_GO_BACK_PAGE_GALLERY,
} from './actionsType';
import {getProperError} from '../utils/helpers';
import {getSearchItem, loader} from './actions';

export const addItemsPhoto = (id, photos, page, nav) => dispatch => {
  dispatch(loader(true));
  AsyncStorage.getItem('company').then(company => {
    return axios
      .patch(`${API_URL}/company/${company}/item/${id}/photos`, photos)
      .then(resp => {
        if (resp.status === 200) {
          dispatch({
            type: ADD_PHOTO_TO_ITEM,
          });
        }
      })
      .then(() => dispatch(getSearchItem(id, nav, page)))
      .catch(e => {
        if (!e.response.data.success) {
          let error = getProperError(e.response.data.message.name);
          dispatch({
            type: ADD_PHOTO_TO_ITEM_ERROR,
            payload: {
              scanInfoError: error,
            },
          });
          dispatch(loader(false));
        }
      });
  });
};

export const setGoBackPageGallery = page => dispatch =>
  dispatch({
    type: SET_GO_BACK_PAGE_GALLERY,
    payload: {goBackPageGallery: page},
  });

export const deleteItemsPhoto = (id, photo, page, nav) => dispatch => {
  dispatch(loader(true));
  AsyncStorage.getItem('company').then(company => {
    return axios
      .delete(`${API_URL}/company/${company}/item/${id}/photos/${photo}`)
      .then(resp => {
        if (resp.status === 200) {
          dispatch({
            type: DELETE_PHOTO_FROM_ITEM,
          });
        }
        dispatch(loader(false));
      })
      .then(() => dispatch(getSearchItem(id, nav, page)))
      .catch(e => {
        if (!e.response.data.success) {
          let error = getProperError(e.response.data.message.name);
          dispatch({
            type: DELETE_PHOTO_FROM_ITEM_ERROR,
            payload: {
              scanInfoError: error,
            },
          });
          dispatch(loader(false));
        }
      });
  });
};
