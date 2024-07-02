import L from 'leaflet';

import { TWrecksSchema } from '@hooks/useWrecks';
import { defLatLon  } from '@lib/global';
import { ILatLon, TLayers } from '@lib/types';
import { JwtManager } from '@lib/jwtManager';

// -----------------------------------------------------------------------------
// NB: use with await.
export const doPause = (ms: number): Promise<void> => new Promise(resolve => setTimeout(resolve, ms));

// -----------------------------------------------------------------------------

export function getBaseMaps(): TLayers {
    const layers = ['simple', 'road', 'terrain', 'satellite'];
    const baseMaps: TLayers = {};
    
    for (const base of layers) {
        switch (base) {
            case 'simple':
                baseMaps.Simple = L.tileLayer(
                    'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', 
                    {   attribution:
                        '<a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a> | ' +
                        '<a href="https://carto.com/attributions" target="_blank">CartoDB'  
                    });
                break;
            case 'road':
                baseMaps.Road = L.tileLayer(
                    'https://tile.openstreetmap.org/{z}/{x}/{y}.png', 
                    {   attribution:
                        '<a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a>' 
                    });
                break;
            case 'terrain':
                baseMaps.Terrain = L.tileLayer(
                    'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', 
                    {   attribution:
                        '<a href="https://opentopomap.org" target="_blank">OpenTopoMap</a>',
                        maxZoom: 17,
                        maxNativeZoom: 15 
                    });
                break;
            case 'satellite':
                baseMaps.Satellite = L.tileLayer(
                    'https://{s}.google.com/vt/lyrs=s,h&x={x}&y={y}&z={z}',
                    {   subdomains:['mt0','mt1','mt2','mt3'],
                        attribution:
                        '<a href="https://mapsplatform.google.com/" target="_blank">powered by Google</a>' 
                    });         
                break;
            default:
                console.error(`Unknown base map type: ${base}`);
                break;
        }
    }
    return baseMaps
}
// -----------------------------------------------------------------------------

export const getFirstWord = (input: string): string => {
    const firstSpaceIndex = input.indexOf(' ');    
    if (firstSpaceIndex === -1) {
      return input;
    }
    return input.substring(0, firstSpaceIndex);
}
// -----------------------------------------------------------------------------
// Return the coords of the most recently added wreck.

export const mostRecentLatLon = (wrecks: TWrecksSchema|undefined): ILatLon => {
    
    const lastLatLon = (): ILatLon => {
        const coord: ILatLon = defLatLon;
        if (wrecks && (wrecks.length > 0)) {
            const wreck = wrecks[wrecks.length-1];
            coord.latitude = wreck.latitude;
            coord.longitude = wreck.longitude;
        }
        return coord;        
    }

    const coord: ILatLon = lastLatLon();
    if (wrecks && (wrecks.length > 0)) {
        const username = new JwtManager().getUsername();
        if (username.length > 0) {
            for (let i = wrecks.length - 1; i >= 0; i--) {
                const wreck = wrecks[i];
                if (wreck.reporter_name === username) {
                    coord.latitude = wreck.latitude;
                    coord.longitude = wreck.longitude;
                    break;
                }
              }
        }
    }
    return coord;
}
// -----------------------------------------------------------------------------
// End
// -----------------------------------------------------------------------------
