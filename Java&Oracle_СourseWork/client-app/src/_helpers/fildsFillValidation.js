import {appTypes} from "../_constants/appTypes";

export const fillFieldsValidator = {
    addPopupValidate,
    nextPopupValidate,
}

function addPopupValidate(objectState, waggonForms, type) {
    // check if all fields are filled
    switch (type) {
        case appTypes.trainType: {
            return !isNaN(objectState.price) && objectState.price > 0 && objectState.name.length > 0;
        }
        case appTypes.waggonType: {
            return !isNaN(objectState.price) && objectState.price > 0 && objectState.name.length > 0;
        }
        case appTypes.station: {
            return objectState.name.length > 0;
        }
        case appTypes.train: {
            if (objectState.type.length > 0 && objectState.name.length > 0 && waggonForms.length > 0) {
                let isAllWaggonsFilled = true;
                waggonForms.forEach((waggonForm) => {
                    if (isNaN(waggonForm.number) || waggonForm.number < 0 || waggonForm.type.length === 0) {
                        return isAllWaggonsFilled = false;
                    }
                });
                return isAllWaggonsFilled;
            }
            return false;
        }
        case appTypes.trainFlights: {
            return objectState.train.length > 0 && objectState.route.length > 0;
        }
        case appTypes.movementRoute: {

            if (objectState.name.length > 0 && waggonForms.length > 1) {
                let isAllStationsFilled = true;
                waggonForms.forEach((stationForm) => {
                    if (stationForm.station.length === 0
                        || stationForm.date === undefined) {
                        return isAllStationsFilled = false;
                    }
                    // check if all stations are different
                    let isAllStationsDifferent = true;
                    let count = 0;
                    waggonForms.forEach((stationForm2) => {
                        if (stationForm.station === stationForm2.station) {
                            count++;
                        }
                        if (count > 1) {
                            return isAllStationsDifferent = false;
                        }
                    });
                    // check if days are correct
                    let isDaysCorrect = true;
                    waggonForms.forEach((stationForm2) => {
                        if (stationForm.date > stationForm2.date) {
                            return isDaysCorrect = false;
                        }
                    });
                    let nowDate = new Date();
                    let date = new Date(stationForm.date);
                    nowDate.setHours(0, 0, 0, 0);
                    date.setHours(0, 0, 0, 0);
                    if (date < nowDate) {
                        isDaysCorrect = false;
                    }
                    isAllStationsFilled = isAllStationsFilled && isAllStationsDifferent && isDaysCorrect;
                    if (!isAllStationsFilled) {
                        return isAllStationsFilled;
                    }
                });
                return isAllStationsFilled;
            }
            return false;
        }
    }
}

function nextPopupValidate(objectState, waggonForms, type) {
    switch (type) {
        case appTypes.train: {
            return objectState.type.length > 0 && objectState.name.length > 0;
        }
        case appTypes.movementRoute: {
            return objectState.name.length > 0;
        }
    }
}
