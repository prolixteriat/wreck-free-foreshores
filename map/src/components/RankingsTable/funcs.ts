import { TWrecksSchema } from '@hooks/useWrecks';

// -----------------------------------------------------------------------------

export interface IRank {
    username: string;
    total: number;
    mostRecent: string;
}
// -----------------------------------------------------------------------------

export function transformData(wrecks: TWrecksSchema|undefined): IRank[]|null {
    
    if (!wrecks) {
        return null;
    }
    const ranks: IRank[] = [];

    for (const wreck of wrecks) {
        const { reporter_name, reported_at } = wreck;
        const rank = ranks.find((rank) => rank.username === reporter_name);
        if (rank) {
            rank.total += 1;
            if (rank.mostRecent < reported_at) {
                rank.mostRecent = reported_at;
            }
        } else {
            ranks.push({
                username: reporter_name,
                total: 1,
                mostRecent: reported_at,
            });
        }
    }
    const sortedRanks = ranks.sort(sortRanks);
    return sortedRanks;
}
// -----------------------------------------------------------------------------

function sortRanks(a: IRank, b: IRank): number {
    if (a.total === b.total) {
        return a.mostRecent > b.mostRecent ? -1 : 1;
    } else {
        return a.total > b.total ? -1 : 1;
    }
}
// -----------------------------------------------------------------------------
// End
// -----------------------------------------------------------------------------

