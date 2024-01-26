import React from 'react';
import TextInput from "./TextInput/TextInput";
import {Button} from "react-bootstrap";
import DatePicker from "react-datepicker";
import './searchingTrainComponent.css';

const SearchingTrainComponent = (props) => {
    const {
        stations,
        onSearch,
    } = props;
    const [fromStation, setFromStation] = React.useState('');
    const [toStation, setToStation] = React.useState('');
    const [startDate, setStartDate] = React.useState(new Date());
    const onFromStationChange = (event) => {
        setFromStation(event.target.value);
    }
    const onToStationChange = (event) => {
        setToStation(event.target.value);
    }
    const onSearchClick = () => {
        const searchData = {
            from: fromStation,
            to: toStation,
            date: startDate.toLocaleDateString(),
        }
        onSearch(searchData);
    }
    return (
        <div className='searchingComponent'>
            <TextInput placeholder='from' value={fromStation} onTextChange={onFromStationChange} stations={stations}/>
            <TextInput placeholder='to' value={toStation} onTextChange={onToStationChange} stations={stations}/>
            <div className='datePicker-container'>
                <DatePicker selected={startDate} onChange={(date) => setStartDate(date)}/>
            </div>
            <Button onClick={onSearchClick} className='search-button'>Search</Button>
        </div>
    );
};

export default SearchingTrainComponent;