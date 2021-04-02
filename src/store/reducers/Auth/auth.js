import {
  LOGIN_USER,
  LOGUT,
  LOGIN_USER_ERROR,
  CHANGE_STATUS_ERROR,
  CHANGE_STATUS_LOAD,
  GET_COMPANY_INFO,
  GET_COMPANY_INFO_ERROR,
  LOGIN_WITH_GOOGLE_ACCOUNT,
  LOGIN_WITH_GOOGLE_ACCOUNT_ERROR,
} from '../../../actions/actionsType.js';

const initialState = {
  currentUser: {},
  currentCompany: null,
  isLogin: false,
  isError: false,
  isLoad: false,
  isLogOut: false,
};

const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOGIN_USER:
      return {
        ...state,
        ...action.payload,
      };
    case GET_COMPANY_INFO:
      return {
        ...state,
        ...action.payload,
      };
    case GET_COMPANY_INFO_ERROR:
      return {
        ...state,
        ...action.payload,
      };
    case LOGUT:
      return {
        ...state,
        ...action.payload,
      };
    case LOGIN_USER_ERROR:
      return {
        ...state,
        ...action.payload,
      };
    case CHANGE_STATUS_ERROR:
      return {
        ...state,
        ...action.payload,
      };
    case CHANGE_STATUS_LOAD:
      return {
        ...state,
        ...action.payload,
      };
    case LOGIN_WITH_GOOGLE_ACCOUNT:
      return {
        ...state,
        ...action.payload,
      };
    case LOGIN_WITH_GOOGLE_ACCOUNT_ERROR:
      return {
        ...state,
        ...action.payload,
      };
    default:
      return state;
  }
};

export default authReducer;
