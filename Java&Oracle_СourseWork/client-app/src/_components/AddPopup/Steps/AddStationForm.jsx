import React from 'react';
import {Container, Row, Col} from "react-bootstrap";
import Select from "../../Select/Select";
import TimePicker from 'react-time-picker'
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import addStationFormStyle from './addFormStyles.module.css';


const AddStationForm = (props) => {
    const {
        handleDateChange,
        handleTimeChange,
        handleStationChange,
        stations,
        item,
    } = props;

    const [station, setStation] = React.useState(item.station ? item.station : "Select station");
    const [time, setTime] = React.useState(item.time ? item.time : "00:00");
    const onStationChange = (event) => {
        handleStationChange(event, item.id);
    }
    const onDateChange = (date) => {
        handleDateChange(date, item.id);
    }

    React.useEffect(() => {
        handleTimeChange(time, item.id);
    }, [time]);
    return (
        <Container className={addStationFormStyle.container}>
            <Row className={addStationFormStyle.row}>
                <Col>
                    <Select value={station} handleChange={onStationChange} list={stations}/>
                </Col>
            </Row>
            <Row className={addStationFormStyle.row}>
                <Col>
                    <DatePicker selected={item.date} onChange={onDateChange}/>
                </Col>
                <Col>
                    <TimePicker value={time} onChange={setTime}/>
                </Col>
            </Row>
        </Container>
    );
};

export default AddStationForm;