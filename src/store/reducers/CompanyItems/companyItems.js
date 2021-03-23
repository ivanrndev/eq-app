import {
  GET_MY_COMPANY_ITEMS,
  GET_MY_COMPANY_ITEMS_ERROR,
} from '../../../actions/actionsType';

const initialState = {
  myCompanyList: [],
  offSet: 0,
  myloadMore: true,
  myError: '',
};

const companyItemsReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_MY_COMPANY_ITEMS:
      return {
        ...state,
        ...action.payload,
      };
    case GET_MY_COMPANY_ITEMS_ERROR:
      return {
        ...state,
        ...action.payload,
      };
    default:
      return state;
  }
};

export default companyItemsReducer;
