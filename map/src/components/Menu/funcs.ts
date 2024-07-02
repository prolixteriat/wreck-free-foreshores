import { environment } from '@lib/config';

// -----------------------------------------------------------------------------

export const getTitle = (): string => {
    const title: string = 'Wreck Free Foreshores';
    switch (environment) {
        case 'dev':
            return title + ' (dev)';
        case 'local':
            return title + ' (local)';
        case 'prod':
            return title;
        case 'test':
            return title + ' (test)';
        default:
            console.error(`Unknown environment: ${environment}`);
            return title;
    }
}
// -----------------------------------------------------------------------------
// End
// -----------------------------------------------------------------------------

