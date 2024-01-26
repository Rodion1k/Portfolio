import React from 'react';
import LinearChart from "../../_components/LinearChart/LinearChart";
import './statisticPage.css';
import DateTimePicker from "../../_components/DateTimePicker/DateTimePicker";
import {orderActions} from "../../_actions/order.actions";
import {connect} from "react-redux";
import {Button} from "react-bootstrap";
import ReactDataGrid from "@inovua/reactdatagrid-community";
import "@inovua/reactdatagrid-community/index.css";

const StatisticPage = (props) => {
    const {
        statistics,// TODO считать места купленные за период
        loaded,
    } = props;
    // date now -1 month
    const [dateFrom, setDateFrom] = React.useState(new Date().setMonth(new Date().getMonth() - 1));
    const [dateTo, setDateTo] = React.useState(new Date());
    const [xAxis, setXAxis] = React.useState([]);
    const [yAxis, setYAxis] = React.useState([]);
    const [yMax, setYMax] = React.useState(0);
    const [yMin, setYMin] = React.useState(0);
    const [type, setType] = React.useState('chart');
    const onDateFromChange = (date) => {
        setDateFrom(date);
    }
    const onDateToChange = (date) => {
        setDateTo(date);
    }
    React.useEffect(() => {
        props.getStatistics(new Date(dateFrom).getTime(), new Date(dateTo).getTime());
    }, []);
    React.useEffect(() => {
        let xAxis = [];
        let yAxis = [];
        if (loaded) {
            if (!(statistics.length > 0)) {
                setXAxis([]);
                setYAxis([]);
                setYMax(0);
                setYMin(0);
                return;
            }
            statistics.forEach((statistic) => {
                xAxis.push(new Date(statistic.date).toLocaleDateString());
                yAxis.push(statistic.count);
            });
            setYMax(Math.max(...yAxis) + 10);
            setYMin(Math.min(...yAxis));
            // unique xAxis
            setXAxis(xAxis);
            setYAxis(yAxis);
        }
    }, [loaded]);
    const handleUpdate = () => {
        props.getStatistics(new Date(dateFrom).getTime(), new Date(dateTo).getTime());
    }
    return (
        <>
            {loaded ?
                <div className='statistic-page-container'>
                    <div className='stat-buttons-container'>
                        <Button onClick={() => setType('chart')}>Chart</Button>
                        <Button onClick={() => setType('table')}>Table</Button>
                    </div>
                    {type === 'chart' ?
                        <LinearChart xData={xAxis} yData={yAxis}
                                     yMax={yMax} yMin={yMin}/>
                        :
                        <ReactDataGrid
                            className="data-guard"
                            idProperty="id"
                            dataSource={statistics}
                            columns={[
                                {name: 'date', header: 'Date', defaultFlex: 1},
                                {name: 'count', header: 'Count', defaultFlex: 1},
                            ]}
                        />
                    }
                    <div className='data_picker_container'>
                        <DateTimePicker
                            dateFrom={dateFrom} dateTo={dateTo}
                            onDateFromChange={onDateFromChange}
                            onDateToChange={onDateToChange}
                        />
                        <Button variant="primary" onClick={handleUpdate}>Update</Button>
                    </div>
                </div>
                :
                <div>Loading</div>
            }
        </>
    );
};
const mapStateToProps = state => {
    return {
        statistics: state.orderReducer.statistics,
        loaded: state.orderReducer.loaded,
    }
}
const actionCreators = {
    getStatistics: orderActions.getStatistics,
}
export default connect(mapStateToProps, actionCreators)(StatisticPage);