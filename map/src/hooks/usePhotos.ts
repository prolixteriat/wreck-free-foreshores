import { useEffect, useState } from 'react';
import { z } from 'zod';

import { Image } from 'react-grid-gallery';

import { apiBaseUrl } from '@lib/config';
import { fetcher } from '@lib/fetcher';

// -----------------------------------------------------------------------------
// http://localhost/kpm/WreckFreeForeshores/API/v1/get-photo/1

export const getPhotoUrl = (id: number) => `${apiBaseUrl}v1/get-photo/${id}`;

// -----------------------------------------------------------------------------
// http://localhost/kpm/WreckFreeForeshores/API/v1/get-photo-info/1

export const getPhotoInfoUrl = (id: number) => `${apiBaseUrl}v1/get-photo-info/${id}`;

const infoFetcher = (url:string) => fetcher(url, PhotoInfoSchema);

const PhotoInfoSchema = z.object({
    height: z.number(),
    width: z.number(),
});
// -----------------------------------------------------------------------------
// Fetch images associated with the provided array of photo IDs.

export interface CustomImage extends Image {
    title: string;
}

export async function fetchPhotos(ids: number[]): Promise<CustomImage[]> {

    const images: CustomImage[] = [];
    for (const i in ids) {
        const photo_id = ids[i];
        const searchUrl = getPhotoUrl(photo_id);
        const url = getPhotoInfoUrl(photo_id)
        const info = await infoFetcher(url);
        const img: CustomImage = {
            src: searchUrl,
            height: info.height,
            width: info.width,
            title: `Photo ${ids[i]}`
        }
        images.push(img);
    }
    return images;
  }
// -----------------------------------------------------------------------------
// Define hook.

interface IusePhotos {
    data: CustomImage[];
    error: Error | undefined;
    isLoading: boolean;
}   
// -------------------

export function usePhotos(ids: number[]): IusePhotos {
    
    const [images, setImages] = useState<CustomImage[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isError, setIsError] = useState<Error|undefined>(undefined);
    
    useEffect(() => {
        setImages([]);
        setIsError(undefined);
        setIsLoading(true);
        fetchPhotos(ids)
        .then((data: CustomImage[]) => { 
            setImages(data); 
        })
        .catch((err: Error) => {
            setIsError(err);
        })
        .finally(() => {
            setIsLoading(false);
        })
    }, [ids]);

    const response: IusePhotos = {
        data: images,
        error: isError,
        isLoading: isLoading
    };

    return response;
}
// -----------------------------------------------------------------------------
// End
// -----------------------------------------------------------------------------


