import { useContext, useState } from 'react';

import { WrecksContext } from '@lib/global';

import { BoatGallery } from '@components/BoatGallery';
import { Loading } from '@components/Common';

import { SubTable } from './subtables';

// -----------------------------------------------------------------------------

export default function SummaryTable(): React.JSX.Element {
    
    const [selectedRow, setSelectedRow] = useState<number>(0);

    const context = useContext(WrecksContext);
    const value = context?.useWrecks;
    const handleRowClick = (id: number): void => { 
      setSelectedRow(id); 
    }; 

    return (
      <>
        {(!value || value?.isLoading) ? (<Loading centre={true}/>): 
          ((value.error) ? (`Error fetching data: ${value.error.message}`) : 
            (value.data) ? (
            <>
            <div className='mb-4 w-fit max-h-[400px] overflow-auto'>
            <table className='border mx-2 text-sm'>
                <thead className='border-b-2 sticky top-0 leading-10'>
                <tr className='bg-blue-50'>
                    <th className='text-left px-2'>Location</th>
                    <th className='text-left px-2'>Name</th>
                    <th className='text-left px-2'>Make</th>
                    <th className='text-left px-2'>Hull</th>
                    <th className='text-left px-2'>Engine</th>
                    <th className='text-left px-2'>Position</th>
                    <th className='text-left px-2'>Floating</th>
                    <th className='text-left px-2'>Condition</th>
                </tr>
                </thead>
                <tbody className=''>
                {value.data.map((wreck, index) => (
                    <tr key={index}                 
                        className={`border-b cursor-pointer 
                            ${index === selectedRow ? 'bg-gray-300' : 'hover:bg-gray-100'}`} 
                        onClick={() => handleRowClick(index)} >
                        <td className='px-2'>{wreck.location}</td>
                        <td className='px-2'>{wreck.name}</td>
                        <td className='px-2'>{wreck.make}</td>
                        <td className='px-2'>{wreck.hull}</td>
                        <td className='px-2'>{wreck.engine}</td>
                        <td className='px-2'>{wreck.position}</td>
                        <td className='px-2'>{wreck.floating}</td>
                        <td className='px-2'>{wreck.vessel_condition}</td>

                    </tr>
                ))}
                </tbody>           
            </table>            
            </div>
            { value.data[selectedRow]  && 
                <SubTable title='Environmental Hazards'
                      items={value.data[selectedRow].environmental} /> }
            { value.data[selectedRow]  &&
                <SubTable title='Safety Hazards'
                      items={value.data[selectedRow].safety} /> }
            <b>Photographs</b>  
            { value.data[selectedRow]  &&                
                <BoatGallery ids={value.data[selectedRow].photos} /> }
            </>
            ) : null)
        }
    </>
    );
}
// -----------------------------------------------------------------------------
// End
// -----------------------------------------------------------------------------
