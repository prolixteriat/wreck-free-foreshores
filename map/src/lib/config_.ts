
// -----------------------------------------------------------------------------

type TEnvironment = 'dev' | 'local' | 'prod' | 'test';

// -----------------------------------------------------------------------------

export const environment: TEnvironment = 'local';

// -----------------------------------------------------------------------------

export const homeUrl = 'https://wreckfree.org';
export let apiBaseUrl: string = '';
export let termsUrl: string = '';
export let devMode: boolean = false;

// -----------------------------------------------------------------------------

export function initConfig(env: TEnvironment): void {

    if (env === 'dev') {
        apiBaseUrl = '';
        termsUrl = '';
        devMode = true;

    } else if (env === 'local') {
        apiBaseUrl = '';
        termsUrl = '';
        devMode = true;

    } else if (env === 'prod') {
        apiBaseUrl = 'https://api.wreckfree.org/';
        termsUrl = 'https://map.wreckfree.org/static/terms.html';
        devMode = false;

    } else if (env === 'test') {
        apiBaseUrl = '';
        termsUrl = '';
        devMode = true;

    } else {
        const msg = `(initConfig) Unknown environment: ${env}`;
        console.error(msg);
        throw new Error(msg);
    }
}
// -----------------------------------------------------------------------------
// End
// -----------------------------------------------------------------------------
