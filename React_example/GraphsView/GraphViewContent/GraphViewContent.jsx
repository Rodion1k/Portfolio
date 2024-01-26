import { useLazyQuery, useQuery } from '@apollo/client';
import clsx from 'clsx';
import GeneralSvg from 'components/GeneralSvg/GeneralSvg';
import Loader from 'components/Loader/Loader';
import { THEMES } from 'constants/general/themes';
import { graphZoomTypes } from 'constants/graphs/graphZoomTypes';
import { graphsDetailsItems } from 'constants/graphs/graphsDetails.items';
import {
    setGraphMagicTypes,
    setGraphZoomExtrimPoints,
    setIsFirstLoad,
    setUnselectedSerias,
} from 'features/graphs/graphsSlice';
import { graphQueries } from 'graphQL/graphs/graph.queries';
import { notificationQueries } from 'graphQL/notification/notification.queries';
import {
    convertGraphTimeStampToUTC,
    convertISO8601ToTimeStamp,
    convertTimeStampWithTimeZone,
    convertToTimestamp,
    formatDatePeriodForReportsGraphs,
} from 'helpers/general/dateHelper';
import { getThemeColorByVarName } from 'helpers/general/getThemeColorByVarName';
import { calculateAlertValues } from 'helpers/graphs/calculateAlertValues';
import { extractFilters, verifyParameterLineColor } from 'helpers/graphs/graphHelpers';
import {
    buildQueryVariables,
    calculateInterval,
    getIntervalsArray,
    getMaxDataPoints,
} from 'helpers/graphs/graphqlQueryBuilder';
import { handleItem } from 'helpers/graphs/handleItem';
import { resolveMetricOptions } from 'helpers/monitoring/metricOptionsResolver';
import { images } from 'images';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useIntl } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';
import {
    resolveLegendNameForMetric,
    resolveMeasurementUnitForMetric,
} from '../../../../../helpers/graphs/graphsResolvers';
import GeneralGraph from '../GeneralGraph/GeneralGraph';
import styles from './GraphViewContent.module.css';

/**
 * Renders the content of the graph view.
 * Contains the graph itself.
 * Contains the logic for fetching the data for the graph.
 *
 * @param {Object} props - The component props.
 * @param {Object} props.queryData - The query data. Contains the query and the variables.
 * @param {Object} props.additionalOptions - The additional options. Contains additional options from filter for the graph.
 * @param {string} props.selectedGraphType - The selected graph type (Template).
 * @param {Object} props.filterDates - The filter dates. Contains the date from and the date to.
 * @returns {JSX.Element} The rendered component.
 */
const GraphViewContent = ({ queryData, additionalOptions, selectedGraphType, filterDates }) => {
    const intl = useIntl();
    const dispatch = useDispatch();
    //#region useSelector variables
    const isFirstLoad = useSelector((state) => state.graphs.isFirstLoad);
    const graphZoomExtrimPoints = useSelector((state) => state.graphs.graphZoomExtrimPoints);
    const magicType = useSelector((state) => state.graphs.templatesMagicTypes)[`template${selectedGraphType}MagicType`];
    const unselectedSerias = useSelector((state) => state.graphs.unselectedSerias)[`template${selectedGraphType}`];
    //#endregion
    //#region useMemo caching variables
    const isReportTemplate = useMemo(
        () =>
            selectedGraphType === graphsDetailsItems.SCAN_NUMBER_PARAMS.id ||
            selectedGraphType === graphsDetailsItems.ALERTS_NUMBER_PARAMS.id,
        [selectedGraphType]
    );
    /** @returns Converted to timestamp filter dates without substructing system timezone*/
    const filterDatesTimeStamps = useMemo(() => {
        return {
            from: convertISO8601ToTimeStamp(filterDates.dateFrom),
            to: convertISO8601ToTimeStamp(filterDates.dateTo),
        };
    }, [filterDates]);
    /** @returns Converted to timestamp query dates with substructing system timezone*/
    const convertedWithTimeZoneQueryDataTimeStamps = useMemo(() => {
        return {
            from: convertTimeStampWithTimeZone(`${convertISO8601ToTimeStamp(queryData.variables.options.startTime)}`),
            to: convertTimeStampWithTimeZone(`${convertISO8601ToTimeStamp(queryData.variables.options.endTime)}`),
        };
    }, [queryData]);
    /** @returns Converted to timestamp filter dates with substructing system timezone*/
    const convertedWithTimeZoneFilterDatesTimeStamps = useMemo(() => {
        return {
            from: convertTimeStampWithTimeZone(`${convertISO8601ToTimeStamp(filterDates.dateFrom)}`),
            to: convertTimeStampWithTimeZone(`${convertISO8601ToTimeStamp(filterDates.dateTo)}`),
        };
    }, [filterDates]);
    //#endregion
    //#region useRef variables
    const currentInterval = useRef(null);
    const maxValuesMetrics = useRef([]);
    const currentExtrimPoint = useRef(convertedWithTimeZoneQueryDataTimeStamps);
    const reportsDates = useRef([]);
    const waitCursorRef = useRef(null);
    const currentCursorPos = useRef({ x: -999, y: -999 });
    //#endregion
    //#region useState variables
    const [seriesData, setSeriesData] = useState([]);
    const [isZoomLock, setIsZoomLock] = useState(false);
    const [isQuereing, setIsQuereing] = useState(false);
    const [zoom, setZoom] = useState({
        zoomStart: convertedWithTimeZoneQueryDataTimeStamps.from,
        zoomEnd: convertedWithTimeZoneQueryDataTimeStamps.to,
    });
    //#endregion
    //#region queries
    const { refetch, loading } = useQuery(queryData.query, {
        variables: queryData.variables,
    });
    const [getNotifications] = useLazyQuery(notificationQueries.GET_NOTIFICATIONS_FOR_GRAPHS);
    const [getMaxValue] = useLazyQuery(graphQueries.GET_MAX_DATE_HISTOGRAM_VALUE);
    //#endregion
    //#region callbacks
    const handleMagicTypeChange = useCallback(
        (e) => {
            dispatch(setGraphMagicTypes({ [`template${selectedGraphType}MagicType`]: e.currentType }));
        },
        [selectedGraphType]
    );

    const handleLegendSelectChanged = useCallback(
        (params) => {
            const selectName = params.name;
            let tempUnselectedSerias = [];
            if (unselectedSerias.find((item) => item === selectName)) {
                tempUnselectedSerias = unselectedSerias.filter((item) => item !== selectName);
            } else {
                tempUnselectedSerias = [...unselectedSerias, selectName];
            }
            dispatch(setUnselectedSerias({ [`template${selectedGraphType}`]: tempUnselectedSerias }));
        },
        [unselectedSerias]
    );
    //#endregion
    const fetchNotifications = async () => {
        let result = [];
        try {
            const notificationData = await getNotifications({
                variables: {
                    input: {
                        model: queryData.variables.filter0.model,
                        serialNumber: queryData.variables.filter0.sn,
                        dateFrom: queryData.variables.options.startTime,
                        dateTo: queryData.variables.options.endTime,
                        type: '',
                    },
                },
            });
            result = notificationData.data.notifications;
        } catch (e) {
            result = [];
        }
        return result;
    };

    const fetchData = async (variables) => {
        setIsQuereing(true);
        let notificationsPromise;
        if (additionalOptions?.showAlerts) notificationsPromise = fetchNotifications();
        refetch(variables).then(async (result) => {
            if (result?.data) {
                const isFilterData =
                    variables.options.startTime === filterDates.dateFrom &&
                    variables.options.endTime === filterDates.dateTo;
                const tempSeriasData = [];
                Object.values(result.data).forEach((element) => {
                    const notNullObject = {
                        index: 0,
                    };
                    const maxValueMetric = maxValuesMetrics.current.find(
                        (item) =>
                            item.metricName === element.metricName && item.measurementName === element.measurementName
                    );
                    const chartValues = element.samples.map((item, index) => {
                        return handleItem(item, element, index, notNullObject);
                    });
                    const extrimNullValues = [
                        [convertedWithTimeZoneFilterDatesTimeStamps.from, NaN],
                        [convertedWithTimeZoneFilterDatesTimeStamps.to, NaN],
                    ];
                    extrimNullValues.splice(1, 0, ...chartValues);
                    const parameterLine = {
                        name: intl.formatMessage({
                            id: resolveLegendNameForMetric({
                                metricName: element.metricName,
                                measurementName: element.measurementName,
                            }),
                        }),
                        data: extrimNullValues,
                        isNoData:
                            isFilterData && extrimNullValues.every((element) => Number.isNaN(parseFloat(element[1]))),
                        maxValue: maxValueMetric.maxValue,
                        measurementUnit: resolveMeasurementUnitForMetric(element.measurementName),
                        color: verifyParameterLineColor(
                            `${element.metricName}_${element.measurementName}`,
                            selectedGraphType
                        ),
                    };
                    tempSeriasData.push(parameterLine);
                });
                if (additionalOptions?.showAlerts) {
                    const notifications = await notificationsPromise;
                    const alertValues = calculateAlertValues(
                        tempSeriasData[0].data,
                        notifications,
                        currentExtrimPoint.current
                    );

                    const parameterLine = {
                        name: 'alerts',
                        data: alertValues.data,
                        events: alertValues.events,
                        eventsCount: alertValues.eventsCount,
                        measurementUnit: resolveMeasurementUnitForMetric(''),
                    };
                    tempSeriasData.push(parameterLine);
                }

                setSeriesData(tempSeriasData);
            }
            setIsQuereing(false);
        });
    };

    const fetchReportsData = async (variables, first = false) => {
        const result = await refetch(variables);

        if (result?.data) {
            const tempSeriasData = [];

            const processData = (axisName, reportType, dataExtractor, lineParameter) => {
                const values = [];
                const tempRepDates = [];

                result.data[reportType].forEach((item) => {
                    tempRepDates.push({
                        from: convertToTimestamp(item.dateFrom),
                        to: convertToTimestamp(item.dateTo),
                    });

                    values.push([formatDatePeriodForReportsGraphs(item.dateFrom, item.dateTo), dataExtractor(item)]);
                });

                if (first) {
                    reportsDates.current = tempRepDates;
                }

                const parameterLine = {
                    name: axisName,
                    data: values,
                    measurementUnit: 'n',
                    color: verifyParameterLineColor(lineParameter, selectedGraphType),
                };

                tempSeriasData.push(parameterLine);
            };

            if (result.data.graphsScansReport) {
                processData(
                    intl.formatMessage({
                        id: 'graph_legend_scanNumber',
                    }),
                    'graphsScansReport',
                    (item) => item.scanNumber,
                    'scanNumber'
                );
                processData(
                    intl.formatMessage({
                        id: 'graph_legend_aiThreadsNumber',
                    }),
                    'graphsScansReport',
                    (item) => item.aiThreads,
                    'aiThreads'
                );
            } else {
                processData(
                    intl.formatMessage({
                        id: 'graph_legend_alertsNumber',
                    }),
                    'graphsAlertsReport',
                    (item) => item.alertNumber,
                    'alertNumber'
                );
            }

            setSeriesData(tempSeriasData);
        }
    };

    const fetchGraphData = (filter, interval) => {
        if (isReportTemplate) {
            const newVariables = {
                filter: {
                    ...queryData.variables.filter,
                },
                options: {
                    ...queryData.variables.options,
                    startTime: filter.dateFrom,
                    endTime: filter.dateTo,
                },
            };
            fetchReportsData(newVariables);
        } else {
            const metricOptions = resolveMetricOptions(selectedGraphType);
            const newVariables = buildQueryVariables(filter, metricOptions, interval, metricOptions.length);
            fetchData(newVariables);
        }
    };

    /**
     * Handles the zoom out functionality.
     * Adjusts the zoom level and updates the graph data accordingly.
     *
     * @param {number} timestampFrom - The starting timestamp of the zoom range.
     * @param {number} timestampTo - The ending timestamp of the zoom range.
     * @param {string} interval - The interval of the graph data.
     * @returns {void}
     */
    const handleZoomOut = (timestampFrom, timestampTo, interval) => {
        if (currentExtrimPoint.current.to >= timestampTo && currentExtrimPoint.current.from <= timestampFrom) {
            return;
        }
        if (
            (currentExtrimPoint.current.from === filterDatesTimeStamps.from &&
                currentExtrimPoint.current.to >= timestampTo) ||
            (currentExtrimPoint.current.from <= timestampFrom &&
                currentExtrimPoint.current.to === filterDatesTimeStamps.to)
        ) {
            return;
        }

        const center = timestampFrom + (timestampTo - timestampFrom) / 2;
        const maxValues = getMaxDataPoints();
        const intervals = getIntervalsArray();
        const intervalIndex = intervals.findIndex((item) => item === interval);
        const newInterval = intervals[intervalIndex - 1];
        let newFrom = (2 * center - newInterval * maxValues * 1000) / 2;
        let newTo = 2 * center - (2 * center - newInterval * maxValues * 1000) / 2;
        const persents = (10 * (filterDatesTimeStamps.to - filterDatesTimeStamps.from)) / 100;

        if (filterDatesTimeStamps.from > convertISO8601ToTimeStamp(convertGraphTimeStampToUTC(newFrom, true))) {
            newFrom = filterDatesTimeStamps.from;
            const newValue = (newTo += persents);
            newTo =
                filterDatesTimeStamps.to < convertISO8601ToTimeStamp(convertGraphTimeStampToUTC(newValue, true))
                    ? filterDatesTimeStamps.to
                    : newValue;
        } else if (filterDatesTimeStamps.to < convertISO8601ToTimeStamp(convertGraphTimeStampToUTC(newTo, true))) {
            newTo = filterDatesTimeStamps.to;
            const newValue = (newFrom -= persents);
            newFrom =
                filterDatesTimeStamps.from > convertISO8601ToTimeStamp(convertGraphTimeStampToUTC(newFrom, true))
                    ? filterDatesTimeStamps.from
                    : newValue;
        }
        const filterWithISODates = {
            systemid: queryData.variables.filter0.model,
            serialNumber: queryData.variables.filter0.sn,
            dateFrom: convertGraphTimeStampToUTC(newFrom, newFrom !== filterDatesTimeStamps.from),
            dateTo: convertGraphTimeStampToUTC(newTo, newTo !== filterDatesTimeStamps.to),
        };
        currentExtrimPoint.current = { from: newFrom, to: newTo };
        currentInterval.current = interval;
        fetchGraphData(filterWithISODates, interval);
        return;
    };

    const zoomChanged = (startPeriodTime, endPeriodTime, mode) => {
        const timestampFrom = startPeriodTime;
        const timestampTo = endPeriodTime;
        if (isReportTemplate) {
            dispatch(
                setGraphZoomExtrimPoints({
                    [`template${selectedGraphType}Points`]: { from: timestampFrom, to: timestampTo },
                })
            );
            return;
        }
        const interval = calculateInterval(timestampFrom, timestampTo);
        dispatch(
            setGraphZoomExtrimPoints({
                [`template${selectedGraphType}Points`]: { from: timestampFrom, to: timestampTo },
            })
        );
        if (interval === currentInterval.current && mode === graphZoomTypes.in) return;

        if (mode === graphZoomTypes.out) {
            handleZoomOut(timestampFrom, timestampTo, interval);
            return;
        }
        const filterWithISODates = {
            systemid: queryData.variables.filter0.model,
            serialNumber: queryData.variables.filter0.sn,
            dateFrom: convertGraphTimeStampToUTC(timestampFrom, timestampFrom !== filterDatesTimeStamps.from),
            dateTo: convertGraphTimeStampToUTC(timestampTo, timestampTo !== filterDatesTimeStamps.to),
        };
        currentExtrimPoint.current = { from: timestampFrom, to: timestampTo };
        currentInterval.current = interval;
        fetchGraphData(filterWithISODates, interval);
    };

    useEffect(() => {
        const filtersArray = extractFilters(queryData.variables);
        const metricMeasurements = filtersArray.map((item) => {
            return {
                metricName: item.metricName,
                measurementName: item.measurementName,
            };
        });
        if (isReportTemplate) {
            maxValuesMetrics.current = [];
            fetchReportsData(queryData.variables, true);
        } else {
            let maxValues = [];
            getMaxValue({
                variables: {
                    filter: {
                        metricMeasurements: metricMeasurements,
                        model: filtersArray[0].model,
                        sn: filtersArray[0].sn,
                    },
                    options: {
                        startTime: filterDates.dateFrom,
                        endTime: filterDates.dateTo,
                    },
                },
            })
                .then(({ data }) => {
                    maxValues = [...data.dateHistogramMaxValues];
                })
                .catch(() => {
                    maxValues = metricMeasurements.map((item) => {
                        return {
                            ...item,
                            maxValue: 100,
                        };
                    });
                })
                .finally(() => {
                    maxValuesMetrics.current = maxValues;
                    fetchData(queryData.variables);
                });
        }

        currentExtrimPoint.current = convertedWithTimeZoneQueryDataTimeStamps;
        const start = graphZoomExtrimPoints[`template${selectedGraphType}Points`]
            ? graphZoomExtrimPoints[`template${selectedGraphType}Points`].from
            : convertedWithTimeZoneQueryDataTimeStamps.from;
        const end = graphZoomExtrimPoints[`template${selectedGraphType}Points`]
            ? graphZoomExtrimPoints[`template${selectedGraphType}Points`].to
            : convertedWithTimeZoneQueryDataTimeStamps.to;
        setZoom({
            zoomStart: start,
            zoomEnd: end,
        });
    }, [queryData]);

    useEffect(() => {
        if (isFirstLoad && !loading) dispatch(setIsFirstLoad(false));
    }, [loading]);

    useEffect(() => {
        const INTERVAL_POSITION = 5;
        let timerId;

        if (waitCursorRef && waitCursorRef.current) {
            timerId = setInterval(() => {
                waitCursorRef.current.style.transform = `translate(${currentCursorPos.current.x}px, ${currentCursorPos.current.y}px)`;
            }, INTERVAL_POSITION);
        }

        return () => {
            clearInterval(timerId);
        };
    }, [loading]);

    useEffect(() => {
        const handleMouseMove = (event) => {
            currentCursorPos.current = { x: event.clientX, y: event.clientY };
        };

        window.addEventListener('mousemove', handleMouseMove);

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
        };
    }, []);

    return (
        <>
            {loading && isFirstLoad ? (
                <Loader />
            ) : (
                <div
                    className={clsx(styles.container, {
                        [styles.nocursor]: isQuereing,
                    })}
                >
                    <GeneralGraph
                        withTypeSwitcher={isReportTemplate}
                        queryData={queryData}
                        zoom={zoom}
                        setZoom={setZoom}
                        seriesData={seriesData}
                        additionalOptions={additionalOptions}
                        zoomChanged={zoomChanged}
                        filterDatesTimeStamps={filterDatesTimeStamps}
                        isZoomLock={isZoomLock}
                        setIsZoomLock={setIsZoomLock}
                        isQuereing={isQuereing}
                        magicType={magicType}
                        unselectedSerias={unselectedSerias}
                        handleMagicTypeChange={handleMagicTypeChange}
                        handleLegendSelectChanged={handleLegendSelectChanged}
                    />
                    <div
                        className={clsx(styles.cursorDefault, {
                            [styles.cursorWaiting]: isQuereing,
                        })}
                        ref={waitCursorRef}
                    >
                        <GeneralSvg
                            svgContent={images.waitCursor}
                            strokeColor={
                                localStorage.getItem('theme') === THEMES.LIGHT.name
                                    ? getThemeColorByVarName('--accent')
                                    : getThemeColorByVarName('--white')
                            }
                        />
                    </div>
                </div>
            )}
        </>
    );
};

export default GraphViewContent;
