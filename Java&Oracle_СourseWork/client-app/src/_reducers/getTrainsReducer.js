import {trainActionTypes} from "../_constants/train.actionTypes";

const initialState = {
    loading: false,
    loaded: false,
    flightsLoaded: false,
    payload: [],
    waggonTypes: [],
    trainTypes: [],
    currentPage: 1,
    rowsCount: 0,
    flights: [],
    seats: [],
    seatsLoaded: false,
}

export const getTrainsReducer = (state = initialState, action) => {
    switch (action.type) {
        case trainActionTypes.GET_TRAINS_REQUEST:
            return {
                ...state,
                loading: true,
                loaded: false,
                flightsLoaded: false,

            }
        case trainActionTypes.GET_TRAINS_SUCCESS:
            return {
                ...state,
                loading: false,
                loaded: true,
                flightsLoaded: false,

                payload: action.payload,
            }
        case trainActionTypes.GET_TRAIN_WAGGON_SUCCESS:
            return {
                ...state,
                loading: false,
                loaded: true,
                flightsLoaded: false,

                waggonTypes: action.waggonTypes,
            }
        case trainActionTypes.GET_TRAIN_TYPES_SUCCESS:
            return {
                ...state,
                loading: false,
                flightsLoaded: false,

                loaded: true,
                trainTypes: action.trainTypes,
            }
        case trainActionTypes.GET_TRAINS_FAILURE:
            return {
                ...state,
                loading: false,

                loaded: false,
                flightsLoaded: false,
            }
        case trainActionTypes.CLEAN:
            return {
                ...state,
                payload: [],
            }
        case trainActionTypes.CHANGE_CURRENT_PAGE:
            return {
                ...state,
                currentPage: action.currentPage,
            }
        case trainActionTypes.GET_ROWS_COUNT_FROM_TABLE:
            return {
                ...state,
                rowsCount: action.rowsCount,
            }
        case trainActionTypes.GET_FLIGHTS_REQUEST:
            return {
                ...state,
                flightsLoaded: false,
            }
        case trainActionTypes.GET_FLIGHTS_SUCCESS:
            return {
                ...state,
                flightsLoaded: true,
                flights: action.flights,
            }
        case trainActionTypes.GET_TRAIN_INFO_REQUEST:
            return {
                ...state,
                loading: true,
                loaded: false,
                payload: [],
                flightsLoaded: false,
            }
        case trainActionTypes.GET_TRAIN_INFO_SUCCESS:
            return {
                ...state,
                payload: action.payload,
                loaded: true,
            }
        case trainActionTypes.GET_TRAIN_INFO_FAILURE:
            return {
                ...state,
                loading: false,
                loaded: false,
                flightsLoaded: false,
                payload: [],
            }
        case trainActionTypes.GET_SEATS_REQUEST:
            return {
                ...state,
                loading: true,
                seatsLoaded: false,
                flightsLoaded: false,
            }
        case trainActionTypes.GET_SEATS_SUCCESS:
            return {
                ...state,
                loading: false,
                seatsLoaded: true,
                flightsLoaded: false,
                seats: action.seats,
            }
        case trainActionTypes.GET_SEATS_FAILURE:
            return {
                ...state,
                loading: false,
                seatsLoaded: false,
                flightsLoaded: false,
            }

        default:
            return state;
    }
}