import { useContext } from 'react';

import { errLatLon, WrecksContext } from '@lib/global';

import { LocationPicker, WrecksMap } from '../';

// -----------------------------------------------------------------------------

export type TComponent = 'LocationPicker' | 'WrecksMap';

// -----------------------------------------------------------------------------

interface IComponentProps {
    compType: TComponent;
}
// -----------------------------------------------------------------------------

export function MakeComponent({ compType }: IComponentProps): React.JSX.Element {
    
    const context = useContext(WrecksContext);
    const wrecks = context?.useWrecks;
    let component: React.JSX.Element;

    if (!wrecks || !wrecks.data) {
        return <></>;
    }
    switch (compType) {
        case 'LocationPicker': {
            component  = <LocationPicker 
                map_id={'wrapper_location_picker'}
                latitude={errLatLon}
                longitude={errLatLon}
                onChange={() => {}}/>;
            break;
        }
        case 'WrecksMap': {
            component =  <WrecksMap 
                map_id={'wrapper_wreckfree_map'}
                wrecks={wrecks?.data}
                mutate={1} /> ;
            break;
        }
        default: {
            component = <></>;
            console.error(`MakeComponent: Invalid component type: ${compType}`);
        }
    }
    return component;
}
// -----------------------------------------------------------------------------
// End
// -----------------------------------------------------------------------------


