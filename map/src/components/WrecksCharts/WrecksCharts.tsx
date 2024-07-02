import { useContext, useMemo } from 'react';

import { WrecksContext } from '@lib/global';
import { Loading } from '@components/Common';

import { IChart, WreckChart } from './chart';
import { getCategoryValues } from './funcs';

// -----------------------------------------------------------------------------

export default function WrecksCharts(): React.JSX.Element {
    
  const context = useContext(WrecksContext);
  const wrecks = context?.useWrecks;
  
  const catVals = useMemo(() => getCategoryValues(wrecks?.data), [wrecks]);
    
  // Construct the array of charts to be displayed 
  const charts: IChart[] = [
    {
      title: 'What sort of boat is it?',
      colour: '#FFFF007D',
      chartType: 'bar_horizontal',
      data: catVals!['sort'],
      sort: true
    },  
    {
      title: 'What is the hull made of?',
      colour: '#00FF007D',
      chartType: 'bar_horizontal',
      data: catVals!['hull'],
      sort: true,
    },        
    {
      title: 'Does it have an engine?',
      colour: '#0000FF7D',
      chartType: 'bar_vertical',
      data: catVals!['engine'],
      sort: true,
    },    
    {
      title: 'Environmental hazards',
      chartType: 'doughnut',
      data: catVals!['environmental'],
      sort: true,
    },    
    {
      title: 'Safety hazards',
      chartType: 'doughnut',
      data: catVals!['safety'],
      sort: true,
    },    
    {
      title: 'Position of the vessel',
      colour: '#FF00007D',
      chartType: 'bar_horizontal',
      data: catVals!['position'],
      sort: true,
    },        
    {
      title: 'Does the vessel float',
      colour: '#42F5D77D',
      chartType: 'bar_vertical',
      data: catVals!['float'],
      sort: true,
    },
    {
      title: 'Condition of the vessel',
      chartType: 'doughnut',
      data: catVals!['condition'],
      sort: true,
    },
  ];

  return ( 
    <>
      {wrecks?.isLoading ? (
        <Loading centre={true}/>
      ) : (
        charts.map((chart, index) => (
          <div key={index} className='p-4'>
            {chart.data && 
              <WreckChart colour={chart.colour}
                  chartType={chart.chartType}
                  data={chart.data}
                  sort={chart.sort}
                  title={chart.title}  />}
          </div>
        ))
      )}
    </>
  );
}
// -----------------------------------------------------------------------------
// End
// -----------------------------------------------------------------------------
