import {HIDE_SCAN, SHOW_SCAN} from './actionsType';

export const hideScanAction = () => dispatch => {
  dispatch({
    type: HIDE_SCAN,
  });
};

export const showScanAction = () => dispatch => {
  dispatch({
    type: SHOW_SCAN,
  });
};
