import { createContext, Dispatch, SetStateAction } from 'react';

import { IuseWrecks } from '@hooks/useWrecks';
import { ILatLon } from '@lib/types';   

// -----------------------------------------------------------------------------

export interface IWrecksContext {
    // jwtManager: JwtManager;
    mutate: number;         // used to trigger re-render of maps
    useWrecks: IuseWrecks;
    
    // setJwtManager: Dispatch<SetStateAction<JwtManager>>;
    setMutate: Dispatch<SetStateAction<number>>;
}

export const WrecksContext = createContext<IWrecksContext|undefined>(undefined);

// -----------------------------------------------------------------------------
// Used to indicate invalid lat or lan value (utside valid range for lat/lon).
export const errLatLon: number = 999;     

// Default center for map if not using location detection.
export const defLatLon: ILatLon= {
    latitude: 50.0973,
    longitude: -5.1325
}
// -----------------------------------------------------------------------------
// Limit for use of SVG markers in maps before switching to circles (performance)
export const svgMarkerLimit: number = 300;

// -----------------------------------------------------------------------------
// Use to force modal dialogs to appear over Leaflet maps.

export const topStyle: React.CSSProperties = {
    position: 'relative', 
    zIndex: 99999
};
// -----------------------------------------------------------------------------
// End
// -----------------------------------------------------------------------------
