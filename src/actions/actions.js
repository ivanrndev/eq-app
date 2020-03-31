import AsyncStorage from '@react-native-community/async-storage';
import axios from '../utils/axios';
import {API_URL, LOGIN_URL} from '../constants/auth.js';
import {getProperError} from '../utils/getPropertyErrorMessage';
import {
  LOGIN_USER,
  LOGIN_USER_ERROR,
  CHANGE_STATUS_ERROR,
  CHANGE_STATUS_LOAD,
  SAVE_CURRENT_SCAN,
  ALLOW_NEW_SCAN,
  SAVE_CURRENT_SCAN_INFO,
  ERROR_CURRENT_SCAN_INFO,
  DIALOG_INPUT,
  SUCCES_IN_SERVICES,
  ERROR_SEND_SERVICES,
  SUCCES_WRITE_OFF,
  ERROR_WRITE_OFF,
  MARKING,
  MARKING_ERROR,
  MARKING_ERROR_DONE,
  MARKING_CURRENT_ID,
  MARKING_SEARCH,
  SHOW_BUTTON_LOAD,
  CHANGE_STATUS_LOAD_MORE,
} from '../actions/actionsType.js';

// Auth actions
export const userPostFetch = ({email, password}) => dispatch => {
  return axios
    .post(LOGIN_URL, {email, password})
    .then(resp => {
      if (resp.status === 200) {
        AsyncStorage.setItem('token', resp.data);
        dispatch({
          type: LOGIN_USER,
          payload: {isLogin: true, isLoad: false},
        });
        dispatch(currentUser());
      }
    })
    .catch(() => {
      dispatch({
        type: LOGIN_USER_ERROR,
        payload: {isError: true, isLoad: false},
      });
    });
};

export const currentUser = () => dispatch => {
  return axios.get('/users/me').then(resp => {
    if (resp.status === 200) {
      AsyncStorage.setItem('company', resp.data.company);
      AsyncStorage.setItem('role', resp.data.role);
    }
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

// Scan actions
export const currentScan = (id, nav, page, info) => dispatch => {
  dispatch({
    type: SAVE_CURRENT_SCAN,
    payload: {currentScan: id, isNewScan: false},
  });
  if (info) {
    dispatch(scanInfo(id, nav, page));
  } else {
    dispatch(dialogInput(false));
    nav.navigate(page);
  }
};

export const dialogInput = status => dispatch => {
  dispatch({
    type: DIALOG_INPUT,
    payload: {dialogInput: status},
  });
};

export const scanInfo = (id, nav, page) => dispatch => {
  AsyncStorage.getItem('company').then(company => {
    return axios
      .get(`${API_URL}/company/${company}/item/${id}`)
      .then(resp => {
        if (resp.status === 200) {
          dispatch({
            type: SAVE_CURRENT_SCAN_INFO,
            payload: {
              scanInfo: resp.data,
              scanInfoError: false,
              isInfoOpen: true,
            },
          });
          dispatch(dialogInput(false));
          nav.navigate(page);
        }
      })
      .catch(e => {
        if (!e.response.data.success) {
          dispatch({
            type: ERROR_CURRENT_SCAN_INFO,
            payload: {
              scanInfoError: true,
              scanInfo: {},
              currentScan: '',
              isInfoOpen: true,
            },
          });
          dispatch(dialogInput(false));
          nav.navigate(page);
        }
      });
  });
};

export const allowNewScan = status => dispatch => {
  dispatch({
    type: ALLOW_NEW_SCAN,
    payload: {
      currentScan: '',
      isNewScan: status,
      scanInfo: {},
      isInfoOpen: false,
    },
  });
};

// Service actions
export const sendToServices = (id, description, place, nav) => dispatch => {
  AsyncStorage.getItem('company').then(company => {
    return axios
      .put(`${API_URL}/company/${company}/item/${id}/repair`, {
        description,
        place,
      })
      .then(resp => {
        if (resp.status === 200) {
          dispatch({
            type: SUCCES_IN_SERVICES,
            payload: {
              inServices: !!resp.data.repair,
              inServicesError: false,
            },
          });
          nav.navigate('ServiceFinish');
        }
      })
      .catch(e => {
        if (!e.response.data.success) {
          let error = getProperError(e.response.data.message.name);
          dispatch({
            type: ERROR_SEND_SERVICES,
            payload: {
              inServicesError: error,
            },
          });
          nav.navigate('ServiceFinish');
        }
      });
  });
};

// WriteOff actions
export const sendToWriteOff = (id, nav) => dispatch => {
  AsyncStorage.getItem('company').then(company => {
    return axios
      .put(`${API_URL}/company/${company}/item/${id}/ban`)
      .then(resp => {
        if (resp.status === 200) {
          dispatch({
            type: SUCCES_WRITE_OFF,
            payload: {
              inWriteOff: !!resp.data.repair,
              inWriteOffError: false,
            },
          });
          nav.navigate('WriteOffFinish');
        }
      })
      .catch(e => {
        if (!e.response.data.success) {
          let error = getProperError(e.response.data.message.name);
          dispatch({
            type: ERROR_WRITE_OFF,
            payload: {
              inWriteOffError: error,
            },
          });
          nav.navigate('WriteOffFinish');
        }
      });
  });
};

// Marking actions
export const getMarkingList = (status, nav) => dispatch => {
  AsyncStorage.getItem('company').then(company => {
    return axios
      .get(`${API_URL}/company/${company}/item/`, {
        params: {marked: status, limit: 6, offSet: 0},
      })
      .then(resp => {
        if (resp.status === 200) {
          dispatch({
            type: MARKING,
            payload: {
              marking: status,
              loadMore: false,
              offSet: 6,
              markingList: resp.data.data,
              markingError: false,
            },
          });
          nav.navigate('MarkingList');
        }
      })
      .catch(e => {
        if (!e.response.data.success) {
          let error = getProperError(e.response.data.message.name);
          dispatch({
            type: MARKING_ERROR,
            payload: {
              markingError: error,
              loadMore: false,
            },
          });
          nav.navigate('MarkingList');
        }
      });
  });
};

export const saveCurrentItemMark = (id, nav) => dispatch => {
  dispatch({
    type: MARKING_CURRENT_ID,
    payload: {
      currentItemMark: id,
    },
  });
  nav.navigate('MarkingScaner');
};

export const makeMarking = (id, code, nav) => dispatch => {
  AsyncStorage.getItem('company').then(company => {
    return axios
      .put(`${API_URL}/company/${company}/item/${id}/mark`, {code})
      .then(resp => {
        if (resp.status === 200) {
          dispatch({
            type: MARKING_ERROR_DONE,
            payload: {
              markingErrorDone: false,
            },
          });
          nav.navigate('MarkingDone');
        }
      })
      .catch(e => {
        if (!e.response.data.success) {
          let error = getProperError(e.response.data.message.name);
          dispatch({
            type: MARKING_ERROR_DONE,
            payload: {
              markingErrorDone: error,
            },
          });
          nav.navigate('MarkingDone');
        }
      });
  });
};

// Search Action
export const searchItem = (status, query, offset, isNew) => dispatch => {
  AsyncStorage.getItem('company').then(company => {
    return axios
      .get(`${API_URL}/company/${company}/item/`, {
        params: {marked: status, search: query, limit: 6, offset: offset},
      })
      .then(resp => {
        if (resp.status === 200) {
          if (isNew) {
            dispatch({
              type: MARKING,
              payload: {
                offSet: 6,
                loadMore: false,
                markingList: resp.data.data,
              },
            });
          } else {
            dispatch({
              type: MARKING_SEARCH,
              payload: {
                offSet: 6,
                loadMore: false,
                markingList: resp.data.data,
              },
            });
          }
        }
      })
      .catch(e => {
        if (!e.response.data.success) {
          let error = getProperError(e.response.data.message.name);
          dispatch({
            type: MARKING_ERROR,
            payload: {
              markingError: error,
              loadMore: false,
            },
          });
        }
      });
  });
};

export const loadMore = status => dispatch => {
  dispatch({
    type: CHANGE_STATUS_LOAD_MORE,
    payload: {loadMore: status},
  });
};
