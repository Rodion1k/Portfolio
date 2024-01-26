import React from 'react';
import ListGroup from 'react-bootstrap/ListGroup';
import {connect} from "react-redux";
import TrainScheduleItem from "../../_components/TrainScheduleItem/TrainScheduleItem";
import {trainActions} from "../../_actions/train.actions";
import {appTypes} from "../../_constants/appTypes";
import PaginationToolBar from "../../_components/PaginationToolBar/PaginationToolBar";
import SearchingTrainComponent from "../../_components/SearchTrainComponent/SearchingTrainComponent";

const TrainSchedulePage = (props) => {
    const {flights, loaded} = props;
    const [flightsList, setFlightsList] = React.useState(flights);
    const [currentPage, setCurrentPage] = React.useState(1);
    const [maxPage, setMaxPage] = React.useState(1);
    const [isLoaded, setIsLoaded] = React.useState(false);
    const [stations, setStations] = React.useState([]);
    const [isGoodList, setIsGoodList] = React.useState(false);

    React.useEffect(() => {
        props.getFlights(appTypes.trainSchedule, props.currentPage);
    }, [props.currentPage]);

    React.useEffect(() => {
        if (loaded && flights.length > 0) {
            let key;
            const groupedFlights = flights.reduce((acc, flight) => {
                key = flight.trainName + flight.routeName;
                if (!acc[key]) {
                    acc[key] = [];
                }
                acc[key].push(flight);
                return acc;
            });
            // new array of objects where  groupedFlights first 7 elements new element
            const firstFlight = {
                trainName: groupedFlights.trainName,
                routeId: groupedFlights.routeId,
                routeName: groupedFlights.routeName,
                stationName: groupedFlights.stationName,
                positionNumber: groupedFlights.positionNumber,
                positionDate: groupedFlights.positionDate,
                positionTime: groupedFlights.positionTime,
            }
            groupedFlights[key].unshift(firstFlight);
            const groupedFlightsArray = Object.values(groupedFlights).slice(7);
            setFlightsList(groupedFlightsArray);
            setIsGoodList(true);
            setMaxPage(Math.ceil(groupedFlightsArray.length / 15));
            setIsLoaded(true);
            const stations = flights.map(flight => {
                return flight.stationName;
            });
            const uniqueStations = [...new Set(stations)];
            setStations(uniqueStations);
        } else {
            setFlightsList([]);
            setIsGoodList(true);
        }
    }, [loaded]);

    React.useEffect(() => {
        props.updateCurrentPage(currentPage);
    }, [currentPage]);
    const handleSearch = (searchData) => {
        const {from, to, date} = searchData;
        //compare date in format dd/mm/yyyy with date in format yyyy-mm-dd
        const dateArray = date.split('/');
        const convertedDate = dateArray[2] + '-' + dateArray[0] + '-' + dateArray[1];
        const groupedFlights = flights.reduce((acc, flight) => {
            const key = flight.trainName + flight.routeName;
            if (!acc[key]) {
                acc[key] = [];
            }
            acc[key].push(flight);
            return acc;
        });
        const groupedFlightsArray = Object.values(groupedFlights).slice(7);
        setMaxPage(Math.ceil(groupedFlightsArray.length / 15));
        console.log(groupedFlightsArray);
        console.log(convertedDate);
        const filteredFlights = groupedFlightsArray.filter(flight => {
            console.log(flight[0].positionDate);
            return flight[0].positionDate === convertedDate;
        });
        console.log(filteredFlights);
        const filteredFlightsByStationFrom = filteredFlights.filter(flight => {
            return flight.some(f => f.stationName === from);
        });
        console.log(filteredFlightsByStationFrom);

        const filteredFlightsByStationTo = filteredFlightsByStationFrom.filter(flight => {
            return flight.some(f => f.stationName === to);
        });

        setFlightsList(filteredFlightsByStationTo);
        console.log(filteredFlightsByStationTo);

    }
    return (
        <>
            {isGoodList ?
                <>
                    <SearchingTrainComponent onSearch={handleSearch} stations={stations}/>
                    <ListGroup>
                        {flightsList.map((flight, index) => {
                            return <TrainScheduleItem key={index} flight={flight}/>
                        })}
                    </ListGroup>
                    <PaginationToolBar currentPage={currentPage} maxPage={maxPage} setCurrentPage={setCurrentPage}/>
                </>
                : <div>Loading...</div>
            }
        </>
    );
};

const mapStateToProps = state => {
    return {
        flights: state.getTrainsReducer.flights,
        loaded: state.getTrainsReducer.flightsLoaded,
        currentPage: state.getTrainsReducer.currentPage,
        rowsCount: state.getTrainsReducer.rowsCount,
    }
}
const actionCreators = {
    getFlights: trainActions.getTrainTypes,
    getRowsCountFromTable: trainActions.getRowsCountFromTable,
    updateCurrentPage: trainActions.changeCurrentPage,
}
export default connect(mapStateToProps, actionCreators)(TrainSchedulePage);