import clsx from 'clsx';
import ImageButton from 'components/ImageButton/ImageButton';
import { zoomInTargetPath } from 'constants/graphs/graphButtonPaths';
import { graphZoomTypes } from 'constants/graphs/graphZoomTypes';
import ReactEcharts from 'echarts-for-react';
import {
    convertDateForGraphTooltip,
    convertDateForGraphs,
    convertGraphTimeStampToUTC,
    convertISO8601ToTimeStamp,
    convertTimeStampWithTimeZone,
} from 'helpers/general/dateHelper';
import { getThemeColorByVarName } from 'helpers/general/getThemeColorByVarName';
import {
    calculateGridPaddings,
    calculateOffset,
    calculateUniqueMeasurementUnits,
    incrementSidesIndexes,
} from 'helpers/graphs/graphCalculators';
import { buildDataURIImage, buildTooltipContent } from 'helpers/graphs/graphHelpers';
import { resolveAxisNameByMeasurementUnit, resolveMarkPointsData } from 'helpers/graphs/graphsResolvers';
import { images } from 'images';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useIntl } from 'react-intl';
import styles from './GeneralGraph.module.css';

/**
 * Renders a general graph component.
 *
 * @component
 * @param {Object} props - The component props.
 * @param {Object} props.queryData - The query data.
 * @param {Object[]} props.seriesData - The series data. The array of objects with the following structure:
 * @param {string} props.seriesData[].name - The series name.
 * @param {string} props.seriesData[].measurementUnit - The series measurement unit.
 * @param {string} props.seriesData[].color - The series color.
 * @param {boolean} props.seriesData[].isNoData - Indicates if the series has no data.
 * @param {Object[]} props.seriesData[].data - The series data. The array of objects with the following structure:
 * @param {number} props.seriesData[].data[].value - The series data value.
 * @param {string} props.seriesData[].data[].timeStamp - The series data timestamp.
 * @param {number} props.seriesData[].maxValue - The series max value for drawing Yaxis.
 * @param {Object} props.additionalOptions - The additional options.
 * @param {Function} props.zoomChanged - The zoom changed callback function.
 * @param {number} props.zoom - The zoom value.
 * @param {Function} props.setZoom - The set zoom function.
 * @param {boolean} props.withTypeSwitcher - Indicates if the type switcher is enabled. For rendering magic type switcher.
 * @param {Function} props.filterDatesTimeStamps - The filter dates timestamps function.
 * @param {boolean} props.isZoomLock - Indicates if the zoom is locked.
 * @param {Function} props.setIsZoomLock - The set is zoom lock function.
 * @param {boolean} props.isQuereing - Indicates if the component is querying.
 * @param {string} props.magicType - The magic type.
 * @param {string[]} props.unselectedSerias - The unselected series.
 * @param {Function} props.handleMagicTypeChange - The handle magic type change function.
 * @param {Function} props.handleLegendSelectChanged - The handle legend select changed function.
 * @returns {JSX.Element} The rendered GeneralGraph component.
 */
const GeneralGraph = ({
    queryData,
    seriesData,
    additionalOptions,
    zoomChanged,
    zoom,
    setZoom,
    withTypeSwitcher,
    filterDatesTimeStamps,
    isZoomLock,
    setIsZoomLock,
    isQuereing,
    magicType,
    unselectedSerias,
    handleMagicTypeChange,
    handleLegendSelectChanged,
}) => {
    const intl = useIntl();
    const chartRef = useRef(null);
    const zoomRef = useRef(zoom);
    const minValueSpanRef = useRef(null);
    const isZoomLockRef = useRef(isZoomLock);
    const isMouseDownRef = useRef(false);
    const currentModeRef = useRef(null);
    const [interval, setInterval] = useState(0);
    const [isNoGraphData, setIsNoGraphData] = useState(false);
    const calculatexAxisInterval = (length) => {
        if (!length) return 0;
        return Math.floor(length / 17);
    };
    useEffect(() => {
        const chartInstance = chartRef.current.getEchartsInstance();
        const series = [];
        const yAxis = [];
        let leftIndex = 0;
        let rightIndex = 0;
        let tempSeriasData = seriesData.sort((a, b) => {
            const hasPercentageA = a.name.includes('%');
            const hasPercentageB = b.name.includes('%');

            if (hasPercentageA && !hasPercentageB) {
                return -1;
            } else if (!hasPercentageA && hasPercentageB) {
                return 1;
            }

            return 0;
        });
        if (additionalOptions?.showAlerts && tempSeriasData[tempSeriasData.length - 1]?.name === 'alerts') {
            tempSeriasData = seriesData.slice(0, -1);
            const alertSeriesDataItem = seriesData[seriesData.length - 1];
            series.push({
                type: 'scatter',
                symbol: function (_, params) {
                    return buildDataURIImage(alertSeriesDataItem.eventsCount[params.dataIndex]);
                },
                symbolSize: 24,
                name: alertSeriesDataItem.name,
                data: alertSeriesDataItem.data,
                tooltip: {
                    show: true,
                    trigger: 'item',
                    textStyle: {},
                    position: function (point) {
                        return [point[0], point[1] + 10];
                    },
                    formatter: function (params) {
                        return buildTooltipContent(alertSeriesDataItem.events[params.dataIndex]);
                    },
                },
            });
        }
        const tempIsNoData = tempSeriasData.every((item) => item.isNoData);
        const uniqueMeasurementUnits = calculateUniqueMeasurementUnits(tempSeriasData);
        tempSeriasData.forEach((element) => {
            const unselectedItem = unselectedSerias.find((item) => item === element.name);
            const markPointsData = resolveMarkPointsData(additionalOptions, unselectedItem);
            const itemColor = unselectedItem ? 'rgba(0, 0, 0, 0)' : element.color;
            series.push({
                yAxisIndex: uniqueMeasurementUnits.findIndex(
                    (item) => item.measurementUnit === element.measurementUnit
                ),
                name: element.name,
                data: element.data,
                lineStyle: {
                    width: 1.2,
                },
                type: magicType,
                ...(withTypeSwitcher && magicType === 'bar' ? { stack: 'one' } : {}),
                showSymbol: false,
                markPoint: {
                    data: markPointsData,
                },
                color: itemColor,
                markLine:
                    additionalOptions.showMiddleLine && !unselectedItem
                        ? {
                              data: [
                                  {
                                      type: 'average',
                                      name: 'Avg',
                                      label: {
                                          position: 'start',
                                          formatter: 'Avg',
                                      },
                                  },
                                  {
                                      type: 'average',
                                      name: 'Avg',
                                      label: {
                                          position: 'end',
                                          formatter: function (params) {
                                              return params.value.toFixed(0);
                                          },
                                      },
                                  },
                              ],
                          }
                        : {},
            });
        });
        uniqueMeasurementUnits.forEach((element, index) => {
            const incrimentedIndexes = incrementSidesIndexes(index, leftIndex, rightIndex);
            leftIndex = incrimentedIndexes.leftIndex;
            rightIndex = incrimentedIndexes.rightIndex;
            let name = intl.formatMessage({ id: resolveAxisNameByMeasurementUnit(element.measurementUnit) });
            name +=
                element.isNoData && !tempIsNoData
                    ? ` (${intl.formatMessage({
                          id: 'status_no_data',
                      })})`
                    : '';
            yAxis.push({
                type: 'value',
                ...(element.measurementUnit === '%' ? { max: 100 } : element.maxValue ? { max: element.maxValue } : {}),
                ...(!tempIsNoData ? { min: 0 } : {}),
                ...(element.measurementUnit === '%' ? { interval: 10 } : {}),
                name: name,
                position: element.measurementUnit === '%' || index % 3 === 0 ? 'left' : 'right',
                axisLine: {
                    show: true,
                    lineStyle: {
                        color: getThemeColorByVarName('--grey'),
                        width: 2,
                    },
                },
                axisTick: {
                    show: false,
                },
                alignTicks: true,
                splitLine: {
                    show: index === 0,
                    lineStyle: {
                        width: 1.4,
                        color: getThemeColorByVarName('--grid'),
                    },
                },
                nameGap: 40,
                offset: calculateOffset(index, leftIndex, rightIndex),
                nameRotate: index % 3 === 0 ? 90 : -90,
                nameLocation: 'center',
                nameTextStyle: {
                    fontSize: '16px',
                    fontFamily: 'Roboto',
                    color: getThemeColorByVarName('--text'),
                    opacity: 0.6,
                },
                axisLabel: {
                    fontSize: '16px',
                    fontFamily: 'Roboto',
                    fontWeight: 500,
                    fontStyle: 'normal',
                    lineHeight: 16,
                    color: getThemeColorByVarName('--text'),
                    opacity: 0.6,
                    margin: 5,
                    formatter: function (params) {
                        return params.toFixed(0);
                    },
                },
            });
        });
        const seriasDataNames = tempSeriasData.map((item) => {
            return { name: item.name, isNoData: item.isNoData };
        });
        const legend = {
            data: seriasDataNames.map((item) => {
                const unselectedItem = unselectedSerias.find((series) => series === item.name);
                return {
                    name: item.name,
                    textStyle: {
                        color:
                            item.isNoData || unselectedItem
                                ? getThemeColorByVarName('--grey')
                                : getThemeColorByVarName('--text'),
                        fontSize: '16px',
                        fontFamily: 'Roboto',
                        fontWeight: 400,
                        fontStyle: 'normal',
                        lineHeight: 16,
                    },
                    ...(item.isNoData || unselectedItem
                        ? {
                              itemStyle: {
                                  color: getThemeColorByVarName('--grey'),
                              },
                          }
                        : {}),
                };
            }),
            top: -5,
            right: 95,
            selectorLabel: {
                shadowBlur: 0,
            },
            icon: 'roundRect',
        };

        chartInstance?.setOption({
            series: series,
            yAxis: yAxis,
            legend: legend,
        });

        if (tempIsNoData) {
            setIsNoGraphData(true);
            return;
        }

        if (tempSeriasData[0]?.data?.length) {
            const newInterval = calculatexAxisInterval(tempSeriasData[0].data.length);
            setInterval(newInterval);
        }
    }, [seriesData, additionalOptions, magicType, unselectedSerias]);

    useEffect(() => {
        const chartInstance = chartRef?.current?.getEchartsInstance();
        chartInstance.clear();
        setIsZoomLock(false);
        setIsNoGraphData(false);
        const handleMouseDown = () => {
            isMouseDownRef.current = true;
        };
        const handleMouseUp = () => {
            isMouseDownRef.current = false;
            if (currentModeRef.current === graphZoomTypes.side) {
                zoomChanged(zoomRef.current.zoomStart, zoomRef.current.zoomEnd, currentModeRef.current);
            }
        };
        chartInstance.getZr().on('mousedown', 'graphic', handleMouseDown);
        chartInstance.getZr().on('mouseup', 'graphic', handleMouseUp);
        return () => {
            const chartInstance = chartRef?.current?.getEchartsInstance();
            chartInstance?.getZr()?.off('mousedown', 'graphic', handleMouseDown);
            chartInstance?.getZr()?.off('mouseup', 'graphic', handleMouseUp);
        };
    }, [queryData]);

    useEffect(() => {
        const chartInstance = chartRef?.current?.getEchartsInstance();
        const handleMouseClick = (e) => {
            if (!e?.target?.path?.data) return;
            if (JSON.stringify(zoomInTargetPath) === JSON.stringify(e.target.path.data)) {
                setIsZoomLock(!isZoomLock);
            }
        };
        chartInstance.getZr().on('click', handleMouseClick);
        return () => {
            const chartInstance = chartRef?.current?.getEchartsInstance();
            chartInstance?.getZr()?.off('click', handleMouseClick);
        };
    }, [isZoomLock, queryData]);

    useEffect(() => {
        zoomRef.current = zoom;
    }, [zoom]);

    useEffect(() => {
        isZoomLockRef.current = isZoomLock;
    }, [isZoomLock]);
    //#region zoomIn zoomOut zoomRefresh handlers
    const handleZoomIn = () => {
        const startPeriodTime = chartRef?.current?.getEchartsInstance().getModel().getOption()?.dataZoom[0].startValue;
        const endPeriodTime = chartRef?.current?.getEchartsInstance().getModel().getOption()?.dataZoom[0].endValue;
        const changingSlice = (endPeriodTime - startPeriodTime) / 4;
        const newZoomStart = startPeriodTime + changingSlice;
        const newZoomEnd = endPeriodTime - changingSlice;
        minValueSpanRef.current = newZoomEnd - newZoomStart;
        setZoom({ zoomStart: newZoomStart, zoomEnd: newZoomEnd });
        zoomChanged(newZoomStart, newZoomEnd, graphZoomTypes.in);
    };

    const handleZoomOut = () => {
        const echartsInstance = chartRef?.current?.getEchartsInstance();
        const dataZoom = echartsInstance?.getModel()?.getOption()?.dataZoom[0];
        if (!dataZoom) {
            return;
        }
        const startPeriodTime = dataZoom.startValue;
        const endPeriodTime = dataZoom.endValue;
        const changingSlice = (endPeriodTime - startPeriodTime) / 2;
        let newZoomStart = startPeriodTime - changingSlice;
        let newZoomEnd = endPeriodTime + changingSlice;
        const startTimeStamp = filterDatesTimeStamps.from;
        const endTimeStamp = filterDatesTimeStamps.to;
        const utcNewZoomStart = convertGraphTimeStampToUTC(newZoomStart, true);
        const utcNewZoomEnd = convertGraphTimeStampToUTC(newZoomEnd, true);
        let zoomStart, zoomEnd;
        if (startTimeStamp > convertISO8601ToTimeStamp(utcNewZoomStart)) {
            zoomStart = filterDatesTimeStamps.from;
            newZoomStart = convertTimeStampWithTimeZone(`${zoomStart}`);
        } else {
            zoomStart = newZoomStart;
        }
        if (endTimeStamp < convertISO8601ToTimeStamp(utcNewZoomEnd)) {
            zoomEnd = filterDatesTimeStamps.to;
            newZoomEnd = convertTimeStampWithTimeZone(`${zoomEnd}`);
        } else {
            zoomEnd = newZoomEnd;
        }
        setZoom({ zoomStart: newZoomStart, zoomEnd: newZoomEnd });
        zoomChanged(zoomStart, zoomEnd, graphZoomTypes.outMinusButton);
    };
    const handleZoomRefresh = () => {
        const zoomStart = filterDatesTimeStamps.from;
        const zoomEnd = filterDatesTimeStamps.to;
        setZoom({
            zoomStart: convertTimeStampWithTimeZone(`${zoomStart}`),
            zoomEnd: convertTimeStampWithTimeZone(`${zoomEnd}`),
        });
        zoomChanged(zoomStart, zoomEnd, graphZoomTypes.outMinusButton);
    };
    //#endregion

    const verifyZoomMode = (zoomStart, zoomEnd) => {
        if (zoomStart > zoomRef.current.zoomStart && zoomEnd < zoomRef.current.zoomEnd) {
            return graphZoomTypes.in;
        } else if (
            (zoomStart < zoomRef.current.zoomStart && zoomEnd < zoomRef.current.zoomEnd) ||
            (zoomStart > zoomRef.current.zoomStart && zoomEnd > zoomRef.current.zoomEnd)
        ) {
            return graphZoomTypes.side;
        } else {
            return graphZoomTypes.out;
        }
    };

    const handleDateZoom = useCallback(() => {
        const startPeriodTime = chartRef?.current?.getEchartsInstance().getModel().getOption()?.dataZoom[0].startValue;
        const endPeriodTime = chartRef?.current?.getEchartsInstance().getModel().getOption()?.dataZoom[0].endValue;
        minValueSpanRef.current = endPeriodTime - startPeriodTime;
        const mode = verifyZoomMode(startPeriodTime, endPeriodTime);
        setZoom({ zoomStart: startPeriodTime, zoomEnd: endPeriodTime });
        currentModeRef.current = mode;
        if (isMouseDownRef.current && mode === graphZoomTypes.side) return;
        zoomChanged(startPeriodTime, endPeriodTime, mode, isZoomLockRef.current);
    }, [queryData]);

    const isRefreshZoomBlock = () => {
        return (
            filterDatesTimeStamps.from >=
                convertISO8601ToTimeStamp(
                    convertGraphTimeStampToUTC(zoom.zoomStart, zoom.zoomStart !== filterDatesTimeStamps.from)
                ) &&
            filterDatesTimeStamps.to <=
                convertISO8601ToTimeStamp(
                    convertGraphTimeStampToUTC(zoom.zoomEnd, zoom.zoomEnd !== filterDatesTimeStamps.to)
                )
        );
    };
    return (
        <>
            <div
                className={clsx(styles.buttonsContainer, {
                    [styles.buttonsContainerDisabled]: isQuereing || isNoGraphData,
                })}
            >
                <ImageButton
                    icon={images.scalePlusIcon}
                    action={handleZoomIn}
                    color={getThemeColorByVarName('--icon')}
                    hoverColor={getThemeColorByVarName('--accent')}
                    isDisabled={
                        isZoomLock ||
                        isQuereing ||
                        isNoGraphData ||
                        (minValueSpanRef.current && minValueSpanRef.current <= 10000)
                    }
                />
                <ImageButton
                    icon={images.scaleMinusIcon}
                    action={handleZoomOut}
                    color={getThemeColorByVarName('--icon')}
                    hoverColor={getThemeColorByVarName('--accent')}
                    isDisabled={isRefreshZoomBlock() || isZoomLock || isQuereing || isNoGraphData}
                />
                <ImageButton
                    icon={images.scaleRefreshIcon}
                    action={handleZoomRefresh}
                    color={getThemeColorByVarName('--icon')}
                    hoverColor={getThemeColorByVarName('--accent')}
                    isDisabled={isRefreshZoomBlock() || isZoomLock || isQuereing || isNoGraphData}
                />
            </div>
            {isNoGraphData && (
                <div className={styles.noDataContainer}>
                    <div>{intl.formatMessage({ id: 'no_data_avalible_period' })}</div>
                </div>
            )}

            {
                <ReactEcharts
                    onWheel={(e) => e.preventDefault()}
                    onEvents={{
                        dataZoom: handleDateZoom,
                        magicTypeChanged: handleMagicTypeChange,
                        legendselectchanged: handleLegendSelectChanged,
                    }}
                    ref={chartRef}
                    lazyUpdate={true}
                    className={styles.echart}
                    option={{
                        animation: false,
                        grid: {
                            ...calculateGridPaddings(seriesData),
                            top: 30,
                            bottom: 30,
                            containLabel: true,
                        },
                        toolbox: {
                            feature: {
                                dataZoom: {
                                    yAxisIndex: 'none',
                                    title: {
                                        zoom: '',
                                        back: '',
                                    },
                                },
                                saveAsImage: {
                                    title: {},
                                },
                                magicType: withTypeSwitcher ? { type: ['line', 'bar'] } : {},
                            },
                            iconStyle: {
                                borderColor: getThemeColorByVarName('--icon'),
                                borderWidth: 1.5,
                                opacity: isQuereing || isNoGraphData ? 0.5 : 1,
                            },
                            top: -5,
                            left: 170,
                        },
                        tooltip: {
                            trigger: 'axis',
                            axisPointer: {
                                type: 'line',
                                animation: false,
                                label: {
                                    color: getThemeColorByVarName('--block'),
                                    formatter: function (params) {
                                        if (withTypeSwitcher) {
                                            const partsArray = params.value.split('\n');
                                            return `${partsArray[0]} - ${partsArray[1]}`;
                                        }
                                        return convertDateForGraphTooltip(params.value);
                                    },
                                },
                            },
                            backgroundColor: getThemeColorByVarName('--block'),
                            borderColor: getThemeColorByVarName('--grey'),
                            textStyle: {
                                fontSize: '16px',
                                fontFamily: 'Roboto',
                                fontWeight: 400,
                                fontStyle: 'normal',
                                lineHeight: 16,
                                color: getThemeColorByVarName('--text'),
                            },
                        },
                        dataZoom: [
                            {
                                type: 'inside',
                                realtime: true,
                                minValueSpan: withTypeSwitcher ? 4 : 10000,
                                startValue: zoom.zoomStart,
                                endValue: zoom.zoomEnd,
                                moveOnMouseWheel: false,
                                zoomLock: isZoomLock || isQuereing || isNoGraphData,
                            },
                        ],
                        xAxis: {
                            type: withTypeSwitcher ? 'category' : 'time',
                            boundaryGap: withTypeSwitcher,
                            axisLine: {
                                show: true,
                                lineStyle: {
                                    color: getThemeColorByVarName('--grey'),
                                    width: 2,
                                },
                            },
                            axisLabel: {
                                fontSize: '16px',
                                fontFamily: 'Roboto',
                                fontWeight: 500,
                                fontStyle: 'normal',
                                lineHeight: 16,
                                color: getThemeColorByVarName('--text'),
                                opacity: 0.6,
                                margin: 15,
                                showMaxLabel: true,
                                showMinLabel: true,
                                interval: interval,
                                formatter: function (value) {
                                    return withTypeSwitcher ? value : convertDateForGraphs(value);
                                },
                            },
                        },
                        yAxis: [
                            {
                                type: 'value',
                            },
                        ],
                        series: [],
                    }}
                />
            }
        </>
    );
};

export default GeneralGraph;
