import React from 'react';
import './seatingChart.css';
import Seat from "./Seat/Seat";

const SeatingChart = (props) => {
    const {
        seats,
        handleSeatClick,
        selectedCount,
    } = props;

    const seats1 = seats.slice(0, seats.length / 2);
    const seats2 = seats.slice(seats.length / 2, seats.length);

    return (
        <div className='seating-chart-container'>
            <div className='seating-chart-container-firstColumn'>
                <div className='seating-chart-container-firstColumn-row'>
                </div>
                <div className='seating-chart-container-firstColumn-row'>

                </div>
            </div>
            <div className='seating-chart-seats-container'>
                <div className='seating-chart-seats-firstRow'>
                    {seats1.map((seat, index) => {
                        return <Seat key={index} selectedCount={selectedCount} handleSeatClick={handleSeatClick}
                                     seat={seat}/>
                    })}
                </div>
                <div className='seating-chart-seats-firstRow'>
                    {seats2.map((seat, index) => {
                        return <Seat key={index} selectedCount={selectedCount} handleSeatClick={handleSeatClick}
                                     seat={seat}/>
                    })}
                </div>
            </div>
            <div className='seating-chart-container-secondColumn'>
                <div className='seating-chart-container-secondColumn-row'>
                </div>
                <div className='seating-chart-container-secondColumn-row'>

                </div>
            </div>
        </div>
    );
};

export default SeatingChart;