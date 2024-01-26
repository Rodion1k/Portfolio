import {popupActionTypes} from "../_constants/popup.actionTypes";

const initialState = {
    objectState: {
        name: '',
        price: '',
        type: '',
        size: '',
        train: '',
        route: '',
        waggonType: '',
        waggonNumber: '',
    },
    waggonForms: [],
    open: false,
    waggonsCount: 0,
}

export function popup(state = initialState, action) {
    switch (action.type) {
        case popupActionTypes.POPUP_NEXT:
            return {
                ...state,
                objectState: action.payload
            };
        case popupActionTypes.POPUP_PREV:
            return {
                ...state,
                objectState: action.payload
            };
        case popupActionTypes.POPUP_CLOSE:
            return {
                ...state,
                open: false,
                objectState: initialState.objectState,
                waggonForms: [],
            }
        case popupActionTypes.POPUP_UPDATE_SECOND_STEP:
            return {
                ...state,
                waggonsCount: action.payload.length,
                waggonForms: action.payload
            }
        case popupActionTypes.POPUP_OPEN:
            return {
                ...state,
                open: true
            }
        case popupActionTypes.POPUP_REMOVE_WAGGON:
            return {
                ...state,
                waggonsCount: state.waggonsCount - 1,
                waggonForms: state.waggonForms.filter((item, index) => index !== action.payload)
            }
        default:
            return state
    }
}