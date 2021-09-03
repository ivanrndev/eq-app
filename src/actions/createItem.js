import {
  CREATE_ITEM,
  CREATE_ITEM_ERROR,
  CREATE_USER_ITEM,
  CREATE_USER_ITEM_ERROR,
  SAVE_ACCOUNT_AND_VALUE,
  SAVE_ADDITIONAL_INFO,
  SAVE_BASE_ITEM_INFO,
  SAVE_ITEM_LOCATIONS,
  SAVE_PHOTO,
  SAVE_RESPONSIBLE,
  CLEAN_CREATE_ITEM,
} from './actionsType';
import AsyncStorage from '@react-native-community/async-storage';
import axios from '../utils/axios';
import {API_URL} from '../constants/auth';
import {addItemsPhoto} from './addItemPhotoActions';

export const saveBaseItemInfo = values => dispatch =>
  dispatch({
    type: SAVE_BASE_ITEM_INFO,
    payload: {baseInfo: values},
  });

export const saveAccountingAndValue = values => dispatch =>
  dispatch({
    type: SAVE_ACCOUNT_AND_VALUE,
    payload: {accountType: values},
  });

export const savePhotos = photos => dispatch =>
  dispatch({
    type: SAVE_PHOTO,
    payload: {photos},
  });

export const saveLocation = location => dispatch =>
  dispatch({
    type: SAVE_ITEM_LOCATIONS,
    payload: {location},
  });

export const saveResponsible = responsible => dispatch => {
  dispatch({
    type: SAVE_RESPONSIBLE,
    payload: {responsible},
  });
};
export const saveAdditionalInfo = additionalInfo => dispatch =>
  dispatch({
    type: SAVE_ADDITIONAL_INFO,
    payload: {additionalInfo},
  });
export const cleanCreateItem = () => dispatch =>
  dispatch({
    type: CLEAN_CREATE_ITEM,
  });

export const createItemAndUser = (
  body,
  item,
  navigation,
  photos,
) => dispatch => {
  AsyncStorage.getItem('company').then(company => {
    return axios
      .post(`${API_URL}/company/${company}/user`, body)
      .then(resp => {
        if (resp.status === 200) {
          dispatch({
            type: CREATE_USER_ITEM,
          });
          return resp.data.user._id;
        }
      })
      .then(id => {
        const data = {...item, person: id};
        dispatch(createItem(data, navigation, photos));
      })
      .catch(e => {
        if (!e.response.data) {
          dispatch({
            type: CREATE_USER_ITEM_ERROR,
            payload: {
              createItemError: e.message,
            },
          });
        }
      });
  });
};

export const createItem = (data, navigation, photos) => dispatch => {
  AsyncStorage.getItem('company').then(company => {
    return axios
      .post(`${API_URL}/company/${company}/item`, data)
      .then(resp => {
        if (resp.status === 200) {
          dispatch({
            type: CREATE_ITEM,
          });
          const id = resp.data[0]._id;
          if (photos) {
            dispatch(addItemsPhoto(id, photos, 'CreateFinish', navigation));
          } else {
            navigation.navigate('CreateFinish');
          }
          dispatch(cleanCreateItem());
        }
      })
      .catch(e => {
        if (!e.response.data) {
          dispatch({
            type: CREATE_ITEM_ERROR,
            payload: {
              statusTransfer: 'error',
              createItemError: e.message,
            },
          });
        }
      });
  });
};
