import {userActionTypes} from "../_constants/user.actionTypes";

const initialState = {
    registering: false,
    registered: false,
};
export function registration(state = initialState, action) {
    switch (action.type) {
        case userActionTypes.REGISTER_REQUEST:
            return {
                ...state,
                registering: true,
                registered: false
            };
        case userActionTypes.REGISTER_SUCCESS:
            return {
                ...state,
                registering: false,
                registered: true
            };
        case userActionTypes.REGISTER_FAILURE:
            return {
                ...state,
                registering: false,
                registered: false
            };
        default:
            return state
    }
}