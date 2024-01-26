import React from 'react';
import {Navigate, Outlet} from "react-router-dom";
import {store} from "../../_store/store";

const AuthenticateProvider = () => {
let loggedIn = store.getState().authentication.loggedIn;
let logging = store.getState().authentication.logging; //прыгает много раз
    console.log("--------------AuthenticateProvider-----------------");
    return (
        store.getState().authentication.loggedIn||store.getState().authentication.logging ?
            <Outlet/>
            : <Navigate to={'/login'}/>
    );
};

export default AuthenticateProvider;