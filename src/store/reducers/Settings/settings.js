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
  BACK_PAGE_MOUNT,
  NFC_FOR_MOUNTING,
  NEXT_PAGE_MOUNT,
  MOUNT_CAMERA_LIST,
  CHANGE_IS_MULTYPLE,
  LOCATION_MAIN,
  LOCATTION_LOC,
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
  locationMain: '',
  locationLoc: '',
  startPageIdent: 'Ident',
  startPageWriteOff: 'WriteOff',
  startPageService: 'Service',
  startPageBack: 'BackScanner',
  startPageInventory: 'InventoryScaner',
  startPageMarking: 'MarkingScaner',
  startPageGive: 'GiveScaner',
  startPageAccept: 'AcceptScaner',
  startPageMountList: 'MountList',
  backPageMount: '',
  nextPageMount: '',
  NFCforMounting: false,
  mountCameraList: [''],
};

const settingsReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOCATION_MAIN:
      return {
        ...state,
        ...action.payload,
      };
    case LOCATTION_LOC:
      return {
        ...state,
        ...action.payload,
      };
    case CHANGE_IS_MULTYPLE:
      return {
        ...state,
        ...action.payload,
      };
    case MOUNT_CAMERA_LIST:
      return {
        ...state,
        ...action.payload,
      };
    case NEXT_PAGE_MOUNT:
      return {
        ...state,
        ...action.payload,
      };
    case NFC_FOR_MOUNTING:
      return {
        ...state,
        ...action.payload,
      };
    case START_PAGE:
      return {
        ...state,
        ...action.payload,
      };
    case BACK_PAGE_MOUNT:
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
