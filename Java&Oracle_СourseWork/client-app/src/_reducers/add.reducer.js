import {trainActionTypes} from "../_constants/train.actionTypes";

const initialState = {
    adding: false,
    added: false,
}
// TODO сделать общим для добавления
export const addTrainTypeReducer = (state = initialState, action) => {
    switch (action.type) {
        case trainActionTypes.ADD_TRAIN_TYPE_REQUEST:
            return {
                ...state,
                adding: true,
                added: false,
            }
        case trainActionTypes.ADD_TRAIN_TYPE_SUCCESS:
            return {
                ...state,
                adding: false,
                added: true,
            }
        case trainActionTypes.ADD_TRAIN_TYPE_FAILURE:
            return {
                ...state,
                adding: false,
                added: false,
            }
        default:
            return state;
    }
}