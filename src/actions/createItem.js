import {SAVE_BASE_ITEM_INFO} from './actionsType';

export const saveBaseItemInfo = values => dispatch =>
  dispatch({
    type: SAVE_BASE_ITEM_INFO,
    payload: {baseInfo: values},
  });
