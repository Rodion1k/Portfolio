import React from 'react';
import EditTable from "../../_components/EditTable/EditTable";
import {trainActions} from "../../_actions/train.actions";
import {connect} from "react-redux";
import AddPopup from "../../_components/AddPopup/AddPopup";
import {appTypes} from "../../_constants/appTypes";

const CreateTrainPage = (props) => {
    const columns = [
        {name: 'name', defaultFlex: 1, editable: false },
        {name: 'trainType', defaultFlex: 1, editable: false },
    ];
    React.useEffect(() => {
        props.getRowsCountFromTable(appTypes.train);
        props.getTrains(appTypes.train, props.currentPage); // добавить так на все страницы
        props.getTrains(appTypes.waggonType);
    }, [props.currentPage, props.addedTrain]);
    return (
        <div>
            <EditTable
                list={props.trains}
                columns={columns}
                type={appTypes.train}
            />
            <AddPopup type={appTypes.train}/>
        </div>
    );
};

const mapStateToProps = state => {
    return {
        addedTrain: state.addTrainTypeReducer.added,
        trains: state.getTrainsReducer.payload,
        currentPage: state.getTrainsReducer.currentPage,
    }
}
const actionCreators = {
    getTrains: trainActions.getTrainTypes,
    getRowsCountFromTable: trainActions.getRowsCountFromTable,
}

export default connect(mapStateToProps, actionCreators)(CreateTrainPage);