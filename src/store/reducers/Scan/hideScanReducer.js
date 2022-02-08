import {HIDE_SCAN, SHOW_SCAN} from './../../../actions/actionsType';

const initialState = {
  isHide: false,
};

const hideScanReducer = (state = initialState, action) => {
  switch (action.type) {
    case HIDE_SCAN:
      return {
        isHide: true,
      };

    case SHOW_SCAN:
      return {
        isHide: false,
      };
    default:
      return state;
  }
};

export default hideScanReducer;
