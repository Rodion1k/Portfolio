import React from 'react';
import {connect} from "react-redux";
import {trainActions} from "../../_actions/train.actions";
import EditTable from "../../_components/EditTable/EditTable";
import {appTypes} from "../../_constants/appTypes";
import AddPopup from "../../_components/AddPopup/AddPopup";
import {updateTrainsInfoReducer} from "../../_reducers/update.reducer";

const TrainFlightsPage = (props) => {
    const columns = [
        {
            name: 'trainName', editable: false, header: 'Train name', defaultFlex: 1,
            rowspan: ({value, dataSourceArray, rowIndex, column}) => {
                let rowspan = 1;

                const prevData = dataSourceArray[rowIndex - 1];
                if (prevData && prevData[column.name] === value) {
                    return rowspan;
                }
                let currentRowIndex = rowIndex + 1;
                while (
                    dataSourceArray[currentRowIndex] &&
                    dataSourceArray[currentRowIndex][column.name] === value
                    ) {
                    rowspan++;
                    currentRowIndex++;
                    if (rowspan > 9) {
                        break;
                    }
                }
                return rowspan;
            }
        },
        {
            name: 'routeName', editable: false, header: 'Route name', defaultFlex: 1,
            rowspan: ({value, dataSourceArray, rowIndex, column}) => {
                let rowspan = 1;

                const prevData = dataSourceArray[rowIndex - 1];
                if (prevData && prevData[column.name] === value) {
                    return rowspan;
                }
                let currentRowIndex = rowIndex + 1;
                while (
                    dataSourceArray[currentRowIndex] &&
                    dataSourceArray[currentRowIndex][column.name] === value
                    ) {
                    rowspan++;
                    currentRowIndex++;
                    if (rowspan > 9) {
                        break;
                    }
                }
                return rowspan;
            }
        },
        {name: 'stationName', header: 'Station Name', editable: false, defaultFlex: 1},
        {name: 'positionNumber', header: 'Position Number', editable: false, defaultFlex: 1},
        {name: 'positionDate', header: 'Position Date', defaultFlex: 1},
        {name: 'positionTime', header: 'Position Time', defaultFlex: 1},
    ];
    React.useEffect(() => {
        props.getRowsCountFromTable(appTypes.trainFlights);
        props.getFlights(appTypes.trainFlights, props.currentPage);
    }, [props.addedFlight, props.currentPage, props.deleted, props.updated]);
    return (
        <div>
            <EditTable
                list={props.flights}
                columns={columns}
                type={appTypes.trainFlights}
            />
            <AddPopup type={appTypes.trainFlights}/>
        </div>
    );
};

const mapStateToProps = state => {
    return {
        addedFlight: state.addTrainTypeReducer.added,
        flights: state.getTrainsReducer.payload,
        currentPage: state.getTrainsReducer.currentPage,
        deleted: state.deleteReducer.deleted,
        updated: state.updateTrainsInfoReducer.updated,
    }
}
const actionCreators = {
    getFlights: trainActions.getTrainTypes,
    getRowsCountFromTable: trainActions.getRowsCountFromTable,
}

export default connect(mapStateToProps, actionCreators)(TrainFlightsPage);