import React from 'react';
import './textInput.css';
const TextInput = (props) => {
    const {
        stations,
        placeholder,
        onTextChange,
        value,
    } = props;
    return (
        <div>
            <input className='text-input-style' value={value} type={'text'} onChange={onTextChange} placeholder={placeholder} list='data'/>
            <datalist id='data'>
                {stations.map((item, index) => {
                    return <option key={index} value={item} label={item}/>
                })}
            < /datalist>
        </div>
    );
};

export default TextInput;