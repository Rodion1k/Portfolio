import React from 'react';
import {Form} from "react-bootstrap";
import GeneralFormGroup from "../FormGroup/GeneralFormGroup";
import {appTypes} from "../../../_constants/appTypes";
import Select from "../../Select/Select";
import {connect} from "react-redux";
import {trainActions} from "../../../_actions/train.actions";

const FirstStep = (props) => {
    const {
        handleNameChange,
        handlePriceChange,
        handleTypeChange,
        handleSizeChange,
        handleRouteChange,
        handleTrainChange,
        type,
        trainTypes,
        objectState,
        waggonTypes,
        payload,
    } = props;
    const parseTrainTypes =
        trainTypes.map((item) => {
            return item.trainType;
        });

    const parsedRoutes =
        waggonTypes.map((item) => {
            return item.routeName;
        });
    const parsedTrains =
        trainTypes.map((item) => {
            return item.name;
        });

    const uniqueRoutes = () => {
        let unique = {};
        parsedRoutes.forEach(function (i) {
            if (!unique[i]) {
                unique[i] = true;
            }
        });
        return Object.keys(unique);
    }
    const onRouteChange = (e) => {
        const route = waggonTypes.find((item) => {
            return item.routeName === e.target.value;
        });
       handleRouteChange(route);
    }
    const onTrainChange = (e) => {
        const train = trainTypes.find((item) => {
            return item.name === e.target.value;
        });
        handleTrainChange(train);
    }


    React.useEffect(() => {
        if (type === appTypes.train)
            props.getTrainTypes(appTypes.trainType);
        if (type === appTypes.trainFlights) {
            props.getTrainTypes(appTypes.train_routes);
        }

    }, [props.isOpen]);

    return (
        <Form>
            {type !== appTypes.trainFlights &&
                <GeneralFormGroup
                    label="Name"
                    placeholder="name"
                    type="text"
                    value={objectState.name}
                    handleChange={handleNameChange}
                />
            }
            {type === appTypes.trainFlights &&
                <>
                    <Select value={objectState.train ? objectState.train : 'Select train'}
                            handleChange={onTrainChange}
                            list={parsedTrains}
                    />
                    <Select value={objectState.route ? objectState.route : 'Select route'}
                            handleChange={onRouteChange}
                            list={uniqueRoutes()}
                    />
                </>
            }
            {
                type === appTypes.train &&
                <Select value={objectState.type ? objectState.type : 'Select train type'}
                        handleChange={handleTypeChange}
                        list={parseTrainTypes}
                />
            }

            {
                (type === appTypes.trainType ||
                    type === appTypes.waggonType) &&
                <GeneralFormGroup
                    label="Price"
                    placeholder="price"
                    value={objectState.price}
                    type="text"
                    handleChange={handlePriceChange}
                />

            }
            {
                type === appTypes.waggonType &&
                <GeneralFormGroup
                    label="Size"
                    placeholder="size"
                    value={objectState.size}
                    type="text"
                    handleChange={handleSizeChange}
                />
            }

        </Form>
    );
};

const mapStateToProps = state => {
    return {
        trainTypes: state.getTrainsReducer.trainTypes,
        waggonTypes: state.getTrainsReducer.waggonTypes,
        isOpen: state.popup.isOpen,
        payload: state.getTrainsReducer.payload,
    }
}
const actionCreators = {
    getTrainTypes: trainActions.getTrainTypes,
}
export default connect(mapStateToProps, actionCreators)(FirstStep);