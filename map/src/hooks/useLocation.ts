import { useState, useEffect } from 'react';

import { ILatLon } from '@lib/types';

// -----------------------------------------------------------------------------
// Return the device's current location.

const getGeolocation = (): Promise<GeolocationCoordinates> => {
    return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
            (position) => resolve(position.coords),
            (error) => reject(error)
        );
    });
};
// -----------------------------------------------------------------------------

async function fetchLocation(): Promise<ILatLon> {

    const geoLoc = await getGeolocation();
    const latlon: ILatLon = {
        latitude: geoLoc.latitude,
        longitude: geoLoc.longitude
    }
    return latlon;
}
// -----------------------------------------------------------------------------
// Define custom hook.

interface IuseLocation {
    latLon: ILatLon | undefined;
    error: Error | undefined;
    isLoading: boolean | undefined;
}

export function useLocation(): IuseLocation {
    
    const [latLon, setLatLon] = useState<ILatLon>();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isError, setIsError] = useState<Error|undefined>(undefined);    
          
    useEffect(() => {
        setIsError(undefined);
        setIsLoading(true);
        fetchLocation()
        .then((data: ILatLon) => { 
            setLatLon(data); 
        })
        .catch((err) => {
            setIsError(err);
        })
        .finally(() => {
            setIsLoading(false);
        })
    }, []);

    const response: IuseLocation = {
        latLon: latLon,
        error: isError,
        isLoading: isLoading
    };

    return response;
}
// -----------------------------------------------------------------------------
// End
// -----------------------------------------------------------------------------
