import {
  SAVE_CURRENT_INVENTORY_USER,
  SAVE_INVENTORY_SCANS,
  MAKE_STOCKTAKING,
  MAKE_STOCKTAKING_ERROR,
  SET_INVENTORY_ITEM_QTY,
  CLEAR_INVENTORY,
  SAVE_INVENTORY_CREATED_ITEM,
} from '../../../actions/actionsType.js';

const initialState = {
  inventoryScanList: [],
  currentInventoryUser: '',
  inventoryError: false,
  makeStocktaking: '',
  inventoryQuantityList: [],
  addedItems: [],
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

    case SET_INVENTORY_ITEM_QTY:
      const existedItem = [...state.inventoryQuantityList].filter(
        item => item.id !== action.payload.id,
      );
      const newList = [
        ...existedItem,
        {
          id: action.payload.id,
          quantity: action.payload.quantity,
        },
      ];
      return {
        ...state,
        inventoryQuantityList: newList,
      };
    case CLEAR_INVENTORY: {
      return {
        ...state,
        ...action.payload,
      };
    }
    case SAVE_INVENTORY_CREATED_ITEM:
      return {
        ...state,
        addedItems: [...state.addedItems, action.payload.addedItems],
      };
    default:
      return state;
  }
};

export default inventoryReducer;
