// Need to import the CSS before 'leaflet'
import 'leaflet/dist/leaflet.css';

import L from 'leaflet';

import icon from 'leaflet/dist/images/marker-icon.png';
import iconRetina from 'leaflet/dist/images/marker-icon-2x.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

import goldIcon from '../assets/marker-icon-gold.png';
import goldIiconRetina from '../assets/marker-icon-2x-gold.png';

import greenIcon from '../assets/marker-icon-green.png';
import greenIconRetina from '../assets/marker-icon-2x-green.png';

// -----------------------------------------------------------------------------
// Force import of leaflet icons.
// https://stackoverflow.com/questions/49441600/react-leaflet-marker-files-not-found
// https://cdnjs.com/libraries/Leaflet.awesome-markers
// https://github.com/lennardv2/Leaflet.awesome-markers

const DefaultIcon = L.icon({
    iconUrl: icon,
    iconRetinaUrl: iconRetina,
    shadowUrl: iconShadow,
    iconSize: [25,41], 
    iconAnchor: [12,41]
});

L.Marker.prototype.options.icon = DefaultIcon;

export const goldMarkerIcon = new L.Icon({
    iconUrl: goldIcon,
    iconRetinaUrl: goldIiconRetina,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });

export const greenMarkerIcon = new L.Icon({
    iconUrl: greenIcon,
    iconRetinaUrl: greenIconRetina,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });

// -----------------------------------------------------------------------------
// End
// -----------------------------------------------------------------------------

