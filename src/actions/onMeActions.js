import {SET_MY_CURRENT_INFO} from "./actionsType";


export const setScanedOnMeItem = (item, itemId) => {
    return {type: SET_MY_CURRENT_INFO, item, itemId }
};
