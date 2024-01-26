import React from 'react';
import {Form} from "react-bootstrap";

const Select = (props) => {
    const {
        value,
        handleChange,
        list,
    } = props;
    return (
        <Form.Select aria-label="Default select example" onChange={handleChange}>
            <option>{value}</option>
            {
                list.map((item, index) => {
                    return (
                        <option key={index}>{item}</option>
                    )
                })
            }
        </Form.Select>
    );
};

export default Select;