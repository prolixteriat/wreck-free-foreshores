import { useUsersAll } from '@hooks/useUsersAll';

import { Loading } from '@components/Common';

import { Table } from './table';

// -----------------------------------------------------------------------------

export default function UsersTable(): React.JSX.Element {
    
  const users = useUsersAll();
  
  return ( 
    <>
    {(users.isLoading) ? (<Loading />): 
      ((users.error) ? 
        (`Error retrieving user data: ${users.error.message}`) : 
        (users.data) ? (
        <>
            <Table users={users.data} />
        </>
        ) : null)
    }
  </>
  );
}
// -----------------------------------------------------------------------------
// End
// -----------------------------------------------------------------------------
