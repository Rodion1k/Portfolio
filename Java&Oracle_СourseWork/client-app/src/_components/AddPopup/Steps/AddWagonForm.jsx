import React from 'react';
import {Form, Container, Row, Col, Image} from "react-bootstrap";
import {krestik} from "../../../images";
import Select from "../../Select/Select";
import addWaggonFormStyle from './addFormStyles.module.css';

const AddWagonForm = (props) => {
    const {
        waggonTypes,
        handleWaggonTypeChange,
        handleWaggonNumberChange,
        item,
    } = props;
    const [waggonType, setWaggonType] = React.useState(item.type ? item.type : "Select waggon type");
    const handleTypeChange = (event) => {
        handleWaggonTypeChange(event, item.id);
    }
    const handleNumberChange = (event) => {
        handleWaggonNumberChange(event, item.id);
    }
    //
    return (
        <Container className={addWaggonFormStyle.waggonContainer}>
            <Row className={addWaggonFormStyle.row}>
                <Col>
                    <Form.Control// TODO add validation and styles
                        placeholder='wagon name'
                        autoFocus
                        onChange={handleNumberChange}
                        value={item.number}
                    />
                </Col>
                <Col >
                    <Select value={waggonType} handleChange={handleTypeChange} list={waggonTypes}/>
                </Col>
                <Col >
                    <Image className='krestik_image' src={krestik} rounded width='30px' height='30px'/>
                </Col>
            </Row>
        </Container>
    );
};

export default AddWagonForm;