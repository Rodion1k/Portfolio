import {combineReducers} from "redux";
import {authentication} from "./authentication.reducer";
import {registration} from "./registration.reducer";
import {alert} from "./alert.reducer";
import {addTrainTypeReducer} from "./add.reducer";
import {getTrainsReducer} from "./getTrainsReducer";
import {updateTrainsInfoReducer} from "./update.reducer";
import {popup} from "./popup.reducer";
import {orderReducer} from "./orcer.reducer";
import {deleteReducer} from "./delete.reducer";
// reducers

const rootReducer = combineReducers({
    authentication,
    registration,
    alert,
    addTrainTypeReducer,
    getTrainsReducer,
    updateTrainsInfoReducer,
    popup,
    orderReducer,
    deleteReducer
});

export default rootReducer;