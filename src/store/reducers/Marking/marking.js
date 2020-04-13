import {
  MARKING,
  MARKING_ERROR,
  MARKING_CURRENT_ID,
  MARKING_ERROR_DONE,
  MARKING_SEARCH,
  CHANGE_STATUS_LOAD_MORE,
  MAKE_MARKING_ERROR_DEFAULT,
} from '../../../actions/actionsType.js';

const initialState = {
  marking: true,
  markingList: [],
  markingSuccess: false,
  markingErrorDone: '',
  markingError: false,
  currentItemMark: '',
  offSet: 0,
  loadMore: false,
  showButtonLoad: true,
};

const markingReducer = (state = initialState, action) => {
  switch (action.type) {
    case MARKING:
      return {
        ...state,
        ...action.payload,
      };
    case MARKING_SEARCH:
      return {
        ...state,
        ...action.payload,
        markingList: state.markingList.concat(action.payload.markingList),
        offSet: state.offSet + action.payload.offSet,
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
