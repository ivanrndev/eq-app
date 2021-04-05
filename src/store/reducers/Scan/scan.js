import {
  SAVE_CURRENT_SCAN,
  ALLOW_NEW_SCAN,
  SAVE_CURRENT_SCAN_INFO,
  ERROR_CURRENT_SCAN_INFO,
  DIALOG_INPUT,
  CHANGE_ALL_IS_OPEN,
  SAVE_GIVE_ITEM_INFO_LIST,
  CLEAR_SCAN_GIVE_LIST,
  UPDATE_SCAN_GIVE_LIST,
  MOUNT_SCAN,
  ERROR_CURRENT_MOUNT_SCAN_INFO,
  SAVE_CURRENT_MOUNT_SCAN_INFO_LIST,
  SAVE_CURRENT_SEARCH,
  SAVE_CURRENT_SEARCH_ERROR,
  SET_CURRENT_MOUNT_PARENT,
  ADD_ITEM_TO_MOUNT_LIST,
  DELETE_ITEM_FROM_MOUNT_LIST,
  SET_ITEM_QTY_FOR_MOUNT,
  MOUNT_ITEMS,
  MOUNT_ITEMS_ERROR,
  CLEAN_MOUNT_ITEMS_LIST,
} from '../../../actions/actionsType.js';
import T from '../../../i18n';

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
  mountScan: {},
  mountScanInfo: '',
  currentParent: '',
  mountList: [],
  mountListWithQty: [],
  mountError: false,
};

const scanReducer = (state = initialState, action) => {
  switch (action.type) {
    case SAVE_CURRENT_MOUNT_SCAN_INFO_LIST:
      return {
        ...state,
        ...action.payload,
      };
    case ERROR_CURRENT_MOUNT_SCAN_INFO:
      return {
        ...state,
        ...action.payload,
      };
    case SAVE_CURRENT_SCAN:
      return {
        ...state,
        ...action.payload,
      };
    case MOUNT_SCAN:
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
    case SAVE_GIVE_ITEM_INFO_LIST:
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
    case SAVE_CURRENT_SEARCH:
      return {
        ...state,
        ...action.payload,
      };
    case SAVE_CURRENT_SEARCH_ERROR:
      return {
        ...state,
        ...action.payload,
      };
    case SET_CURRENT_MOUNT_PARENT:
      return {
        ...state,
        currentParent: action.payload,
      };
    case ADD_ITEM_TO_MOUNT_LIST:
      const isItemAdded = [...state.mountList].find(
        item => item._id === action.payload._id,
      );
      if (isItemAdded) {
        return {
          ...state,
          mountError: `${T.t('error_has_already_mounted')}`,
        };
      } else if (!!action.payload.parent) {
        return {
          ...state,
          mountError: `${T.t('error_already_mounted')}`,
        };
      } else if (action.payload.items.length > 0) {
        return {
          ...state,
          mountError: `${T.t('error_has_mounted_items')}`,
        };
      } else if (action.payload._id === state.currentParent) {
        return {
          ...state,
          mountError: 'Impossible mount item on itself',
        };
      } else {
        return {
          ...state,
          mountList: [...state.mountList, action.payload],
          mountError: false,
        };
      }
    case DELETE_ITEM_FROM_MOUNT_LIST:
      const filteredList = [...state.mountList].filter(
        item => item._id !== action.payload,
      );
      const filteredQtyList = [...state.mountListWithQty].filter(
        item => item._id !== action.payload,
      );
      return {
        ...state,
        mountList: filteredList,
        mountListWithQty: filteredQtyList,
      };
    case SET_ITEM_QTY_FOR_MOUNT:
      const existedItem = [...state.mountListWithQty].filter(
        item => item.id !== action.payload.id,
      );
      const newMountList = [
        ...existedItem,
        {
          id: action.payload.id,
          quantity: action.payload.quantity,
        },
      ];
      return {
        ...state,
        mountListWithQty: newMountList,
      };

    case MOUNT_ITEMS:
      return {
        ...state,
      };
    case MOUNT_ITEMS_ERROR:
      return {
        ...state,
        mountError: action.payload,
      };
    case CLEAN_MOUNT_ITEMS_LIST: {
      return initialState;
    }
    default:
      return state;
  }
};

export default scanReducer;
