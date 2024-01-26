import React from 'react';
import {Button, ListGroupItem} from "react-bootstrap";
import './trainOrderItem.css';
import WaggonSchemaPopup from "../WaggonSchemaPopup/WaggonSchemaPopup";

const TrainOrderItem = (props) => {
    const {
        waggon,
        stations
    } = props;

    return (
        <ListGroupItem>
            <div className='train-order-item-main'>
                <div className='train-order-item-container'>
                    <div className='train-order-item-firstColumn'>
                        <div>
                            Waggon name: {waggon.waggonName}
                        </div>
                        <div>
                            Waggon type: {waggon.waggonType}
                        </div>
                    </div>
                    <div>
                        Waggon cost: {waggon.waggonCoast}
                    </div>
                    <WaggonSchemaPopup stations={stations} waggon={waggon}/>
                </div>
            </div>
        </ListGroupItem>
    );
};

export default TrainOrderItem;