import {API_URL} from '../_constants/URLs'
import {authHeader} from "../_helpers/auth-header";

export const userService = {
    login,
    logout,
    register,
    isUserLoggedIn,
}

async function isUserLoggedIn() {
    const requestOptions = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            ...authHeader()
        },
    };
    const response = await fetch(`${API_URL}/api/auth/isUserLoggedIn`, requestOptions);
    const user = await handleResponse(response);
    return user;
}

async function login(login, password) {
    const requestOptions = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({login, password}),
    };
    const response = await fetch(`${API_URL}/api/auth/login`,
        requestOptions
    );

    const user = await handleResponse(response);
    localStorage.setItem('user', JSON.stringify(user));
    return user;
}

async function register(user) {
    const requestOptions = {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(user),
    }
    const response = await fetch(`${API_URL}/api/auth/register`, requestOptions);
    return handleResponse(response);
}

function logout() {
    localStorage.removeItem('user');
}


function handleResponse(response) {
    return response.text().then((text) => {
        const data = text && JSON.parse(text);
        if (!response.ok) {
            if (response.status === 401) {
                logout();
                window.location.reload();
            }
            const error = (data && data.message) || response.statusText;
            return Promise.reject(error);
        }
        return data;
    })
}

