import {API_URL} from "../_constants/URLs";
import {authHeader} from "../_helpers/auth-header";
import {userService} from "./user_service";

export const trainService = {
    addTrainType,
    getTrainTypes,
    getTrains,
    updateTrainTypes,
    updateTrains,
    addWaggonType,
    getWaggonTypes,
    addTrain,
    getTrainInfo,
    getSeats,
    getAllOrders,
    deleteTrain
}

async function addTrainType(trainType, price) {
    const requestOptions = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            ...authHeader()
        },
        body: JSON.stringify({trainType, price})
    };

    const response = await fetch(`${API_URL}/admin/train/addTrainType`, requestOptions);
    const answer = await handleResponse(response);
    return answer;
}


async function addTrain(train) {
    const requestOptions = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            ...authHeader()
        },
        body: JSON.stringify(train)
    };

    const response = await fetch(`${API_URL}/admin/train/addTrain`, requestOptions);
    const answer = await handleResponse(response);
    return answer;
}

async function deleteTrain(trainId) {
    const requestOptions = {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            ...authHeader()
        },
    };
    const response = await fetch(`${API_URL}/admin/train/deleteTrain/${trainId}`, requestOptions);
    const answer = await handleResponse(response);
    return answer;
}

async function updateTrains(trains) {
    const requestOptions = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            ...authHeader()
        },
        body: trains
    };
    const response = await fetch(`${API_URL}/admin/train/updateTrains`, requestOptions);
    const answer = await handleResponse(response);
    return answer;
}


async function updateTrainTypes(trainTypes) {
    const requestOptions = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            ...authHeader()
        },
        body: JSON.stringify(trainTypes)
    };

    const response = await fetch(`${API_URL}/admin/train/updateTrainTypes`, requestOptions);
    const answer = await handleResponse(response);// TODO красить красгым строки без апдейта и зеленым с апдейтом
    return answer;
}


async function getTrainTypes(itemFrom, itemTo) {
    const requestOptions = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            ...authHeader()
        }
    };

    if (isNaN(itemFrom) || isNaN(itemTo)) {
        itemFrom = 0;
        itemTo = 0;
    }
    const response = await fetch(`${API_URL}/user/train/getTrainTypes?itemFrom=${itemFrom}&itemTo=${itemTo}`, requestOptions);
    const trainTypes = await handleResponse(response);
    return trainTypes;
}

async function getAllOrders(itemFrom, itemTo){
    const requestOptions = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            ...authHeader()
        }
    };
    // check for NAN
    if (isNaN(itemFrom) || isNaN(itemTo)) {
        itemFrom = 0;
        itemTo = 0;
    }
    const response = await fetch(`${API_URL}/user/generic/getAllOrders?itemFrom=${itemFrom}&itemTo=${itemTo}`, requestOptions);
    const orders = await handleResponse(response);
    return orders;
}

async function getTrainInfo(trainState) {
    const requestOptions = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            ...authHeader()
        }
    };
    const response =
        await fetch(`${API_URL}/user/train/getTrainInfo?trainName=${trainState.trainName}&routeId=${trainState.routeId}`,
            requestOptions);
    const trainInfo = await handleResponse(response);
    return trainInfo;
}

async function getTrains(itemFrom, itemTo) {
    const requestOptions = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            ...authHeader()
        }
    };
    if (isNaN(itemFrom) || isNaN(itemTo)) {
        itemFrom = 0;
        itemTo = 0;
    }
    const response = await fetch(`${API_URL}/user/train/getTrains?itemFrom=${itemFrom}&itemTo=${itemTo}`, requestOptions);
    const trains = await handleResponse(response);
    return trains;
}

async function addWaggonType(name, size, price) {
    size='60';
    const requestOptions = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            ...authHeader()
        },
        body: JSON.stringify({name, size, price})
    };

    const response = await fetch(`${API_URL}/admin/train/addWaggonType`, requestOptions);
    const answer = await handleResponse(response);
    return answer;
}

async function getWaggonTypes(itemFrom, itemTo) {
    const requestOptions = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            ...authHeader()
        }
    };
    // check for NAN
    if (isNaN(itemFrom) || isNaN(itemTo)) {
        itemFrom = 0;
        itemTo = 0;
    }
    const response = await fetch(`${API_URL}/user/train/getWaggonTypes?itemFrom=${itemFrom}&itemTo=${itemTo}`, requestOptions);
    const waggonTypes = await handleResponse(response);
    return waggonTypes;
}


async function getSeats(waggonId, trainName, routeId) {
    const requestOptions = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            ...authHeader()
        }
    };
    const response =
        await fetch(`${API_URL}/user/train/getSeats?waggonId=${waggonId}&trainName=${trainName}&routeId=${routeId}`,
    requestOptions
);
    const answer = await handleResponse(response);
    return answer;
}

function handleResponse(response) {
    return response.text().then((text) => {
        const data = text && JSON.parse(text);
        if (!response.ok) {
            if (response.status === 401) {
                userService.logout();
                window.location.reload();
            }
            const error = (data && data.message) || response.statusText;
            return Promise.reject(error);
        }
        return data;
    })
}