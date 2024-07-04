import { Suspense } from 'react';

import { IWrecksContext } from '@lib/global';
import { JwtManager } from '@lib/jwtManager';
import { NotificationForm, RankingsTable, SummaryTable, UsersTable, 
    WrecksCharts, WrecksMap } from '@lib/lazy';

import { TWrecksSchema } from '@hooks/useWrecks';

import { Loading } from '@components/Common';


// -----------------------------------------------------------------------------

export interface ITab {
    id: TTabName;
    admin: boolean;
    title: string;
    component: React.JSX.Element;
}

// Use lowercase for tab names.
export type TTabName = 'charts' | 'form' | 'map' | 'ranks' | 'table' | 'users';

export type TTabSelectCallback = (tab: TTabName) => void;

// -----------------------------------------------------------------------------
// Create and return a single tab object, based upon the supplied tab name.

function makeTab(tabName: TTabName, wrecks: TWrecksSchema, mutate: number, onSelect: TTabSelectCallback): ITab|null {
  
    const formatTab = (title: string, admin: boolean, component: React.JSX.Element): ITab => {
        return {
            title: title, 
            id: tabName, 
            admin: admin,
            component: 
            <>
              <Suspense fallback={<Loading />}>
                  { component }
              </Suspense>
            </>
          };
    }

    switch (tabName) {
        case 'charts': {
            return formatTab('Charts', false, <WrecksCharts />);
        }

        case 'form': {
            return formatTab('Report a Wreck', false, <NotificationForm onSelect={onSelect} />);
        }

        case 'map': {
            return formatTab('Map', false, 
                <WrecksMap map_id='wreck_map' wrecks={wrecks} mutate={mutate} />);
        }

        case 'ranks': {
            return formatTab('Rankings', false, <RankingsTable />);
        }

        case 'table': {
            return formatTab('Summary Table', true, <SummaryTable />);
        }

        case 'users': {
            return formatTab('Users', true, <UsersTable />);
        }
        default: {
            console.error(`Unknown tab name: ${tabName}`);
      }
    }
    return null
}

// -----------------------------------------------------------------------------

export function makeTabs(context: IWrecksContext|undefined, onSelect: TTabSelectCallback): ITab[] {

    const tabs: ITab[] = [];
    const wrecks = context?.useWrecks.data;
    if (!wrecks) {
        return tabs;
    }

    const addTab= (tabName: TTabName) => {
        const tab: ITab|null = makeTab(tabName, wrecks, context?.mutate, onSelect);
        if (tab) {
            tabs.push(tab);
        }
    }
    
    addTab('map');
    addTab('charts');
    const role = new JwtManager().getRole();
    switch (role) {
        case '': {
            break;
        }
        case 'user': {
            addTab('ranks');
            addTab('form');
            break
        }
        case 'admin': {
            addTab('ranks');
            addTab('form');
            addTab('users');
            addTab('table');
            break
        }
        default: {
            console.error(`Unknown role: ${role}`);
      }
    }

  return tabs;
}  
// -----------------------------------------------------------------------------
// End
// -----------------------------------------------------------------------------
