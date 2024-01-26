import React, {useState, useEffect} from 'react';
import './RegistrationPage.css'
import {Link, useNavigate} from "react-router-dom";
import {connect} from "react-redux";
import {userActions} from "../../_actions/user.actions";
import {textValidators} from "../../_helpers/inputTextValidation";
import {userService} from "../../_services/user_service";
import {alertActions} from "../../_actions/alert.actions";

const RegistrationPage = (props) => {
    // state for user
    const [user, setUser] = useState({
        name: '',
        surname: '',
        patronymic: '',
        login: '',
        password: '',
        email: '',
        passport: '',
        role: 'ROLE_USER',
    });
    const [error, setError] = useState({
        nameValidationErrorMessage: '',
        surnameValidationErrorMessage: '',
        patronymicValidationErrorMessage: '',
        loginValidationErrorMessage: '',
        passwordValidationErrorMessage: '',
        emailValidationErrorMessage: '',
    });
    const [submitted, setSubmitted] = useState(false);
    const [repeatedPassword, setRepeatedPassword] = useState('');
    const navigate = useNavigate();
    const handleFirstNameChange = (e) => {
        e.preventDefault();
        props.clearAlerts();
        setUser({...user, name: e.target.value});
    }
    const handleLastNameChange = (e) => {
        e.preventDefault();
        setSubmitted(false);
        props.clearAlerts();
        setUser({...user, surname: e.target.value});
    }
    const handlePatronymicChange = (e) => {
        e.preventDefault();
        props.clearAlerts();
        setSubmitted(false);
        setUser({...user, patronymic: e.target.value});
    }
    const handleLoginChange = (e) => {
        e.preventDefault();
        setSubmitted(false);
        props.clearAlerts();
        setUser({...user, login: e.target.value});
    }
    const handlePasswordChange = (e) => {
        e.preventDefault();
        props.clearAlerts();
        setSubmitted(false);
        setUser({...user, password: e.target.value});
    }
    const handleEmailChange = (e) => {
        e.preventDefault();
        props.clearAlerts();
        setSubmitted(false);
        setUser({...user, email: e.target.value});
    }
    const handlePassportChange = (e) => {
        e.preventDefault();
        props.clearAlerts();
        setSubmitted(false);
        setUser({...user, passport: e.target.value});
    }
    const handleSubmit = (e) => {
        e.preventDefault();
        props.clearAlerts();
        let nameValidationErrorMessage = textValidators.validateName(user.name, false);
        let surnameValidationErrorMessage = textValidators.validateName(user.surname, false);
        let patronymicValidationErrorMessage = textValidators.validateName(user.patronymic, false);
        let loginValidationErrorMessage = textValidators.validateLogin(user.login, false);
        let passwordValidationErrorMessage = textValidators.validatePassword(user.password, false);
        let emailValidationErrorMessage = textValidators.validateEmailAddress(user.email, false);
        if (!nameValidationErrorMessage && !surnameValidationErrorMessage
            && !patronymicValidationErrorMessage && !loginValidationErrorMessage
            && !passwordValidationErrorMessage && !emailValidationErrorMessage &&
            user.password === repeatedPassword) {
            props.register(user);
       }
        else {
            props.error("wrong Data");
        }
        setSubmitted(true);
    }

    useEffect(() => {
        if (submitted && props.registered) {
            setSubmitted(false);
            navigate('/login');
        }
    }, [props.registered]);

    const handleRepeatPasswordChange = (e) => {
        e.preventDefault();
        setRepeatedPassword(e.target.value);
    }


    return (
        <form className="registration-form">
            <h3>Sign Up</h3>
            <div className="mb-3">
                <label>First name</label>
                <input
                    type="text"
                    className="form-control"
                    placeholder="First name"
                    onChange={handleFirstNameChange}
                />
            </div>
            <div className="mb-3">
                <label>Last name</label>
                <input
                    type="text"
                    className="form-control"
                    placeholder="Last name"
                    onChange={handleLastNameChange}
                />
            </div>
            <div className="mb-3">
                <label>Patronymic</label>
                <input type="text"
                       className="form-control"
                       placeholder="Patronymic"
                       onChange={handlePatronymicChange}
                />
            </div>
            <div className="mb-3">
                <label>Email address</label>
                <input
                    type="email"
                    className="form-control"
                    placeholder="Enter email"
                    onChange={handleEmailChange}
                />
            </div>
            <div className="mb-3">
                <label>Login</label>
                <input
                    type="text"
                    className="form-control"
                    placeholder="Enter login"
                    onChange={handleLoginChange}
                />
            </div>

            <div className="mb-3">
                <label>Passport</label>
                <input
                    type="text"
                    className="form-control"
                    placeholder="Passport"
                    onChange={handlePassportChange}
                />
            </div>
            <div className="mb-3">
                <label>Password</label>
                <input
                    type="password"
                    className="form-control"
                    placeholder="Enter password"
                    onChange={handlePasswordChange}
                />
            </div>
            <div className="mb-3">
                <label>Repeat password</label>
                <input
                    type="password"
                    className="form-control"
                    placeholder="Repeat password"
                    onChange={handleRepeatPasswordChange}
                />
            </div>
            {
                submitted &&
                <div className="alert alert-danger" role="alert">
                    {props.alert.message}
                </div>
            }
            <div className="d-grid">
                <button type="submit" className="btn btn-primary" onClick={handleSubmit}>
                    Sign Up
                </button>
            </div>
            <p className="forgot-password text-right">
                Already registered <Link to="/login">sign in?</Link>
            </p>
        </form>

    );
};

const mapStateToProps = state => {
    return {
        registering: state.registration,
        registered: state.registration.registered,
        alert: state.alert
    };
}

const actionCreators = {
    register: userActions.register,
    clearAlerts:alertActions.clear,
    error:alertActions.error,
}
export default connect(mapStateToProps, actionCreators)(RegistrationPage);