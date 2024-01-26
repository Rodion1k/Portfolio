import React from 'react';
import {connect} from "react-redux";
import EditTable from "../../_components/EditTable/EditTable";
import AddPopup from "../../_components/AddPopup/AddPopup";
import {appTypes} from "../../_constants/appTypes";
import {trainActions} from "../../_actions/train.actions";

const StationsPage = (props) => {
    const columns = [
        {name: 'name', header: 'Station name', defaultFlex: 1, editable: false },
    ];
    React.useEffect(() => {
        props.getRowsCountFromTable(appTypes.station);
        props.getStations(appTypes.station, props.currentPage);
    }, [props.addedStation, props.currentPage]);
    return (
        <div>
            <EditTable
                list={props.stations}
                columns={columns}
                type={appTypes.station}
            />
            <AddPopup
                type={appTypes.station}
            />
        </div>
    );
};

const mapStateToProps = state => {
    return {
        addedStation:  state.addTrainTypeReducer.added,
        stations: state.getTrainsReducer.waggonTypes,
        currentPage: state.getTrainsReducer.currentPage,
    }
}
const actionCreators = {
    getStations: trainActions.getTrainTypes,
    getRowsCountFromTable: trainActions.getRowsCountFromTable,
}

export default connect(mapStateToProps, actionCreators)(StationsPage);