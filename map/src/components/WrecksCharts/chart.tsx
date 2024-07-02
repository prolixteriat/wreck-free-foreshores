import { useEffect, useMemo, useRef } from 'react';

import { getChartData, getChartJsType, getChartOptions, ICategoryValue,
         TChartType } from './funcs';

// -----------------------------------------------------------------------------
// Use the following import to include all options for dev purposes:
/*
import Chart from 'chart.js/auto';
import { ChartConfiguration,
} from 'chart.js';
*/
// However, for prod use the following explicit imports to allow tree-shaking:

import {
    ArcElement,
    Chart,
    ChartConfiguration,
    BarController,
    BarElement,
    CategoryScale,
    DoughnutController,
    Legend,
    LinearScale,
    Title,
    Tooltip,
} from 'chart.js';
  
Chart.register(
    ArcElement,
    BarController,
    BarElement,    
    CategoryScale,
    DoughnutController,
    Legend,
    LinearScale,
    Title,
    Tooltip
);

// See the following for further information:
// https://www.chartjs.org/docs/latest/getting-started/integration.html#bundle-optimization
  
// -----------------------------------------------------------------------------
  
export interface IChart {
    colour?: string;
    chartType: TChartType;
    data: ICategoryValue[];
    sort: boolean;
    title: string;
}
// -----------------------------------------------------------------------------

export function WreckChart(props: IChart): React.JSX.Element {

    const { colour, chartType, data, sort, title } = props;
    const chartData = useMemo(() => getChartData(data, sort, colour), [data, sort, colour]);
    const chartOptions = getChartOptions(chartType, title);
    const chartRef = useRef<Chart | null>(null);
  
    const canvasCallback = (canvas: HTMLCanvasElement | null) => {
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (ctx) {        
            if (chartRef.current) {
                chartRef.current.destroy();
            }
            const config: ChartConfiguration = {
                type: getChartJsType(chartType),
                data: chartData,
                options: chartOptions
              };            
            chartRef.current = new Chart(ctx, config);
        }
    };      
  
    useEffect(() => {
        if (chartRef.current) {
          chartRef.current.data = chartData;
          chartRef.current.update();
        }
    }, [chartData]);
  
    return (
        <div className='w-full' >
            <canvas ref={canvasCallback} />
        </div>
    );
}
// -----------------------------------------------------------------------------
// End
// -----------------------------------------------------------------------------
