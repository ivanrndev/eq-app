import {
  GET_COUNT_MY_COMPANY_ITEMS,
  GET_COUNT_MY_COMPANY_ITEMS_ERROR,
  MORE_MY_COMPANYITEMS,
  SEARCH_MY_COMPANY_ITEMS,
  SEARCH_MY_COMPANY_ITEMS_ERROR,
} from '../../../actions/actionsType';
import {uniqBy} from 'lodash';

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
    case MORE_MY_COMPANYITEMS:
      let updateScan = uniqBy([...state.myCompanyList, ...action.payload.myCompanyList], '_id');
      return {
        ...state,
        myCompanyList: updateScan,
        myloadMore: action.payload.myloadMore,
        totalItemsCount: action.payload.totalItemsCount,
      }
    default:
      return state;
  }
};

export default companyItemsReducer;
