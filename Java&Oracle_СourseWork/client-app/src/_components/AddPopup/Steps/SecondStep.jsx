import React from 'react';
import {Form, Image} from "react-bootstrap";
import {plus} from "../../../images";
import {connect} from 'react-redux';
import {popupActions} from "../../../_actions/popup.actions";
import AddWagonForm from "./AddWagonForm";
import {appTypes} from "../../../_constants/appTypes";
import AddStationForm from "./AddStationForm";

const SecondStep = (props) => {
    const {
        waggonForms,
        waggonTypes,
        update,
        waggonsCount,
        type
    } = props;

    const [waggonFormsState, setWaggonFormsState] = React.useState(waggonForms);
    const [stepType, setStepType] = React.useState();// в useEffect
    const parsedWaggonTypes =
        waggonTypes.map((item) => {
            return item.name;
        });

    const handleAddWagon = () => {
        update([...waggonForms, {id: waggonForms.length, number: '', type: '',}]);
    }

    const handleWaggonTypeChange = (event, id) => {
        const newWaggonForms = [...waggonForms];
        newWaggonForms[id].type = event.target.value;
        update(newWaggonForms);
    }

    const handleWaggonNumberChange = (event, id) => {
        const newWaggonForms = [...waggonForms];
        newWaggonForms[id].number = event.target.value;
        update(newWaggonForms);
    }

    const handleStationChange = (event, id) => {
        const newStationForms = [...waggonForms];
        let station = waggonTypes.find((item) => {
            return item.name === event.target.value;
        });
        newStationForms[id].station = station.id;
        update(newStationForms);
    }

    const handleDeleteWaggon = (id) => {
        const newWaggonForms = [...waggonForms];
        newWaggonForms.splice(id, 1);
        newWaggonForms.forEach((item, index) => {
            item.id = index;
        });
        update(newWaggonForms);
    }

    const handleDateChange = (date, id) => {
        const newWaggonForms = [...waggonForms];
        newWaggonForms[id].date = date;
        update(newWaggonForms);

    }


    const handleTimeChange = (value, id) => {
        const newWaggonForms = [...waggonForms];
        newWaggonForms[id].time = value;
        update(newWaggonForms);
    }

    React.useEffect(() => {
        setWaggonFormsState(waggonForms);
    }, [
        waggonForms, waggonsCount
    ]);

    const content = () => {
        switch (type) {
            case appTypes.train:
                return waggonFormsState.map((item, index) => {
                        return <AddWagonForm
                            key={index}
                            item={item}
                            waggonTypes={parsedWaggonTypes}
                            handleWaggonTypeChange={handleWaggonTypeChange}
                            handleWaggonNumberChange={handleWaggonNumberChange}
                            handleDeleteWaggon={handleDeleteWaggon}
                        />
                    }
                );
            case appTypes.movementRoute:
                return waggonFormsState.map((item, index) => {
                        return <AddStationForm
                            key={index}
                            item={item}
                            stations={parsedWaggonTypes}
                            handleStationChange={handleStationChange}
                            handleDateChange={handleDateChange}
                            handleTimeChange={handleTimeChange}
                        />
                    }
                );
        }
    }


    return (
        <Form>
            <Image className='plus_image' src={plus} onClick={handleAddWagon} rounded width='30px' height='30px'/>
            {content()}
        < /Form>
    );
};

const mapStateToProps = state => {
    return {
        waggonForms: state.popup.waggonForms,
        waggonsCount: state.popup.waggonsCount,
    }
}

const actionCreators = {
    update: popupActions.update,
}

export default connect(mapStateToProps, actionCreators)(SecondStep);