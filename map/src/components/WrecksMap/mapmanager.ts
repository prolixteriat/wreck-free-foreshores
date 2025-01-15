import '@lib/leaflet.ts';
import L from 'leaflet';

import { getPhotoUrl } from '@hooks/usePhotos';
import { TWrecksSchema } from '@hooks/useWrecks';
import { kioskMode } from '@lib/config';
import { defLatLon, svgMarkerLimit } from '@lib/global';
import { getBaseMaps, mostRecentLatLon } from '@lib/funcs';
import { JwtManager } from '@lib/jwtManager';
import { greenMarkerIcon } from '@lib/leaflet.ts';
import { MapPref } from '@lib/mapPref';
import { LegendControl, TLayers, TLayersShape, TLayersWMS } from '@lib/types';

// -----------------------------------------------------------------------------

export class MapManager {

    private baseMaps: TLayers;
    private shapeLayers: TLayersShape;
    private wmsLayers: TLayersWMS;

    private ctrlLayer: L.Control.Layers | null;
    private legend: LegendControl | null;
    private map: L.Map;
    private mapPref: MapPref;
    private wrecks: TWrecksSchema;

    // -------------------------------------------------------------------------
    
    constructor(map_id: string, wrecks: TWrecksSchema) {

        this.wrecks = wrecks;
        this.baseMaps = {};
        this.shapeLayers = [];
        this.wmsLayers = {};
        this.ctrlLayer = null;
        this.legend = null;
        this.mapPref = new MapPref();

        this.initBaseMaps();  // call before map initialisation
        this.map = L.map(map_id, {
            center: [defLatLon.latitude, defLatLon.longitude],
            // dragging: !L.Browser.mobile,
            layers: [this.baseMaps[this.mapPref.getBase()]],
            // tap: !L.Browser.mobile,
            zoom: this.mapPref.getZoom(),
            zoomSnap: 0
        });
        if (kioskMode === true) {
            this.restrictBounds();
        }
        this.initMap();
    }
    // -------------------------------------------------------------------------

    addLayer(layer: L.GeoJSON | L.TileLayer | L.TileLayer.WMS, name: string = ''): void {

        this.ctrlLayer?.addOverlay(layer, name);
        // selectOverlayLayer(this.map, layer, name);
    }
    // -------------------------------------------------------------------------
    
    initBaseMaps(): void {
        this.baseMaps = getBaseMaps();
    }
    // -------------------------------------------------------------------------
    // add boundary line layers

    async initBoundaryOverlays(): Promise<void> {
        return;
    }
    // -------------------------------------------------------------------------
    
    initMap(): void { 
        if (this.ctrlLayer !== null) {
            this.map.removeControl(this.ctrlLayer);
        }
        this.ctrlLayer = L.control
            .layers(this.baseMaps)
            .addTo(this.map); 
            
        this.map.on('baselayerchange', (event: L.LayersControlEvent): void => {
            this.mapPref.setBase(event.name);    
        }); 
        
        this.map.on('zoomend', (): void => {
            this.mapPref.setZoom(this.map.getZoom());
        });
    }
    // -------------------------------------------------------------------------

    initMarkers(): void {

        const getText = (name: string, value: string|null|undefined): string => 
            value ? `<b>${name}</b>: ${value}<br>` : '';

        const getImage = (photos: number[]): string =>
            photos.length > 0 ? `<img src="${getPhotoUrl(photos[0])}" class="mx-auto" alt="Boat photo" width="200"/>` : '';

        const renderer = L.canvas();
        const username = new JwtManager().getUsername();
        // choose which marker type to use for rendering performance
        const useCircle = (this.wrecks.length > svgMarkerLimit);
        let usercount = 0;      // no. of wrecks reported by this user
        let marker: L.CircleMarker | L.Marker;
        for (const wreck of this.wrecks) {
            const ll = L.latLng(wreck.latitude, wreck.longitude);
            // marker based upon whether wreck has been reported by this user
            if (username === wreck.reporter_name) {
                usercount++;
                marker = L.marker(ll, {title: wreck.location, icon: greenMarkerIcon})
                marker = (useCircle ) ? 
                    L.circleMarker(ll, {renderer: renderer,radius: 8, color: 'green'}) :
                    L.marker(ll, {title: wreck.location, icon: greenMarkerIcon});
                } else {
                // marker = L.marker(ll, {title: wreck.location})
                marker = (useCircle ) ?
                    L.circleMarker(ll, {renderer: renderer,radius: 8}) :
                    L.marker(ll, {title: wreck.location});
            }
            let txt = '<div class="text-wrap" style="font-weight: normal; width: 300px;">';
            txt += getText('ID', String(wreck.wreck_id));
            txt += getText('Location', wreck.location);
            txt += getText('Name', wreck.name);
            txt += getText('Make & model', wreck.make);
            txt += getText('Sort', wreck.sort);
            txt += getText('Hull', wreck.hull);
            txt += getText('Engine', wreck.engine);
            txt += getText('Position', wreck.position);
            txt += getText('Floating', wreck.floating);
            txt += getText('Condition', wreck.vessel_condition);
            txt += getText('Reported by', wreck.reporter_name);
            txt += getImage(wreck.photos);
            txt += '</div>';
            marker.bindPopup(txt);
            marker.addTo(this.map);
        }
        // show / hide legend
        if (usercount > 0) {
            if (!this.legend) {
                this.legend = new LegendControl({ position: 'topright' });
                this.legend.addTo(this.map); 
            }
        } else if (this.legend !== null) {
            this.map.removeControl(this.legend);
            this.legend = null;
        }
    }
    // -------------------------------------------------------------------------
    
    initShapeLayers(): void {
        // Remove any existing shape layers
        for (const layer of this.shapeLayers) {
            this.map.removeLayer(layer);
        }
        this.shapeLayers = [];
    }
    // -------------------------------------------------------------------------
    
    async initWmsLayers(): Promise<void> {
        // Remove any existing WMS layers
        for (const layer of Object.values(this.wmsLayers)) {
            this.map.removeLayer(layer);
            this.ctrlLayer?.removeLayer(layer);
        }
    }
    // -------------------------------------------------------------------------

    restrictBounds(): void {
        // Restrict map viewport to Cornwall area
        const bounds = L.latLngBounds(
            [49.960, -5.853],     // south-west corner
            [50.396, -4.419]      // north-east corner
        );
        // this.map.setMaxBounds(bounds);
        this.map.fitBounds(bounds);
        this.map.setMinZoom(10);
        this.map.on('drag', () => {
            this.map.panInsideBounds(bounds, { animate: false });
        });        
    }
    // -------------------------------------------------------------------------

    show(): void {

        this.initMarkers();
        this.initWmsLayers();
        this.initShapeLayers();
        this.initBoundaryOverlays();
        const ll = mostRecentLatLon(this.wrecks);
        this.map.setView([ll.latitude, ll.longitude], this.mapPref.getZoom());
        // this.map.removeLayer(this.baseMaps.Terrain);
        // this.map.addLayer(this.baseMaps.Road);
        // this.map.fitBounds(this.params.bounds);
    }
    // -------------------------------------------------------------------------
}
// -----------------------------------------------------------------------------
// End
// -----------------------------------------------------------------------------

