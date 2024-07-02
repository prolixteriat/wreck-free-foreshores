import { apiBaseUrl } from '@lib/config';
import { IApiStatus, poster } from '@lib/poster';

// -----------------------------------------------------------------------------

export async function addUser(username: string, email: string, password: string, 
                            acceptedTerms: boolean): Promise<IApiStatus> {
    const url = apiBaseUrl + 'v1/add-user';
    const body = JSON.stringify({
                    username: username,
                    password: password,
                    email: email,
                    terms_accepted: acceptedTerms,
                });
    return poster(url, body);    
}
// -----------------------------------------------------------------------------

export async function login(email: string, password: string): Promise<IApiStatus> {
    const url = apiBaseUrl + 'v1/login';
    const body = JSON.stringify({
                    password: password,
                    email: email,
                });
    return poster(url, body);
}
// -----------------------------------------------------------------------------

export async function passwordReset(email: string): Promise<IApiStatus> {
    const url = apiBaseUrl + 'v1/password-reset';
    const body = JSON.stringify({
                    email: email,
                });
    return poster(url, body);
}
// -----------------------------------------------------------------------------
// End
// -----------------------------------------------------------------------------
