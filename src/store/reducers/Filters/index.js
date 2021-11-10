import {
    SET_FILTERS,
    SET_QUERY
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
        case SET_QUERY:
            console.log('action.payload', action.payload)
            return {
                ...state,
                query: action.payload,
            };
        default:
            return state;
    }
};

export default filterReducer;
