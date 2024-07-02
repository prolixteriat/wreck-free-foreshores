import { useContext, useEffect, useState } from 'react';

import { WrecksContext } from '@lib/global';

import { ITab,  makeTabs, TTabName } from './makeTabs';

// -----------------------------------------------------------------------------

export default function Tabs(): React.JSX.Element {
    
    const [activeTab, setActiveTab] = useState<TTabName>('map');
    const context = useContext(WrecksContext);
    const [tabs, setTabs] = useState<ITab[]>([]);

    const onSelect = async (tab: TTabName) => {
        setActiveTab(tab);
    };

    useEffect(() => {
        const newTabs = makeTabs(context, onSelect);
        setTabs(newTabs);
    }, [context]);

    return (
        <div className='w-full p-4'>
            <div role='tablist' className='flex flex-wrap tabs tabs-lifted text-nowrap mb-4'>
                {tabs.map((tab, index) => (
                    <a role='tab'
                        key={index}
                        className={`tab ${activeTab === tab.id ? 'tab-active' : ''}`}
                        onClick={() => setActiveTab(tab.id)}
                    >
                        {tab.admin ? <span>&#9830;&nbsp;</span> : ''} {tab.title}
                    </a>
                ))}

            </div>
            {tabs.map((tab, index) => (
                <div key={index}>
                {(activeTab === tab.id) && tab.component}
                </div>
            ))}
        </div>
    );    
}
// -----------------------------------------------------------------------------
// End
// -----------------------------------------------------------------------------
