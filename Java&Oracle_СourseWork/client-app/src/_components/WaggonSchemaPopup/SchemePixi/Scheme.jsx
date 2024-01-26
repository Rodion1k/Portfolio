import React from 'react';
import '../waggonSchemaPopup.css';
import SeatingChart from "../SeatingChart/SeatingChart";

const Scheme = (props) => {
    const {
        seats,
    } = props;
    // let seats = [{seatType: 'seat', isAvailable: true, label: '1'},
    //     {seatType: 'seat', isAvailable: true, label: '2'},
    //     {seatType: 'seat', isAvailable: false, label: '3'},
    //     {seatType: 'seat', isAvailable: false, label: '4'},
    //     {seatType: 'seat', isAvailable: true, label: '5'},
    //     {seatType: 'seat', isAvailable: true, label: '6'},
    //     {seatType: 'seat', isAvailable: true, label: '7'},
    //     {seatType: 'seat', isAvailable: true, label: '8'},
    //     {seatType: 'seat', isAvailable: true, label: '9'},
    //     {seatType: 'seat', isAvailable: true, label: '10'},
    //     {seatType: 'seat', isAvailable: true, label: '11'},
    //     {seatType: 'seat', isAvailable: false, label: '12'},
    //     {seatType: 'seat', isAvailable: false, label: '13'},
    //     {seatType: 'seat', isAvailable: true, label: '14'},
    //     {seatType: 'seat', isAvailable: true, label: '15'},
    //     {seatType: 'seat', isAvailable: true, label: '16'},
    //     {seatType: 'seat', isAvailable: true, label: '17'},
    //     {seatType: 'seat', isAvailable: true, label: '18'},
    //     {seatType: 'seat', isAvailable: true, label: '19'},
    //     {seatType: 'seat', isAvailable: true, label: '20'},
    //     {seatType: 'seat', isAvailable: true, label: '21'},
    //     {seatType: 'seat', isAvailable: false, label: '22'},
    //     {seatType: 'seat', isAvailable: false, label: '23'},
    //     {seatType: 'seat', isAvailable: true, label: '24'},
    //     {seatType: 'seat', isAvailable: true, label: '25'},
    //     {seatType: 'seat', isAvailable: true, label: '26'},
    //     {seatType: 'seat', isAvailable: true, label: '27'},
    //     {seatType: 'seat', isAvailable: true, label: '28'},
    //     {seatType: 'seat', isAvailable: true, label: '29'},
    //     {seatType: 'seat', isAvailable: true, label: '30'},
    //     {seatType: 'seat', isAvailable: true, label: '31'},
    //     {seatType: 'seat', isAvailable: false, label: '32'},
    //     {seatType: 'seat', isAvailable: false, label: '33'},
    //     {seatType: 'seat', isAvailable: true, label: '34'},
    //     {seatType: 'seat', isAvailable: true, label: '35'},
    //     {seatType: 'seat', isAvailable: true, label: '36'},
    //     {seatType: 'seat', isAvailable: true, label: '37'},
    //     {seatType: 'seat', isAvailable: true, label: '38'},
    //     {seatType: 'seat', isAvailable: true, label: '39'},
    //     {seatType: 'seat', isAvailable: true, label: '40'},
    //     {seatType: 'seat', isAvailable: true, label: '41'},
    //     {seatType: 'seat', isAvailable: false, label: '42'},
    //     {seatType: 'seat', isAvailable: false, label: '43'},
    //     {seatType: 'seat', isAvailable: true, label: '44'},
    //     {seatType: 'seat', isAvailable: true, label: '45'},
    //     {seatType: 'seat', isAvailable: true, label: '46'},
    //     {seatType: 'seat', isAvailable: true, label: '47'},
    //     {seatType: 'seat', isAvailable: true, label: '48'},
    //     {seatType: 'seat', isAvailable: true, label: '49'},
    //     {seatType: 'seat', isAvailable: true, label: '50'},
    //     {seatType: 'seat', isAvailable: true, label: '51'},
    //     {seatType: 'seat', isAvailable: false, label: '52'},
    //     {seatType: 'seat', isAvailable: false, label: '53'},
    //     {seatType: 'seat', isAvailable: true, label: '54'},
    //     {seatType: 'seat', isAvailable: true, label: '55'},
    //     {seatType: 'seat', isAvailable: true, label: '56'},
    //     {seatType: 'seat', isAvailable: true, label: '57'},
    //     {seatType: 'seat', isAvailable: true, label: '58'},
    //     {seatType: 'seat', isAvailable: true, label: '59'},
    //     {seatType: 'seat', isAvailable: true, label: '60'},
    // ];
    return (
        <div>
            <SeatingChart seats={seats}/>
        </div>
    );
};

export default Scheme;