import {
  CHANGE_STATUS_ERROR,
  CHANGE_STATUS_LOAD,
  GET_COMPANY_INFO,
  GET_COMPANY_INFO_ERROR,
  LOGIN_USER,
  LOGIN_USER_ERROR,
  LOGIN_WITH_GOOGLE_ACCOUNT,
  LOGUT,
} from '../../../actions/actionsType.js';
import {USER_ROLE} from "../../../actions/actionsType";

const initialState = {
  currentUser: {},
  currentCompany: null,
  isLogin: false,
  isError: false,
  isLoad: false,
  isLogOut: false,
  role: '',
};
const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOGIN_USER:
      return {
        ...state,
        ...action.payload,
      };
    case USER_ROLE:
      return {
        ...state,
        role: action.role,
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
    default:
      return state;
  }
};

export default authReducer;
