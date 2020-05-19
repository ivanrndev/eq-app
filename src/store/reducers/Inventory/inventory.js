import {
  SAVE_CURRENT_INVENTORY_USER,
  SAVE_INVENTORY_SCANS,
  MAKE_STOCKTAKING,
  MAKE_STOCKTAKING_ERROR,
} from '../../../actions/actionsType.js';

const initialState = {
  inventoryScanList: [],
  currentInventoryUser: '',
  inventoryError: false,
  makeStocktaking: '',
};

const inventoryReducer = (state = initialState, action) => {
  switch (action.type) {
    case SAVE_CURRENT_INVENTORY_USER:
      return {
        ...state,
        ...action.payload,
      };
    case SAVE_INVENTORY_SCANS:
      return {
        ...state,
        ...action.payload,
      };
    case MAKE_STOCKTAKING:
      return {
        ...state,
        ...action.payload,
      };
    case MAKE_STOCKTAKING_ERROR:
      return {
        ...state,
        ...action.payload,
      };
    default:
      return state;
  }
};

export default inventoryReducer;
