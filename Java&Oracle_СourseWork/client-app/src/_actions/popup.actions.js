import {popupActionTypes} from "../_constants/popup.actionTypes";

export const popupActions = {
    nextStep,
    prevStep,
    close,
    update,
    open,
    removeWaggon,
};

function nextStep(payload) {
    return {type: popupActionTypes.POPUP_NEXT, payload};
}

function prevStep(payload) {
    return {type: popupActionTypes.POPUP_PREV, payload};
}

function close() {
    return {type: popupActionTypes.POPUP_CLOSE};
}

function update(payload) {
    return {type: popupActionTypes.POPUP_UPDATE_SECOND_STEP, payload};
}

function open() {
    return {type: popupActionTypes.POPUP_OPEN};
}

function removeWaggon(payload) {
    return {type: popupActionTypes.POPUP_REMOVE_WAGGON, payload};
}
