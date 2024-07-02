<?php declare (strict_types=1);

# ------------------------------------------------------------------------------

require_once 'private/QueryMain.php';
require_once 'tests/creds.php';

use PHPUnit\Framework\TestCase;

# ------------------------------------------------------------------------------

// Set to false by default to avoid accidental load testing
const DO_LOAD_TEST = false;

// Number of users / wrecks to generate
const LIGHT_USERS = 50;
const HEAVY_USERS = 10;

# ------------------------------------------------------------------------------

final class LoadTest extends TestCase {

    private QueryMain $query;
    private string $password;

    # --------------------------------------------------------------------------

    public function setUp(): void {
        $this->query = new QueryMain();
        $this->password = TEST_PASSWORD;
    }
    # --------------------------------------------------------------------------
    
    public function tearDown(): void {
        unset($this->query);
    }
    # --------------------------------------------------------------------------

    public function test_generate_load(): void {
        if (!DO_LOAD_TEST) {
            $this->assertTrue(true);
            return;
        }
        $success = true;
        // add large number of users with small number of wrecks
        for ($i=0; $i < LIGHT_USERS; $i++) {
            if (!$this->make_user_load(10)) {
                $success = false;
            }
        }
        // add small number of users with large number of wrecks
        for ($i=0; $i < HEAVY_USERS; $i++) {
            if (!$this->make_user_load(200)) {
                $success = false;
            }
        }
        $this->assertTrue($success);
    } 
    # --------------------------------------------------------------------------
    private function make_latlon(): array {
        $llat = 49.86463626;
        $llon = -6.418941851;
        $ulat = 55.81165983;
        $ulon = 1.76891206;        
        $randomLat = $llat + mt_rand() / mt_getrandmax() * ($ulat - $llat);
        $randomLon = $llon + mt_rand() / mt_getrandmax() * ($ulon - $llon);
                
        return array($randomLat, $randomLon);
    }

    # --------------------------------------------------------------------------
    private function make_user(): array {
        $name = 'test_' . strval(random_int(0, 99999));
        $params = array('username' => $name, 'email' => "$name@bandolin.co.uk", 
            'password' => $this->password, 'terms_accepted' => 1);
        return $params;
    }
    # --------------------------------------------------------------------------

    private function make_user_load(int $num_wrecks): bool {
        $user_success = true;
        $wreck_success = true;
        $user_params = $this->make_user();
        $status = $this->query->add_user($user_params);
        if ($status->success) {
            $token_payload = array('sub' => $user_params['username'], 'user_id' => $status->data);
            $num_wrecks = rand(0, $num_wrecks);
            for ($j=0; $j < $num_wrecks; $j++) {
                $wreck_params = $this->make_wreck();
                $status = $this->query->add_wreck($wreck_params, $token_payload);
                if (!$status->success) {
                    $wreck_success = false;
                }
            }
        } else {        
            $user_success = false;
        }
        return $user_success && $wreck_success;
    } 
    # --------------------------------------------------------------------------
    private function make_wreck(): array {
        $latlon = $this->make_latlon();
        $params = array('location' => 'test_location', 
            'latitude' => number_format($latlon[0], 4, '.', ''), 
            'longitude' => number_format($latlon[1], 4, '.', ''), 
            'length' => strval(rand(8, 29)), 
            'safety' => $this->getSafetyOptions(),
            'environmental' => $this->getEnvironmentalOptions(),
            'sort' => $this->getSortOption(), 
            'hull' => $this->getHullOption(), 
            'engine' => $this->getEngineOption(), 
            'position' => $this->getPositionOption(), 
            'floating' => $this->getFloatingOption(), 
            'vessel_condition' => $this->getConditionOption()
        );

        return $params;
    }
    # --------------------------------------------------------------------------

    private function getConditionOption(): string {
        $options = array( 
            'It could probably float and be towed away',
            'It could probably float with buoyancy bags and be towed away',
            'Total wreck - will need to be dismantled in place',
            'Could be removed by land',
            'Other'
        );
        return $options[array_rand($options)];
    }
    # --------------------------------------------------------------------------

    private function getEngineOption(): string {
        $options = array( 
            'No engine',
            'Inboard engine',
            'Outboard engine'
        );
        return $options[array_rand($options)];
    }
    # --------------------------------------------------------------------------

    private function getEnvironmentalOptions(): string {
        $options = array( 
            'Fuel tanks',
            'Oil in engine',
            'Containers of paint or chemicals',
            'Netting or things wildlife could get caught in',
            'Degrading plastics',
            'Other'
        );
        return $this->getStringArraySubset($options);
    }    
    # --------------------------------------------------------------------------

    private function getFloatingOption(): string {
        $options = array( 
            'Yes',
            'No',
            'Maybe'
        );
        return $options[array_rand($options)];
    }
    # --------------------------------------------------------------------------

    private function getHullOption(): string {
        $options = array( 
            'Fibreglass/GRP',
            'Wood',
            'Steel',
            'Aluminium',
            'Plastic',
            'Other'
        );
        return $options[array_rand($options)];
    }
    # --------------------------------------------------------------------------

    private function getPositionOption(): string {
        $options = array( 
            'Foreshore - above high water springs mark',
            'Foreshore - below high water springs mark',
            'On dry land'
        );
        return $options[array_rand($options)];
    }
    # --------------------------------------------------------------------------

    private function getSafetyOptions(): string {
        $options = array( 
            'Boat unstable and could fall over',
            'Boat not properly secured',
            'Boat in poor condition and would be a risk to people boarding it',
            'Other'
        );
        return $this->getStringArraySubset($options);
    }    
    # --------------------------------------------------------------------------

    private function getSortOption(): string {
        $options = array( 
            'Canoe or small personal watercraft',
            'Sailing dingy, tender, punt, small outboard boat',
            'Yacht - fin keel',
            'Yacht - bilge/twin keels',
            'Yacht - long keel',
            'Trimaran or catarmaran',
            'Motor yacht',
            'Fishing boat',
            'Other');
        return $options[array_rand($options)];
    }
    # --------------------------------------------------------------------------

    private function getStringArraySubset(array $options): string {
        $subset = array();
        $num_options = rand(0, 2);
        for ($i=0; $i < $num_options; $i++) {
            $option = $options[array_rand($options)];
            if (!in_array($option, $subset)) {
                array_push($subset, $option);
            }
        }
        return json_encode($subset);
    }
    # --------------------------------------------------------------------------
}
# ------------------------------------------------------------------------------

/*
End
*/
