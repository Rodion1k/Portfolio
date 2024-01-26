import {userActionTypes} from "../_constants/user.actionTypes";

//let token = JSON.parse(localStorage.getItem('token'));
const initialState = {
    user: {},
    loggedIn: false,
    logging: false,
}

export const authentication = (state = initialState, action) => {
    switch (action.type) {
        case userActionTypes.LOGIN_REQUEST:
            return {
                ...state,
                user: action.user,
                logging: true,
                loggedIn: false,
            }
        case userActionTypes.LOGIN_SUCCESS:
            return {
                ...state,
                user: action.user,
                logging: false,
                loggedIn: true,
            }
        case userActionTypes.LOGIN_FAILURE:
            return {
                ...state,
                user: {},
                logging: false,
                loggedIn: false,
            }
        case userActionTypes.LOGOUT:
            return {
                ...state,
                user: {},
                logging: false,
                loggedIn: false,
            }
            case userActionTypes.CHECK_TOKEN_REQUEST:
            return {
                ...state,
                logging: true,
                loggedIn: false,
            }
            default: return state;
    }

}

