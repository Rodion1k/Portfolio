import React from 'react';
import {orderActions} from "../../_actions/order.actions";
import {connect} from "react-redux";
import CardItem from "../CardPage/CardItem/CardItem";

const AccountPage = (props) => {
    const {
        orders,
        loaded,
        deleted,
    } = props;
    const [ordersList, setOrdersList] = React.useState([]);
    const [isGoodList, setIsGoodList] = React.useState(false);
    React.useEffect(() => {
        props.getOrders('1');
    }, [deleted]);
    React.useEffect(() => {
        // join orders by orderId
        if (loaded && orders.length > 0) {
            let newOrders = orders.reduce((acc, order) => {
                const key = order.orderId;
                if (!acc[key]) {
                    acc[key] = [];
                }
                acc[key].push(order);
                return acc;
            });
            console.log(newOrders);
            const firstOrder = {
                orderId: newOrders.orderId,
                price: newOrders.price,
                routeName: newOrders.routeName,
                seatNumber: newOrders.seatNumber,
                trainName: newOrders.trainName,
                trainType: newOrders.trainType,
                userId: newOrders.userId,
                userName: newOrders.userName,
                waggonName: newOrders.waggonName,
                waggonType: newOrders.waggonType,
                status: newOrders.status,
                stationFrom: newOrders.stationFrom,
                stationTo: newOrders.stationTo,
                dateFrom: newOrders.dateFrom,
                dateTo: newOrders.dateTo,
            }
            const newOrdersArray = Object.values(newOrders).slice(15);
            newOrdersArray[0].unshift(firstOrder);
            setOrdersList(newOrdersArray);
            setIsGoodList(true);
        } else {
            setIsGoodList(true);
            setOrdersList([]);
        }

    }, [loaded])
    const handleDeleteOrder = (orderId) => {
        props.deleteOrder(orderId);
    }
    return (
        <>
            {isGoodList ?
                <div className='card-page-container-orders'>
                    <>
                        {ordersList.map((order, index) => {
                            return <div key={index}>
                                <CardItem type='acc' deleteOrder={handleDeleteOrder} order={order}/>
                            </div>
                        })}
                        {ordersList.length === 0 &&
                            <div className='card-page-div-alert'>Is empty</div>
                        }
                    </>
                </div>
                :
                <div>Loading...</div>
            }
        </>
    );
};

const mapStateToProps = state => {
    return {
        orders: state.orderReducer.confirmedOrders,
        loaded: state.orderReducer.loaded,
        deleted: state.orderReducer.deleted,
    }
}
const actionCreators = {
    getOrders: orderActions.getUserOrdersConfirmed,
    deleteOrder: orderActions.deleteOrder,
}
export default connect(mapStateToProps, actionCreators)(AccountPage);