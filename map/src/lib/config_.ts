
// -----------------------------------------------------------------------------

type TEnvironment = 'dev' | 'local' | 'kiosk' | 'prod';

// -----------------------------------------------------------------------------

export const environment: TEnvironment = 'local';

// -----------------------------------------------------------------------------

export const homeUrl = 'https://wreckfree.org';
export let apiBaseUrl: string = '';
export let termsUrl: string = '';
export let devMode: boolean = false;
export let kioskMode: boolean = false;

// -----------------------------------------------------------------------------

export function initConfig(env: TEnvironment): void {

    if (env === 'dev') {
        apiBaseUrl = 'https://api-dev.wreckfree.org/';
        termsUrl = 'https://map-dev.wreckfree.org/static/terms.html';

    } else if (env === 'local') {
        apiBaseUrl = '';
        termsUrl = '';
        devMode = true;

    } else if (env === 'kiosk') {
        apiBaseUrl = 'https://api.wreckfree.org/';
        termsUrl = 'https://map.wreckfree.org/static/terms.html';
        kioskMode = true;

    } else if (env === 'prod') {
        apiBaseUrl = 'https://api.wreckfree.org/';
        termsUrl = 'https://map.wreckfree.org/static/terms.html';

    } else {
        const msg = `(initConfig) Unknown environment: ${env}`;
        console.error(msg);
        throw new Error(msg);
    }
}
// -----------------------------------------------------------------------------
// End
// -----------------------------------------------------------------------------
