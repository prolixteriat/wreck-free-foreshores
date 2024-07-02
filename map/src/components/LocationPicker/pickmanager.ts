import '@lib/leaflet.ts';
import L from 'leaflet';

import { TWrecksSchema } from '@hooks/useWrecks';
import { getBaseMaps, mostRecentLatLon } from '@lib/funcs';
import { defLatLon, errLatLon, svgMarkerLimit } from '@lib/global';
import { JwtManager } from '@lib/jwtManager';
import { MapPref } from '@lib/mapPref';
import { LegendControl, TLayers } from '@lib/types';

import { greenMarkerIcon, goldMarkerIcon } from '@lib/leaflet.ts';

// -----------------------------------------------------------------------------

export type TPickCallback = (latitude: number, longitude: number) => void;

// -----------------------------------------------------------------------------

export class PickManager {
    
    private latitude: number;
    private longitude: number;
    private onChange: TPickCallback;

    private baseMaps: TLayers;
    private ctrlLayer: L.Control.Layers | null;
    private legend: LegendControl | null;
    private map: L.Map;
    private mapPref: MapPref;
    private marker: L.Marker | null;
    private wrecks: TWrecksSchema | undefined;

    // -------------------------------------------------------------------------
    
    constructor(map_id: string, latitude: number, longitude: number, 
                wrecks: TWrecksSchema | undefined, onChange: TPickCallback) {

        this.latitude = latitude;
        this.longitude = longitude;
        this.wrecks = wrecks;
        this.onChange = onChange;

        this.baseMaps = {};
        this.ctrlLayer = null;
        this.legend = null;
        this.marker = null;
        this.mapPref = new MapPref();

        this.initBaseMaps();  // call before map initialisation
        
        // Get centre point for map.
        const latlon = mostRecentLatLon(wrecks);
        const lat = this.latitude === errLatLon ? latlon.latitude : this.latitude;
        const lon = this.longitude === errLatLon ? latlon.longitude : this.longitude;
        this.map = L.map(map_id, {
            center: [lat, lon],
            dragging: !L.Browser.mobile,
            layers: [this.baseMaps[this.mapPref.getBase()]],
            tap: !L.Browser.mobile,
            zoom: this.mapPref.getZoom(),
            zoomSnap: 0
        });  
        this.initMap();
    }
    // -------------------------------------------------------------------------
    
    initBaseMaps(): void {
        this.baseMaps = getBaseMaps();
    }
    // -------------------------------------------------------------------------

    initClickHandler(): void {
        
        const newMarker=() => {
            const markerTitle = `(${this.latitude.toFixed(4)},${this.longitude.toFixed(4)}`;
            const latlng = L.latLng(this.latitude, this.longitude);
            if (this.marker) {
                this.map.removeLayer(this.marker);
            }
            this.marker = L.marker(latlng, 
                    {title: markerTitle,
                    icon: goldMarkerIcon
                    });
            this.marker.addTo(this.map);
        }

        const onMapClick=(e: L.LeafletMouseEvent) => {
            const { lat, lng } = e.latlng;
            this.latitude = lat;
            this.longitude = lng;
            newMarker();
            this.onChange(this.latitude, this.longitude);
        }

        if (this.latitude !== errLatLon && this.longitude !== errLatLon) {
            newMarker();
        }
        this.map.on('click', onMapClick);
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

        this.initClickHandler();
    }
    // -------------------------------------------------------------------------

    initMarkers(): void {

        const renderer = L.canvas();

        const username = new JwtManager().getUsername();
        // choose which marker type to use for rendering performance
        const useCircle = this.wrecks && (this.wrecks.length > svgMarkerLimit);        
        let usercount = 0;      // no. of wrecks reported by this user
        let marker: L.CircleMarker | L.Marker;
        if (this.wrecks) {
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
                marker.addTo(this.map);
            }
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

    show(latitude: number, longitude: number): void {
        
        const lat = latitude === errLatLon ? defLatLon.latitude : latitude;
        const lon = longitude === errLatLon ? defLatLon.longitude : longitude;
        
        this.initMarkers();
        this.map.setView([lat, lon], this.mapPref.getZoom());
    }
    // -------------------------------------------------------------------------
}
// -----------------------------------------------------------------------------
// End
// -----------------------------------------------------------------------------

