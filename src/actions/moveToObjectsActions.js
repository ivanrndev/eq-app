import {
    CHANGE_QUANTITY,
    CHOOSED_MOVE_USER,
    CLEAN_MOVE_TO_OBJECT, DELETE_MOVE_ITEM, IS_ROLE_ALLOW,
    MOVE_TO_OBJECT_ERROR,
    SAVE_MOVE_LOCATIONS, SET_IS_ADD_MOVE,
    SET_IS_MOVE_SCANER,
    SET_SCANED_MOVE_ITEM
} from "./actionsType";
import {loader} from "./actions";
import axios from "../utils/axios";
import {API_URL} from "../constants/auth";

export const setIsMoveScan = (boolean) => {
  return {type: SET_IS_MOVE_SCANER, boolean }
};
export const setScanedMoveItem = (item, itemId) => {
  return {type: SET_SCANED_MOVE_ITEM, item, itemId}
};

export const openMoveScan = (nav, page)=> dispatch => {
  dispatch(loader(true));

  nav.navigate(page);
  dispatch(loader(false));
};
export const setIsAddMove = (boolean) => {
    return {type: SET_IS_ADD_MOVE, boolean }
};
export const saveMoveLocation = location => dispatch => {
    dispatch({
        type: SAVE_MOVE_LOCATIONS,
        payload: {location},
    });
};
export const setIsRoleAllow = (payload) => {
    return {
        type: IS_ROLE_ALLOW,
        payload,
    };
}
export const setIsRoleAllowThunk = () => async (dispatch) => {
    dispatch(setIsRoleAllow(false));
    await new Promise(res => setTimeout(res, 2000));
    dispatch(setIsRoleAllow(true));
}
export const cleanMoveToObject = () => dispatch =>
    dispatch({
        type: CLEAN_MOVE_TO_OBJECT,
    });
export const deleteMoveItem = (id) => dispatch =>
    dispatch({
        type: DELETE_MOVE_ITEM,
        id
    });
export const setChoosedUser = payload => dispatch =>
    dispatch({
        type: CHOOSED_MOVE_USER,
        payload
    });

export const changeLocationWithoutUser = (data, companyId, navigation) => dispatch => {
    return axios
        .put(`${API_URL}/company/${companyId}/item/locations/add`, data)
        .then(resp => {
            if (resp.status === 200) {
                navigation.navigate('MoveSuccess');
                dispatch(cleanMoveToObject());
            }
        })
        .catch(e => {
            if (e.message) {
                dispatch({
                    type: MOVE_TO_OBJECT_ERROR,
                    message: e.message,
                });
            }
        });
};

export const changeLocation = (data, companyId, navigation) => dispatch => {
    return axios
        .put(`${API_URL}/company/${companyId}/item/move`, data)
        .then(resp => {
            if (resp.status === 200) {
                navigation.navigate('MoveSuccess');
                dispatch(cleanMoveToObject());
            }
        })
        .catch(e => {
            if (e.message) {
                dispatch({
                    type: MOVE_TO_OBJECT_ERROR,
                    message: e.message,
                });
                navigation.navigate('MoveSuccess');
            }
        });
};

export const changeQuantity = (payload) => {
  return {
    type: CHANGE_QUANTITY,
    payload,
  };
}
