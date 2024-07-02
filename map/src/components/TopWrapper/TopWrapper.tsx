import { useState } from 'react';

import { useWrecks } from '@hooks/useWrecks';

import { IWrecksContext, WrecksContext } from '@lib/global';

import { Loading } from '@components/Common';
import { Menu } from '@components/Menu';
import { Tabs } from '@components/Tabs';

// -----------------------------------------------------------------------------

export default function TopWrapper(): React.JSX.Element {
    
    const wrecks = useWrecks();
    const [mutate, setMutate] = useState<number>(0);
    
    const value: IWrecksContext = { useWrecks: wrecks, 
                                    mutate: mutate,
                                    setMutate: setMutate };

    return ( 
        <WrecksContext.Provider value={value}>
        {(value.useWrecks.isLoading) ? (<Loading centre={true}/>): 
          ((value.useWrecks.error) ? 
            (`Error retrieving wreck data: ${value.useWrecks.error.message}`) : 
            (value.useWrecks.data) ? (
            <>
                <Menu />
                <Tabs />
            </>
            ) : null)
        }
        </WrecksContext.Provider>
    );
}
// -----------------------------------------------------------------------------
// End
// -----------------------------------------------------------------------------
