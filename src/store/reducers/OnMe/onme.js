import {
  GET_MY_ITEMS,
  GET_MY_ITEMS_ERROR,
  GET_MY_ITEMS_SEARCH,
  CHANGE_STATUS_MY_LOAD_MORE,
  MY_CURRENT_INFO_ID,
} from '../../../actions/actionsType.js';
import {
  CLEAN_SEARCH_RESULT, GET_SEARCH_ITEMS,
  SEARCH_ITEMS,
  SET_IS_SHOW_FILTER,
  SET_MY_CURRENT_INFO,
  SET_SCANED_MOVE_ITEM
} from "../../../actions/actionsType";

const initialState = {
  myList: [],
  myloadMore: false,
  myError: false,
  myCurrentId: '',
  myCurrentCode: '',
  isMyInfoOpen: false,
  isShowFilter: false,
  scanedItem: [],
  scanedItemId: [],
  totalItemsCount: 0,
  searchResult: [],
  searchCount: 0,
};

const onMeReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_MY_ITEMS:
      return {
        ...state,
        ...action.payload,
      };
    case GET_MY_ITEMS_ERROR:
      return {
        ...state,
        ...action.payload,
      };
    case GET_MY_ITEMS_SEARCH:
      return {
        ...state,
        ...action.payload,
        myList: state.myList.concat(action.payload.myList),
      };
    case CHANGE_STATUS_MY_LOAD_MORE:
      return {
        ...state,
        ...action.payload,
      };
    case SET_MY_CURRENT_INFO:
      return {
        ...state,
        scanedItem: !state.scanedItemId.find(item =>item === action.itemId)
            ? [...state.scanedItem, action.item]
            : [...state.scanedItem],
        scanedItemId: !state.scanedItemId.find(item =>item === action.itemId)
            ? [...state.scanedItemId, action.itemId]
            : [...state.scanedItemId],
      };
    case MY_CURRENT_INFO_ID:
      return {
        ...state,
        ...action.payload,
      };
    case SET_IS_SHOW_FILTER:
      return {
        ...state,
        isShowFilter: action.boolean,
      };


    case SEARCH_ITEMS:
      return {
        ...state,
        ...action.payload,
        myList: action.payload.searchResult,
      };
    case GET_SEARCH_ITEMS:
      return {
        ...state,
        ...action.payload,
        myList: state.myList.concat(action.payload.myList),
      };
    case CLEAN_SEARCH_RESULT:
      return {
        ...state,
        myloadMore: false,
      }

    default:
      return state;
  }
};

export default onMeReducer;
