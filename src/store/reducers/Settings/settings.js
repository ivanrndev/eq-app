import {LOADER} from '../../../actions/actionsType.js';

const initialState = {
  loader: false,
};

const settingsReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOADER:
      return {
        ...state,
        ...action.payload,
      };
    default:
      return state;
  }
};

export default settingsReducer;
