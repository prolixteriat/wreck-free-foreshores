import { lazy } from 'react';

// -----------------------------------------------------------------------------
// Dynamically import the components used by tabs as not all tabs may be used.

export const NotificationForm = lazy(() => import('@components/NotificationForm/NotificationForm'));
export const RankingsTable = lazy(() => import('@components/RankingsTable/RankingsTable'));
export const SummaryTable = lazy(() => import('@components/SummaryTable/SummaryTable'));
export const UsersTable = lazy(() => import('@components/UsersTable/UsersTable'));
export const WrecksCharts = lazy(() => import('@components/WrecksCharts/WrecksCharts'));
export const WrecksMap = lazy(() => import('@components/WrecksMap/WrecksMap'));

// -----------------------------------------------------------------------------
// End
// -----------------------------------------------------------------------------
