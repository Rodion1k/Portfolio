/**
 * This module contains helper functions for resolving legend names, measurement units and axis names for metrics.
 * @module graphsResolvers
 */

/**
 * Resolves the legend name for a given metric and measurement.
 * @param {Object} metricOptions - The metric and measurement options.
 * @param {string} metricOptions.metricName - The name of the metric.
 * @param {string} metricOptions.measurementName - The name of the measurement.
 * @returns {string} - The resolved localization id legend name as a React component.
 */

export const resolveLegendNameForMetric = (metricOptions) => {
    if (metricOptions.metricName === 'WinCpuPerf' && metricOptions.measurementName === 'PercentProcessorTime') {
        return 'graph_legend_cpuLoad';
    } else if (metricOptions.metricName === 'CpuTemp' && metricOptions.measurementName === 'Temperature') {
        return 'graph_legend_cpuTemperature';
    } else if (metricOptions.metricName === 'gpu' && metricOptions.measurementName === 'PercentGPUCoreLoad') {
        return 'graph_legend_gpuLoad';
    } else if (metricOptions.metricName === 'gpu' && metricOptions.measurementName === 'TemperatureHotSpot') {
        return 'graph_legend_gpuTemperature';
    } else if (metricOptions.metricName === 'WinDiskPerf' && metricOptions.measurementName === 'PercentFreeSpace') {
        return 'graph_legend_ssdSpace';
    } else if (metricOptions.metricName === 'GeneratorFPSensors' && metricOptions.measurementName === 'Temperature') {
        return 'graph_legend_generatorTemperature';
    } else if (metricOptions.metricName === 'GeneratorFPSensors' && metricOptions.measurementName === 'Current') {
        return 'graph_legend_generatorCurrent';
    } else if (metricOptions.metricName === 'GeneratorFPSensors' && metricOptions.measurementName === 'Voltage') {
        return 'graph_legend_generatorVoltage';
    } else if (
        metricOptions.metricName === 'WinMemPerf' &&
        metricOptions.measurementName === 'PercentCommittedBytesInUse'
    ) {
        return 'graph_legend_freeRam';
    } else if (metricOptions.metricName === 'ScanCount' && metricOptions.measurementName === 'Total') {
        return 'graph_legend_scanNumber';
    }
};

/**
 * Resolves the measurement unit for a given measurement name.
 * @param {string} measurementName - The name of the measurement.
 * @returns {string} - The resolved measurement unit.
 */

export const resolveMeasurementUnitForMetric = (measurementName) => {
    switch (measurementName) {
        case 'PercentProcessorTime':
        case 'PercentGPUCoreLoad':
        case 'PercentFreeSpace':
        case 'PercentCommittedBytesInUse':
            return '%';
        case 'Temperature':
        case 'TemperatureHotSpot':
            return '°C';
        case 'Current':
            return 'mkA';
        case 'Voltage':
            return 'kV';
        default:
            return '';
    }
};

/**
 * Resolves the axis name for a given measurement unit.
 * @param {string} measurementUnit - The measurement unit.
 * @returns {string} - The resolved localization id axis name.
 */

export const resolveAxisNameByMeasurementUnit = (measurementUnit) => {
    switch (measurementUnit) {
        case '%':
            return 'graph_axis_percent';
        case '°C':
            return 'graph_axis_temperature';
        case 'mkA':
            return 'graph_axis_current';
        case 'kV':
            return 'graph_axis_voltage';
        default:
            return 'graph_axis_number';
    }
};

export const resolveMarkPointsData = (additionalOptions, unselectedItem) => {
    const data = [];
    if (unselectedItem) return data;
    if (additionalOptions.showExtremums) data.push({ type: 'max', name: 'Max' }, { type: 'min', name: 'Min' });
    return data;
};
