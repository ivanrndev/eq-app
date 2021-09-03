import {
  SAVE_ACCOUNT_AND_VALUE,
  SAVE_ADDITIONAL_INFO,
  SAVE_BASE_ITEM_INFO,
  SAVE_ITEM_LOCATIONS,
  SAVE_PHOTO,
  SAVE_RESPONSIBLE,
  CLEAN_CREATE_ITEM,
} from '../../../actions/actionsType';

const initialState = {
  baseInfo: {type: '', title: '', brand: '', model: '', serial: ''},
  accountType: {
    batch: {
      quantity: 1,
      units: 'PC',
    },
    pricePerPiece: '1',
  },
  photos: [],
  location: {
    location: '',
    object: '',
  },
  responsible: {
    role: '',
    firstName: '',
    email: '',
    id: '',
  },
  additionalInfo: [],
  createItemError: '',
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
    case CLEAN_CREATE_ITEM:
      return {
        ...initialState,
      };

    default:
      return state;
  }
};

export default createItemReducer;
