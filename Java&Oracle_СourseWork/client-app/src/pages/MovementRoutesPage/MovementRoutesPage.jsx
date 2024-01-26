import React from 'react';
import {connect} from "react-redux";
import {trainActions} from "../../_actions/train.actions";
import {appTypes} from "../../_constants/appTypes";
import AddPopup from "../../_components/AddPopup/AddPopup";
import EditTable from "../../_components/EditTable/EditTable";

const MovementRoutesPage = (props) => {
    const columns = [
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
        {name: 'stationName', header: 'Station Name', defaultFlex: 1, editable: false },
        {name: 'positionNumber', header: 'Position Number', defaultFlex: 1, editable: false },
        {name: 'positionDate', header: 'Position Date', defaultFlex: 1, editable: false },
        {name: 'positionTime', header: 'Position Time', defaultFlex: 1, editable: false },
    ];
    React.useEffect(() => {
        props.getRowsCountFromTable(appTypes.movementRoute);
        props.getRoutes(appTypes.movementRoute, props.currentPage);
        props.getRoutes(appTypes.station);
    }, [props.addedRoute, props.currentPage]);
    return (
        <div>
            <EditTable
                list={props.routes}
                columns={columns}
                type={appTypes.movementRoute}
            />
            <AddPopup type={appTypes.movementRoute}/>
        </div>
    );
};
const mapStateToProps = state => {
    return {
        addedRoute: state.addTrainTypeReducer.added,
        routes: state.getTrainsReducer.payload,
        currentPage: state.getTrainsReducer.currentPage,
    }
}
const actionCreators = {
    getRoutes: trainActions.getTrainTypes,
    getRowsCountFromTable: trainActions.getRowsCountFromTable,
}

export default connect(mapStateToProps, actionCreators)(MovementRoutesPage);