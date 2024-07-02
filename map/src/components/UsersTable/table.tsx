import { useEffect, useState } from 'react';

import { TUsersSchema } from '@hooks/useUsersAll';

import { getFirstWord } from '@lib/funcs';
import { JwtManager } from '@lib/jwtManager';

// -----------------------------------------------------------------------------

interface ITableProps {
    users: TUsersSchema;
}

export function Table({ users }: ITableProps): React.JSX.Element {
    
    const [isSmallScreen, setIsSmallScreen] = useState<boolean>(window.innerWidth <= 600);

    useEffect(() => {
      const handleResize = () => {
        setIsSmallScreen(window.innerWidth <= 600);
      };
  
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }, []);
  
    const columns = isSmallScreen
      ? ['ID', 'User', 'Role', 'Count', 'Dis.', 'Ver.', 'Terms', 'Created']
      : ['ID', 'Username', 'Role', 'No. of Reports', 'Disabled', 'Verified', 'Terms Accepted', 'Created'];

    const boolText = (value: number) => (value === 0) ? 'No' : 'Yes';

    const username = new JwtManager().getUsername();

    return ( 
        <div className='m-0 p-0 md:m-4 w-fit max-h-screen-150 overflow-auto'>
        <table className='table'>
            <thead className='border-b-2 sticky top-0 text-sm'>
            <tr className='bg-blue-50'>
                {!isSmallScreen && <th className='text-left px-1 md:px-4'>{columns[0]}</th>}
                <th className='px-1 md:px-4'>{columns[1]}</th>
                <th className='px-1 md:px-4'>{columns[2]}</th>
                <th className='px-1 md:px-4 text-center'>{columns[3]}</th>
                <th className='px-1 md:px-4'>{columns[4]}</th>
                <th className='px-1 md:px-4'>{columns[5]}</th>
                <th className='px-1 md:px-4'>{columns[6]}</th>
                <th className='px-1 md:px-4'>{columns[7]}</th>
            </tr>
            </thead>
            <tbody className=''>
            {users.map((user, index) => (
                <tr key={index}  
                        className={`hover cursor-pointer text-sm leading-3 
                        ${user.username === username ? 'bg-orange-100' : ''}`} >
                    {!isSmallScreen && <td className='px-1 md:px-4'>{user.user_id}</td>}
                    <td className='px-1 md:px-4'>{user.username}</td>
                    <td className='px-1 md:px-4'>{user.role}</td>
                    <td className='px-1 md:px-4 text-center'>{user.postings}</td>
                    <td className='px-1 md:px-4 text-center'>{boolText(user.disabled)}</td>
                    <td className='px-1 md:px-4 text-center'>{boolText(user.verified)}</td>
                    <td className='px-1 md:px-4 text-center'>{boolText(user.terms_accepted)}</td>
                    <td className='px-1 md:px-4 text-center'>{getFirstWord(user.created_at)}</td>
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

