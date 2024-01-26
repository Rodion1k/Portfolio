import React, {useEffect} from "react";
import './LoginPage.css'
import {connect} from 'react-redux';
import {userActions} from "../../_actions/user.actions";
import {Link, useNavigate} from "react-router-dom";
import {alertActions} from "../../_actions/alert.actions";
import LoadingSpinner from "../../_components/Spinner/LoadingSpinner";


const LoginPage = (props) => {

    const [username, setUsername] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [submitted, setSubmitted] = React.useState(false);
    const navigate = useNavigate();

    const handleLogin = (e) => {
        e.preventDefault();

        if (props.alert.type) {
            props.clearAlerts();
        }
        setSubmitted(true);
        if (username && password) {
            props.login(username, password);
            console.log("login " + username + "password " + password);
        }
    }
    let k = false;
    useEffect(() => {
        if (k) return;
        k = true;// to prevent infinite loop
        if (props.loggedIn) {
            navigate('/');
        } else {
            props.isLoggedIn();
        }
    }, [props.loggedIn]);

    const handleUsernameChange = (e) => {
        if (props.alert.type) {
            props.clearAlerts();
        }
        setSubmitted(false);//bad
        setUsername(e.target.value);
    }
    const handlePasswordChange = (e) => {
        if (props.alert.type) {
            props.clearAlerts();
        }
        setSubmitted(false);
        setPassword(e.target.value);
    }

    return (<form className="login-form">
            <h3>Sign In</h3>
            <div className="mb-3">
                <label>Email address</label>
                <input
                    type="email"
                    className="form-control"
                    placeholder="Enter email"
                    onChange={handleUsernameChange}
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


            <div className="d-grid">
                {props.logging ? (
                        <LoadingSpinner/>
                    )
                    :
                    <button type="submit" className="btn btn-primary" onClick={handleLogin}>
                        Submit
                    </button>
                }
                {
                    submitted &&
                    <div className="alert alert-danger" role="alert">
                        {props.alert.message}
                    </div>
                }
            </div>
            <p className="forgot-password text-left">
                Not registered? <Link to="/registration">sign up</Link>
            </p>
        </form>

    );

}

const mapStateToProps = state => {
    return {
        loggedIn: state.authentication.loggedIn,
        logging: state.authentication.logging,
        alert: state.alert
    }
}
const actionCreators = {
    login: userActions.login, logout: userActions.logout,
    isLoggedIn: userActions.isUserLoggedIn,
    clearAlerts: alertActions.clear,
}
export default connect(mapStateToProps, actionCreators)(LoginPage);