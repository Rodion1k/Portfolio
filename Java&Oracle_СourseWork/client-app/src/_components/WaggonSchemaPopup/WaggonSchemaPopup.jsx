import React from 'react';
import {Button, Modal, ModalBody, ModalFooter} from 'react-bootstrap';
import {connect} from "react-redux";
import './waggonSchemaPopup.css';
import SeatingChart from "./SeatingChart/SeatingChart";
import {trainActions} from "../../_actions/train.actions";
import {popupActions} from "../../_actions/popup.actions";
import {orderActions} from "../../_actions/order.actions";
import Select from "../Select/Select";

const WaggonSchemaPopup = (props) => {
    const {
        waggon,
        seats,
        loaded,
        isOpen,
        stations,
    } = props;
    const [price, setPrice] = React.useState(0);
    const [selectedSeats, setSelectedSeats] = React.useState([]);
    const [selectedCount, setSelectedCount] = React.useState(0);
    const [stationFrom, setStationFrom] = React.useState('');
    const [stationTo, setStationTo] = React.useState('');
    const stationNames = stations.map(station => station.stationName);
    const handleClose = () => {
        props.close();
    }
    const handleShow = () => {
        props.open();
        props.getSeats(waggon.waggonId, waggon.trainName, waggon.routeId);
    }
    React.useEffect(() => {
        setPrice((waggon.waggonCoast + waggon.trainTypeCoast) * selectedCount);
    }, [loaded, selectedCount]);

    const handleSeatClick = (seat) => {
        if (selectedSeats.includes(seat)) {
            setSelectedSeats(selectedSeats.filter(item => item !== seat));
            setSelectedCount(selectedCount - 1);
        } else {
            setSelectedSeats([...selectedSeats, seat]);
            setSelectedCount(selectedCount + 1);
        }
    }
    const handleStationFromChange = (e) => {
        // find station from stations by name
        const station = stations.find(station => station.stationName === e.target.value);
        setStationFrom(station);
    }

    const handleStationToChange = (e) => {
        const station = stations.find(station => station.stationName === e.target.value);
        setStationTo(station);
    }


    const handleToCart = (e) => {
        e.preventDefault();
        const order = {
            selectedSeats,
            price,
            stationFrom: stationFrom.stationName,
            stationTo: stationTo.stationName,
            dateFrom: stationFrom.time,
            dateTo: stationTo.time,
        }
        props.addToCart(order);
        setSelectedSeats([]);
        setSelectedCount(0);
        handleClose();
    }// TODO: add validation and selects stations also add to orderrequest date from and datteTo

    return (
        <>
            <Button variant="primary" onClick={handleShow}>
                Choose
            </Button>
            <Modal show={isOpen}
                   onHide={handleClose}
                   aria-labelledby="contained-modal-title-vcenter"
                   centered
                   keyboard={false}>
                <Modal.Header closeButton>
                    <Modal.Title>Choose max 4 seats</Modal.Title>
                </Modal.Header>
                <ModalBody>
                    <SeatingChart selectedCount={selectedCount} handleSeatClick={handleSeatClick} seats={seats}/>
                </ModalBody>
                <ModalFooter>
                    <div className='schema-footer-container'>
                        <div style={{width: "300px", marginInlineEnd: "5px"}}>
                            From:
                            <Select list={stationNames} value={stationFrom.stationName}
                                    handleChange={handleStationFromChange}/>
                        </div>
                        <div style={{width: "300px"}}>
                            To:
                            <Select list={stationNames} value={stationTo.stationName}
                                    handleChange={handleStationToChange}/>
                        </div>
                        <div className='price-div'>Price: {price}</div>
                        <Button variant="primary" className='buy-button' onClick={handleToCart}>
                            Add to cart
                        </Button>
                    </div>
                </ModalFooter>
            </Modal>
        </>
    );
};

const mapStateToProps = state => {
    return {
        loaded: state.getTrainsReducer.seatsLoaded,
        seats: state.getTrainsReducer.seats,
        isOpen: state.popup.open,
    }
}
const actionCreators = {
    getSeats: trainActions.getSeats,
    close: popupActions.close,
    open: popupActions.open,
    addToCart: orderActions.addOrder,
}

export default connect(mapStateToProps, actionCreators)(WaggonSchemaPopup);