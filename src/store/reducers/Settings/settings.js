import {
  LOADER,
  LANG,
  HELP,
  FORGOT_PASS_SUCESS,
  FORGOT_PASS_ERROR,
  RESET_PASS_INFO,
  NFC,
  LOCATIONS,
  START_PAGE,
} from '../../../actions/actionsType.js';

const initialState = {
  loader: false,
  lang: '',
  help: '',
  forgot_pass_sucess: '',
  forgot_pass_error: '',
  nfcBack: '',
  nfcNext: '',
  isMultiple: false,
  nameOfType: '',
  swithCamera: '',
  locations: '',
  startPageIdent: 'Ident',
  startPageWriteOff: 'WriteOff',
  startPageService: 'Service',
  startPageBack: 'BackScanner',
  startPageInventory: 'InventoryScaner',
  startPageMarking: 'MarkingScaner',
  startPageGive: 'GiveScaner',
  startPageAccept: 'AcceptScaner',
};

const settingsReducer = (state = initialState, action) => {
  switch (action.type) {
    case START_PAGE:
      return {
        ...state,
        ...action.payload,
      };
    case LOADER:
      return {
        ...state,
        ...action.payload,
      };
    case NFC:
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
    case LOCATIONS:
      return {
        ...state,
        ...action.payload,
      };
    default:
      return state;
  }
};

export default settingsReducer;
