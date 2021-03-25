import {
  GET_COUNT_MY_COMPANY_ITEMS,
  GET_COUNT_MY_COMPANY_ITEMS_ERROR,
  SEARCH_MY_COMPANY_ITEMS,
  SEARCH_MY_COMPANY_ITEMS_ERROR,
} from '../../../actions/actionsType';

const initialState = {
  myCompanyList: [],
  offSet: 0,
  myloadMore: true,
  myError: '',
  totalItemsCount: '',
};

const companyItemsReducer = (state = initialState, action) => {
  switch (action.type) {
    case SEARCH_MY_COMPANY_ITEMS:
      return {
        ...state,
        ...action.payload,
      };
    case SEARCH_MY_COMPANY_ITEMS_ERROR:
      return {
        ...state,
        ...action.payload,
      };
    case GET_COUNT_MY_COMPANY_ITEMS:
      return {
        ...state,
        ...action.payload,
      };
    case GET_COUNT_MY_COMPANY_ITEMS_ERROR:
      return {
        ...state,
        ...action.payload,
      };
    default:
      return state;
  }
};

export default companyItemsReducer;
