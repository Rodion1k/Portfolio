import {API_URL} from "../_constants/URLs";
import {authHeader} from "../_helpers/auth-header";
import {userService} from "./user_service";

export const orderService = {
    addOrder,
    getUserOrders,
    deleteOrder,
    confirmOrder,
    getConfirmedOrders,
    getStatistics
}

async function addOrder(order) {
    order.userId = JSON.parse(localStorage.getItem('user')).userId;
    const requestOptions = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            ...authHeader()
        },
        body: JSON.stringify(order)
    };

    const response = await fetch(`${API_URL}/user/generic/addOrder`, requestOptions);
    const answer = await handleResponse(response);
    return answer;
}

async function confirmOrder(orderId) {
    const requestOptions = {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            ...authHeader()
        }
    };

    const response = await fetch(`${API_URL}/user/generic/confirmOrder?orderId=${orderId}`, requestOptions);
    const answer = await handleResponse(response);
    return answer;
}

async function deleteOrder(orderId) {
    const requestOptions = {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            ...authHeader()
        }
    };

    const response = await fetch(`${API_URL}/user/generic/deleteOrder?orderId=${orderId}`, requestOptions);
    const answer = await handleResponse(response);
    return answer;
}

async function getUserOrders(status) {
    let userId = JSON.parse(localStorage.getItem('user')).userId;
    const requestOptions = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            ...authHeader()
        }
    };

    const response = await fetch(`${API_URL}/user/generic/getUserCartOrders?userId=${userId}&status=${status}`, requestOptions);
    const answer = await handleResponse(response);
    return answer;
}

async function getConfirmedOrders(dateFrom, dateTo) {
    const requestOptions = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            ...authHeader()
        }
    };

    const response =
        await fetch(`${API_URL}/user/generic/getConfirmedOrders?dateFrom=${dateFrom}&dateTo=${dateTo}`,
            requestOptions);
    const answer = await handleResponse(response);
    return answer;
}

async function getStatistics(dateFrom, dateTo) {
    const requestOptions = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            ...authHeader()
        }
    };

    const response =
        await fetch(`${API_URL}/user/generic/getStatistics?dateFrom=${dateFrom}&dateTo=${dateTo}`,
            requestOptions);
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