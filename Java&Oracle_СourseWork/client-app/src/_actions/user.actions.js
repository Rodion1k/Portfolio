import {userActionTypes} from "../_constants/user.actionTypes";
import {userService} from "../_services/user_service";
import {alertActions} from "./alert.actions";

const login = (username, password) => {
    return dispatch => {
        dispatch(request({username}));
        userService.login(username, password).then(
            user => {
                dispatch(success(user));
            },
            error => {
                dispatch(failure(error.toString()));
                console.log(error.toString());
                dispatch(alertActions.error(error.toString()));
            }
        );

    }

    function request(user) {
        return {type: userActionTypes.LOGIN_REQUEST, user}
    }

    function success(user) {
        return {type: userActionTypes.LOGIN_SUCCESS, user}
    }

    function failure(error) {
        return {type: userActionTypes.LOGIN_FAILURE, error}
    }
}

const register = (user) => {
    return dispatch => {
        dispatch(request(user));
        userService.register(user).then(
            user => {
                dispatch(success());
                dispatch(alertActions.success('Registration successful'));
            },
            (error) => {
                dispatch(failure(error.toString()));
                dispatch(alertActions.error(error.toString()));
            }
        );

    }

    function request(user) {
        return {type: userActionTypes.REGISTER_REQUEST, user};
    }

    function success(user) {
        return {type: userActionTypes.REGISTER_SUCCESS, user};
    }

    function failure(error) {
        return {type: userActionTypes.REGISTER_FAILURE, error};
    }
}

function isUserLoggedIn() {
    return dispatch => {
        dispatch(request());
        userService.isUserLoggedIn().then(
            (user) => {
                dispatch(success(user));
            },
            (error) => {
                dispatch(failure(error.toString()));
            }
        );
    }

    function request(user) {
        return {type: userActionTypes.LOGIN_REQUEST, user}
    }

    function success(user) {
        return {type: userActionTypes.LOGIN_SUCCESS, user}
    }

    function failure(error) {
        return {type: userActionTypes.LOGIN_FAILURE, error}
    }
}



const logout = () => {
    userService.logout();
    return {type: userActionTypes.LOGOUT}
}
export const userActions = {
    login,
    logout,
    register,
    isUserLoggedIn,
}