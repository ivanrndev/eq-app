import {
  SUCCES_IN_SERVICES,
  ERROR_SEND_SERVICES,
  PUT_ERROR_SEND_SERVICES,
} from '../../../actions/actionsType.js';

const initialState = {
  inServices: false,
  inServicesError: false,
};

const servicesReducer = (state = initialState, action) => {
  switch (action.type) {
    case SUCCES_IN_SERVICES:
      return {
        ...state,
        ...action.payload,
      };
    case ERROR_SEND_SERVICES:
      return {
        ...state,
        ...action.payload,
      };
    case PUT_ERROR_SEND_SERVICES:
      return {
        ...state,
        ...action.payload,
      };
    default:
      return state;
  }
};

export default servicesReducer;
