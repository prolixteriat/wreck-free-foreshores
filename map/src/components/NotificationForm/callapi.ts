import { apiBaseUrl } from '@lib/config';
import { IApiStatus, poster } from '@lib/poster';

import { IFormData } from './funcs.ts';

// -----------------------------------------------------------------------------

export async function addWreck(formData: IFormData, jwtToken: string): Promise<IApiStatus> {
    
    const url = apiBaseUrl + 'v1/add-wreck';
    const data = new FormData();
    
    Object.keys(formData).forEach((key) => {
        const value = formData[key as keyof IFormData];
        if (value instanceof FileList) {
            for (let i = 0; i < value.length; i++) {
                data.append('files[]', value[i]);
            }
        } else if (Array.isArray(value)) {
            const arr: string[] = value.map(str => str.startsWith('Other (') ? 'Other' : str);
            data.append(key, JSON.stringify(arr));
        } else if (typeof(value) === 'number') {
            data.append(key, value.toString());
        } else if (typeof(value) === 'string') {
            if (value.startsWith('Other (')) {
                data.append(key, 'Other');
            } else {
                data.append(key, value);
            }
        } else if (typeof(value) === 'boolean') {
            data.append(key, value ? '1' : '0');
        } else {
            console.error(`Unknown type for ${key}: ${typeof(value)}`);
        }
      });
      
    return poster(url, data, jwtToken);
}
// -----------------------------------------------------------------------------
// End
// -----------------------------------------------------------------------------

