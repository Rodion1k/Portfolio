import React from 'react';
import {Button} from "react-bootstrap";
import {useNavigate} from "react-router-dom";
import {ListGroupItem} from "react-bootstrap";
import './trainSchedule.css';

const TrainScheduleItem = (props) => {
    const {flight} = props;
    const trainName = flight[0].trainName;
    const routeName = flight[0].routeName;
    const timeFrom = new Date(flight[0].positionDate + ' ' + flight[0].positionTime);
    const timeTo = new Date(flight[flight.length - 1].positionDate + ' ' + flight[flight.length - 1].positionTime);
    const time = timeTo - timeFrom;
    const timeInHoursAndMinutes = Math.floor(time / 1000 / 60 / 60) + 'h ' + Math.floor(time / 1000 / 60 % 60) + 'm';
    const firstStation = flight[0].stationName;
    const lastStation = flight[flight.length - 1].stationName;
    const navigate = useNavigate();
    //get stations from flight
    const stations = flight.map(flight => {
        const station = {
            stationName: flight.stationName,
            positionNumber: flight.positionNumber,
            time: new Date(flight.positionDate + ' ' + flight.positionTime),
        }
        return station;
    });

    const handleSelectSeats = () => {
        navigate('/train-order', {state: {trainName: trainName, routeId: flight[0].routeId, stations: stations}}); // TODO в state строки передать посмотреть как и загрузить стр от сюда

    }
    return (
        <ListGroupItem>
            <div className='main-container'>
                <div className='first-column'>
                    <div>
                        <span className='train-name'>{trainName}</span>
                        <span className='route-name'>{routeName}</span>
                    </div>
                    <div className='train-info-container'>
                        <div className='train-info-column'>
                            <div>
                                {timeFrom.toLocaleString()}
                            </div>
                            <div>
                                {firstStation}
                            </div>
                        </div>
                        <div className='train-info-column'>
                            <div>
                                {timeTo.toLocaleString()}
                            </div>
                            <div>
                                {lastStation}
                            </div>
                        </div>
                        <div>
                            {timeInHoursAndMinutes}
                        </div>
                    </div>
                </div>
                <div className='second-column'>
                    <Button className='select-button' variant="primary" onClick={handleSelectSeats}>select
                        seats</Button>
                </div>
            </div>
        </ListGroupItem>
    );
};

export default TrainScheduleItem;