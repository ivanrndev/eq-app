import {
  TRANSACTIONS_LIST,
  TRANSACTIONS_ERROR,
  LOAD_MORE_TRANSACTIONS,
  CLEAR_TRANSACTIONS_LIST,
} from '../../../actions/actionsType.js';

const initialState = {
  transactionList: [],
  transactionItemId: '',
  transactionError: false,
  loadMoreTransaction: false,
  offSet: 0,
};

const transactionsReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOAD_MORE_TRANSACTIONS:
      return {
        ...state,
        ...action.payload,
      };
    case CLEAR_TRANSACTIONS_LIST:
      return {
        ...state,
        ...action.payload,
      };
    case TRANSACTIONS_LIST:
      return {
        ...state,
        ...action.payload,
        offSet: state.offSet + action.payload.offSet,
        transactionList: state.transactionList.concat(
          action.payload.transactionList,
        ),
      };
    case TRANSACTIONS_ERROR:
      return {
        ...state,
        ...action.payload,
      };
    default:
      return state;
  }
};

export default transactionsReducer;
