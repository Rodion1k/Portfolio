import React from 'react';
import EditTable from "../../_components/EditTable/EditTable";
import {trainActions} from "../../_actions/train.actions";
import {connect} from "react-redux";
import {appTypes} from "../../_constants/appTypes";

const AdminOrdersPage = (props) => {
    const columns = [
        {name: 'userId', header: 'User id', defaultFlex: 1, editable: false},
        {name: 'price', header: 'Price', defaultFlex: 1, editable: false},
        {name: 'stationFrom', header: 'Station from', defaultFlex: 1, editable: false},
        {name: 'stationTo', header: 'Station to', defaultFlex: 1, editable: false},
        {name: 'dateFrom', header: 'Date from', defaultFlex: 1, editable: false},
        {name: 'dateTo', header: 'Date to', defaultFlex: 1, editable: false}
    ];
    React.useEffect(() => {
        props.getOrders('order', props.currentPage);
        props.getRowsCountFromTable('order');
    }, [props.currentPage]);
    return (
        <div>
            <EditTable
                list={props.orders}
                columns={columns}
                type={'order'}
            />
        </div>
    );
};

const mapStateToProps = state => {
    return {
        orders: state.getTrainsReducer.payload,
        currentPage: state.getTrainsReducer.currentPage,
    }
}
const actionCreators = {
    getOrders: trainActions.getTrainTypes,
    getRowsCountFromTable: trainActions.getRowsCountFromTable,
}
export default connect(mapStateToProps, actionCreators)(AdminOrdersPage);