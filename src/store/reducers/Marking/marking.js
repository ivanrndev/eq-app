import {
  MARKING,
  CLEAR_MARKING,
  MARKING_ERROR,
  MARKING_CURRENT_ID,
  MARKING_ERROR_DONE,
  MARKING_SEARCH,
  CHANGE_STATUS_LOAD_MORE,
  MAKE_MARKING_ERROR_DEFAULT,
  MARKING_MORE_SEARCH,
} from '../../../actions/actionsType.js';

const initialState = {
  marking: true,
  markingList: [],
  markingSuccess: false,
  markingErrorDone: '',
  markingError: false,
  currentItemMark: '',
  loadMore: false,
  showButtonLoad: true,
  totalItemsCount:0,
};

const markingReducer = (state = initialState, action) => {
  switch (action.type) {
    case MARKING:
      return {
        ...state,
        ...action.payload,
      };
    case CLEAR_MARKING:
      return {
        ...state,
        ...action.payload,
      };
    case MARKING_SEARCH:
      return {
        ...state,
        ...action.payload,
        markingList: action.payload.markingList,
      };
    case MARKING_MORE_SEARCH:
      return {
        ...state,
        ...action.payload,
        markingList: state.markingList.concat(action.payload.markingList),
      };
    case MARKING_ERROR:
      return {
        ...state,
        ...action.payload,
      };
    case MAKE_MARKING_ERROR_DEFAULT:
      return {
        ...state,
        ...action.payload,
      };
    case MARKING_CURRENT_ID:
      return {
        ...state,
        ...action.payload,
      };
    case MARKING_ERROR_DONE:
      return {
        ...state,
        ...action.payload,
      };
    case CHANGE_STATUS_LOAD_MORE:
      return {
        ...state,
        ...action.payload,
      };
    default:
      return state;
  }
};

export default markingReducer;
