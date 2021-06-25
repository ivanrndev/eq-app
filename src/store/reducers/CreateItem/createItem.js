import {SAVE_BASE_ITEM_INFO} from '../../../actions/actionsType';

const initialState = {
  baseInfo: {type: '', title: '', brand: '', model: '', serial: ''},
  accountType: {
    batch: {
      qty: '',
      units: '',
    },
    pricePerPiece: '',
    priceTotal: '',
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
    default:
      return state;
  }
};

export default createItemReducer;
