import {trainActionTypes} from "../_constants/train.actionTypes";

const initialState = {
    deleting: false,
    deleted: false,
}
export const deleteReducer = (state = initialState, action) => {
    switch (action.type) {
        case trainActionTypes.DELETE_OBJECT_REQUEST:
            return {
                ...state,
                deleting: true,
                deleted: false,
            }
        case trainActionTypes.DELETE_OBJECT_SUCCESS:
            return {
                ...state,
                deleting: false,
                deleted: true,
            }
        case trainActionTypes.DELETE_OBJECT_FAILURE:
            return {
                ...state,
                deleting: false,
                deleted: false,
            }
        default:
            return state;
    }
}