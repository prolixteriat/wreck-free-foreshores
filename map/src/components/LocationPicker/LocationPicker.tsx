import { useContext, useEffect, useRef } from 'react';

import { useLocation } from '@hooks/useLocation';
import { errLatLon, WrecksContext } from '@lib/global';

import { PickManager, TPickCallback } from './pickmanager';

// -----------------------------------------------------------------------------

interface ILocationPickerProps {
    latitude: number;
    longitude: number;
    map_id: string;
    onChange: TPickCallback;
}
// -----------------------------------------------------------------------------

export default function LocationPicker(props: ILocationPickerProps): React.JSX.Element {
    
    const { latitude, longitude, map_id, onChange } = props;

    const mapStyles = {
        width: '100%',
        height: '400px'
    };
    
    const context = useContext(WrecksContext);
  
    const mapRef = useRef<PickManager | null>(null);

    const location = useLocation();

    useEffect(() => { 
        let lat = latitude;
        let lon = longitude;
        if ((lat === errLatLon || lon === errLatLon) && location.latLon) {
            lat = location.latLon.latitude;
            lon = location.latLon.longitude;
        }
        if (!mapRef.current) {
            mapRef.current = new PickManager(map_id, latitude, longitude, 
                            context?.useWrecks.data, onChange);
        }
        mapRef.current.show(lat, lon);
        }, [map_id, latitude, longitude, location, context?.useWrecks.data, onChange]
    ); 
  
    return (
        <div id={map_id} style={mapStyles} />
    );
}
// -----------------------------------------------------------------------------
// End
// -----------------------------------------------------------------------------
