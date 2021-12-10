import {
  SAVE_CURRENT_INVENTORY_USER,
  SAVE_INVENTORY_SCANS,
  MAKE_STOCKTAKING,
  MAKE_STOCKTAKING_ERROR,
  SET_INVENTORY_ITEM_QTY,
  CLEAR_INVENTORY,
  SAVE_INVENTORY_CREATED_ITEM,
} from '../../../actions/actionsType.js';
import {
  ADD_ITEMS_FROM_SAVED_INVENTORY,
  SAVE_ID_INVENTORY,
  SAVE_KIT_TMC,
  SAVE_UUID,
} from '../../../actions/actionsType';

const initialState = {
  inventoryScanList: [],
  currentInventoryUser: '',
  inventoryError: false,
  makeStocktaking: '',
  inventoryQuantityList: [],
  addedItems: [],
  inventoryId: '',
  itemsUuid: [],
  itemsKit: [],
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
    case SAVE_ID_INVENTORY:
      return {
        ...state,
        ...action.payload,
      };
    case MAKE_STOCKTAKING:
      return {
        ...state,
        ...action.payload,
      };
    case ADD_ITEMS_FROM_SAVED_INVENTORY:
      const newItems = action.payload.inventoryScanList.map(item => {
        const tmc = {
          metadata: {
            type: item.item.type,
            title: item.item.title,
            brand: item.item.brand,
            model: item.item.model,
            serial: item.item.serial,
          },
          batch: {
            quantity: item.amountReal,
            units: item.item.units,
          },
          person: {
            role: item.person.role,
            firstName: item.person.firstName,
          },
          uuid: item.uuid,
        };
        return tmc;
      });
      return {
        ...state,
        inventoryScanList: newItems,
      };
    case MAKE_STOCKTAKING_ERROR:
      return {
        ...state,
        ...action.payload,
      };
    case SAVE_UUID:
      const newUuidItem = action.payload.map(i => ({
        id: i.item._id,
        uuid: i.uuid,
      }));
      const filterItemUid = state.itemsUuid.filter(i => i.id !== newUuidItem[0].id);

      const newNew = [...filterItemUid, ...newUuidItem];
      return {
        ...state,
        itemsUuid: newNew,
        // itemsUuid: newItem,
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
    case SAVE_KIT_TMC: {
      const itemFromKit = action.payload.itemsKit.filter(
        item => item._id !== state.inventoryScanList._id,
      );
      const updateScan = [...state.inventoryScanList, ...itemFromKit];
      return {
        ...state,
        itemsKit: action.payload.itemsKit,
        inventoryScanList: updateScan,
      };
    }
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
