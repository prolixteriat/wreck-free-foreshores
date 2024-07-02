import L from 'leaflet';

// -----------------------------------------------------------------------------

export interface ILatLon { 
    latitude: number, 
    longitude: number 
}
// -----------------------------------------------------------------------------

export type TLayers = { [k: string]: L.TileLayer | L.LayerGroup };
export type TLayersGeoJSON = { [k: string]: L.GeoJSON };
export type TLayersShape = (L.Circle | L.Rectangle)[];
export type TLayersWMS = { [k: string]: L.TileLayer.WMS };

// -----------------------------------------------------------------------------

export class LegendControl extends L.Control {
    constructor(options?: L.ControlOptions) {
        super(options);
    }

    onAdd() {
        const rnd = Math.random().toString(36).substring(7);
        const div = L.DomUtil.create('div', 'info legend ' + rnd);

        // Example legend content
        div.innerHTML = `
            <div class="bg-white p-1 rounded shadow">
            <div class="flex items-center mb-1">
                <span class="w-4 h-4 bg-blue-500 inline-block rounded-full mr-2"></span> Others
            </div>
            <div class="flex items-center">
                <span class="w-4 h-4 bg-green-500 inline-block rounded-full mr-2"></span> Mine
            </div>        
            </div>
        `;

        return div;
    }
}
// -----------------------------------------------------------------------------
// End
// -----------------------------------------------------------------------------
