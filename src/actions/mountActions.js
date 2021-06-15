import {
  ADD_ITEM_TO_MOUNT_LIST,
  CLEAN_MOUNT_ITEMS_LIST,
  DELETE_ITEM_FROM_MOUNT_LIST,
  MOUNT_ITEMS,
  MOUNT_ITEMS_ERROR,
  SET_CURRENT_MOUNT_PARENT,
  SET_ITEM_QTY_FOR_MOUNT,
} from './actionsType';
import AsyncStorage from '@react-native-community/async-storage';
import axios from '../utils/axios';
import {API_URL} from '../constants/auth';
import {getSearchItem, loader} from './actions';

export const addMountParent = parentId => dispatch => {
  dispatch({
    type: SET_CURRENT_MOUNT_PARENT,
    payload: parentId,
  });
};
export const addItemToMountList = item => dispatch => {
  dispatch({
    type: ADD_ITEM_TO_MOUNT_LIST,
    payload: item,
  });
};

export const setMountItemQty = (id, quantity) => dispatch => {
  dispatch({
    type: SET_ITEM_QTY_FOR_MOUNT,
    payload: {id, quantity},
  });
};
export const deleteItemFromMountList = id => dispatch => {
  dispatch({
    type: DELETE_ITEM_FROM_MOUNT_LIST,
    payload: id,
  });
};

export const mountItems = (parent, items, navigation, page) => dispatch => {
  AsyncStorage.getItem('company').then(company => {
    return axios
      .put(`${API_URL}/company/${company}/item/mount`, {
        items,
        parent,
      })
      .then(resp => {
        if (resp.status === 200) {
          dispatch(loader(false));
          dispatch({
            type: MOUNT_ITEMS,
          });
          z;
        }
      })
      .then(() => {
        dispatch(cleanMountItemsList());
        dispatch(getSearchItem(parent, navigation, page));
      })
      .catch(e => {
        if (!e.response.data.success) {
          dispatch({
            type: MOUNT_ITEMS_ERROR,
            payload: e.response.data.message.message,
          });
        }
        dispatch(loader(false));
      });
  });
};

export const cleanMountItemsList = () => dispatch =>
  dispatch({
    type: CLEAN_MOUNT_ITEMS_LIST,
  });
