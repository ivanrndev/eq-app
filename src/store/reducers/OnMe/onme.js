import {
  GET_MY_ITEMS,
  GET_MY_ITEMS_ERROR,
  GET_MY_ITEMS_SEARCH,
  CHANGE_STATUS_MY_LOAD_MORE,
  MY_CURRENT_INFO_ID,
} from '../../../actions/actionsType.js';

const initialState = {
  myList: [],
  myloadMore: false,
  offSet: 0,
  myError: false,
  myCurrentId: '',
  myCurrentCode: '',
  isMyInfoOpen: false,
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
        offSet: state.offSet + action.payload.offSet,
      };
    case CHANGE_STATUS_MY_LOAD_MORE:
      return {
        ...state,
        ...action.payload,
      };
    case MY_CURRENT_INFO_ID:
      return {
        ...state,
        ...action.payload,
      };
    default:
      return state;
  }
};

export default onMeReducer;
