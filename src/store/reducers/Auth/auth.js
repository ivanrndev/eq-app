import {
  LOGIN_USER,
  LOGIN_USER_ERROR,
  CHANGE_STATUS_ERROR,
  CHANGE_STATUS_LOAD,
} from '../../../actions/actionsType.js';

const initialState = {
  currentUser: {},
  isLogin: false,
  isError: false,
  isLoad: false,
};

const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOGIN_USER:
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
    default:
      return state;
  }
};

export default authReducer;
