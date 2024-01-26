import React from 'react';
import EditTable from "../../_components/EditTable/EditTable";
import AddPopup from "../../_components/AddPopup/AddPopup";
import {connect} from "react-redux";
import {trainActions} from "../../_actions/train.actions";
import {appTypes} from "../../_constants/appTypes";

const CreateTrainTypePage = (props) => {
    const columns = [
        {name: 'trainType', header: 'Train Type', defaultFlex: 1, editable: false },
        {name: 'price', header: 'Price', type: 'number', defaultFlex: 1, editable: false }
    ];
    React.useEffect(() => {
        props.getRowsCountFromTable(appTypes.trainType);
        props.getTrainTypes(appTypes.trainType,props.currentPage);// TODO вызывается дважды
    }, [props.trainTypeAdded, props.trainTypeUpdated, props.currentPage]);

    return (
        <div>
            <EditTable
                list={props.trainTypes}
                columns={columns}
                type={appTypes.trainType}
            />
            <AddPopup type={appTypes.trainType}/>
        </div>
    );
};

const mapStateToProps = state => {
    return {
        trainTypeAdded: state.addTrainTypeReducer.added,
        trainTypes: state.getTrainsReducer.trainTypes,
        trainTypeUpdated: state.updateTrainsInfoReducer.updated,
        currentPage: state.getTrainsReducer.currentPage,
    }
}
const actionCreators = {
    getTrainTypes: trainActions.getTrainTypes,
    getRowsCountFromTable: trainActions.getRowsCountFromTable,
}
export default connect(mapStateToProps, actionCreators)(CreateTrainTypePage);