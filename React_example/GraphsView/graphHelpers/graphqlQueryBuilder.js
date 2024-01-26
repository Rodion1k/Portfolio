import { gql } from '@apollo/client';

/**
 * Builds the query fields for a given index.
 * @param {number} index - The index of the query field.
 * @returns {string} - The query field string.
 */
const buildPartQueryFields = (index) => {
    return `$filter${index}: MeasurementFilters!,`;
};

/**
 * Builds the date histogram for a given index.
 * @param {number} index - The index of the date histogram.
 * @returns {string} - The date histogram string.
 */
const buildPartDateHistogram = (index) => {
    const dateHistogramFields = `
        metricName
        measurementName
        samples {
            timestamp
            value
        }
    `;

    return `dateHistogram_${index}: dateHistogram (filter: $filter${index},options:$options){${dateHistogramFields}}`;
};

/**
 * Builds the query body for the given number of parameters.
 * @param {number} paramsCount - The number of parameters.
 * @returns {Object} - The GraphQL query object.
 */
const buildQueryBody = (paramsCount) => {
    let query = 'query paramsGraphQuery(';
    let queryFields = '';
    let dateHistograms = '';
    for (let i = 0; i < paramsCount; i++) {
        queryFields += buildPartQueryFields(i);
        dateHistograms += buildPartDateHistogram(i);
    }
    query += `${queryFields} $options: MeasurementOptions!){${dateHistograms}}`;

    return gql(query);
};

/**
 * Builds the query variables for a given index.
 * @param {string} systemid - The system ID.
 * @param {string} serialNumber - The serial number.
 * @param {string} metricName - The metric name.
 * @param {string} measurementName - The measurement name.
 * @param {number} index - The index of the query variable.
 * @returns {Object} - The query variable object.
 */
const buildQueryVariablesPart = (systemid, serialNumber, metricName, measurementName, instance, index) => {
    return {
        [`filter${index}`]: {
            model: systemid,
            sn: serialNumber,
            metricName: metricName,
            measurementName: measurementName,
            instance: instance,
        },
    };
};

/**
 * Builds the query variables for the given filter, metric options, and number of parameters.
 * @param {Object} filter - The filter object.
 * @param {Array} metricOptions - The metric options array.
 * @param {number} paramsCount - The number of parameters.
 * @returns {Object} - The query variables object.
 */
export const buildQueryVariables = (filter, metricOptions, interval, paramsCount) => {
    const variables = {};
    const startTime = filter.dateFrom;
    const endTime = filter.dateTo;

    for (let i = 0; i < paramsCount; i++) {
        const queryVariablesPart = buildQueryVariablesPart(
            filter.systemid,
            filter.serialNumber,
            metricOptions[i].metricName,
            metricOptions[i].measurementName,
            metricOptions[i].instance,
            i
        );
        variables[`filter${i}`] = queryVariablesPart[`filter${i}`];
    }
    variables.options = {
        startTime,
        aggs: 'avg',
        interval: `${interval.toString()}s`,
        endTime,
    };

    return variables;
};

function findClosestValue(arr, target) {
    const filteredArr = arr.filter((value) => value <= target);
    if (filteredArr.length === 0) {
        return 1;
    }
    return Math.max(...filteredArr);
}

const intervals = [86400, 43200, 21600, 10800, 7200, 3600, 1800, 1200, 900, 600, 300, 120, 60, 30, 20, 15, 10, 5, 2, 1];
const maxDataPoints = 1296;

export const getIntervalsArray = () => {
    return intervals;
};

export const getMaxDataPoints = () => {
    return maxDataPoints;
};

export const calculateInterval = (from, to) => {
    const delta = (to - from) / (maxDataPoints * 1000);
    const closestValue = findClosestValue(intervals, delta);
    if (delta < 1) return 1;
    return closestValue;
};

/**
 * Builds the metric query data for graphs.
 * @param {Object} filter - The filter object.
 * @param {Array} metricOptions - The metric options array.
 * @returns {Object} - The query data object.
 */
export const buildMetricQueryDataForGraphs = (filter, metricOptions, interval) => {
    const queryBody = buildQueryBody(metricOptions.length);
    const variables = buildQueryVariables(filter, metricOptions, interval, metricOptions.length);

    return {
        query: queryBody,
        variables: variables,
    };
};
