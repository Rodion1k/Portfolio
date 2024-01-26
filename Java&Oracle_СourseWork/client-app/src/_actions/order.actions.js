import {orderActionTypes} from "../_constants/order.actiomTypes";
import {alertActions} from "./alert.actions";
import {orderService} from "../_services/order_service";


const addOrder = (order) => {
    return dispatch => {
        dispatch(request());
        orderService.addOrder(order)
            .then(
                order => {
                    dispatch(success(order));
                    dispatch(alertActions.success('Order added'));
                },
                error => {
                    dispatch(failure(error.toString()));
                    dispatch(alertActions.error(error.toString()));
                }
            );
    };

    function request() {
        return {type: orderActionTypes.ADD_ORDER_REQUEST}
    }

    function success() {
        return {type: orderActionTypes.ADD_ORDER_SUCCESS}
    }

    function failure(error) {
        return {type: orderActionTypes.ADD_ORDER_FAILURE, error}
    }
}

const getUserOrders = (status) => {
    return dispatch => {
        dispatch(request());
        orderService.getUserOrders(status)
            .then(
                orders => dispatch(success(orders)),
                error => dispatch(failure(error.toString()))
            );
    };

    function request() {
        return {type: orderActionTypes.GET_ORDERS_REQUEST}
    }

    function success(orders) {
        return {type: orderActionTypes.GET_ORDERS_SUCCESS, orders}
    }

    function failure(error) {
        return {type: orderActionTypes.GET_ORDERS_FAILURE, error}
    }
}

const getUserOrdersConfirmed = (status) => {
    return dispatch => {
        dispatch(request());
        orderService.getUserOrders(status)
            .then(
                confirmedOrders => dispatch(success(confirmedOrders)),
                error => dispatch(failure(error.toString()))
            );
    };

    function request() {
        return {type: orderActionTypes.GET_CONFIRMED_ORDERS_REQUEST}
    }

    function success(confirmedOrders) {
        return {type: orderActionTypes.GET_CONFIRMED_ORDERS_SUCCESS, confirmedOrders}
    }

    function failure(error) {
        return {type: orderActionTypes.GET_CONFIRMED_ORDERS_FAILURE, error}
    }
}

const getAllConfirmedOrders = (dateFrom, dateTo) => {
    return dispatch => {
        dispatch(request());
        orderService.getConfirmedOrders(dateFrom, dateTo)
            .then(
                confirmedOrders => dispatch(success(confirmedOrders)),
                error => dispatch(failure(error.toString()))
            );
    };

    function request() {
        return {type: orderActionTypes.GET_CONFIRMED_ORDERS_REQUEST}
    }

    function success(confirmedOrders) {
        return {type: orderActionTypes.GET_CONFIRMED_ORDERS_SUCCESS, confirmedOrders}
    }

    function failure(error) {
        return {type: orderActionTypes.GET_CONFIRMED_ORDERS_FAILURE, error}
    }
}

const getStatistics = (dateFrom, dateTo) => {
    return dispatch => {
        dispatch(request());
        orderService.getStatistics(dateFrom, dateTo)
            .then(
                statistics => dispatch(success(statistics)),
                error => dispatch(failure(error.toString()))
            );
    };

    function request() {
        return {type: orderActionTypes.GET_STATISTICS_REQUEST}
    }

    function success(statistics) {
        return {type: orderActionTypes.GET_STATISTICS_SUCCESS, statistics}
    }

    function failure(error) {
        return {type: orderActionTypes.GET_STATISTICS_FAILURE, error}
    }
}

const deleteOrder = (orderId) => {
    return dispatch => {
        dispatch(request());
        orderService.deleteOrder(orderId)
            .then(
                order => {
                    dispatch(success(order));
                    dispatch(alertActions.success('Order deleted'));
                },
                error => {
                    dispatch(failure(error.toString()));
                    dispatch(alertActions.error(error.toString()));
                }
            );
    }

    function request() {
        return {type: orderActionTypes.DELETE_ORDER_REQUEST}
    }

    function success() {
        return {type: orderActionTypes.DELETE_ORDER_SUCCESS}
    }

    function failure(error) {
        return {type: orderActionTypes.DELETE_ORDER_FAILURE, error}
    }
}

const confirmOrder = (orderId) => {
    return dispatch => {
        dispatch(request());
        orderService.confirmOrder(orderId)
            .then(
                order => {
                    dispatch(success());
                    dispatch(alertActions.success('Order confirmed'));
                },
                error => {
                    dispatch(failure(error.toString()));
                    dispatch(alertActions.error(error.toString()));
                }
            );
    }

    function request() {
        return {type: orderActionTypes.CONFIRM_ORDER_REQUEST}
    }

    function success() {
        return {type: orderActionTypes.CONFIRM_ORDER_SUCCESS}
    }

    function failure(error) {
        return {type: orderActionTypes.CONFIRM_ORDER_FAILURE, error}
    }
}



export const orderActions = {
    addOrder,
    getUserOrders,
    deleteOrder,
    confirmOrder,
    getUserOrdersConfirmed,
    getAllConfirmedOrders,
    getStatistics,
}