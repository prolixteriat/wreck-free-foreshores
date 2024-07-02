import { useEffect, useRef } from 'react';

import { TWrecksSchema } from '@hooks/useWrecks';

import { MapManager } from './mapmanager';

// -----------------------------------------------------------------------------

interface IWrecksMapProps {
  map_id: string;
  wrecks: TWrecksSchema;
  mutate: number;         // used to trigger re-render
} 

export default function WrecksMap(props: IWrecksMapProps): React.JSX.Element {

  const { map_id, wrecks, mutate } = props;

  const mapStyles = {
    width: '100%',
    height: 'calc(100vh - 150px)',
  };
  
  const mapRef = useRef<MapManager | null>(null);
  
  useEffect(() => {    
    if (!mapRef.current) {
          mapRef.current = new MapManager(map_id, wrecks);
      }
      mapRef.current.show();
  }, [map_id, wrecks, mutate]
  ); 

  return (
      <div id={map_id} style={mapStyles} />
  );
}
// -----------------------------------------------------------------------------
// End
// -----------------------------------------------------------------------------
