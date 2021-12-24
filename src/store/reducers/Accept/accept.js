import {
  GET_BID_LIST,
  GET_BID_LIST_ERROR,
  LOAD_MORE_STATUS,
  CLEAR_BID_LIST,
  SAVE_USER_ACCEPT_BID,
  ALREADY_SCANNED_BIDS,
  MAKE_ACCEPT,
  MAKE_ACCEPT_ERROR,
} from '../../../actions/actionsType.js';

const initialState = {
  acceptList: [],
  acceptListId: [],
  acceptloadMore: false,
  offSet: 0,
  acceptError: false,
  userAcceptId: '',
  showButtons: true,
  userAcceptBid: '',
  alreadyScannedBids: [],
};

const acceptReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_BID_LIST_ERROR:
      return {
        ...state,
        ...action.payload,
      };
    case GET_BID_LIST:
      return {
        ...state,
        ...action.payload,
        // acceptList: state.acceptList.concat(action.payload.acceptList),
        acceptList: !state.acceptListId.find(item => item === action.payload.userAcceptId)
          ? [...state.acceptList, action.payload.acceptList].flat()
          : [...state.acceptList],
        acceptListId: !state.acceptListId.find(item => item === action.payload.userAcceptId)
          ? [...state.acceptListId, action.payload.userAcceptId]
          : [...state.acceptListId],
        offSet: state.offSet + action.payload.offSet,
      };
    case LOAD_MORE_STATUS:
      return {
        ...state,
        ...action.payload,
      };
    case CLEAR_BID_LIST:
      return {
        ...state,
        ...action.payload,
      };
    case SAVE_USER_ACCEPT_BID:
      return {
        ...state,
        ...action.payload,
      };
    case ALREADY_SCANNED_BIDS:
      return {
        ...state,
        ...action.payload,
      };
    case MAKE_ACCEPT:
      return {
        ...state,
        ...action.payload,
      };
    case MAKE_ACCEPT_ERROR:
      return {
        ...state,
        ...action.payload,
      };
    default:
      return state;
  }
};

export default acceptReducer;
