import React from 'react';
import {Container, Row, Col} from "react-bootstrap";
import DatePicker from "react-datepicker";

const DateTimePicker = (props) => {
    const {
        dateFrom,
        dateTo,
        onDateFromChange,
        onDateToChange,
    } = props;
    return (
        <Container style={{alignSelf: "center"}}>
            <Row>
                <Col>
                    From date:
                    <DatePicker selected={dateFrom} onChange={onDateFromChange}/>
                </Col>
                <Col>
                    To date:
                    <DatePicker selected={dateTo} onChange={onDateToChange}/>
                </Col>
            </Row>
        </Container>
    );
};

export default DateTimePicker;