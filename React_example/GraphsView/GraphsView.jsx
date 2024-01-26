import { switcherButtonItems } from 'constants/general/switcherButton.items';
import { graphsDetailsItems } from 'constants/graphs/graphsDetails.items';
import { INTERVAL_GROUPING } from 'constants/reports/reports';
import {
    clearGraphMagicTypes,
    clearGraphZoomExtrimPoints,
    clearUnselectedSerias,
    selectFilterGrouping,
    setAppliedFilterGrouping,
    setAppliedGraphsFilter,
    setGraphMagicTypes,
    setIsFirstLoad,
    setTempGraphsFilter,
} from 'features/graphs/graphsSlice';
import { reportsQueries } from 'graphQL/reports/reports.queries';
import { convertGraphTimeStampToUTC } from 'helpers/general/dateHelper';
import { useCallback, useEffect, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';
import appStyles from '../../../../App/app.module.css';
import { buildMetricQueryDataForGraphs, calculateInterval } from '../../../../helpers/graphs/graphqlQueryBuilder';
import { resolveMetricOptions } from '../../../../helpers/monitoring/metricOptionsResolver';
import GraphViewContent from './GraphViewContent/GraphViewContent';
import GraphsSideBar from './GraphsSideBar/GraphsSideBar';
import styles from './GraphsView.module.css';

/**
 * Renders the GraphsView component.
 * This component displays a sidebar for selecting filters and a graph container for displaying the graph based on the selected filters.
 * Component build query data for graph based on selected graph type and applied filters.
 * @returns {JSX.Element} The rendered GraphsView component.
 */
const GraphsView = () => {
    const dispatch = useDispatch();
    //#region useSelector variables
    const selectedGraphType = useSelector((state) => state.graphs.selectedGraphType);
    const selectedFilterType = useSelector((state) => state.graphs.selectedFilterType);
    const selectedFilterGrouping = useSelector((state) => state.graphs.selectedFilterGrouping);
    const tempGraphFilter = useSelector((state) => state.graphs.tempGraphsFilter);
    const appliedGraphFilter = useSelector((state) => state.graphs.appliedGraphsFilter);
    const appliedFilterGrouping = useSelector((state) => state.graphs.appliedFilterGrouping);
    const graphZoomExtrimPoints = useSelector((state) => state.graphs.graphZoomExtrimPoints);
    //#endregion
    const [queryData, setQueryData] = useState(null);
    //#region callbacks
    const handleFilterChange = useCallback((filterValue) => {
        const changedFilter = { ...tempGraphFilter };
        switch (selectedFilterType) {
            case switcherButtonItems.general.id:
                switch (selectedFilterGrouping) {
                    case switcherButtonItems.system.id: {
                        const systemTemp = {
                            systemid: filterValue?.systemid,
                            serialNumber: filterValue?.serialNumber,
                            dateFrom: filterValue?.dateFrom,
                            dateTo: filterValue?.dateTo,
                        };
                        changedFilter.system = { ...systemTemp };
                        break;
                    }

                    case switcherButtonItems.group.id: {
                        const groupTemp = {
                            groupId: filterValue?.groupId,
                            dateFrom: filterValue?.dateFrom,
                            dateTo: filterValue?.dateTo,
                        };
                        changedFilter.group = { ...groupTemp };
                        break;
                    }
                    case switcherButtonItems.all.id: {
                        const allTemp = {
                            dateFrom: filterValue?.dateFrom,
                            dateTo: filterValue?.dateTo,
                        };
                        changedFilter.all = { ...allTemp };
                        break;
                    }
                }
                break;
            case switcherButtonItems.additional.id: {
                const additionalTemp = {
                    hideEmptyRows: filterValue?.hideEmptyRows,
                    grouping: filterValue?.grouping,
                    showExtremums: filterValue?.showExtremums,
                    showMiddleLine: filterValue?.showMiddleLine,
                    showAlerts: filterValue?.showAlerts,
                };
                changedFilter.additional = { ...additionalTemp };
                break;
            }
        }
        dispatch(setTempGraphsFilter(changedFilter));
    });

    const handleApplyClick = useCallback((filterValue) => {
        let updatedFilter = {};
        switch (selectedFilterType) {
            case switcherButtonItems.general.id:
                updatedFilter = { ...tempGraphFilter, [selectedFilterGrouping.toLowerCase()]: { ...filterValue } };
                dispatch(setAppliedFilterGrouping(selectedFilterGrouping));
                break;
            case switcherButtonItems.additional.id:
                updatedFilter = { ...tempGraphFilter, [selectedFilterType.toLowerCase()]: { ...filterValue } };
                break;
        }
        dispatch(setTempGraphsFilter(updatedFilter));
        dispatch(setIsFirstLoad(true));
        dispatch(
            setAppliedGraphsFilter({
                general: { ...appliedGraphFilter.general },
                additional: { ...appliedGraphFilter.additional },
                [selectedFilterType.toLowerCase()]: { ...filterValue },
            })
        );
        dispatch(clearGraphZoomExtrimPoints(null));
    });

    const handleClear = useCallback(() => {
        const defaultFilter = {
            system: {
                systemid: '',
                serialNumber: '',
                dateFrom: '',
                dateTo: '',
            },
            group: {
                groupId: '',
                dateFrom: '',
                dateTo: '',
            },
            all: {
                dateFrom: '',
                dateTo: '',
            },
            additional: {
                hideEmptyResults: false,
                grouping: INTERVAL_GROUPING.day.id,
                showExtremums: false,
                showMiddleLine: false,
                showAlerts: false,
            },
        };
        dispatch(clearGraphMagicTypes());
        dispatch(clearUnselectedSerias());
        dispatch(setTempGraphsFilter(defaultFilter));
        dispatch(
            setAppliedGraphsFilter({
                general: {},
                additional: { hideEmptyRows: false, grouping: INTERVAL_GROUPING.day.id },
            })
        );
        dispatch(clearGraphZoomExtrimPoints());
    });
    //#endregion
    const resolveFilterVariables = () => {
        let resultFilter = {};
        switch (appliedFilterGrouping) {
            case switcherButtonItems.system.id:
                resultFilter = {
                    device: {
                        model: appliedGraphFilter.general.systemid,
                        sn: appliedGraphFilter.general.serialNumber,
                    },
                };
                break;
            case switcherButtonItems.group.id:
                resultFilter = {
                    group: {
                        groupId: appliedGraphFilter.general.groupId,
                    },
                };
                break;
        }

        return resultFilter;
    };

    const getQueryData = () => {
        if (
            selectedGraphType === graphsDetailsItems.SCAN_NUMBER_PARAMS.id ||
            selectedGraphType === graphsDetailsItems.ALERTS_NUMBER_PARAMS.id
        ) {
            const query =
                selectedGraphType === graphsDetailsItems.SCAN_NUMBER_PARAMS.id
                    ? reportsQueries.GET_GRAPHS_SCAN_STATISTICS
                    : reportsQueries.GET_GRAPHS_ALERT_STATISTICS;
            const variables = {
                filter: resolveFilterVariables(),
                options: {
                    startTime: appliedGraphFilter.general.dateFrom,
                    endTime: appliedGraphFilter.general.dateTo,
                    interval: appliedGraphFilter.additional.grouping,
                    hideEmpty: appliedGraphFilter.additional.hideEmptyResults,
                },
            };
            const buildQueryData = {
                query: query,
                variables: variables,
            };
            return buildQueryData;
        } else {
            const metricOptions = resolveMetricOptions(selectedGraphType);
            const startTime = graphZoomExtrimPoints[`template${selectedGraphType}Points`]
                ? convertGraphTimeStampToUTC(graphZoomExtrimPoints[`template${selectedGraphType}Points`].from, true)
                : appliedGraphFilter.general.dateFrom;
            const endTime = graphZoomExtrimPoints[`template${selectedGraphType}Points`]
                ? convertGraphTimeStampToUTC(graphZoomExtrimPoints[`template${selectedGraphType}Points`].to, true)
                : appliedGraphFilter.general.dateTo;

            const filterWithISODates = {
                systemid: appliedGraphFilter.general.systemid,
                serialNumber: appliedGraphFilter.general.serialNumber,
                dateFrom: startTime,
                dateTo: endTime,
            };
            const interval = calculateInterval(new Date(startTime).getTime(), new Date(endTime).getTime());
            return buildMetricQueryDataForGraphs(filterWithISODates, metricOptions, interval);
        }
    };

    useEffect(() => {
        if (selectedGraphType === 0 || Object.keys(appliedGraphFilter.general).length === 0) {
            setQueryData(null);
            return;
        }
        setQueryData(getQueryData());
    }, [selectedGraphType, appliedGraphFilter]);

    useEffect(() => {
        dispatch(setIsFirstLoad(true));
        if (
            !(
                selectedGraphType === graphsDetailsItems.SCAN_NUMBER_PARAMS.id ||
                selectedGraphType === graphsDetailsItems.ALERTS_NUMBER_PARAMS.id
            )
        )
            dispatch(setGraphMagicTypes({ [`template${selectedGraphType}MagicType`]: 'line' }));
    }, [selectedGraphType]);

    return (
        <div className={styles.container}>
            <div className={styles.firstColumn}>
                <GraphsSideBar
                    selectedGraphType={selectedGraphType}
                    filter={tempGraphFilter}
                    appliedFilter={appliedGraphFilter}
                    onApplyFilter={handleApplyClick}
                    onFilterChange={handleFilterChange}
                    onClearClick={handleClear}
                    selectedFilterGrouping={selectedFilterGrouping}
                    setSelectedFilterGrouping={(value) => dispatch(selectFilterGrouping(value))}
                />
            </div>
            <div className={styles.secondColumn}>
                <div className={styles.header}>
                    <h2 className={`${appStyles.H3}`}>
                        <FormattedMessage id="navBar_graphs_button" />
                    </h2>
                </div>
                <div className={styles.graphContainer}>
                    {queryData ? (
                        <GraphViewContent
                            selectedGraphType={selectedGraphType}
                            additionalOptions={{
                                showExtremums: appliedGraphFilter.additional.showExtremums,
                                showMiddleLine: appliedGraphFilter.additional.showMiddleLine,
                                showAlerts: appliedGraphFilter.additional.showAlerts,
                            }}
                            queryData={queryData}
                            filterDates={{
                                dateFrom: appliedGraphFilter.general.dateFrom,
                                dateTo: appliedGraphFilter.general.dateTo,
                            }}
                        />
                    ) : (
                        <div className={styles.noData}>
                            <FormattedMessage id="graphs_view_alertMessage" />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default GraphsView;
