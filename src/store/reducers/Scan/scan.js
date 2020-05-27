import {
  SAVE_CURRENT_SCAN,
  ALLOW_NEW_SCAN,
  SAVE_CURRENT_SCAN_INFO,
  ERROR_CURRENT_SCAN_INFO,
  DIALOG_INPUT,
  CHANGE_ALL_IS_OPEN,
  SAVE_CURRENT_SCAN_INFO_LIST,
  CLEAR_SCAN_GIVE_LIST,
  UPDATE_SCAN_GIVE_LIST,
} from '../../../actions/actionsType.js';

const initialState = {
  currentScan: '',
  scanInfo: {},
  selectGiveId: '',
  scanUserRole: '',
  scanGiveList: [],
  isNewScan: true,
  scanInfoError: false,
  dialogInput: false,
  isInfoOpen: false,
  scanLoader: false,
};

const scanReducer = (state = initialState, action) => {
  switch (action.type) {
    case SAVE_CURRENT_SCAN:
      return {
        ...state,
        ...action.payload,
      };
    case ALLOW_NEW_SCAN:
      return {
        ...state,
        ...action.payload,
      };
    case SAVE_CURRENT_SCAN_INFO:
      return {
        ...state,
        ...action.payload,
      };
    case CLEAR_SCAN_GIVE_LIST:
      return {
        ...state,
        ...action.payload,
      };
    case UPDATE_SCAN_GIVE_LIST:
      return {
        ...state,
        ...action.payload,
      };
    case SAVE_CURRENT_SCAN_INFO_LIST:
      return {
        ...state,
        ...action.payload,
        scanGiveList: state.scanGiveList.concat(action.payload.scanGiveList),
      };
    case ERROR_CURRENT_SCAN_INFO:
      return {
        ...state,
        ...action.payload,
      };
    case DIALOG_INPUT:
      return {
        ...state,
        ...action.payload,
      };
    case CHANGE_ALL_IS_OPEN:
      return {
        ...state,
        ...action.payload,
      };
    default:
      return state;
  }
};

export default scanReducer;