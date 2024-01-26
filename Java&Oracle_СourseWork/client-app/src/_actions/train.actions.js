import {trainActionTypes} from "../_constants/train.actionTypes";
import {trainService} from "../_services/train_service";
import {alertActions} from "./alert.actions";
import {appTypes} from "../_constants/appTypes";
import {movementRoutes_service} from "../_services/movementRoutes_service";
import {generic_model_service} from "../_services/generic_model_service";

const addTrainType = (data, type, waggonForms) => {
    let name = data.name;
    let price = data.price;
    let waggonSize = data.size;
    if (type === appTypes.trainType) {
        let trainType = name;
        return dispatch => {
            dispatch(request());
            trainService.addTrainType(trainType, price).then(
                () => {
                    dispatch(success());
                    dispatch(alertActions.success('Train type added'));
                },
                error => {
                    dispatch(failure(error.toString()));
                    dispatch(alertActions.error(error.toString()));
                }
            );
        }
    } else if (type === appTypes.waggonType) {
        return dispatch => {
            dispatch(request());
            trainService.addWaggonType(name, waggonSize, price).then(
                () => {
                    dispatch(success());
                    dispatch(alertActions.success('Waggon type added'));
                },
                error => {
                    dispatch(failure(error.toString()));
                    dispatch(alertActions.error(error.toString()));
                }
            );
        }
    } else if (type === appTypes.station) {
        return dispatch => {
            dispatch(request());
            movementRoutes_service.addStation(name).then(
                () => {
                    dispatch(success());//TODO мб сообщение с бэка ловитб
                    dispatch(alertActions.success('Waggon type added'));
                },
                error => {
                    dispatch(failure(error.toString()));
                    dispatch(alertActions.error(error.toString()));
                }
            )
        }
    } else if (type === appTypes.train) {
        return dispatch => {
            let parsedWaggons = [];
            waggonForms.map((item) => {
                let waggon = {
                    waggonNumber: item.number,
                    waggonType: item.type
                }
                parsedWaggons.push(waggon);
            })
            let train = {
                name: name,
                trainType: data.type,
                waggons: parsedWaggons
            }
            dispatch(request());
            trainService.addTrain(train).then(
                () => {
                    dispatch(success());
                    dispatch(alertActions.success('Train added'));
                },
                error => {
                    dispatch(failure(error.toString()));
                    dispatch(alertActions.error(error.toString()));
                }
            );
        }
    } else if (type === appTypes.movementRoute) {
        return dispatch => {
            let route = {
                name: name,
                stationRoutes: [],
            }
            let parsedRoute = [];
            waggonForms.map((item, index) => {
                let date = new Date(item.date);
                // item.time is a string like "12:00"
                // item.date is a "2022-12-15T21:00:00.000Z"
                // so we need to split the time string and add it to the date
                let time = item.time.split(":");
                date.setHours(time[0]);
                date.setMinutes(time[1]);

                let routeItem = {
                    stationId: item.station,
                    positionTime: date.getTime(),
                    positionNumber: index + 1
                }
                parsedRoute.push(routeItem);
            });
            route.stationRoutes = parsedRoute;
            dispatch(request());
            movementRoutes_service.addRoute(route).then(
                () => {
                    dispatch(success());
                    dispatch(alertActions.success('Movement route added'));
                },
                error => {
                    dispatch(failure(error.toString()));
                    dispatch(alertActions.error(error.toString()));
                }
            );
        }
    } else if (type === appTypes.trainFlights) {
        return dispatch => {
            let flight = {
                routeId: data.route,
                trainId: data.train,
            }
            dispatch(request());
            movementRoutes_service.addTrainFlight(flight).then(
                () => {
                    dispatch(success());
                    dispatch(alertActions.success('Train flight added'));
                },
                error => {
                    dispatch(failure(error.toString()));
                    dispatch(alertActions.error(error.toString()));
                }
            );
        }
    }

    function request() {
        return {type: trainActionTypes.ADD_TRAIN_TYPE_REQUEST}
    }

    function success() {
        return {type: trainActionTypes.ADD_TRAIN_TYPE_SUCCESS}
    }

    function failure(error) {
        return {type: trainActionTypes.ADD_TRAIN_TYPE_FAILURE, error}
    }
}


const updateTrainsInfo = (data, type) => {
    if (type === appTypes.trainType)
        return dispatch => {
            dispatch(request());
            trainService.updateTrainTypes(data).then(
                () => {
                    dispatch(success());
                    dispatch(alertActions.success('Data updated'));
                },
                error => {
                    dispatch(failure(error.toString()));
                    dispatch(alertActions.error(error.toString()));
                }
            );
        }
    else if (type === appTypes.train)
        return dispatch => {
            dispatch(request());
            trainService.updateTrains(data).then(
                () => {
                    dispatch(success());
                    dispatch(alertActions.success('Data updated'));
                },
                error => {
                    dispatch(failure(error.toString()));
                    dispatch(alertActions.error(error.toString()));
                }
            );
        }
    else if (type === 'time')
        return dispatch => {
            dispatch(request());
            movementRoutes_service.updateTime(data).then(
                () => {
                    dispatch(success());
                    dispatch(alertActions.success('Data updated'));
                },
                error => {
                    dispatch(failure(error.toString()));
                    dispatch(alertActions.error(error.toString()));
                }
            );
        }

    function request() {
        return {type: trainActionTypes.UPDATE_TRAINS_REQUEST}
    }

    function success() {
        return {type: trainActionTypes.UPDATE_TRAINS_SUCCESS}
    }

    function failure(error) {
        return {type: trainActionTypes.UPDATE_TRAINS_FAILURE, error}
    }
}

const getTrainInfo = (trainState) => {
    return dispatch => {
        dispatch(request());
        trainService.getTrainInfo(trainState).then(
            (data) => {
                dispatch(success(data));
            },
            error => {
                dispatch(failure(error.toString()));
                dispatch(alertActions.error(error.toString()));
            }
        );
    }

    function request() {
        return {type: trainActionTypes.GET_TRAIN_INFO_REQUEST}
    }

    function success(data) {
        return {type: trainActionTypes.GET_TRAIN_INFO_SUCCESS, payload: data}
    }

    function failure(error) {
        return {type: trainActionTypes.GET_TRAIN_INFO_FAILURE, error}
    }
}

const getTrainTypes = (type, currentPage) => {
    const itemTo = currentPage * appTypes.pageSize + 1;
    const itemFrom = itemTo - appTypes.pageSize;
    if (type === appTypes.trainType)
        return dispatch => {
            dispatch(request());
            trainService.getTrainTypes(itemFrom, itemTo).then(
                (trainTypes) => {
                    dispatch(successTrainTypes(trainTypes));
                },
                error => {
                    dispatch(failure(error.toString()));
                    dispatch(alertActions.error(error.toString()));
                }
            );
        }
    else if(type === 'order')
        return dispatch => {
            dispatch(request());
            trainService.getAllOrders(itemFrom, itemTo).then(
                (payload) => {
                    dispatch(success(payload));
                },
                error => {
                    dispatch(failure(error.toString()));
                    dispatch(alertActions.error(error.toString()));
                }
            );
        }
    else if (type === appTypes.train)
        return dispatch => {
            dispatch(request());
            trainService.getTrains(itemFrom, itemTo).then(
                (payload) => {
                    dispatch(success(payload));
                },
                error => {
                    dispatch(failure(error.toString()));
                    dispatch(alertActions.error(error.toString()));
                }
            );
        }
    else if (type === appTypes.waggonType)
        return dispatch => {
            dispatch(request());
            trainService.getWaggonTypes(itemFrom, itemTo).then(
                (waggonTypes) => {
                    dispatch(successWaggonTypes(waggonTypes));
                },
                error => {
                    dispatch(failure(error.toString()));
                    dispatch(alertActions.error(error.toString()));
                }
            );
        }
    else if (type === appTypes.station)
        return dispatch => {
            dispatch(request());
            movementRoutes_service.getStations(itemFrom, itemTo).then(
                (waggonTypes) => {
                    dispatch(successWaggonTypes(waggonTypes));
                },
                error => {
                    dispatch(failure(error.toString()));
                    dispatch(alertActions.error(error.toString()));
                }
            )
        }
    else if (type === appTypes.movementRoute)
        return dispatch => {
            dispatch(request());
            movementRoutes_service.getRoutes(itemFrom, itemTo).then(
                (routes) => {
                    dispatch(success(routes));
                },
                error => {
                    dispatch(failure(error.toString()));
                    dispatch(alertActions.error(error.toString()));
                }
            )
        }
    else if (type === appTypes.trainFlights)
        return dispatch => {
            dispatch(request());
            movementRoutes_service.getTrainFlights(itemFrom, itemTo).then(
                (trainFlights) => {
                    dispatch(success(trainFlights));
                },
                error => {
                    dispatch(failure(error.toString()));
                    dispatch(alertActions.error(error.toString()));
                }
            )
        }
    else if (type === appTypes.train_routes)
        return dispatch => {
            dispatch(request());
            movementRoutes_service.getRoutes(itemFrom, itemTo).then(
                (waggonTypes) => {
                    dispatch(successWaggonTypes(waggonTypes));// TODO проверить в отладке
                    trainService.getTrains().then(
                        (trainTypes) => {
                            dispatch(successTrainTypes(trainTypes));
                        },
                        error => {
                            dispatch(failure(error.toString()));
                            dispatch(alertActions.error(error.toString()));
                        })

                },
                error => {
                    dispatch(failure(error.toString()));
                    dispatch(alertActions.error(error.toString()));
                });
        }
    else if (type === appTypes.trainSchedule)
        return dispatch => {
            dispatch(requestTrainFlights());
            movementRoutes_service.getTrainFlights(itemFrom, itemTo).then(
                (flights) => {
                    dispatch(successTrainFlights(flights));
                },
                error => {
                    dispatch(failure(error.toString()));
                    dispatch(alertActions.error(error.toString()));
                }
            )
        }


    // function success(trainTypes) for trainTypes
    function successWaggonTypes(waggonTypes) {
        return {type: trainActionTypes.GET_TRAIN_WAGGON_SUCCESS, waggonTypes}
    }

    function successTrainTypes(trainTypes) {
        return {type: trainActionTypes.GET_TRAIN_TYPES_SUCCESS, trainTypes}
    }

    function successTrainFlights(flights) {
        return {type: trainActionTypes.GET_FLIGHTS_SUCCESS, flights}
    }

    function requestTrainFlights() {
        return {type: trainActionTypes.GET_FLIGHTS_REQUEST}
    }

    function request() {
        return {type: trainActionTypes.GET_TRAINS_REQUEST}
    }

    function success(payload) {
        return {type: trainActionTypes.GET_TRAINS_SUCCESS, payload}
    }

    function failure(error) {
        return {type: trainActionTypes.GET_TRAINS_FAILURE, error}
    }

}
const getTrains = () => {
    return dispatch => {
        dispatch(request());
        trainService.getTrains().then(
            (trains) => {
                dispatch(success(trains));
            },
            error => {
                dispatch(failure(error.toString()));
                dispatch(alertActions.error(error.toString()));
            }
        );
    }

    function request() {
        return {type: trainActionTypes.GET_TRAINS_REQUEST}
    }

    function success(trains) {
        return {type: trainActionTypes.GET_TRAINS_SUCCESS, trains}
    }

    function failure(error) {
        return {type: trainActionTypes.GET_TRAINS_FAILURE, error}
    }

}


const changeCurrentPage = (currentPage) => {
    return {type: trainActionTypes.CHANGE_CURRENT_PAGE, currentPage}
}

const getRowsCountFromTable = (type) => {
    return dispatch => {
        generic_model_service.getTableSize(mapTypeToTableName()).then(
            (rowsCount) => {
                dispatch(success(rowsCount));
            },
            error => {
                dispatch(alertActions.error(error.toString()));
            }
        );
    }

    function success(rowsCount) {
        return {type: trainActionTypes.GET_ROWS_COUNT_FROM_TABLE, rowsCount}
    }

    function mapTypeToTableName() {
        switch (type) {
            case appTypes.trainType:
                return 'TRAIN_TYPES';
            case appTypes.train:
                return 'TRAINS';
            case appTypes.waggonType:
                return 'WAGGONS_TYPES';
            case appTypes.station:
                return 'STATIONS';
            case appTypes.movementRoute:
                return 'MOVEMENT_ROUTE_VIEW';// todo ДОБАВЛЯТЬ ТУТ НОВЫЕ ТИПЫ
            case appTypes.trainFlights:
                return 'FLIGHTS_VIEW';
            case 'order':
                return 'ORDERS';
        }
    }
}

const getSeats = (waggonId, trainName, routeId) => {
    return dispatch => {
        dispatch(request());
        trainService.getSeats(waggonId, trainName, routeId).then(
            (seats) => {
                dispatch(success(seats));
            },
            error => {
                dispatch(failure(error.toString()));
                dispatch(alertActions.error(error.toString()));
            }
        );
    }

    function request() {
        return {type: trainActionTypes.GET_SEATS_REQUEST}
    }

    function success(seats) {
        return {type: trainActionTypes.GET_SEATS_SUCCESS, seats}
    }

    function failure(error) {
        return {type: trainActionTypes.GET_SEATS_FAILURE, error}
    }
}

const deleteObject = (type, data) => {
    if(type==='train')
        return dispatch => {
            dispatch(request());
            movementRoutes_service.deleteTrainFromRoute(data).then(
                (train) => {
                    dispatch(success());
                },
                error => {
                    dispatch(failure(error.toString()));
                    dispatch(alertActions.error(error.toString()));
                }
            );
        }
    else if(type==='flight')
        return dispatch => {
            dispatch(request());
            movementRoutes_service.deleteFlight(data).then(
                (train) => {
                    dispatch(success());
                },
                error => {
                    dispatch(failure(error.toString()));
                    dispatch(alertActions.error(error.toString()));
                }
            );
        }
    else if(type==='station')
        return dispatch => {
            dispatch(request());
            movementRoutes_service.deleteStationFromRoute(data).then(
                (train) => {
                    dispatch(success());
                },
                error => {
                    dispatch(failure(error.toString()));
                    dispatch(alertActions.error(error.toString()));
                }
            );
        }
    function request() {
        return {type: trainActionTypes.DELETE_OBJECT_REQUEST}
    }

    function success() {
        return {type: trainActionTypes.DELETE_OBJECT_SUCCESS}
    }

    function failure(error) {
        return {type: trainActionTypes.DELETE_OBJECT_FAILURE, error}
    }
}

export const trainActions = {
    addTrainType,
    getTrainTypes,
    getTrains,
    updateTrainsInfo,
    changeCurrentPage,
    getRowsCountFromTable,
    getTrainInfo,
    getSeats,
    deleteObject,
}