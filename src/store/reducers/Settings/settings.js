import {
  LOADER,
  LANG,
  HELP,
  FORGOT_PASS_SUCESS,
  FORGOT_PASS_ERROR,
  RESET_PASS_INFO,
} from '../../../actions/actionsType.js';

const initialState = {
  loader: false,
  lang: '',
  help: '',
  forgot_pass_sucess: '',
  forgot_pass_error: '',
};

const settingsReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOADER:
      return {
        ...state,
        ...action.payload,
      };
    case HELP:
      return {
        ...state,
        ...action.payload,
      };
    case LANG:
      return {
        ...state,
        ...action.payload,
      };
    case FORGOT_PASS_SUCESS:
      return {
        ...state,
        ...action.payload,
      };
    case FORGOT_PASS_ERROR:
      return {
        ...state,
        ...action.payload,
      };
    case RESET_PASS_INFO:
      return {
        ...state,
        ...action.payload,
      };
    default:
      return state;
  }
};

export default settingsReducer;
