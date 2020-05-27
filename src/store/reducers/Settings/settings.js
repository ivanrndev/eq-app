import {LOADER, LANG} from '../../../actions/actionsType.js';

const initialState = {
  loader: false,
  lang: '',
};

const settingsReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOADER:
      return {
        ...state,
        ...action.payload,
      };
    case LANG:
      return {
        ...state,
        ...action.payload,
      };
    default:
      return state;
  }
};

export default settingsReducer;
