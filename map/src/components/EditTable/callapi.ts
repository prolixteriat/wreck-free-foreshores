import { apiBaseUrl } from '@lib/config';
import { IApiStatus, poster } from '@lib/poster';

// -----------------------------------------------------------------------------

export async function setWreckVisibility(wreck_id: number, hidden: boolean, 
                        jwtToken: string): Promise<IApiStatus> {
    
    const url = apiBaseUrl + 'v1/set-wreck-visibility';
    const data = new FormData();
    data.append('id', wreck_id.toString());
    data.append('hidden', hidden ? '1' : '0');
  
    return poster(url, data, jwtToken);
}
// -----------------------------------------------------------------------------
// End
// -----------------------------------------------------------------------------

