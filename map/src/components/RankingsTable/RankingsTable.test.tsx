import React from 'react';
import { test, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';

import { ComponentWrapper } from '../ComponentWrapper';
import { IuseWrecks, TWrecksSchema } from '../../hooks/useWrecks'; 

// -----------------------------------------------------------------------------

const mockWrecksData: TWrecksSchema = [{"wreck_id":1,"location":"Trabas Beach","w3w":"settled.crucially.cheese","latitude":50.095771,"longitude":-5.12973,"name":"Bain de Soleil","make":"Chaparral","length":3.5,"sort":"Yacht - fin keel","hull":"Fibreglass/GRP","engine":"Inboard engine","position":"Foreshore - below high water springs mark","floating":"Yes","vessel_condition":"Total wreck - will need to be dismantled in place","additional":null,"reported_at":"2024-07-03 11:34:36","reporter_id":1,"owner_id":null,"hidden":0,"notified":0,"status":"Reported","comment":null,"updated_at":null,"reporter_name":"test_admin","owner_name":null,"environmental":["Fuel tanks","Oil in engine","Degrading plastics"],"safety":["Boat unstable and could fall over","Boat not properly secured","Boat in poor condition and would be a risk to people boarding it"],"photos":[1,2]},{"wreck_id":2,"location":"Port Navas Creek","w3w":"firelight.heartened.scanner","latitude":50.094505,"longitude":-5.133262,"name":"Beau Solei","make":"Cruisers Yachts","length":3,"sort":"Motor yacht","hull":"Aluminium","engine":"No engine","position":"On dry land","floating":"No","vessel_condition":"It could probably float with bouyancy bags and be towed away","additional":null,"reported_at":"2024-07-03 11:34:36","reporter_id":2,"owner_id":null,"hidden":0,"notified":0,"status":"Assigned","comment":null,"updated_at":null,"reporter_name":"test_user","owner_name":null,"environmental":["Fuel tanks","Containers of paint or chemicals"],"safety":["Boat unstable and could fall over"],"photos":[3,4,5]},{"wreck_id":3,"location":"Polpenwith Creek","w3w":"prefect.chatters.splice","latitude":50.093723,"longitude":-5.132043,"name":"Carpe Diem","make":"Bayliner","length":4.5,"sort":"Fishing boat","hull":"Fibreglass/GRP","engine":"Outboard engine","position":"Foreshore - above high water springs mark","floating":"Yes","vessel_condition":"It could probably float and be towed away","additional":null,"reported_at":"2024-07-03 11:34:36","reporter_id":1,"owner_id":null,"hidden":0,"notified":0,"status":"In progress","comment":null,"updated_at":null,"reporter_name":"test_admin","owner_name":null,"environmental":["Containers of paint or chemicals","Netting or things wildlife could get caught in","Degrading plastics"],"safety":["Boat not properly secured"],"photos":[6]},{"wreck_id":4,"location":"Padgagarrack Cove","w3w":"weddings.unfit.shark","latitude":50.096822,"longitude":-5.141713,"name":"Ciao Bella","make":"Yamaha","length":4.1,"sort":"Canoe or small personal watercraft","hull":"Steel","engine":"Inboard engine","position":"Foreshore - below high water springs mark","floating":"Yes","vessel_condition":"Total wreck - will need to be dismantled in place","additional":null,"reported_at":"2024-07-03 11:34:36","reporter_id":2,"owner_id":null,"hidden":0,"notified":0,"status":"Cleared","comment":null,"updated_at":null,"reporter_name":"test_user","owner_name":null,"environmental":["Containers of paint or chemicals"],"safety":["Boat in poor condition and would be a risk to people boarding it"],"photos":[7]},{"wreck_id":5,"location":"Ponsence Cove","w3w":"feels.amending.engrossed","latitude":50.099275,"longitude":-5.132085,"name":"Del Mar","make":"Alumacraft","length":3,"sort":"Yacht - fin keel","hull":"Aluminium","engine":"No engine","position":"Foreshore - below high water springs mark","floating":"No","vessel_condition":"Total wreck - will need to be dismantled in place","additional":"Nesting birds","reported_at":"2024-07-03 11:34:36","reporter_id":1,"owner_id":null,"hidden":0,"notified":0,"status":"Reported","comment":null,"updated_at":null,"reporter_name":"test_admin","owner_name":null,"environmental":["Netting or things wildlife could get caught in"],"safety":["Boat unstable and could fall over"],"photos":[8]},{"wreck_id":6,"location":"Bosahan Cove","w3w":"punters.proudest.waking","latitude":50.101835,"longitude":-5.140452,"name":"Dolce Far Niente","make":"Azimut","length":2.8,"sort":"Yacht - long keel","hull":"Fibreglass/GRP","engine":"Inboard engine","position":"Foreshore - above high water springs mark","floating":"Yes","vessel_condition":"It could probably float and be towed away","additional":null,"reported_at":"2024-07-03 11:34:36","reporter_id":2,"owner_id":null,"hidden":0,"notified":0,"status":"Reported","comment":null,"updated_at":null,"reporter_name":"test_user","owner_name":null,"environmental":["Fuel tanks"],"safety":["Boat in poor condition and would be a risk to people boarding it"],"photos":[9]},{"wreck_id":7,"location":"Grebe Beach","w3w":"deflation.riddle.slightly","latitude":50.097658,"longitude":-5.152308,"name":"Dreamboat","make":"Beneteau","length":4.1,"sort":"Canoe or small personal watercraft","hull":"Fibreglass/GRP","engine":"Outboard engine","position":"Foreshore - below high water springs mark","floating":"Yes","vessel_condition":"Could be removed by land","additional":null,"reported_at":"2024-07-03 11:34:36","reporter_id":1,"owner_id":null,"hidden":0,"notified":0,"status":"Reported","comment":null,"updated_at":null,"reporter_name":"test_admin","owner_name":null,"environmental":[],"safety":[],"photos":[10,11]},{"wreck_id":8,"location":"Trebah Beach","w3w":"observers.spearhead.shutting","latitude":50.093561,"longitude":-5.153486,"name":"La Dolce Vita","make":"Four Winns","length":3.7,"sort":"Yacht - fin keel","hull":"Fibreglass/GRP","engine":"No engine","position":"Foreshore - above high water springs mark","floating":"Yes","vessel_condition":"Total wreck - will need to be dismantled in place","additional":"Attacked by shark","reported_at":"2024-07-03 11:34:36","reporter_id":2,"owner_id":null,"hidden":0,"notified":0,"status":"Assigned","comment":null,"updated_at":null,"reporter_name":"test_user","owner_name":null,"environmental":["Oil in engine","Degrading plastics"],"safety":["Boat not properly secured","Boat in poor condition and would be a risk to people boarding it"],"photos":[12]},{"wreck_id":9,"location":"Porth Saxon Beach","w3w":"appealed.reforming.wades","latitude":50.09534,"longitude":-5.162399,"name":"Namaste","make":"Monterey","length":3.9,"sort":"Yacht - fin keel","hull":"Wood","engine":"No engine","position":"On dry land","floating":"Maybe","vessel_condition":"Could be removed by land","additional":null,"reported_at":"2024-07-03 11:34:36","reporter_id":1,"owner_id":null,"hidden":0,"notified":0,"status":"reported","comment":null,"updated_at":null,"reporter_name":"test_admin","owner_name":null,"environmental":["Oil in engine"],"safety":[],"photos":[13]},{"wreck_id":10,"location":"Gillan Creek","w3w":"fuzz.absorb.garden","latitude":50.092025,"longitude":-5.160549,"name":"Mariposa","make":"Bowriders","length":2.9,"sort":"Sailing dingy, tender, punt, small outboard boat","hull":"Plastic","engine":"No engine","position":"Foreshore - below high water springs mark","floating":"Maybe","vessel_condition":"It could probably float and be towed away","additional":"Mysterious cargo","reported_at":"2024-07-03 11:34:36","reporter_id":1,"owner_id":null,"hidden":0,"notified":0,"status":"In progress","comment":null,"updated_at":null,"reporter_name":"test_admin","owner_name":null,"environmental":["Netting or things wildlife could get caught in"],"safety":["Boat unstable and could fall over"],"photos":[14,15]},{"wreck_id":11,"location":"test_location","w3w":null,"latitude":50.095771,"longitude":-5.12973,"name":null,"make":null,"length":1.3,"sort":"test_sort","hull":"test_hull","engine":"test_engine","position":"test_position","floating":"test_floating","vessel_condition":"test_condition","additional":null,"reported_at":"2024-07-03 11:34:47","reporter_id":1,"owner_id":null,"hidden":0,"notified":0,"status":"Reported","comment":null,"updated_at":null,"reporter_name":"test_admin","owner_name":null,"environmental":[],"safety":[],"photos":[]}];

const mockUseWrecks: IuseWrecks = {
    data: undefined,
    error: undefined,
    isLoading: false,
    mutate: undefined
};

const initMockUseWrecks = () => {
    mockUseWrecks.data = undefined;
    mockUseWrecks.error = undefined;
    mockUseWrecks.isLoading = false;
    mockUseWrecks.mutate = undefined;
};

vi.mock('../../hooks/useWrecks', () => ({
   useWrecks: () => {
       return mockUseWrecks;
   },
}));

// -----------------------------------------------------------------------------

test('should contain the "test_admin" user in table', async () => {
    initMockUseWrecks();
    mockUseWrecks.data = mockWrecksData;    
    render( <ComponentWrapper component={'RankingsTable'} /> );
    // screen.debug();
    const textToMatch = await screen.findByText(/test_admin/);
    expect(textToMatch).not.toBeNull();    
});
// -----------------------------------------------------------------------------

test('should show error message', async () => {
    initMockUseWrecks();
    mockUseWrecks.error = new Error('test');    
    render( <ComponentWrapper component={'RankingsTable'} /> );
    const textToMatch = await screen.findByText(/Error retrieving wreck data/);
    expect(textToMatch).not.toBeNull();    
});
// -----------------------------------------------------------------------------
// End
// -----------------------------------------------------------------------------
