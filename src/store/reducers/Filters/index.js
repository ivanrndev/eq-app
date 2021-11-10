import {
    SET_FILTERS
} from '../../../actions/actionsType';

const initialState = {
    responsibleUser: {title: ''},
    selectedLoc: '',
    selectedObj: '',
    type: '',
    status: '',
    query: ''
};

const filterReducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_FILTERS:
            console.log('action.payload', action.payload)
            return {
                ...state,
                ...action.payload,
            };
        default:
            return state;
    }
};

export default filterReducer;
