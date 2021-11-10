import {
} from '../../../actions/actionsType';

const initialState = {
    responsibleUser: null,
    selectedLoc: null,
    selectedObj: null,
    type: null,
    status: null,
};

const createItemReducer = (state = initialState, action) => {
    switch (action.type) {
        // case SAVE_BASE_ITEM_INFO:
        //     return {
        //         ...state,
        //         ...action.payload,
        //     };
        default:
            return state;
    }
};

export default createItemReducer;
