import { useEffect, useState } from 'react';

import { getFirstWord } from '@lib/funcs';
import { JwtManager } from '@lib/jwtManager';

import { IRank } from './funcs';

// -----------------------------------------------------------------------------

interface ITableProps {
    data: IRank[];
}

export function Table({ data }: ITableProps): React.JSX.Element {
    
    const [isSmallScreen, setIsSmallScreen] = useState<boolean>(window.innerWidth <= 600);

    useEffect(() => {
      const handleResize = () => {
        setIsSmallScreen(window.innerWidth <= 600);
      };
  
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }, []);
  
    const columns = isSmallScreen ? 
            ['', 'User', 'Count', 'Date'] : 
            ['Rank', 'Username', 'No. of Reports', 'Most Recent Report'];

    const username = new JwtManager().getUsername();
    return ( 
        <div className='m-4 w-fit max-h-screen-150 overflow-y-auto'>
        <table className='table'>
            <thead className='border-b-2 sticky top-0 text-sm'>
            <tr className='bg-blue-50'>
                <th className='text-center px-1'>{columns[0]}</th>
                <th className='text-left px-3 md:px-4'>{columns[1]}</th>
                <th className='text-center px-3 md:px-4'>{columns[2]}</th>
                <th className='text-left px-3 md:px-4'>{columns[3]}</th>
            </tr>
            </thead>
            <tbody className=''>
            {data.map((rank, index) => (
                <tr key={index}                 
                    className={`hover cursor-pointer text-sm leading-3 
                        ${rank.username === username ? 'bg-orange-100' : ''}`} >
                    <td className='text-center px-1 md:px-4'>{index+1}</td>
                    <td className='px-3 md:px-4'>{rank.username}</td>
                    <td className='text-center px-3 md:px-4'>{rank.total}</td>
                    <td className='px-3 md:px-4'>{getFirstWord(rank.mostRecent)}</td>
                </tr>
            ))}
            </tbody>           
        </table>            
        </div>
    );
}
// -----------------------------------------------------------------------------
// End
// -----------------------------------------------------------------------------

