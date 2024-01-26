import {API_URL} from "../_constants/URLs";
import {authHeader} from "../_helpers/auth-header";
import {userService} from "./user_service";

export const generic_model_service = {
    getTableSize,
}

async function getTableSize(tableName) {
    const requestOptions = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            ...authHeader()
        },
    };
    const response = await fetch(`${API_URL}/user/generic/getCount?tableName=${tableName}`, requestOptions);
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