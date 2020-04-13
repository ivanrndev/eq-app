import AsyncStorage from '@react-native-community/async-storage';
import axios from '../utils/axios';
import {API_URL, LOGIN_URL} from '../constants/auth.js';
import {getProperError, actionCheckError} from '../utils/helpers.js';
import {
  LOGIN_USER,
  LOGIN_USER_ERROR,
  CHANGE_STATUS_ERROR,
  CHANGE_STATUS_LOAD,
  SAVE_CURRENT_SCAN,
  ALLOW_NEW_SCAN,
  SAVE_CURRENT_SCAN_INFO,
  SAVE_CURRENT_SCAN_INFO_LIST,
  CLEAR_SCAN_GIVE_LIST,
  UPDATE_SCAN_GIVE_LIST,
  ERROR_CURRENT_SCAN_INFO,
  DIALOG_INPUT,
  SUCCES_IN_SERVICES,
  ERROR_SEND_SERVICES,
  PUT_ERROR_SEND_SERVICES,
  SUCCES_WRITE_OFF,
  ERROR_WRITE_OFF,
  PUT_ERROR_WRITE_OFF,
  MARKING,
  MARKING_ERROR,
  MARKING_ERROR_DONE,
  MAKE_MARKING_ERROR_DEFAULT,
  MARKING_CURRENT_ID,
  MARKING_SEARCH,
  CHANGE_STATUS_LOAD_MORE,
  GET_MY_ITEMS,
  GET_MY_ITEMS_ERROR,
  GET_MY_ITEMS_SEARCH,
  CHANGE_STATUS_MY_LOAD_MORE,
  MY_CURRENT_INFO_ID,
  TRANSACTIONS_LIST,
  TRANSACTIONS_ERROR,
  GET_USERS,
  GET_USERS_ERROR,
  USER_CURRENT_ID,
  TRANSFER,
  ERROR_TRANSFER,
  TRANSFERS_LIST,
  TRANSFERS_ERROR,
  LOAD_MORE_TRANSFERS,
  LOAD_MORE_TRANSACTIONS,
  CLEAR_TRANSFERS_LIST,
  CLEAR_TRANSACTIONS_LIST,
  TRANSFERS_ID,
} from '../actions/actionsType.js';

// Auth actions
export const userPostFetch = ({email, password}) => dispatch => {
  return axios
    .post(LOGIN_URL, {email, password})
    .then(resp => {
      if (resp.status === 200) {
        AsyncStorage.setItem('token', resp.data.token);
        AsyncStorage.setItem('role', resp.data.role);
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
      AsyncStorage.setItem('userId', resp.data._id);
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
export const currentScan = (id, nav, page, saveItems = false) => dispatch => {
  dispatch({
    type: SAVE_CURRENT_SCAN,
    payload: {currentScan: id, isNewScan: false},
  });
  dispatch(scanInfo(id, nav, page, saveItems));
};

export const dialogInput = status => dispatch => {
  dispatch({
    type: DIALOG_INPUT,
    payload: {dialogInput: status},
  });
};

export const scanInfo = (id, nav, page, saveItems) => dispatch => {
  AsyncStorage.getItem('company').then(company => {
    return axios
      .get(`${API_URL}/company/${company}/item/${id}`)
      .then(resp => {
        if (resp.status === 200) {
          if (saveItems) {
            let checkErrors = actionCheckError(resp.data);
            if (checkErrors) {
              dispatch({
                type: ERROR_CURRENT_SCAN_INFO,
                payload: {
                  scanInfoError: checkErrors,
                },
              });
            } else {
              let role = resp.data.person ? resp.data.person.role : 'none';
              dispatch({
                type: SAVE_CURRENT_SCAN_INFO_LIST,
                payload: {
                  scanGiveList: resp.data,
                  scanUserRole: role,
                  selectGiveId: resp.data._id,
                  scanInfoError: false,
                },
              });
            }
          } else {
            dispatch({
              type: SAVE_CURRENT_SCAN_INFO,
              payload: {
                scanInfo: resp.data,
                scanInfoError: false,
                isInfoOpen: true,
              },
            });
          }
          dispatch(dialogInput(false));
          nav.navigate(page);
        }
      })
      .catch(e => {
        if (!e.response.data.success) {
          dispatch({
            type: ERROR_CURRENT_SCAN_INFO,
            payload: {
              scanInfoError: e.response.data.message.name,
              scanInfo: {},
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
      scanInfoError: false,
      scanUserRole: '',
      selectGiveId: '',
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

export const putServicesError = error => dispatch => {
  dispatch({
    type: PUT_ERROR_SEND_SERVICES,
    payload: {inServicesError: error},
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

export const putWriteOffError = error => dispatch => {
  dispatch({
    type: PUT_ERROR_WRITE_OFF,
    payload: {inWriteOffError: error},
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

export const makeMarkingErrorDefault = () => dispatch => {
  dispatch({
    type: MAKE_MARKING_ERROR_DEFAULT,
    payload: {
      markingSuccess: false,
    },
  });
};

export const makeMarking = (id, code) => dispatch => {
  dispatch(makeMarkingErrorDefault());
  AsyncStorage.getItem('company').then(company => {
    return axios
      .put(`${API_URL}/company/${company}/item/${id}/mark`, {code})
      .then(resp => {
        if (resp.status === 200) {
          dispatch({
            type: MARKING_ERROR_DONE,
            payload: {
              markingErrorDone: false,
              markingSuccess: true,
            },
          });
        }
      })
      .catch(e => {
        if (!e.response.data.success) {
          let error = getProperError(e.response.data.message.name);
          dispatch({
            type: MARKING_ERROR_DONE,
            payload: {
              markingErrorDone: error,
              markingSuccess: false,
            },
          });
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

// OnMe actions
export const getItemsOnMe = nav => dispatch => {
  AsyncStorage.getItem('company').then(company => {
    return axios
      .get(`${API_URL}/company/${company}/item/me`, {
        params: {limit: 6, offSet: 0},
      })
      .then(resp => {
        if (resp.status === 200) {
          dispatch({
            type: GET_MY_ITEMS,
            payload: {
              myloadMore: false,
              offSet: 6,
              myList: resp.data.data,
              myError: false,
            },
          });
          nav.navigate('OnMe');
        }
      })
      .catch(e => {
        if (!e.response.data.success) {
          let error = getProperError(e.response.data.message.name);
          dispatch({
            type: GET_MY_ITEMS_ERROR,
            payload: {
              myError: error,
              myloadMore: false,
            },
          });
          nav.navigate('OnMe');
        }
      });
  });
};

export const searchMyItem = (query, offset, isNew) => dispatch => {
  AsyncStorage.getItem('company').then(company => {
    return axios
      .get(`${API_URL}/company/${company}/item/me`, {
        params: {search: query, limit: 6, offset: offset},
      })
      .then(resp => {
        if (resp.status === 200) {
          if (isNew) {
            dispatch({
              type: GET_MY_ITEMS,
              payload: {
                offSet: 6,
                myloadMore: false,
                myList: resp.data,
              },
            });
          } else {
            dispatch({
              type: GET_MY_ITEMS_SEARCH,
              payload: {
                offSet: 6,
                myloadMore: false,
                myList: resp.data,
              },
            });
          }
        }
      })
      .catch(e => {
        if (!e.response.data.success) {
          let error = getProperError(e.response.data.message.name);
          dispatch({
            type: GET_MY_ITEMS_ERROR,
            payload: {
              myError: error,
              myloadMore: false,
            },
          });
        }
      });
  });
};

export const saveCurrentMyItem = (id, nav) => dispatch => {
  dispatch({
    type: MY_CURRENT_INFO_ID,
    payload: {
      myCurrentId: id,
      isMyInfoOpen: true,
    },
  });
  nav.navigate('OnMeInfo');
};

export const myloadMore = status => dispatch => {
  dispatch({
    type: CHANGE_STATUS_MY_LOAD_MORE,
    payload: {myloadMore: status},
  });
};

// Transactions actions
export const getTransactions = (id, nav, offset) => dispatch => {
  AsyncStorage.getItem('company').then(company => {
    return axios
      .get(`${API_URL}/company/${company}/item/${id}/transactions`, {
        params: {limit: 6, offset: offset},
      })
      .then(resp => {
        if (resp.status === 200) {
          dispatch({
            type: TRANSACTIONS_LIST,
            payload: {
              transactionList: resp.data.data,
              transactionItemId: id,
              transactionError: false,
              loadMoreTransaction: false,
              offSet: 6,
            },
          });
          nav.navigate('Transactions');
        }
      })
      .catch(e => {
        if (!e.response.data.success) {
          let error = getProperError(e.response.data.message.name);
          dispatch({
            type: TRANSACTIONS_ERROR,
            payload: {
              transactionError: error,
              transactionItemId: id,
              loadMoreTransaction: false,
              offSet: 6,
            },
          });
          nav.navigate('Transactions');
        }
      });
  });
};

export const clearTransaction = () => dispatch => {
  dispatch({
    type: CLEAR_TRANSACTIONS_LIST,
    payload: {
      transactionList: [],
      transactionItemId: '',
      transactionError: false,
      loadMoreTransaction: false,
      offSet: 0,
    },
  });
};

export const loadMoreTransactions = status => dispatch => {
  dispatch({
    type: LOAD_MORE_TRANSACTIONS,
    payload: {loadMoreTransaction: status},
  });
};

// Give actions
export const getUserList = (nav, search, page = '') => dispatch => {
  AsyncStorage.getItem('company').then(company => {
    return axios
      .get(`${API_URL}/company/${company}/user`, {
        params: {search},
      })
      .then(resp => {
        if (resp.status === 200) {
          dispatch({
            type: GET_USERS,
            payload: {
              userList: resp.data,
              getUsetError: false,
            },
          });
          if (page !== '') {
            nav.navigate(page);
          }
        }
      })
      .catch(e => {
        if (!e.response.data.success) {
          let error = getProperError(e.response.data.message.name);
          dispatch({
            type: GET_USERS_ERROR,
            payload: {
              getUsetError: error,
            },
          });
          if (page !== '') {
            nav.navigate(page);
          }
        }
      });
  });
};

export const saveCurrentUser = (id, role, nav) => dispatch => {
  dispatch({
    type: USER_CURRENT_ID,
    payload: {
      userCurrentId: id,
      userRole: role,
    },
  });
  nav.navigate('GiveScaner');
};

export const clearGiveList = () => dispatch => {
  dispatch({
    type: CLEAR_SCAN_GIVE_LIST,
    payload: {
      scanGiveList: [],
    },
  });
};

export const updateGiveList = list => dispatch => {
  dispatch({
    type: UPDATE_SCAN_GIVE_LIST,
    payload: {
      scanGiveList: list,
    },
  });
};

export const makeTransfer = (nav, list, user) => dispatch => {
  AsyncStorage.getItem('company').then(company => {
    return axios
      .post(`${API_URL}/transfer/`, {
        item_ids: list,
        recipient: user,
        company_id: company,
      })
      .then(resp => {
        if (resp.status === 200) {
          let status = '';
          if (resp.data.transfer) {
            status =
              resp.data.transfer === true
                ? 'complete'
                : resp.data.transfer.status;
          } else {
            status = 'error';
          }
          dispatch({
            type: TRANSFER,
            payload: {
              statusTransfer: status,
              transferError: resp.data.errors,
            },
          });
          nav.navigate('GiveFinish');
        }
      })
      .catch(e => {
        if (!e.response.data) {
          let error = getProperError(e.response.data.errors.type);
          dispatch({
            type: ERROR_TRANSFER,
            payload: {
              statusTransfer: 'error',
              transferError: error,
            },
          });
          nav.navigate('GiveFinish');
        }
      });
  });
};

// Transfers action
export const getTransfers = (nav, user_id, offset) => dispatch => {
  AsyncStorage.getItem('company').then(company => {
    return axios
      .get(`${API_URL}/company/${company}/user/${user_id}/transfers`, {
        params: {limit: 6, offset: offset},
      })
      .then(resp => {
        if (resp.status === 200) {
          dispatch({
            type: TRANSFERS_LIST,
            payload: {
              transferList: resp.data.data,
              transferError: false,
              loadMoreTransfers: false,
              offSet: 6,
            },
          });
          nav.navigate('Transfers');
        }
      })
      .catch(e => {
        if (!e.response.data.success) {
          let error = getProperError(e.response.data.message.name);
          dispatch({
            type: TRANSFERS_ERROR,
            payload: {
              transferError: error,
              loadMoreTransfers: false,
            },
          });
          nav.navigate('Transfers');
        }
      });
  });
};

export const loadMoreTransfers = status => dispatch => {
  dispatch({
    type: LOAD_MORE_TRANSFERS,
    payload: {loadMoreTransfers: status},
  });
};

export const clearTransfer = () => dispatch => {
  dispatch({
    type: CLEAR_TRANSFERS_LIST,
    payload: {
      transferList: [],
      transferError: false,
      loadMoreTransfers: false,
      offSet: 0,
      transferId: '',
    },
  });
};

export const saveCurrenTransferId = (nav, id) => dispatch => {
  dispatch({
    type: TRANSFERS_ID,
    payload: {transferId: id},
  });
  nav.navigate('TransferInfo');
};
