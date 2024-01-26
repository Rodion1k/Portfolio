import { metricDataTypes } from 'constants/monitoring/metricDataTypes';
import { convertTimeStampWithTimeZone } from 'helpers/general/dateHelper';
import { metricDataFormatter } from 'helpers/monitoring/metricDataFormatter';

/**
 * Handles an item in the graph.
 * If the item is null, the function checks if the previous item is not null.
 * If the difference between the timestamps of the current and previous items is less than 20 seconds,
 * the function returns the previous item value.
 *
 * @param {Object} item - The item to handle.
 * @param {Object} element - The element associated with the item.
 * @param {number} index - The index of the item.
 * @param {Object} notNullObject - An object containing the index of the not-null item.
 * @returns {Array} - An array containing the converted timestamp and the formatted metric value.
 */
export const handleItem = (item, element, index, notNullObject) => {
    if (item.value === null) {
        if (parseInt(item.timestamp) / 1000 - parseInt(element.samples[notNullObject.index]?.timestamp) / 1000 <= 20) {
            return [
                convertTimeStampWithTimeZone(item.timestamp),
                metricDataFormatter(
                    element.samples[notNullObject.index].value,
                    metricDataTypes.DIGITAL,
                    element.measurementName
                ).value,
            ];
        }
    }
    notNullObject.index = index;
    return [
        convertTimeStampWithTimeZone(item.timestamp),
        metricDataFormatter(item.value, metricDataTypes.DIGITAL, element.measurementName).value,
    ];
};
