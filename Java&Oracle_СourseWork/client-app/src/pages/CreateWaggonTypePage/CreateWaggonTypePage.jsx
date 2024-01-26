import React from 'react';
import {connect} from "react-redux";
import {trainActions} from "../../_actions/train.actions";
import EditTable from "../../_components/EditTable/EditTable";
import AddPopup from "../../_components/AddPopup/AddPopup";
import {appTypes} from "../../_constants/appTypes";

const CreateWaggonTypePage = (props) => {
    const columns = [
        {name: 'name', header: 'Name', defaultFlex: 1, editable: false },
        {name: 'size', header: 'Size', type: 'number', defaultFlex: 1, editable: false },
        {name: 'price', header: 'Price', type: 'number', defaultFlex: 1, editable: false }
    ];
    React.useEffect(() => {
        props.getRowsCountFromTable(appTypes.waggonType);
        props.getWaggonTypes(appTypes.waggonType,props.currentPage);// TODO вызывается дважды
    },[props.waggonTypeAdded, props.waggonTypeUpdated, props.currentPage]);
    return (
        <div>
            <EditTable
                list={props.waggonTypes}
                columns={columns}
                type={appTypes.waggonType}
            />
            <AddPopup type={appTypes.waggonType}/>
        </div>
    );
};

const mapStateToProps = state => {
    return {
        waggonTypeAdded: state.addTrainTypeReducer.added,
        waggonTypes: state.getTrainsReducer.waggonTypes,
        waggonTypeUpdated: state.updateTrainsInfoReducer.updated,
        currentPage: state.getTrainsReducer.currentPage,
    }
}
const actionCreators = {
    getWaggonTypes: trainActions.getTrainTypes,
    getRowsCountFromTable: trainActions.getRowsCountFromTable,
}
export default connect(mapStateToProps, actionCreators)(CreateWaggonTypePage);