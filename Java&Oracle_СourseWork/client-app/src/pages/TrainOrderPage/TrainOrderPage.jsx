import React from 'react';
import {useLocation} from "react-router-dom";
import {connect} from "react-redux";
import {trainActions} from "../../_actions/train.actions";
import {ListGroup} from "react-bootstrap";
import './trainOrderPage.css';
import TrainOrderItem from "../../_components/TrainOrderItem/TrainOrderItem";
const TrainOrderPage = (props) => {
    const {
        trainInfo,
        loaded,
    } = props;
    React.useEffect(() => {
        props.getTrainInfo(location.state);
    }, []);
    const location = useLocation();

    return (
        <>
            {loaded ?
                <div className='train-order-container'>
                    <div className="train-order-header-text-container">
                        <div className="train-order-header-text">
                            Train name:
                        </div>
                        <span className='order-name'>{location.state.trainName}</span>
                    </div>
                    <div className="train-order-header-text-container">
                        <div className="train-order-header-text">
                            Train type:
                        </div>
                        <span className='order-name'>{trainInfo[0].trainType}</span>
                    </div>
                    <div className='train-order-header'>
                        Chose waggon and seat:
                    </div>
                    <ListGroup>
                        {trainInfo.map((waggon, index) => {
                            return <TrainOrderItem key={index} stations={location.state.stations} waggon={waggon} />
                        })}
                    </ListGroup>
                </div>
                :
                <div>Loading...</div>
            }
        </>
    );
};
const mapStateToProps = state => {
    return {
        trainInfo: state.getTrainsReducer.payload,
        loaded: state.getTrainsReducer.loaded,
    }
}
const actionCreators = {
    getTrainInfo: trainActions.getTrainInfo,
}
export default connect(mapStateToProps, actionCreators)(TrainOrderPage);