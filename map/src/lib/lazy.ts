import { lazy } from 'react';

// -----------------------------------------------------------------------------

export const BoatGallery = lazy(() => import('@components/BoatGallery/BoatGallery'));
export const EditTable = lazy(() => import('@components/EditTable/EditTable'));
export const LocationPicker = lazy(() => import('@components/LocationPicker/LocationPicker'));
export const NotificationForm = lazy(() => import('@components/NotificationForm/NotificationForm'));
export const RankingsTable = lazy(() => import('@components/RankingsTable/RankingsTable'));
export const SummaryTable = lazy(() => import('@components/SummaryTable/SummaryTable'));
export const UsersTable = lazy(() => import('@components/UsersTable/UsersTable'));
export const WrecksCharts = lazy(() => import('@components/WrecksCharts/WrecksCharts'));
export const WrecksMap = lazy(() => import('@components/WrecksMap/WrecksMap'));

// -----------------------------------------------------------------------------
// End
// -----------------------------------------------------------------------------
