import {
  CHANGE_QUANTITY,
  CHOOSED_MOVE_USER,
  CLEAN_MOVE_TO_OBJECT,
  DELETE_MOVE_ITEM,
  IS_ROLE_ALLOW,
  MOVE_TO_OBJECT_ERROR,
  SAVE_MOVE_LOCATIONS,
  SET_IS_ADD_MOVE,
  SET_IS_MOVE_SCANER,
  SET_SCANED_MOVE_ITEM,
} from '../../../actions/actionsType';

const initialState = {
  isMoveToObject: false,
  location: {
    objects: '',
    location: '',
  },
  errorMessage: '',
  isAllowed: true,
  scanedItem: [],
  scanedItemId: [],
  choosedUser: {
    id: null,
    firstName: null,
  },
  scanedItemToMove: [],
  isAdd: false,
};

const moveToObjectReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_IS_MOVE_SCANER:
      return {
        ...state,
        isMoveToObject: action.boolean,
      };
    case SET_SCANED_MOVE_ITEM:
      return {
        ...state,
        scanedItem: !state.scanedItemId.find(item => item === action.itemId)
          ? [...state.scanedItem, action.item]
          : [...state.scanedItem],
        scanedItemId: !state.scanedItemId.find(item => item === action.itemId)
          ? [...state.scanedItemId, action.itemId]
          : [...state.scanedItemId],
      };
    case SAVE_MOVE_LOCATIONS:
      return {
        ...state,
        ...action.payload,
      };
    case CLEAN_MOVE_TO_OBJECT:
      return {
        ...state,
        ...initialState,
      };
    case MOVE_TO_OBJECT_ERROR:
      return {
        ...state,
        errorMessage: action.message,
      };
    case IS_ROLE_ALLOW:
      return {
        ...state,
        isAllowed: action.payload,
      };
    case SET_IS_ADD_MOVE:
      return {
        ...state,
        isAdd: action.boolean,
      };
    case CHOOSED_MOVE_USER:
      return {
        ...state,
        choosedUser: action.payload,
      };
    case DELETE_MOVE_ITEM:
      return {
        ...state,
        scanedItem: state.scanedItem.filter(item => item._id !== action.id),
        scanedItemId: state.scanedItem.filter(item => item._id !== action.id),
        scanedItemToMove: state.scanedItemToMove.filter(item => item.id !== action.id),
      };

    case CHANGE_QUANTITY:
      const newGiveList = {
        id: action.payload.id,
        quantity: action.payload.number,
        companyId: action.payload.companyId,
        userId: action.payload.userId,
        object: action.payload.object,
        location: action.payload.location,
      };
      return {
        ...state,
        scanedItemToMove: state.scanedItemToMove.find(item => item.id === action.payload.id)
          ? [
              ...state.scanedItemToMove.map(item =>
                item.id === action.payload.id ? {...item, quantity: action.payload.number} : item,
              ),
            ]
          : [...state.scanedItemToMove, newGiveList],
      };

    default:
      return state;
  }
};

export default moveToObjectReducer;
