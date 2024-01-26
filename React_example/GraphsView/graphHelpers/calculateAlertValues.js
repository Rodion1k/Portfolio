import { convertTimeStampWithTimeZone } from 'helpers/general/dateHelper';

/**
 * Calculates alert values based on chart values, notifications, and current extreme point.
 * @param {Array<Array<number>>} chartValues - The chart values.
 * @param {Array<Object>} notifications - The notifications.
 * @param {Object} currentExtrimPoint - The current graph extreme point.
 * @returns {Object} - The calculated alert values.
 * @example
 * // returns {
 * //   data: [[1624521600000, 95], [1624521600000, 95]],
 * //   events: [
 * //     [{ name: 'event1', value: 1624521600000 }],
 * //     [{ name: 'event2', value: 1624521600000 }],
 * //   ],
 * //   eventsCount: [1, 1],
 */
export const calculateAlertValues = (chartValues, notifications, currentExtrimPoint) => {
    const alertValues = {};
    const currentExtrPoint = currentExtrimPoint;
    const difExtrPointsTime = ((currentExtrPoint.to - currentExtrPoint.from) / 100) * 1.2;
    for (const notification of notifications) {
        const valueN = convertTimeStampWithTimeZone(notification.timestamp);
        const name = notification.event;
        let closestValueC = null;
        for (const chart of chartValues) {
            const valueC = chart[0];
            if (closestValueC === null || Math.abs(valueN - valueC) < Math.abs(valueN - closestValueC)) {
                closestValueC = valueC;
            }
        }
        if (alertValues[closestValueC]) {
            alertValues[closestValueC].events.push({ name: name, value: closestValueC });
        } else {
            alertValues[closestValueC] = {
                data: [closestValueC, 95],
                events: [{ name: name, value: closestValueC }],
            };
        }

        const valuesArray = Object.values(alertValues);
        for (let i = 0; i < valuesArray.length - 1; i++) {
            if (Math.abs(valuesArray[i].data[0] - valuesArray[i + 1].data[0]) <= difExtrPointsTime) {
                valuesArray[i].events = valuesArray[i].events.concat(valuesArray[i + 1].events);
                delete alertValues[valuesArray[i + 1].data[0]];
            }
        }
    }

    const resultValues = Object.values(alertValues).map((item) => {
        return {
            ...item,
            eventsCount: item.events.length,
        };
    });

    const events = resultValues.map((item) => item.events);

    const sortedEvents = events.map((item) => {
        return item.sort((a, b) => {
            return a.value - b.value;
        });
    });

    return {
        data: resultValues.map((item) => item.data),
        events: sortedEvents,
        eventsCount: resultValues.map((item) => item.eventsCount),
    };
};
