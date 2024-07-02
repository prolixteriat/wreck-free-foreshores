<?php declare (strict_types=1);

# ------------------------------------------------------------------------------

require_once 'private/database.php';
require_once 'tests/creds.php';

use PHPUnit\Framework\TestCase;

# ------------------------------------------------------------------------------
# Check that creds constants have been properly defined.

final class DatabaseTest extends TestCase {

    private DbInterface $db;
    # --------------------------------------------------------------------------

    public function setUp(): void {
        $this->db = new DbInterface();
    }
    # --------------------------------------------------------------------------
    
    public function tearDown(): void {
        unset($this->query);
    }
    # --------------------------------------------------------------------------

    public function test_check_token(): void {
        # failure
        $status = $this->db->check_token('junk', 'junk');
        $this->assertFalse($status->success);
    }
    # --------------------------------------------------------------------------

    public function test_update_password(): void {
        # success
        $status = $this->db->update_password('user@bandolin.co.uk', TEST_PASSWORD);
        $this->assertTrue($status->success);

    }    
  
    # --------------------------------------------------------------------------
}
# ------------------------------------------------------------------------------

/*
End
*/
