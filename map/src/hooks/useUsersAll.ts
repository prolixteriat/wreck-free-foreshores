import useSWR, { KeyedMutator } from 'swr';

import { z } from 'zod';

import { apiBaseUrl } from '@lib/config';
import { fetcherAuth } from '@lib/fetcher';
import { JwtManager } from '@lib/jwtManager';

// -----------------------------------------------------------------------------

export const getUsersAllUrl = (): string => { return `${apiBaseUrl}v1/` + 'get-users-all'; }

const usersFetcher = (data: string[]) => fetcherAuth(data, UsersSchemaArray);

// -----------------------------------------------------------------------------
// Define data artefacts associated with the API call. Example API call:
// http://localhost/kpm/WreckFreeForeshores/API/v1/get-users-all

const UsersSchema = z.object({
    user_id: z.number(),
    username: z.string(),
    role: z.string(),
    postings: z.number(),
    verified: z.number(),
    disabled: z.number(),
    terms_accepted: z.number(),
    created_at: z.string(),
});

const UsersSchemaArray = z.array(UsersSchema);

export type TUsersSchema = z.TypeOf<typeof UsersSchemaArray>;

// -----------------------------------------------------------------------------
// Define hook.

export interface IuseUsersAll {
    data: TUsersSchema | undefined;
    error: Error | undefined;
    isLoading: boolean | undefined;
    mutate: KeyedMutator<TUsersSchema> | undefined;
}   
// -------------------

export function useUsersAll(): IuseUsersAll {
    
    const searchUrl = getUsersAllUrl();
    const token = new JwtManager().getToken();
    const { data, error, isLoading, mutate } = useSWR([searchUrl, token], 
        usersFetcher, { 
            refreshInterval: 5 * 60 * 1000, // refresh every 5 mins
      });
    
    const response: IuseUsersAll = { 
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
