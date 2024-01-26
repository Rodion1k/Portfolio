import React from 'react';
import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
import LoginPage from "../pages/LoginPage/LoginPage";
import HomePage from "../pages/HomePage/HomePage";
import AuthenticateProvider from "../_components/AuthenticateProvider/AuthenticateProvider";
import RegistrationPage from "../pages/RegistrationPage/RegistrationPage";
import Layout from "../_components/Layout/Layout";
import AccountPage from "../pages/AccountPage/AccountPage";
import CardPage from "../pages/CardPage/CardPage";
import NotFoundPage from "../pages/NotFoundPage/NotFoundPage";
import CreateTrainPage from "../pages/CrateTrainPage/CreateTrainPage";
import CreateTrainTypePage from "../pages/CreateTypePage/CreateTrainTypePage";
import CreateWagonTypePage from "../pages/CreateWaggonTypePage/CreateWaggonTypePage";
import StationsPage from "../pages/StationsPage/StationsPage";
import MovementRoutesPage from "../pages/MovementRoutesPage/MovementRoutesPage";
import TrainFlightsPage from "../pages/TrainFlightsPage/TrainFlightsPage";
import TrainSchedulePage from "../pages/TrainSchedulePage/TrainSchedulePage";
import TrainOrderPage from "../pages/TrainOrderPage/TrainOrderPage";
import StatisticPage from "../pages/StatisticPage/StatisticPage";
import AdminOrdersPage from "../pages/AdminOrdersPage/AdminOrdersPage";

const App = () => {
    return (
        <div>
            <Router>
                <Routes>
                    <Route element={<AuthenticateProvider/>}>
                        <Route element={<Layout/>} path="/">
                            <Route index element={<HomePage/>}/>
                            <Route element={<AccountPage/>} path="account"/>
                            <Route element={<CardPage/>} path="card"/>
                            <Route element={<TrainSchedulePage/>} path="schedule"/>
                            <Route element={<CreateTrainPage/>} path="create-train"/>
                            <Route element={<CreateTrainTypePage/>} path="create-trainType"/>
                            <Route element={<CreateWagonTypePage/>} path="create-waggonType"/>
                            <Route element={<StationsPage/>} path="stations"/>
                            <Route element={<MovementRoutesPage/>} path="movement-routes"/>
                            <Route element={<TrainFlightsPage/>} path="train-flights"/>
                            <Route element={<TrainOrderPage/>} path="train-order"/>
                            <Route element={<StatisticPage/>} path="statistic"/>
                            <Route element={<AdminOrdersPage/>} path='all-orders'/>
                            <Route element={<NotFoundPage/>} path="*"/>
                        </Route>
                    </Route>
                    <Route element={<LoginPage/>} path="/login"/>
                    <Route element={<RegistrationPage/>} path="/registration"/>
                </Routes>
            </Router>
        </div>
    );
}
export default App;