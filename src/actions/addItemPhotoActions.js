import AsyncStorage from '@react-native-community/async-storage';
import axios from '../utils/axios';
import {API_URL} from '../constants/auth';
import {ADD_PHOTO_TO_ITEM, ADD_PHOTO_TO_ITEM_ERROR} from './actionsType';
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
