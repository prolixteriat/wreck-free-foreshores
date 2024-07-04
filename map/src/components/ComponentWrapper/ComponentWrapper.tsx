import { Suspense, useState } from 'react';

import { useWrecks } from '@hooks/useWrecks';

import { environment, initConfig } from '@lib/config';
import { IWrecksContext, WrecksContext } from '@lib/global';

import { Loading } from '@components/Common';
import { MakeComponent, TComponent } from './components';

// -----------------------------------------------------------------------------

interface IWrecksMapWrapperProps {
    component: TComponent;
}
// -----------------------------------------------------------------------------
// TODO: Extend props to include a discriminated union representing props to be
// drilled to sub-components.

export default function ComponentWrapper( { component }: IWrecksMapWrapperProps): React.JSX.Element {
    
    initConfig(environment);
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
                <Suspense fallback={<Loading />}>
                    <MakeComponent compType={component} />
                </Suspense>
            </>
            ) : null)
        }
        </WrecksContext.Provider>
    );
}
// -----------------------------------------------------------------------------
// End
// -----------------------------------------------------------------------------
