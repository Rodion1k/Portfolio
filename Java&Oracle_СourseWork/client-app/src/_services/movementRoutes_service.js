import {API_URL} from "../_constants/URLs";
import {authHeader} from "../_helpers/auth-header";
import {userService} from "./user_service";

export const movementRoutes_service = {
    addStation,
    getStations,
    addRoute,
    getRoutes,
    getTrainFlights,
    addTrainFlight,
    deleteTrainFromRoute,
    deleteFlight,
    deleteStationFromRoute,
    updateTime
};

async function deleteTrainFromRoute(data) {
    const requestOptions = {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            ...authHeader()
        }
    };
    const response =
        await fetch(`${API_URL}/admin/route/deleteTrainFromRoute?routeId=${data.routeId}&trainName=${data.trainName}`,
            requestOptions);
    const answer = await handleResponse(response);
    return answer;

}

async function updateTime(data) {
    const requestOptions = {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            ...authHeader()
        }
    };
    const date = new Date(data.positionDate + " " + data.positionTime);
    const time = date.getTime();
    const response = await fetch(`${API_URL}/admin/route/updateTime?newTime=${time}&stationName=${data.stationName}`, requestOptions);
    const answer = await handleResponse(response);
    return answer;
}

async function deleteFlight(data) {
    const requestOptions = {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            ...authHeader()
        }
    };
    const response = await fetch(`${API_URL}/admin/route/deleteFlight?routeId=${data.routeId}`, requestOptions);
    const answer = await handleResponse(response);
    return answer;
}

async function deleteStationFromRoute(data) {
    const requestOptions = {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            ...authHeader()
        }
    };
    const response = await fetch(`${API_URL}/admin/route/deleteStationFromRoute?routeId=${data.routeId}&stationName=${data.stationName}`,
        requestOptions);
    const answer = await handleResponse(response);
    return answer;
}

async function addStation(name) { //TODO сделать поиск как в телеметрии
    const requestOptions = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            ...authHeader()
        },
        body: JSON.stringify({name})
    };

    const response = await fetch(`${API_URL}/admin/route/addStation`, requestOptions);
    const answer = await handleResponse(response);
    return answer;
}

async function addRoute(route) {
    const requestOptions = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            ...authHeader()
        },
        body: JSON.stringify(route)
    };
    const response = await fetch(`${API_URL}/admin/route/addRoute`, requestOptions);
    const answer = await handleResponse(response);
    return answer;
}

async function addTrainFlight(trainFlight) {
    const requestOptions = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            ...authHeader()
        },
        body: JSON.stringify(trainFlight)
    };
    const response = await fetch(`${API_URL}/admin/route/addFlight`, requestOptions);
    const answer = await handleResponse(response);
    return answer;
}

async function getRoutes(itemFrom, itemTo) {
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
    const response = await fetch(`${API_URL}/user/route/getRoutes?itemFrom=${itemFrom}&itemTo=${itemTo}`, requestOptions);
    const routes = await handleResponse(response);
    return routes;
}

async function getTrainFlights(itemFrom, itemTo) {
    const requestOptions = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            ...authHeader()
        }
    };
    const response = await fetch(`${API_URL}/user/route/getFlights?itemFrom=${itemFrom}&itemTo=${itemTo}`, requestOptions);
    const trainFlights = await handleResponse(response);
    return trainFlights;
}

async function getStations(itemFrom, itemTo) {
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
    const response = await fetch(`${API_URL}/user/route/getStations?itemFrom=${itemFrom}&itemTo=${itemTo}`, requestOptions);
    const stations = await handleResponse(response);
    return stations;
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