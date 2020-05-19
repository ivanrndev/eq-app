import {
  TRANSFERS_LIST,
  TRANSFERS_ERROR,
  LOAD_MORE_TRANSFERS,
  CLEAR_TRANSFERS_LIST,
  TRANSFERS_ID,
} from '../../../actions/actionsType.js';

const initialState = {
  transferList: [],
  transferId: '',
  transferError: false,
  loadMoreTransfers: false,
  offSet: 0,
};

const transfersReducer = (state = initialState, action) => {
  switch (action.type) {
    case TRANSFERS_LIST:
      return {
        ...state,
        ...action.payload,
        offSet: state.offSet + action.payload.offSet,
        transferList: state.transferList.concat(action.payload.transferList),
      };
    case CLEAR_TRANSFERS_LIST:
      return {
        ...state,
        ...action.payload,
      };
    case TRANSFERS_ERROR:
      return {
        ...state,
        ...action.payload,
      };
    case LOAD_MORE_TRANSFERS:
      return {
        ...state,
        ...action.payload,
      };
    case TRANSFERS_ID:
      return {
        ...state,
        ...action.payload,
      };
    default:
      return state;
  }
};

export default transfersReducer;
