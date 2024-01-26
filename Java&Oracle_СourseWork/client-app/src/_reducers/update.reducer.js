import {trainActionTypes} from "../_constants/train.actionTypes";

const initialState = {
    updating: false,
    updated: false,
}

export const updateTrainsInfoReducer = (state = initialState, action) => {
    switch (action.type) {
        case trainActionTypes.UPDATE_TRAINS_REQUEST:
            return {
                ...state,
                updating: true,
                updated: false,
            }
        case trainActionTypes.UPDATE_TRAINS_SUCCESS:
            return {
                ...state,
                updating: false,
                updated: true,
            }
        case trainActionTypes.UPDATE_TRAINS_FAILURE:
            return {
                ...state,
                updating: false,
                updated: false,
            }
        default:
            return state;
    }
}