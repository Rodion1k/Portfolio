import React from 'react';
import {Button, Modal, ModalBody, Form} from 'react-bootstrap';
import {connect} from 'react-redux';
import {alertActions} from "../../_actions/alert.actions";
import {trainActions} from "../../_actions/train.actions";
import FirstStep from "./Steps/FirstStep";
import SecondStep from "./Steps/SecondStep";
import {appTypes} from "../../_constants/appTypes";
import {popupActions} from "../../_actions/popup.actions";
import {fillFieldsValidator} from "../../_helpers/fildsFillValidation";

const AddPopup = (props) => {
    const [show, setShow] = React.useState(false);
    const [currentStep, setCurrentStep] = React.useState(0);
    let title = '';
    let maxStep = 0;
    const [objectState, setObjectState] = React.useState(
        props.objectState
    );
    React.useEffect(() => {
        if (props.added) {
            setShow(false);
        }
    }, [props.added]);
    React.useEffect(() => {
        setObjectState(props.objectState);
    }, [props.isOpen]);

    const handleClose = () => {
        props.close();
        setCurrentStep(0);
        setShow(false);
    }
    const handleShow = () => {
        props.open();
        setShow(true);
    }
    const handleNameChange = (e) => {
        if (props.alert.type) {
            props.clearAlerts();
        }
        setObjectState({...objectState, name: e.target.value});
        console.log(objectState);
    }
    const handlePriceChange = (e) => {
        if (props.alert.type) {
            props.clearAlerts();
        }
        setObjectState({...objectState, price: e.target.value});
    }

    const handleSizeChange = (e) => {
        if (props.alert.type) {
            props.clearAlerts();
        }
        setObjectState({...objectState, size: '60'});
    }

    const handleTypeChange = (e) => {
        if (props.alert.type) {
            props.clearAlerts();
        }
        if (e.target.value === 'Select train type') return;
        setObjectState({...objectState, type: e.target.value});
    }

    const handleRouteChange = (route) => {
        if (props.alert.type) {
            props.clearAlerts();
        }
        setObjectState({...objectState, route: route.routeId});
    }

    const handleTrainChange = (train) => {
        if (props.alert.type) {
            props.clearAlerts();
        }
        setObjectState({...objectState, train: train.id});
    }

    const handleAdd = (e) => {
        e.preventDefault();
        if (props.alert.type) {
            props.clearAlerts();
        }
        if (fillFieldsValidator.addPopupValidate(objectState, props.waggonForms, props.type)) {
            props.addTrainType(objectState, props.type, props.waggonForms);
        } else {
            props.error("wrong input");
        }

    }

    React.useEffect(() => {
        if (props.alert.type === 'alert-success') {
            props.close();
            setCurrentStep(0);
        }
    }, [props.alert.type]);

    const handleNext = (e) => {// TODO validation
        e.preventDefault();
        if (fillFieldsValidator.nextPopupValidate(objectState, props.waggonForms, props.type)) {
            props.nextStep(objectState);
            setCurrentStep(currentStep + 1);
        } else {
            props.error("wrong input");
        }
    }
    const handleBack = (e) => {
        e.preventDefault();
        props.prevStep(objectState);

        setCurrentStep(currentStep - 1);
    }
    switch (props.type) {
        case appTypes.trainType:
            title = 'Add train type';
            break;
        case appTypes.train:
            maxStep = 1;
            title = 'Add train';
            break;
        case appTypes.movementRoute:
            maxStep = 1;
            title = 'Add movement route';
            break;
        case appTypes.waggonType:
            title = 'Add waggon type';
            break;
        case appTypes.station:
            title = 'Add station';
            break;
        case appTypes.trainFlights:
            title = 'Add train flight';
            break;
    }

    return (
        <>
            <Button variant="primary" onClick={handleShow}>
                {title}
            </Button>
            <Modal show={show}
                   onHide={handleClose}
                   backdrop="static"
                   aria-labelledby="contained-modal-title-vcenter"
                   centered
                   keyboard={false}>
                <Modal.Header closeButton>
                    <Modal.Title>{title}</Modal.Title>
                </Modal.Header>
                <ModalBody>
                    {currentStep === 0 &&
                        <FirstStep
                            type={props.type}
                            handleTypeChange={handleTypeChange}
                            handleSizeChange={handleSizeChange}
                            handleNameChange={handleNameChange}
                            handlePriceChange={handlePriceChange}
                            handleRouteChange={handleRouteChange}
                            handleTrainChange={handleTrainChange}
                            objectState={objectState}
                        />
                    }
                    {
                        currentStep === 1 &&
                        <SecondStep
                            type={props.type}
                            waggonTypes={props.waggonTypes}
                        />
                    }
                    {
                        props.alert.type === 'alert-danger' &&
                        <div className="alert alert-danger" role="alert">
                            {props.alert.message}
                        </div>
                    }
                </ModalBody>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                    {currentStep !== 0 &&
                        <Button variant="primary" onClick={handleBack}>Back</Button>
                    }
                    {currentStep !== maxStep &&
                        <Button variant="primary" onClick={handleNext}>Next</Button>
                    }
                    {currentStep === maxStep &&
                        <Button variant="primary" onClick={handleAdd}>Add</Button>
                    }
                </Modal.Footer>
            </Modal>
        </>
    );
};
const mapStateToProps = state => {
    return {
        adding: state.addTrainTypeReducer.adding,
        added: state.addTrainTypeReducer.added,
        //payload: state.getTrainsReducer.payload,
        waggonTypes: state.getTrainsReducer.waggonTypes,
        alert: state.alert,
        isOpen: state.popup.open,
        objectState: state.popup.objectState,
        waggonForms: state.popup.waggonForms,
    }
}
const actionCreators = {
    addTrainType: trainActions.addTrainType,
    clearAlerts: alertActions.clear,
    error: alertActions.error,
    nextStep: popupActions.nextStep,
    prevStep: popupActions.prevStep,
    close: popupActions.close,
    open: popupActions.open
}
export default connect(mapStateToProps, actionCreators)(AddPopup);