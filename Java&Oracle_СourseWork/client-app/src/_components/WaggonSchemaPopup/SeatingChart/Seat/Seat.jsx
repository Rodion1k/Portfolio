import React from 'react';
import './seat.css';

const Seat = (props) => {
    const {
        seat,
        handleSeatClick,
        selectedCount,
    } = props;
    const [seatClass, setSeatClass] = React.useState('seat-container');
    const [checked, setChecked] = React.useState(false);
    const handleChooseSeat = () => {
        if (selectedCount < 4) {
            setChecked(!checked);
            handleSeatClick(seat);
        } else {
            if (checked) {
                setChecked(!checked);
                handleSeatClick(seat);
            }
        }
    }
    React.useEffect(() => {
        if (checked) {
            setSeatClass('seat-container pre-selected');
        } else if (seat.isBought === '0') {
            setSeatClass('seat-container available');
        } else {
            setSeatClass('seat-container not-available');
        }
    });

    return (
        <div className={seatClass}
             onClick={handleChooseSeat}>
            <div className='seat-label'>{seat.seatNumber}</div>
        </div>
    );
};

export default Seat;