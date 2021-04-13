import AsyncStorage from '@react-native-community/async-storage';
import axios from '../utils/axios';
import {API_URL} from '../constants/auth';
import {
  ADD_PHOTOS_TO_COMMENT,
  CHANGE_STATUS_LOAD_MORE_COMMENTS,
  CLEAR_COMMENTS,
  DELETE_PHOTOS_FROM_COMMENT,
  GET_COMMENTS,
  GET_COMMENTS_ERROR,
  SEND_COMMENT,
  SEND_COMMENT_ERROR,
} from './actionsType';
import {getProperError} from '../utils/helpers';
import {loader} from './actions';

export const getComments = (nav, itemId, offset, page) => dispatch => {
  AsyncStorage.getItem('company').then(company => {
    return axios
      .get(`${API_URL}/company/${company}/item/${itemId}/comments/`, {
        params: {limit: 0, offset: offset},
      })
      .then(resp => {
        if (resp.status === 200) {
          dispatch({
            type: GET_COMMENTS,
            payload: {
              itemId: itemId,
              commentsList: resp.data.data.reverse(),
              offSet: 6,
              commentsloadMore: false,
              commentsError: false,
              isInfoOpen: true,
              page: page,
            },
          });
          nav.navigate('Comments');
          dispatch(loader(false));
        }
      })
      .catch(e => {
        if (!e.response.data.success) {
          let error = getProperError(e.response.data.message.name);
          dispatch({
            type: GET_COMMENTS_ERROR,
            payload: {
              commentsError: error,
              commentsloadMore: false,
              page: page,
            },
          });
          nav.navigate('Comments');
          dispatch(loader(false));
        }
      });
  });
};

export const loadMoreComments = status => dispatch => {
  dispatch({
    type: CHANGE_STATUS_LOAD_MORE_COMMENTS,
    payload: {commentsloadMore: status},
  });
};

export const clearComments = () => dispatch => {
  dispatch({
    type: CLEAR_COMMENTS,
    payload: {
      commentsList: [],
      commentsloadMore: false,
      offSet: 0,
      isInfoOpen: false,
      commentsError: false,
      addNewComment: false,
      addNewCommentError: '',
      photos: [],
    },
  });
};

export const sendComments = (itemId, message) => dispatch => {
  AsyncStorage.getItem('company').then(company => {
    return axios
      .post(`${API_URL}/company/${company}/item/${itemId}/comments/`, message)
      .then(resp => {
        if (resp.status === 200) {
          dispatch({
            type: SEND_COMMENT,
            payload: {
              addNewComment: true,
            },
          });
        }
      })
      .catch(e => {
        if (!e.response.data.success) {
          let error = getProperError(e.response.data.message.name);
          dispatch({
            type: SEND_COMMENT_ERROR,
            payload: {
              addNewComment: false,
              addNewCommentError: error,
            },
          });
        }
      });
  });
};

export const addPhotoToComment = photoArr => dispatch => {
  dispatch({
    type: ADD_PHOTOS_TO_COMMENT,
    payload: photoArr,
  });
};
export const deletePhotoFromComment = photoName => dispatch => {
  dispatch({
    type: DELETE_PHOTOS_FROM_COMMENT,
    payload: photoName,
  });
};
