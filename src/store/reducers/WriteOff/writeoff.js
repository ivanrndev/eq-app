import {
  SUCCES_WRITE_OFF,
  ERROR_WRITE_OFF,
} from '../../../actions/actionsType.js';

const initialState = {
  inWriteOff: false,
  inWriteOffError: false,
};

const writeoffReducer = (state = initialState, action) => {
  switch (action.type) {
    case SUCCES_WRITE_OFF:
      return {
        ...state,
        ...action.payload,
      };
    case ERROR_WRITE_OFF:
      return {
        ...state,
        ...action.payload,
      };
    default:
      return state;
  }
};

export default writeoffReducer;
