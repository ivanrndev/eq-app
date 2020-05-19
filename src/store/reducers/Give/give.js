import {
  GET_USERS,
  GET_USERS_ERROR,
  USER_CURRENT_ID,
  SUCCES_TRANSFER,
  TRANSFER,
  CLEAR_USER_LIST,
} from '../../../actions/actionsType.js';

const initialState = {
  userList: [],
  getUsetError: false,
  userCurrentId: '',
  userRole: '',
  statusTransfer: '',
  transferError: '',
};

const giveReducer = (state = initialState, action) => {
  switch (action.type) {
    case CLEAR_USER_LIST:
      return {
        ...state,
        ...action.payload,
      };
    case GET_USERS:
      return {
        ...state,
        ...action.payload,
      };
    case GET_USERS_ERROR:
      return {
        ...state,
        ...action.payload,
      };
    case USER_CURRENT_ID:
      return {
        ...state,
        ...action.payload,
      };
    case SUCCES_TRANSFER:
      return {
        ...state,
        ...action.payload,
      };
    case TRANSFER:
      return {
        ...state,
        ...action.payload,
      };
    default:
      return state;
  }
};

export default giveReducer;
