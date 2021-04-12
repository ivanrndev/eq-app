import AsyncStorage from '@react-native-community/async-storage';
import axios from '../utils/axios';
import {
  API_URL,
  LOGIN_GOOGLE_URL,
  LOGIN_URL,
  PORGOT_PASS,
} from '../constants/auth.js';
import {actionCheckError, getProperError} from '../utils/helpers.js';
import {
  ADD_ITEM_TO_MOUNT_LIST,
  ALLOW_NEW_SCAN,
  ALREADY_SCANNED_BIDS,
  BACK_PAGE_MOUNT,
  CHANGE_IS_MULTYPLE,
  CHANGE_STATUS_ERROR,
  CHANGE_STATUS_LOAD,
  CHANGE_STATUS_LOAD_MORE,
  CHANGE_STATUS_MY_LOAD_MORE,
  CLEAR_BID_LIST,
  CLEAR_GIVE_ITEM_QTY,
  CLEAR_INVENTORY,
  CLEAR_MARKING,
  CLEAR_SCAN_GIVE_LIST,
  CLEAR_TRANSACTIONS_LIST,
  CLEAR_TRANSFERS_LIST,
  CLEAR_USER_LIST,
  DIALOG_INPUT,
  ERROR_CURRENT_MOUNT_SCAN_INFO,
  ERROR_CURRENT_SCAN_INFO,
  ERROR_SEND_SERVICES,
  ERROR_TRANSFER,
  ERROR_WRITE_OFF,
  FORGOT_PASS_ERROR,
  FORGOT_PASS_SUCESS,
  GET_BID_LIST,
  GET_BID_LIST_ERROR,
  GET_COMPANY_INFO,
  GET_COMPANY_INFO_ERROR,
  GET_COUNT_MY_COMPANY_ITEMS,
  GET_COUNT_MY_COMPANY_ITEMS_ERROR,
  GET_MY_ITEMS,
  GET_MY_ITEMS_ERROR,
  GET_MY_ITEMS_SEARCH,
  GET_USERS,
  GET_USERS_ERROR,
  HELP,
  LANG,
  LOAD_MORE_STATUS,
  LOAD_MORE_TRANSACTIONS,
  LOAD_MORE_TRANSFERS,
  LOADER,
  LOCATION_MAIN,
  LOCATIONS,
  LOCATTION_LOC,
  LOGIN_USER,
  LOGIN_USER_ERROR,
  LOGIN_WITH_GOOGLE_ACCOUNT,
  LOGIN_WITH_GOOGLE_ACCOUNT_ERROR,
  LOGUT,
  MAKE_ACCEPT,
  MAKE_ACCEPT_ERROR,
  MAKE_STOCKTAKING,
  MAKE_STOCKTAKING_ERROR,
  MARKING,
  MARKING_CURRENT_ID,
  MARKING_ERROR,
  MARKING_ERROR_DONE,
  MARKING_SEARCH,
  MOUNT_CAMERA_LIST,
  MOUNT_SCAN,
  MY_CURRENT_INFO_ID,
  NEXT_PAGE_MOUNT,
  NFC,
  NFC_FOR_MOUNTING,
  PUT_ERROR_SEND_SERVICES,
  PUT_ERROR_WRITE_OFF,
  RESET_PASS_INFO,
  SAVE_CURRENT_INVENTORY_USER,
  SAVE_CURRENT_SCAN,
  SAVE_CURRENT_SCAN_INFO,
  SAVE_CURRENT_SEARCH,
  SAVE_CURRENT_SEARCH_ERROR,
  SAVE_GIVE_ITEM_INFO_LIST,
  SAVE_INVENTORY_CREATED_ITEM,
  SAVE_INVENTORY_SCANS,
  SAVE_USER_ACCEPT_BID,
  SEARCH_MY_COMPANY_ITEMS,
  SEARCH_MY_COMPANY_ITEMS_ERROR,
  SET_GIVE_ITEM_QTY,
  SET_INVENTORY_ITEM_QTY,
  START_PAGE,
  SUCCES_IN_SERVICES,
  SUCCES_WRITE_OFF,
  TRANSACTIONS_ERROR,
  TRANSACTIONS_LIST,
  TRANSFER,
  TRANSFERS_ERROR,
  TRANSFERS_ID,
  TRANSFERS_LIST,
  TRANSFERS_UPDATE,
  TRANSFERS_UPDATE_ERROR,
  UPDATE_SCAN_GIVE_LIST,
  USER_CURRENT_ID,
} from './actionsType';

// Settings
export const nfc = (
  nfcBack,
  nfcNext,
  isMultiple,
  swithCamera,
  nameOfType,
  NFCforMounting = false,
) => dispatch => {
  dispatch({
    type: NFC,
    payload: {
      nfcBack,
      nfcNext,
      isMultiple,
      swithCamera,
      nameOfType,
      NFCforMounting,
    },
  });
};

export const changeLocationMain = name => dispatch => {
  dispatch({
    type: LOCATION_MAIN,
    payload: {locationMain: name},
  });
};

export const changeLocationLoc = name => dispatch => {
  dispatch({
    type: LOCATTION_LOC,
    payload: {locationLoc: name},
  });
};

export const changeIsMultiple = status => dispatch => {
  dispatch({
    type: CHANGE_IS_MULTYPLE,
    payload: {isMultiple: status},
  });
};

export const mountCameraList = (array, item) => dispatch => {
  const newArray = array.concat(item);
  dispatch({
    type: MOUNT_CAMERA_LIST,
    payload: {mountCameraList: newArray},
  });
};

export const backPageMount = page => dispatch => {
  dispatch({
    type: BACK_PAGE_MOUNT,
    payload: {backPageMount: page},
  });
};

export const nextPageMount = page => dispatch => {
  dispatch({
    type: NEXT_PAGE_MOUNT,
    payload: {nextPageMount: page},
  });
};

export const NFCforMounting = page => dispatch => {
  dispatch({
    type: NFC_FOR_MOUNTING,
    payload: {NFCforMounting: page},
  });
};

export const switchStartPage = (name, page) => dispatch => {
  dispatch({
    type: START_PAGE,
    payload: {
      [name]: page,
    },
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
export const authWithGoogleAccount = token => dispatch => {
  dispatch(loader(true));
  return axios
    .post(LOGIN_GOOGLE_URL, {token})
    .then(resp => {
      if (resp.status === 200) {
        AsyncStorage.setItem('token', resp.data.token);
        AsyncStorage.setItem('role', resp.data.role);
        dispatch({
          type: LOGIN_WITH_GOOGLE_ACCOUNT,
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
        dispatch(loader(false));
      }
    })
    .catch(e => {
      if (!e.response.data.success) {
        dispatch({
          type: LOGIN_WITH_GOOGLE_ACCOUNT_ERROR,
          payload: {
            isError: e.response.data.message.name,
            isLoad: false,
          },
        });
        dispatch(loader(false));
      }
    });
};

export const currentUser = () => dispatch => {
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

// Scan and search actions

export const currentScan = (
  id,
  nav,
  page,
  saveItems = false,
  mount = false,
) => dispatch => {
  if (mount) {
    dispatch({
      type: MOUNT_SCAN,
      payload: {mountScan: id},
    });
    dispatch(scanInfo(id, nav, page, saveItems, true));
  } else {
    dispatch({
      type: SAVE_CURRENT_SCAN,
      payload: {currentScan: id, isNewScan: false},
    });
    dispatch(scanInfo(id, nav, page, saveItems));
  }
};

export const dialogInput = status => dispatch => {
  dispatch({
    type: DIALOG_INPUT,
    payload: {dialogInput: status},
  });
};

export const getSearchItem = (
  id,
  nav,
  page,
  isSearchForGiveItem = false,
) => dispatch => {
  AsyncStorage.getItem('company').then(company => {
    dispatch(loader(true));
    return axios
      .get(`${API_URL}/company/${company}/item/${id}/detailed`)
      .then(resp => {
        if (resp.status === 200) {
          let checkErrors = actionCheckError(resp.data);
          const isRepairItem =
            page === 'BackInfo' && checkErrors === 'InRepair';
          if (checkErrors && !isRepairItem) {
            dispatch({
              type: ERROR_CURRENT_SCAN_INFO,
              payload: {
                scanInfoError: checkErrors,
                selectGiveId: resp.data._id,
                scanInfo: resp.data,
              },
            });
          } else {
            if (isSearchForGiveItem) {
              let role = resp.data.person ? resp.data.person.role : 'none';
              dispatch({
                type: SAVE_GIVE_ITEM_INFO_LIST,
                payload: {
                  scanGiveList: resp.data,
                  scanUserRole: role,
                  selectGiveId: resp.data._id,
                  scanInfoError: false,
                },
              });
            } else {
              dispatch({
                type: SAVE_CURRENT_SEARCH,
                payload: {
                  scanInfo: resp.data,
                  scanInfoError: false,
                  selectGiveId: resp.data._id,
                  isInfoOpen: true,
                },
              });
            }
          }
          dispatch(loader(false));
          nav.navigate(page);
        }
      })
      .catch(e => {
        dispatch({
          type: SAVE_CURRENT_SEARCH_ERROR,
          payload: {
            mountError: e.response.data.message,
          },
        });
        dispatch(loader(false));
      });
  });
};

export const scanInfo = (
  id,
  nav,
  page,
  saveItems,
  mount = false,
) => dispatch => {
  AsyncStorage.getItem('company').then(company => {
    return axios
      .get(`${API_URL}/company/${company}/item/${id}`)
      .then(resp => {
        if (resp.status === 200) {
          if (mount) {
            let checkErrors = actionCheckError(resp.data);
            if (checkErrors) {
              dispatch({
                type: ERROR_CURRENT_MOUNT_SCAN_INFO,
                payload: {
                  mountError: checkErrors,
                },
              });
              dispatch(loader(false));
            } else {
              dispatch({
                type: ADD_ITEM_TO_MOUNT_LIST,
                payload: resp.data,
              });
              dispatch(loader(false));
            }
          } else {
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
                  type: SAVE_GIVE_ITEM_INFO_LIST,
                  payload: {
                    scanGiveList: resp.data,
                    scanUserRole: role,
                    selectGiveId: resp.data._id,
                    scanInfoError: false,
                    scanInfo: resp.data,
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
          }
          dispatch(dialogInput(false));
          dispatch(loader(false));
          nav.navigate(page);
        }
      })
      .catch(e => {
        if (!mount) {
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
        } else {
          dispatch({
            type: ERROR_CURRENT_MOUNT_SCAN_INFO,
            payload: {
              mountError: e.response.data.message.message,
            },
          });
          dispatch(loader(false));
          dispatch(dialogInput(false));
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
  dispatch(loader(false));
};

// Service actions
export const sendToServices = (
  id,
  description,
  place,
  quantity,
  nav,
) => dispatch => {
  const isFullFilled = !!description && !!place && !!quantity;
  const data = isFullFilled
    ? {
        description,
        place,
        quantity,
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
export const sendToWriteOff = (id, nav, quantity) => dispatch => {
  const data = quantity
    ? {
        quantity,
      }
    : {};
  AsyncStorage.getItem('company').then(company => {
    return axios
      .put(`${API_URL}/company/${company}/item/${id}/ban`, data)
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
export const getMarkingList = (status, nav, page = true) => dispatch => {
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
          if (page) {
            nav.navigate('MarkingList');
          }
          dispatch(loader(false));
        }
      })
      .catch(e => {
        if (!e.response.data.success) {
          let error = getProperError(e.response.data.message.name);
          dispatch({
            type: MARKING_ERROR,
            payload: {
              marking: status,
              markingError: error,
              loadMore: false,
            },
          });
          if (page) {
            nav.navigate('MarkingList');
          }
          dispatch(loader(false));
        }
      });
  });
};

export const saveCurrentItemMark = (id, nav, startPage) => dispatch => {
  dispatch({
    type: MARKING_CURRENT_ID,
    payload: {
      currentItemMark: id,
    },
  });
  dispatch(
    nfc('Marking', 'MarkingFinish', false, 'MarkingScaner', 'startPageMarking'),
  );
  nav.navigate(startPage);
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

export const searchMyItem = (query, offset, isNew, limit) => dispatch => {
  AsyncStorage.getItem('company').then(company => {
    return axios
      .get(`${API_URL}/company/${company}/item/me`, {
        params: {search: query, offset, limit},
      })
      .then(resp => {
        if (resp.status === 200) {
          let data = resp.data.data ? resp.data.data : resp.data;
          if (isNew) {
            dispatch({
              type: GET_MY_ITEMS,
              payload: {
                offSet: offset,
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

export const saveCurrentMyItem = (id, code, nav, page) => dispatch => {
  dispatch({
    type: MY_CURRENT_INFO_ID,
    payload: {
      myCurrentId: id,
      myCurrentCode: code,
      isMyInfoOpen: true,
    },
  });
  nav.navigate(page);
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
export const setGiveItemsQty = (id, quantity) => dispatch => {
  dispatch({
    type: SET_GIVE_ITEM_QTY,
    payload: {id, quantity},
  });
};

export const getUserList = (nav, search = '', page = '') => dispatch => {
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
export const clearGiveItemQty = () => dispatch => {
  dispatch({
    type: CLEAR_GIVE_ITEM_QTY,
  });
};

export const saveCurrentUser = (id, role, nav, startPage) => dispatch => {
  dispatch({
    type: USER_CURRENT_ID,
    payload: {
      userCurrentId: id,
      userRole: role,
    },
  });
  dispatch(
    nfc('GiveListCheck', 'GiveListCheck', true, 'GiveScaner', 'startPageGive'),
  );
  nav.navigate(startPage);
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
      .then(() => {
        dispatch(clearGiveList());
        dispatch(clearGiveItemQty());
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
  dispatch(
    nfc('AcceptList', 'AcceptList', false, 'AcceptScaner', 'startPageAccept'),
  );
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
export const setInventoryItemsQty = (id, quantity) => dispatch => {
  dispatch({
    type: SET_INVENTORY_ITEM_QTY,
    payload: {id, quantity},
  });
};
export const clearInventory = () => dispatch => {
  dispatch({
    type: CLEAR_INVENTORY,
    payload: {
      inventoryScanList: [],
      currentInventoryUser: '',
      inventoryError: false,
      makeStocktaking: '',
      inventoryQuantityList: [],
      addedItems: [],
    },
  });
};

export const saveCurrentUserInventory = (id, nav, startPage) => dispatch => {
  dispatch({
    type: SAVE_CURRENT_INVENTORY_USER,
    payload: {
      currentInventoryUser: id,
    },
  });
  dispatch(
    nfc(
      'Inventory',
      'InventoryChooseMode',
      true,
      'InventoryScaner',
      'startPageInventory',
    ),
  );
  nav.navigate(startPage);
};

export const saveInventoryItem = arr => dispatch => {
  dispatch({
    type: SAVE_INVENTORY_SCANS,
    payload: {
      inventoryScanList: arr,
    },
  });
};
export const saveCreatedInventoryItem = obj => dispatch => {
  dispatch({
    type: SAVE_INVENTORY_CREATED_ITEM,
    payload: {
      addedItems: obj,
    },
  });
};

export const makeStocktaking = (
  userId,
  idQtyArray,
  addedItemsArray,
  nav,
) => dispatch => {
  AsyncStorage.getItem('company').then(company => {
    return axios
      .post(`${API_URL}/company/${company}/stocktaking/`, {
        item_ids: idQtyArray,
        target: userId,
        added_items: addedItemsArray,
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

export const resetPassInfo = () => dispatch => {
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
  dispatch(loader(true));
  return axios
    .patch(`${API_URL}/transfer/${id}/edit`, {
      item_ids: items.map(item => ({
        id: item._id,
        quantity: item.batch ? item.batch.quantity : 1,
      })),
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

        AsyncStorage.getItem('userId')
          .then(id => {
            dispatch(getTransfers(nav, id, 0, true, route));
          })
          .then(() => dispatch(loader(false)));
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
      AsyncStorage.getItem('userId').then(id => {
        dispatch(getTransfers(nav, id, 0, true, route));
      });
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
export const getLocations = () => dispatch => {
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

// unMount Item From Parent
export const unMountItemFromParent = (
  parent,
  items,
  code,
  nav,
  page,
) => dispatch => {
  AsyncStorage.getItem('company').then(company => {
    return axios
      .put(`${API_URL}/company/${company}/item/unmount`, {parent, items})
      .then(resp => {
        if (resp.status === 200) {
          dispatch(loader(false));
          dispatch(currentScan(code, nav, page, false));
        }
      })
      .catch(e => {
        if (!e.response.data.success) {
          dispatch(loader(false));
        }
      });
  });
};

export const mountItemFromParent = (
  parent,
  items,
  code,
  nav,
  page,
) => dispatch => {
  AsyncStorage.getItem('company').then(company => {
    return axios
      .put(`${API_URL}/company/${company}/item/mount`, {
        items: [{id: items}],
        parent,
      })
      .then(resp => {
        if (resp.status === 200) {
          dispatch(loader(false));
          dispatch(currentScan(code, nav, page, false, true));
        }
      })
      .catch(e => {
        if (!e.response.data.success) {
          dispatch(loader(false));
        }
      });
  });
};

//company
export const searchMyCompanyItems = (query, offset, limit) => dispatch => {
  AsyncStorage.getItem('company').then(company => {
    return axios
      .get(`${API_URL}/company/${company}/item`, {
        params: {search: query, offset, limit},
      })
      .then(resp => {
        if (resp.status === 200) {
          let data = resp.data.data ? resp.data.data : resp.data;
          dispatch({
            type: SEARCH_MY_COMPANY_ITEMS,
            payload: {
              offSet: offset,
              myloadMore: true,
              myCompanyList: data,
            },
          });
        }
      })
      .catch(e => {
        if (!e.response.data.success) {
          let error = getProperError(e.response.data.message.name);
          dispatch({
            type: SEARCH_MY_COMPANY_ITEMS_ERROR,
            payload: {
              myError: error,
              myloadMore: false,
            },
          });
        }
      });
  });
};
export const getTotalCountMyCompanyItems = () => dispatch => {
  AsyncStorage.getItem('company').then(company => {
    return axios
      .get(`${API_URL}/company/${company}/item`, {
        params: {offset: 0, limit: 1},
      })
      .then(resp => {
        if (resp.status === 200) {
          dispatch({
            type: GET_COUNT_MY_COMPANY_ITEMS,
            payload: {
              myloadMore: true,
              totalItemsCount: resp.data.count,
            },
          });
        }
      })
      .catch(e => {
        if (!e.response.data.success) {
          let error = getProperError(e.response.data.message.name);
          dispatch({
            type: GET_COUNT_MY_COMPANY_ITEMS_ERROR,
            payload: {
              myError: error,
              myloadMore: false,
            },
          });
        }
      });
  });
};
