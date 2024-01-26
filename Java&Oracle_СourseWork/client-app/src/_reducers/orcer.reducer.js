import {orderActionTypes} from "../_constants/order.actiomTypes";

const initialState = {
    loading: false,
    loaded: false,
    adding: false,
    added: false,
    deleting: false,
    deleted: false,
    confirming: false,
    confirmed: false,
    orders: [],
    confirmedOrders: [],
    orderTimes: [
        {
            id: '',
            time: ''
        },
    ],
    statistics:[]
}

export const orderReducer = (state = initialState, action) => {
    switch (action.type) {
        case orderActionTypes.GET_ORDERS_REQUEST:
            return {
                ...state,
                loading: true,
                loaded: false,
            }
        case orderActionTypes.GET_ORDERS_SUCCESS:
            return {
                ...state,
                loading: false,
                loaded: true,
                orders: action.orders,
            }
        case orderActionTypes.GET_ORDERS_FAILURE:
            return {
                ...state,
                loading: false,
                loaded: false,
            }
        case orderActionTypes.ADD_ORDER_REQUEST:
            return {
                ...state,
                adding: true,
                added: false,
            }
        case orderActionTypes.ADD_ORDER_SUCCESS:
            return {
                ...state,
                adding: false,
                added: true,
            }
        case orderActionTypes.ADD_ORDER_FAILURE:
            return {
                ...state,
                adding: false,
                added: false,
            }
        case orderActionTypes.CONFIRM_ORDER_REQUEST:
            return {
                ...state,
                confirming: true,
                confirmed: false,
            }
        case orderActionTypes.CONFIRM_ORDER_SUCCESS:
            return {
                ...state,
                confirming: false,
                confirmed: true,
            }
        case orderActionTypes.CONFIRM_ORDER_FAILURE:
            return {
                ...state,
                confirming: false,
                confirmed: false,
            }
        case orderActionTypes.DELETE_ORDER_REQUEST:
            return {
                ...state,
                deleting: true,
                deleted: false,
            }
        case orderActionTypes.DELETE_ORDER_SUCCESS:
            return {
                ...state,
                deleting: false,
                deleted: true,
            }
        case orderActionTypes.DELETE_ORDER_FAILURE:
            return {
                ...state,
                deleting: false,
                deleted: false,
            }
        case orderActionTypes.UPDATE_ORDER_TIMES_SUCCESS:
            return {
                ...state,
                orderTimes: action.orderTimes,
            }
        case orderActionTypes.GET_CONFIRMED_ORDERS_REQUEST:
            return {
                ...state,
                loading: true,
                loaded: false,
            }

        case orderActionTypes.GET_CONFIRMED_ORDERS_SUCCESS:
            return {
                ...state,
                loading: false,
                loaded: true,
                confirmedOrders: action.confirmedOrders,
            }
        case orderActionTypes.GET_CONFIRMED_ORDERS_FAILURE:
            return {
                ...state,
                loading: false,
                loaded: false,
            }
        case orderActionTypes.GET_STATISTICS_REQUEST:
            return {
                ...state,
                loading: true,
                loaded: false,
            }
        case orderActionTypes.GET_STATISTICS_SUCCESS:
            return {
                ...state,
                loading: false,
                loaded: true,
                statistics: action.statistics,
            }
        case orderActionTypes.GET_STATISTICS_FAILURE:
            return {
                ...state,
                loading: false,
                loaded: false,
            }
        default:
            return state;
    }
}