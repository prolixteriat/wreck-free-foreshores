<?php declare (strict_types=1);

# ------------------------------------------------------------------------------

require_once 'private/mailer.php';
require_once 'private/QueryMain.php';
require_once 'tests/creds.php';

use PHPUnit\Framework\TestCase;

# ------------------------------------------------------------------------------

final class QueryMainTest extends TestCase {

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

    public function test_get_wrecks(): void {
        $status = $this->query->get_wrecks();
        $this->assertTrue($status->success);
    } 
    # --------------------------------------------------------------------------

    public function test_add_wreck(): void {
        # success
        $params_correct = array('location' => 'test_location', 'latitude' => '50.095771', 
            'longitude' => '-5.12973', 'length' => '1.3', 'sort' => 'test_sort', 
            'hull' => 'test_hull', 'engine' => 'test_engine', 'position' => 'test_position', 
            'floating' => 'test_floating', 'vessel_condition' => 'test_condition');
        $token_payload = array('sub' => 'test_user', 'user_id' => 1);
        $status = $this->query->add_wreck($params_correct, $token_payload);
        $this->assertTrue($status->code === 200); 
        # disabled user
        $token_payload = array('sub' => 'test_disabled', 'user_id' => 1);
        $status = $this->query->add_wreck($params_correct, $token_payload);
        $this->assertTrue($status->code === 403); 
        # incorrect query - record
        $params = array('location' => 'test_location', 'latitude' => '50.095771', 
            'longitude' => '-5.12973', 'length' => '1.3', 'sort' => 'test_sort', 
            'floating' => 'test_floating', 'vessel_condition' => 'test_condition');
        $token_payload = array('sub' => 'test_user', 'user_id' => 1);
        $status = $this->query->add_wreck($params, $token_payload);
        $this->assertTrue($status->code === 400); 
        # incorrect query - token
        $params = array('location' => 'test_location', 'latitude' => '50.095771', 
            'longitude' => '-5.12973', 'length' => '1.3', 'sort' => 'test_sort', 
            'hull' => 'test_hull', 'engine' => 'test_engine', 'position' => 'test_position', 
            'floating' => 'test_floating', 'vessel_condition' => 'test_condition');
        $token_payload = array('sub' => 'test_user');
        $status = $this->query->add_wreck($params_correct, $token_payload);
        $this->assertTrue($status->code === 400);       
    }    
    # --------------------------------------------------------------------------

    public function test_get_photo(): void {
        # success
        $params = array('id' => 1);
        $status = $this->query->get_photo($params);
        $this->assertTrue($status->code === 200);
        # invalid ID
        $params = array('id' => -1);
        $status = $this->query->get_photo($params);
        $this->assertTrue($status->code === 404);
        # incorrect query
        $params = array('photo_id' => 1);
        $status = $this->query->get_photo($params);
        $this->assertTrue($status->code === 400);
    }
    # --------------------------------------------------------------------------

    public function test_get_photo_info(): void {
        # success
        $params = array('id' => 1);
        $status = $this->query->get_photo_info($params);
        $this->assertTrue($status->code === 200);
        # invalid ID
        $params = array('id' => -1);
        $status = $this->query->get_photo_info($params);
        $this->assertTrue($status->code === 404);
        # incorrect query
        $params = array('photo_id' => 1);
        $status = $this->query->get_photo_info($params);
        $this->assertTrue($status->code === 400);
    }
    # --------------------------------------------------------------------------
}
# ------------------------------------------------------------------------------

/*
End
*/
