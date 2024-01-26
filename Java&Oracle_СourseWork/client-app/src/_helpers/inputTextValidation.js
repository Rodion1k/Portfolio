export const textValidators = {
    validateEmailAddress,
    validatePassword,
    validateName,
    validateLogin,
}

function validateEmailAddress(email, allowEmptyText) {
    let validationErrorText = '';

    if (!email) {
        if (allowEmptyText === false) return 'Value is required';
        else
            return validationErrorText;
    }
    let emailRegEx =
        /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    if (!emailRegEx.test(email)) {
        validationErrorText = 'Email is not valid';
    }
    return validationErrorText;
}

function validatePassword(password, allowEmptyText) {
    let validationErrorText = '';

    if (!password) {
        if (allowEmptyText === false) return 'Value is required';
        else
            return validationErrorText;
    }

    if (password.length < 8) {
        validationErrorText = 'Password must be at least 8 characters';
    }

    return validationErrorText;
}

function validateLogin(login, allowEmptyText) {
    let validationErrorText = '';

    if (!login) {
        if (allowEmptyText === false) return 'Value is required';
        else
            return validationErrorText;
    }

    if (login.length < 5) {
        validationErrorText = 'Login must be at least 5 characters';
    }

    return validationErrorText;
}

function validateName(name, allowEmptyText) {

    let validationErrorText = '';
    if (!name) {
        if (allowEmptyText === false) return 'Value is required';
        else return validationErrorText;
    }
    let nameRegEx = /^[ЁёА-яa-zA-Z]+$/u;
    if (!nameRegEx.test(name)) {
        validationErrorText = 'Value is not valid';
    }
    return validationErrorText;
}