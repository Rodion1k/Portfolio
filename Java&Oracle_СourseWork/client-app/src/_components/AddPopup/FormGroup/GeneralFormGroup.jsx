import React from 'react';
import {Form} from "react-bootstrap";

const GeneralFormGroup = (props) => {
    const {
        label,
        placeholder,
        type,
        handleChange
    } = props;
    return (
        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
            <Form.Label>{label}</Form.Label>
            <Form.Control// TODO add validation and styles
                type={type}
                placeholder={placeholder}
                autoFocus
                disabled={label === 'Size'}
                value={label === 'Size' ? 60 : props.value}
                onChange={handleChange}
            />
        </Form.Group>
    );
};

export default GeneralFormGroup;