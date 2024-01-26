import React from 'react';
import ReactEcharts from 'echarts-for-react';

const LinearChart = (props) => {
    const{
        xData,
        yData,
        yMax,
        yMin,
    }=props;
    return (
        <ReactEcharts
            theme={'theme'}
            style={{height: '700px', width: '100%'}}
            option={{
                xAxis: {
                    name: "yLegend",
                    nameTextStyle: {
                        verticalAlign: 'bottom',
                        padding: [0, 0, 5, 0],
                    },
                    type: "category",
                    data: xData,
                },
                yAxis: {
                    name: "yLegend",
                    type: "value",
                    nameTextStyle: {
                        verticalAlign: 'bottom',
                        padding: [0, 0, 5, 0],
                    },
                    max: yMax,
                    min: 0,
                },
                dataZoom: [
                    {
                        type: 'slider',
                        xAxisIndex: 0,
                        filterMode: 'none',
                        bottom: '2%',
                    },

                    {
                        type: 'inside',
                        xAxisIndex: 0,
                        filterMode: 'none',
                    },
                ],
                legend: {
                    show: true,
                },
                series: [{
                    data: yData,
                    type: "line"
                }]
            }}
        />
    );
};

export default LinearChart;