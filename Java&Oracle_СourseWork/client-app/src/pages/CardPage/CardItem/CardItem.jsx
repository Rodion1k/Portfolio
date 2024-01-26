import React from 'react';
import {Button, Card} from "react-bootstrap";
import './CardItem.css';

const CardItem = (props) => {
    const {
        deleteOrder,
        order,
        buyOrder,
        type
    } = props;

    const handleDelete = (e) => {
        e.preventDefault();
        deleteOrder(order[0].orderId);
    }
    const handleBuy = (e) => {
        e.preventDefault();
        buyOrder(order[0].orderId);
    }
    const dateFrom= new Date(order[0].dateFrom).toLocaleString();
    const dateTo= new Date(order[0].dateTo).toLocaleString();
    console.log(dateFrom);
    return (
        <Card style={{width: '18rem', marginTop: '10px'}}>
            <Card.Body>
                <Card.Title>{order[0].routeName}</Card.Title>
                <div>Station from: {order[0].stationFrom}</div>
                <div>Station to: {order[0].stationTo}</div>
                <div>Date from: {dateFrom}</div>
                <div>Date to: {dateTo}</div>
                <div>Train name: {order[0].trainName}</div>
                <div>Train type: {order[0].trainType}</div>
                <div>Waggon name: {order[0].waggonName}</div>
                <div>Waggon type: {order[0].waggonType}</div>
                <div className='card-item-container-seats'>Seats:
                    {order.map((seat, index) => {
                        return <div key={index}>{seat.seatNumber}</div>
                    })
                    }
                </div>
                <div>Price: {order[0].price}</div>
            </Card.Body>
            <Card.Footer>
                <div className='card-item-container-footer'>
                    <Button variant="primary" onClick={handleDelete}>Delete</Button>
                    {type === 'card' &&
                        <Button variant="primary" onClick={handleBuy}>Buy</Button>
                    }
                </div>
            </Card.Footer>
        </Card>
    );
};

export default CardItem;