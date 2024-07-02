import { Gallery } from 'react-grid-gallery';

import { usePhotos } from '@hooks/usePhotos';

import { Loading } from '@components/Common';

// -----------------------------------------------------------------------------

interface IBoatGalleryProps {
  ids: number[];
} 

export default function BoatGallery({ ids }: IBoatGalleryProps): React.JSX.Element {

  const { data, error, isLoading } = usePhotos(ids);
  return (
    <>
    {(isLoading) ? (<Loading />): 
      (error) ? (`Error fetching data: ${error.message}`) : 
        (data) ? (
          <Gallery
            images={data}
            enableImageSelection={false}
          />
        ) : null
    }
    </>
  );
}
// -----------------------------------------------------------------------------
// End
// -----------------------------------------------------------------------------
