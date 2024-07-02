import { useContext, useMemo } from 'react';

import { WrecksContext } from '@lib/global';

import { Loading } from '@components/Common';

import { transformData } from './funcs';
import { Table } from './table';

// -----------------------------------------------------------------------------

export default function RankingsTable(): React.JSX.Element {
    
  const context = useContext(WrecksContext);
  const wrecks = context?.useWrecks;
  const ranks = useMemo(() => transformData(wrecks?.data), [wrecks?.data]);
  
  return ( 
    <>
    {(!wrecks || wrecks.isLoading) ? (<Loading />): 
      ((wrecks.error) ? 
        (`Error retrieving wreck data: ${wrecks.error.message}`) : 
        (ranks) ? (
        <>
            <Table data={ranks} />
        </>
        ) : null)
    }
  </>
  );
}
// -----------------------------------------------------------------------------
// End
// -----------------------------------------------------------------------------
