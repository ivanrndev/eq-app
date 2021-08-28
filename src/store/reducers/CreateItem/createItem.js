import {
  SAVE_ACCOUNT_AND_VALUE,
  SAVE_ADDITIONAL_INFO,
  SAVE_AMOUNT_OF_INSTANCES,
  SAVE_BASE_ITEM_INFO,
  SAVE_ITEM_LOCATIONS,
  SAVE_PHOTO,
  SAVE_RESPONSIBLE,
} from '../../../actions/actionsType';

const initialState = {
  baseInfo: {type: '', title: '', brand: '', model: '', serial: ''},
  accountType: {
    batch: {
      qty: '',
      units: '',
    },
    pricePerPiece: '',
  },
  photos: [],
  location: {
    location: '',
    object: '',
  },
  responsible: '',
  additionalInfo: [],
  amountOfInstances: '',
};

const createItemReducer = (state = initialState, action) => {
  switch (action.type) {
    case SAVE_BASE_ITEM_INFO:
      return {
        ...state,
        ...action.payload,
      };
    case SAVE_ACCOUNT_AND_VALUE:
      return {
        ...state,
        ...action.payload,
      };
    case SAVE_PHOTO:
      return {
        ...state,
        photos: [...state.photos, ...action.payload.photos],
      };
    case SAVE_RESPONSIBLE:
      return {
        ...state,
        ...action.payload,
      };
    case SAVE_ITEM_LOCATIONS:
      return {
        ...state,
        ...action.payload,
      };
    case SAVE_ADDITIONAL_INFO:
      return {
        ...state,
        ...action.payload,
      };
    case SAVE_AMOUNT_OF_INSTANCES:
      return {
        ...state,
        ...action.payload,
      };
    default:
      return state;
  }
};

export default createItemReducer;
