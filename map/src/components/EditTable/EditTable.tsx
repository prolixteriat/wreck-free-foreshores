import { useContext, useState } from 'react';

import { WrecksContext } from '@lib/global';
import { JwtManager } from '@lib/jwtManager';
import { IApiStatus } from '@lib/poster';

import { useWrecks } from '@hooks/useWrecks';
import { Loading } from '@components/Common';

import { setWreckVisibility } from './callapi.ts';

// -----------------------------------------------------------------------------

export default function EditTable(): React.JSX.Element {
    
  const [isUpdating, setIsUpdating] = useState<boolean>(false);
  const [selectedRow, setSelectedRow] = useState<number>(0);

  const context = useContext(WrecksContext);
    
  const { data, error, isLoading, mutate } = useWrecks(true);
  const handleRowClick = (id: number): void => { 
    setSelectedRow(id); 
  }; 

  const handleCheckboxChange = async (id: number) => {
    const wreck = data?.[id];
    if (!wreck) return;
    const token = new JwtManager().getToken() || '';
    try {
      setIsUpdating(true);
      const newStatus: IApiStatus = await setWreckVisibility(wreck?.wreck_id, 
                        !Boolean(wreck?.hidden).valueOf(), token);
      if (newStatus.success) {
        mutate!();
        context?.useWrecks.mutate!();
      } else {
        alert(newStatus.message);
        console.log(newStatus.message);
      }
    }
    finally {
      setIsUpdating(false);
    }        
  };

  return (
      <>
        {(isLoading || isUpdating) ? (<Loading centre={true}/>): 
          ((error) ? (`Error fetching data: ${error.message}`) : 
            (data) ? (
            <>
            <div className='mb-4 w-fit max-h-screen-150 overflow-auto'>
            <table className='border mx-2 text-sm'>
                <thead className='border-b-2 sticky top-0 leading-10'>
                <tr className='bg-blue-50'>
                    <th className='text-left px-2'>ID</th>
                    <th className='text-left px-2'>Location</th>
                    <th className='text-left px-2'>Reporter</th>
                    <th className='text-left px-2'>Hidden</th>
                </tr>
                </thead>
                <tbody className=''>
                {data.map((wreck, index) => (
                    <tr key={index}                 
                        className={`border-b cursor-pointer 
                            ${index === selectedRow ? 'bg-gray-300' : 'hover:bg-gray-100'}`} 
                        onClick={() => handleRowClick(index)} >
                        <td className='px-2'>{wreck.wreck_id}</td>
                        <td className='px-2'>{wreck.location}</td>
                        <td className='px-2'>{wreck.reporter_name}</td>
                        <td style={{ textAlign: 'center' }}>
                          <input
                            type='checkbox'
                            checked={Boolean(wreck.hidden).valueOf()}
                            onChange={() => handleCheckboxChange(index)}
                          />
                        </td>
                    </tr>
                ))}
                </tbody>           
            </table>            
            </div>
            </>
            ) : null)
        }
    </>
    );
}
// -----------------------------------------------------------------------------
// End
// -----------------------------------------------------------------------------
