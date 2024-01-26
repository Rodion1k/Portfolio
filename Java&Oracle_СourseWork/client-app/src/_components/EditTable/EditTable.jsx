import React from 'react';
import ReactDataGrid from "@inovua/reactdatagrid-community";
import "@inovua/reactdatagrid-community/index.css";
import {connect} from "react-redux";
import {Button} from "react-bootstrap";
import {trainActions} from "../../_actions/train.actions";
import PaginationToolBar from "../PaginationToolBar/PaginationToolBar";
import './editTable.css';
import {appTypes} from "../../_constants/appTypes";

const EditTable = (props) => {
    let initialData = props.list;
    const [maxPage, setMaxPage] = React.useState(1);
    const [dataSource, setDataSource] = React.useState([]);
    let columns = props.columns;
    const [currentPage, setCurrentPage] = React.useState(1);
    const [selected, setSelected] = React.useState({});
    const [edited, setEdited] = React.useState({});
    const filterValue = columns.map(column => {
        return {
            name: column.name,
            operator: 'contains',
            type: 'string',
            value: '',
        };
    }, []);


    const handleEditComplete = React.useCallback(({value, columnId, rowId}) => {
        const data = [...dataSource];
        const rowIndex = data.findIndex(item => item === selected);
        data[rowIndex][columnId] = value;
        setEdited(data[rowIndex]);
    }, [dataSource,selected]);


    React.useEffect(() => {
        props.updateCurrentPage(currentPage);
        //TODO add pagination state to store and get it from there
    }, [currentPage]);


    React.useEffect(() => {
        if (props.trainTypesLoaded) {
            setDataSource(initialData);
            setMaxPage(Math.ceil(props.rowsCount / 15));
        }
    }, [props.trainTypesLoaded, props.rowsCount]);

    const handleUpdateTime = (e) => {
       e.preventDefault();
        props.updateTime(edited,'time');
    }

    const handleDeleteStation = (e) => {
        e.preventDefault();
        props.deleteObject('station', selected);
    }

    const handleDeleteFlight = (e) => {
        e.preventDefault();
        props.deleteObject('flight', selected);
    }

    const handleDeleteTrain = (e) => {
        e.preventDefault();
        props.deleteObject('train', selected);
    }

    const handleSelectionChange = React.useCallback((rowProps, event) => {
        setSelected(rowProps.data);
    }, []);

    return (
        <div>
            <ReactDataGrid
                className="data-guard"
                idProperty="id"
                columns={columns}
                editable={true}
                onRowClick={handleSelectionChange}
                defaultFilterValue={filterValue}
                onEditComplete={handleEditComplete}
                dataSource={dataSource}
            />
            <PaginationToolBar currentPage={currentPage} maxPage={maxPage} setCurrentPage={setCurrentPage}/>
            {props.type === appTypes.trainFlights &&
                <div className='grid-buttons-container'>
                    <Button variant="primary" onClick={handleDeleteStation}>Delete station from route</Button>
                    <Button variant="primary" onClick={handleDeleteFlight}>Delete flight</Button>
                    <Button variant="primary" onClick={handleDeleteTrain}>Delete train from route</Button>
                    <Button variant="primary" onClick={handleUpdateTime}>Update time</Button>
                </div>
            }
        </div>
    );
};
const mapStateToProps = state => {
    return {
        trainTypesLoaded: state.getTrainsReducer.loaded,
        rowsCount: state.getTrainsReducer.rowsCount,
    }
}
const actionCreators = {
    updateTime: trainActions.updateTrainsInfo,
    updateCurrentPage: trainActions.changeCurrentPage,
    deleteObject: trainActions.deleteObject,
}

export default connect(mapStateToProps, actionCreators)(EditTable);