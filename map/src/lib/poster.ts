
// -----------------------------------------------------------------------------

export interface IApiStatus {
    success: boolean;
    message: string;
}
// -----------------------------------------------------------------------------

export async function poster(url: string, body: string|FormData, token?: string): Promise<IApiStatus> {
    const status: IApiStatus = { success: false, message: '' };
    try {
        const headers: HeadersInit = token ? 
            { 'Authorization': `Bearer ${token}` } :
            { 'Content-Type': 'application/json' };
        const response = await fetch(url, {
            method: 'POST',  
            headers: headers,
            body: body	
        })
        if (!response.ok) {
            const errorData = await response.json();
            status.message = errorData || response.statusText;
        } else {
            const data = await response.json();
            status.success = true;
            status.message = data;
        }
    } catch (error) {
        status.message = (error instanceof Error) ? error.message : 'Error occurred';
    }

    return status;
}
// -----------------------------------------------------------------------------
// End
// -----------------------------------------------------------------------------

