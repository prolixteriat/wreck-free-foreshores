import useSWR, { KeyedMutator } from 'swr';
import { z } from 'zod';

import { apiBaseUrl } from '@lib/config';
import { fetcher } from '@lib/fetcher';

// -----------------------------------------------------------------------------

export const getWrecksUrl = (includeHidden: boolean): string => { 
    const url = `${apiBaseUrl}v1/` + 'get-wrecks?include_hidden=';
    return includeHidden ? url+'1' : url+'0'; 
}

const wrecksFetcher = (url: string) => fetcher(url, WrecksSchemaArray);

// -----------------------------------------------------------------------------
// Define data artefacts associated with the API call. Example API call:
// http://localhost/kpm/WreckFreeForeshores/API/v1/get-wrecks

const WreckSchema = z.object({
    wreck_id: z.number(),
    location: z.string(),
    w3w: z.string().nullish(),
    latitude: z.number(),
    longitude: z.number(),
    name: z.string().nullish(),
    make: z.string().nullish(),
    length: z.number(),
    sort: z.string(),
    hull: z.string(),
    engine: z.string(),
    position: z.string(),
    floating: z.string(),
    vessel_condition: z.string(),
    additional: z.string().nullish(),
    reported_at: z.string(),
    reporter_name: z.string(),
    reporter_id: z.number(),
    owner_name: z.string().nullish(),
    owner_id: z.number().nullish(),
    hidden: z.number(),
    notified: z.number(),
    status: z.string(),
    comment: z.string().nullish(),
    updated_at: z.string().nullish(),
    environmental: z.array(z.string()),
    safety: z.array(z.string()),
    photos: z.array(z.number()),
});

const WrecksSchemaArray = z.array(WreckSchema);

export type TWrecksSchema = z.TypeOf<typeof WrecksSchemaArray>;

// -----------------------------------------------------------------------------
// Define hook.

export interface IuseWrecks {
    data: TWrecksSchema | undefined;
    error: Error | undefined;
    isLoading: boolean | undefined;
    mutate: KeyedMutator<TWrecksSchema> | undefined;
}   
// -------------------

export function useWrecks(includeHidden: boolean=false): IuseWrecks {
    
    const searchUrl = getWrecksUrl(includeHidden);
    const { data, error, isLoading, mutate } = useSWR(searchUrl, wrecksFetcher,
      { refreshInterval: 5 * 60 * 1000, // refresh every 5 mins
      });
    
    const response: IuseWrecks = { 
        data: data, 
        error: error, 
        isLoading: isLoading,
        mutate: mutate
    };

    return response;
}
// -----------------------------------------------------------------------------
// End
// -----------------------------------------------------------------------------

