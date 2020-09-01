import AsyncStorage from '@react-native-community/async-storage';
import axios from '../utils/axios';
import {API_URL, LOGIN_URL, PORGOT_PASS} from '../constants/auth.js';
import {getProperError, actionCheckError} from '../utils/helpers.js';
import {
  LOGUT,
  LOGIN_USER,
  GET_COMPANY_INFO,
  GET_COMPANY_INFO_ERROR,
  LOGIN_USER_ERROR,
  CHANGE_STATUS_ERROR,
  CHANGE_STATUS_LOAD,
  SAVE_CURRENT_SCAN,
  ALLOW_NEW_SCAN,
  LOADER,
  LANG,
  HELP,
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
  CLEAR_MARKING,
  MARKING_ERROR,
  MARKING_ERROR_DONE,
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
  CLEAR_USER_LIST,
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
  TRANSFERS_UPDATE,
  TRANSFERS_UPDATE_ERROR,
  GET_BID_LIST,
  GET_BID_LIST_ERROR,
  LOAD_MORE_STATUS,
  CLEAR_BID_LIST,
  SAVE_USER_ACCEPT_BID,
  ALREADY_SCANNED_BIDS,
  MAKE_ACCEPT,
  MAKE_ACCEPT_ERROR,
  SAVE_CURRENT_INVENTORY_USER,
  SAVE_INVENTORY_SCANS,
  MAKE_STOCKTAKING,
  MAKE_STOCKTAKING_ERROR,
  GET_COMMENTS,
  GET_COMMENTS_ERROR,
  CHANGE_STATUS_LOAD_MORE_COMMENTS,
  CLEAR_COMMENTS,
  SEND_COMMENT,
  SEND_COMMENT_ERROR,
  FORGOT_PASS_SUCESS,
  FORGOT_PASS_ERROR,
  RESET_PASS_INFO,
  NFC,
  LOCATIONS,
} from '../actions/actionsType.js';

// Settings
export const nfc = (nfcBack, nfcNext, isMultiple) => dispatch => {
  dispatch({
    type: NFC,
    payload: {nfcBack, nfcNext, isMultiple},
  });
};

export const loader = status => dispatch => {
  dispatch({
    type: LOADER,
    payload: {loader: status},
  });
};

export const lang = language => dispatch => {
  dispatch({
    type: LANG,
    payload: {lang: language},
  });
};

export const helps = status => dispatch => {
  dispatch({
    type: HELP,
    payload: {help: status},
  });
};

// Auth actions
export const userPostFetch = ({email, password}) => dispatch => {
  return axios
    .post(LOGIN_URL, {login: email, password})
    .then(resp => {
      if (resp.status === 200) {
        AsyncStorage.setItem('token', resp.data.token);
        AsyncStorage.setItem('role', resp.data.role);
        dispatch({
          type: LOGIN_USER,
          payload: {
            isLogin: true,
            isLoad: false,
            isLogOut: false,
          },
        });

        // first open help
        AsyncStorage.setItem('help', '1');
        dispatch(helps(1));

        dispatch(currentUser());
      }
    })
    .catch(e => {
      if (!e.response.data.success) {
        dispatch({
          type: LOGIN_USER_ERROR,
          payload: {
            isError: e.response.data.message.name,
            isLoad: false,
          },
        });
      }
    });
};

export const logOut = (nav, ifNav = true) => dispatch => {
  AsyncStorage.removeItem('token');
  AsyncStorage.removeItem('role');
  AsyncStorage.removeItem('userId');
  AsyncStorage.removeItem('company');
  AsyncStorage.removeItem('email');
  AsyncStorage.removeItem('firstName');
  AsyncStorage.removeItem('lastName');
  AsyncStorage.removeItem('help');
  AsyncStorage.removeItem('language');
  dispatch({
    type: LOGUT,
    payload: {
      isLogOut: true,
      isLogin: false,
      currentCompany: {},
    },
  });
  if (ifNav) {
    nav.navigate('Auth');
  }
};

export const currentUser = props => dispatch => {
  return axios.get('/users/me').then(resp => {
    if (resp.status === 200) {
      // dispatch(getCompanyInfo());
      if (resp.data.email) {
        AsyncStorage.setItem('email', resp.data.email);
      }
      if (resp.data.firstName) {
        AsyncStorage.setItem('firstName', resp.data.firstName);
      }
      if (resp.data.lastName) {
        AsyncStorage.setItem('lastName', resp.data.lastName);
      }
      if (resp.data.company) {
        AsyncStorage.setItem('company', resp.data.company);
      }
      if (resp.data.company) {
        AsyncStorage.setItem('userId', resp.data._id);
      }
      // get company info
      dispatch(getCompanyInfo());
    }
  });
};

export const getCompanyInfo = () => dispatch => {
  AsyncStorage.getItem('company').then(company => {
    return axios
      .get(`${API_URL}/company/my`)
      .then(resp => {
        if (resp.status === 200) {
          dispatch({
            type: GET_COMPANY_INFO,
            payload: {
              currentCompany: resp.data.company,
            },
          });
        }
      })
      .catch(e => {
        if (!e.response.data.success) {
          dispatch({
            type: GET_COMPANY_INFO_ERROR,
            payload: {
              currentCompany: e.response.data.message.name,
            },
          });
        }
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
  console.log('PrePAGE', page);
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
                  selectGiveId: resp.data._id,
                },
              });
              dispatch(loader(false));
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
              dispatch(loader(false));
            }
          } else {
            dispatch({
              type: SAVE_CURRENT_SCAN_INFO,
              payload: {
                scanInfo: resp.data,
                scanInfoError: false,
                selectGiveId: resp.data._id,
                isInfoOpen: true,
              },
            });
            dispatch(loader(false));
          }
          dispatch(dialogInput(false));
          dispatch(loader(false));
          console.log('page', page);
          nav.navigate(page);
        }
      })
      .catch(e => {
        dispatch({
          type: ERROR_CURRENT_SCAN_INFO,
          payload: {
            scanInfoError: e.response.data.message.name,
            scanInfo: {},
            isInfoOpen: true,
          },
        });
        dispatch(loader(false));
        dispatch(dialogInput(false));
        nav.navigate(page);
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
  dispatch(loader(false));
};

// Service actions
export const sendToServices = (id, description, place, nav) => dispatch => {
  const isFullFilled = !!description && !!place;
  const data = isFullFilled
    ? {
        description,
        place,
      }
    : {};
  AsyncStorage.getItem('company').then(company => {
    return axios
      .put(`${API_URL}/company/${company}/item/${id}/repair`, data)
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
          dispatch(loader(false));
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
          dispatch(loader(false));
        }
      });
  });
};

export const backFromServices = (id, nav) => dispatch => {
  AsyncStorage.getItem('company').then(company => {
    return axios
      .put(`${API_URL}/company/${company}/item/repair/back`, {
        item_ids: id,
      })
      .then(resp => {
        if (resp.status === 200) {
          let errorBack = resp.data.errors[0]
            ? resp.data.errors[0].type
            : false;
          dispatch({
            type: SUCCES_IN_SERVICES,
            payload: {
              inServices: !!resp.data.repair,
              inServicesError: errorBack,
            },
          });
          nav.navigate('BackFinish');
          dispatch(loader(false));
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
          nav.navigate('BackFinish');
          dispatch(loader(false));
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
          dispatch(loader(false));
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
          dispatch(loader(false));
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
          dispatch(loader(false));
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
          dispatch(loader(false));
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
  nav.navigate('SelectScanMarking');
};

export const makeMarking = (id, code) => dispatch => {
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
export const clearMarking = () => dispatch => {
  dispatch({
    type: CLEAR_MARKING,
    payload: {
      markingList: [],
      markingErrorDone: false,
    },
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
          dispatch(loader(false));
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
          dispatch(loader(false));
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
          let data = resp.data.data ? resp.data.data : resp.data;
          if (isNew) {
            dispatch({
              type: GET_MY_ITEMS,
              payload: {
                offSet: 6,
                myloadMore: false,
                myList: data,
              },
            });
          } else {
            dispatch({
              type: GET_MY_ITEMS_SEARCH,
              payload: {
                offSet: 6,
                myloadMore: false,
                myList: data,
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
          dispatch(loader(false));
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
          dispatch(loader(false));
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
            dispatch(loader(false));
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
            dispatch(loader(false));
          }
        }
      });
  });
};

export const clearUserList = () => dispatch => {
  dispatch({
    type: CLEAR_USER_LIST,
    payload: {
      userList: [],
    },
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
  nav.navigate('SelectScanGive');
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
          dispatch(loader(false));
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
          dispatch(loader(false));
        }
      });
  });
};

// Transfers action
export const getTransfers = (
  nav,
  user_id,
  offset,
  unSave = false,
  route = 'Transfers',
) => dispatch => {
  AsyncStorage.getItem('company').then(company => {
    return axios
      .get(`${API_URL}/company/${company}/user/${user_id}/transfers`, {
        params: {limit: 6, offset: offset},
      })
      .then(resp => {
        if (resp.status === 200) {
          if (unSave) {
            dispatch({
              type: TRANSFERS_UPDATE,
              payload: {
                transferList: resp.data.data,
                transferError: false,
                loadMoreTransfers: false,
                offSet: 6,
              },
            });
          } else {
            dispatch({
              type: TRANSFERS_LIST,
              payload: {
                transferList: resp.data.data,
                transferError: false,
                loadMoreTransfers: false,
                offSet: 6,
              },
            });
          }
          if (route) {
            nav.navigate(route);
          } else {
            nav.navigate('Transfers');
          }
          dispatch(loader(false));
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
          dispatch(loader(false));
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

// Accept actions
export const getBidList = (nav, id, offset) => dispatch => {
  AsyncStorage.getItem('company').then(company => {
    return axios
      .get(`${API_URL}/company/${company}/user/${id}/transfers/receive`, {
        params: {limit: 6, offset},
      })
      .then(resp => {
        if (resp.status === 200) {
          let data = resp.data.data ? resp.data.data : resp.data;
          dispatch({
            type: GET_BID_LIST,
            payload: {
              acceptList: data,
              userAcceptId: id,
              acceptError: false,
              acceptloadMore: false,
              offSet: 6,
            },
          });
          nav.navigate('Accept');
          dispatch(loader(false));
        }
      })
      .catch(e => {
        if (!e.response.data.success) {
          let error = getProperError(e.response.data.message.name);
          dispatch({
            type: GET_BID_LIST_ERROR,
            payload: {
              acceptError: error,
              userAcceptId: id,
              acceptloadMore: false,
              offSet: 6,
            },
          });
          nav.navigate('Accept');
          dispatch(loader(false));
        }
      });
  });
};

export const acceptloadMoreStatus = status => dispatch => {
  dispatch({
    type: LOAD_MORE_STATUS,
    payload: {acceptloadMore: status},
  });
};

export const clearBidList = () => dispatch => {
  dispatch({
    type: CLEAR_BID_LIST,
    payload: {
      acceptList: [],
      alreadyScannedBids: [],
      acceptloadMore: false,
      offSet: 0,
      acceptError: false,
      userAcceptId: '',
      userAcceptBid: '',
    },
  });
};

export const userAcceptBid = (nav, id) => dispatch => {
  dispatch({
    type: SAVE_USER_ACCEPT_BID,
    payload: {
      userAcceptBid: id,
    },
  });
  nav.navigate('AcceptList');
};

export const clearUserAcceptBid = () => dispatch => {
  dispatch({
    type: SAVE_USER_ACCEPT_BID,
    payload: {
      userAcceptBid: '',
    },
  });
};

export const alreadyScannedBids = arr => dispatch => {
  dispatch({
    type: ALREADY_SCANNED_BIDS,
    payload: {
      alreadyScannedBids: arr,
    },
  });
};

export const makeAccept = (
  accept_id,
  reject,
  nav,
  object = '',
  location = '',
) => dispatch => {
  AsyncStorage.getItem('company').then(company => {
    return axios
      .post(`${API_URL}/transfer/${accept_id}/complete/`, {
        reject,
        company_id: company,
        object,
        location,
      })
      .then(resp => {
        if (resp.status === 200) {
          dispatch({
            type: MAKE_ACCEPT,
            payload: {
              acceptList: [],
              alreadyScannedBids: [],
              acceptError: false,
              showButtons: false,
            },
          });
          nav.navigate('AcceptFinish');
          dispatch(loader(false));
        }
      })
      .catch(e => {
        if (!e.response.data.success) {
          let error = getProperError(e.response.data.message.name);
          dispatch({
            type: MAKE_ACCEPT_ERROR,
            payload: {
              acceptError: error,
              showButtons: false,
            },
          });
          nav.navigate('AcceptFinish');
          dispatch(loader(false));
        }
      });
  });
};

// inventory actions
export const saveCurrentUserInventory = (id, nav) => dispatch => {
  dispatch({
    type: SAVE_CURRENT_INVENTORY_USER,
    payload: {
      currentInventoryUser: id,
    },
  });
  nav.navigate('SelectScanInventory');
};

export const alreadyScanned = arr => dispatch => {
  dispatch({
    type: SAVE_INVENTORY_SCANS,
    payload: {
      inventoryScanList: arr,
    },
  });
};

export const makeStocktaking = (array, userId, nav) => dispatch => {
  AsyncStorage.getItem('company').then(company => {
    return axios
      .post(`${API_URL}/company/${company}/stocktaking/`, {
        item_ids: array,
        target: userId,
      })
      .then(resp => {
        if (resp.status === 200) {
          dispatch({
            type: MAKE_STOCKTAKING,
            payload: {
              makeStocktaking: true,
              inventoryError: false,
              inventoryScanList: [],
            },
          });
          nav.navigate('InventoryDone');
          dispatch(loader(false));
        }
      })
      .catch(e => {
        if (!e.response.data.success) {
          let error = getProperError(e.response.data.message.name);
          dispatch({
            type: MAKE_STOCKTAKING_ERROR,
            payload: {
              inventoryError: error,
            },
          });
          nav.navigate('InventoryDone');
          dispatch(loader(false));
        }
      });
  });
};

// comments
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
    },
  });
};

export const sendComments = (itemId, message) => dispatch => {
  AsyncStorage.getItem('company').then(company => {
    return axios
      .post(`${API_URL}/company/${company}/item/${itemId}/comments/`, {message})
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

// forgot password
export const forgotPassword = key => dispatch => {
  return axios
    .post(PORGOT_PASS, {key})
    .then(resp => {
      if (resp.status === 200) {
        dispatch({
          type: FORGOT_PASS_SUCESS,
          payload: {
            forgot_pass_sucess: 'SUCESS',
          },
        });
      }
    })
    .catch(e => {
      if (!e.response.data.success) {
        dispatch({
          type: FORGOT_PASS_ERROR,
          payload: {
            forgot_pass_sucess: false,
            forgot_pass_error: e.response.data.message.name,
          },
        });
      }
    });
};

export const resetPassInfo = status => dispatch => {
  dispatch({
    type: RESET_PASS_INFO,
    payload: {
      forgot_pass_sucess: false,
      forgot_pass_error: false,
    },
  });
};

// Update Transfer
export const updateTransfer = (nav, id, items, route) => dispatch => {
  return axios
    .patch(`${API_URL}/transfer/${id}/edit`, {
      item_ids: items.map(item => item._id),
    })
    .then(resp => {
      if (resp.status === 200) {
        dispatch({
          type: TRANSFERS_UPDATE,
          payload: {
            transferUpdate: true,
            transferUpdateError:
              resp.data.errors.length > 0 ? resp.data.errors[0] : '',
          },
        });
        dispatch(loader(false));
        AsyncStorage.getItem('userId').then(id => {
          dispatch(getTransfers(nav, id, 0, true, route));
        });
      }
    })
    .catch(e => {
      if (!e.response.data.success) {
        dispatch({
          type: TRANSFERS_UPDATE_ERROR,
          payload: {
            transferUpdateError: e.response.data.message.name,
          },
        });
        dispatch(loader(false));
      }
    });
};

// Delete Transfer
export const deleteTransfer = (nav, id, route) => dispatch => {
  return axios
    .delete(`${API_URL}/transfer/${id}/reject`)
    .then(resp => {
      if (resp.status === 200) {
        dispatch({
          type: TRANSFERS_UPDATE,
          payload: {
            transferUpdate: true,
          },
        });
        AsyncStorage.getItem('userId').then(id => {
          dispatch(getTransfers(nav, id, 0, true, route));
        });
        dispatch(loader(false));
      }
    })
    .catch(e => {
      if (!e.response.data.success) {
        dispatch({
          type: TRANSFERS_UPDATE_ERROR,
          payload: {
            transferUpdateError: e.response.data.message.name,
          },
        });
        dispatch(loader(false));
      }
    });
};

// locations
export const getLocations = props => dispatch => {
  AsyncStorage.getItem('company').then(company => {
    return axios.get(`/company/${company}/locations`).then(resp => {
      if (resp.status === 200) {
        dispatch({
          type: LOCATIONS,
          payload: {locations: resp.data.data},
        });
      }
    });
  });
};
