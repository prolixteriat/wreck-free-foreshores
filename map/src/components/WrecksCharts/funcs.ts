import { ChartConfiguration } from 'chart.js';

import { TWrecksSchema } from '@hooks/useWrecks';

// -----------------------------------------------------------------------------
// Define available chart types.
export type TChartType = 'bar_horizontal' | 'bar_vertical' | 'doughnut' | 'pie';

// Map internal chart types to their ChartJS equivalents.
export const getChartJsType = (chartType: TChartType) => {
    switch (chartType) {
        case 'bar_horizontal':
            return 'bar';
        case 'bar_vertical':
            return 'bar';
        case 'doughnut':
            return 'doughnut';
        case 'pie':
            return 'pie';
        default:
            console.error(`Unknown chart type: ${chartType}`);
            return 'bar';
    }
}
// -----------------------------------------------------------------------------
// Return data in a format suitable for charting. If 'colour' is supplied, it 
// will be used for all data values. If not, random colours will be used.

export function getChartData(data: ICategoryValue[], sort: boolean, colour?: string) {

    const [values, labels, colours] = transformData(data, sort);
    const chartData = {
        labels,
        datasets: [
        {
            data: values,
            backgroundColor: colour || colours,
            borderColor: 'LightGray',
            borderWidth: 1
        }
        ]
    };
    return chartData;
}
// -----------------------------------------------------------------------------
// Return chart options.
// Info on how to show percentages and custom labels in pie charts...
// https://stackoverflow.com/questions/52044013/chartjs-datalabels-show-percentage-value-in-pie-piece

export function getChartOptions(chartType: TChartType, title?: string) {

    const chartOptions: ChartConfiguration['options'] = {
        responsive: true,
        aspectRatio: 1,
        maintainAspectRatio: false,
        indexAxis: 'y' as const,
        plugins: {
          legend: {
            display: false,
          },
          title: {
            align: 'start' as const,
            display: true,
            text: title,
            font: {
                size: 18,
            }
          },
        },
        scales: {           
            y: {
              ticks: {
                autoSkip: true,
              }
            }
          }
    }
    
    // Customise options dependent upon chart type being used.
    switch (chartType) {
        case 'bar_horizontal':
            break;
        case 'bar_vertical':
            chartOptions.indexAxis = 'x' as const;
            break;
        case 'doughnut':
        case 'pie':
            delete chartOptions.scales;
            chartOptions.plugins = { ...chartOptions.plugins,
                legend: {
                  display: true,
                  align: 'center' as const,
                  position: 'left' as const,
                  labels: {
                    boxWidth: 20,
                    font: {
                        size: 10
                    }
                  }
                }
            }
            break;
    }
    return chartOptions;
}
// -----------------------------------------------------------------------------
// Return a random colour string using the supplied opacity value.

function getRandomColour(opacity: number = 0.5): string {
    const r = Math.floor(Math.random() * 255);
    const g = Math.floor(Math.random() * 255);
    const b = Math.floor(Math.random() * 255);
    return `rgba(${r},${g},${b},${opacity})`;
}
// -----------------------------------------------------------------------------

type TCategoryValues = { [k: string]: ICategoryValue[] };

export interface ICategoryValue {
    name: string;
    value: number;
}

const updateCategoryValue = (catvals: ICategoryValue[], name: string): void => {
    const existingCategory = catvals.find(category => category.name === name);
    if (existingCategory) {
        existingCategory.value += 1;
    } else {
        catvals.push({ name: name, value: 1 });
    }
}

export function getCategoryValues(wrecks: TWrecksSchema|undefined): TCategoryValues|undefined {
    
    if (!wrecks) {
        return undefined;
    }
    const catvals: TCategoryValues = {};
    catvals['condition'] = [];
    catvals['engine'] = [];
    catvals['environmental'] = [];
    catvals['float'] = [];
    catvals['hull'] = [];
    catvals['position'] = [];
    catvals['safety'] = [];
    catvals['sort'] = [];

    wrecks.map((wreck) => {
        updateCategoryValue(catvals['condition'], wreck.vessel_condition);
        updateCategoryValue(catvals['engine'] , wreck.engine);
        wreck.environmental.forEach(name => updateCategoryValue(catvals['environmental'], name));
        updateCategoryValue(catvals['float'], wreck.floating);
        updateCategoryValue(catvals['hull'], wreck.hull);
        updateCategoryValue(catvals['position'], wreck.position);
        wreck.safety.forEach(name => updateCategoryValue(catvals['safety'], name));
        updateCategoryValue(catvals['sort'], wreck.sort);
    
    });
    return catvals;
}

// -----------------------------------------------------------------------------
// Transform data into a format suitable for charting. Returns arrays of:
// values, labels, colours

function transformData(data: ICategoryValue[], 
                    sort: boolean = false): [number[], string[], string[]] {

    const labels: string[] = [];    // Axis labels.
    const values: number[] = [];    // Axis values.
    const colours: string[] = [];   // Colour values.

    if (data.length > 0) {
        if (sort) {
            data.sort((a, b) => {
                const ac = a.value ??= 0;
                const bc = b.value ??= 0;
                return (ac > bc) ? -1 : (ac < bc) ? 1 : 0;
            });
        }
        data.map((record) => {
            labels.push(record.name ??= '');
            values.push(record.value ??= 0);
            colours.push(getRandomColour());
        });
    }
    return [values, labels, colours];
}
// -----------------------------------------------------------------------------
// End
// -----------------------------------------------------------------------------
