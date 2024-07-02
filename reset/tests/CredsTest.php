<?php declare (strict_types=1);

# ------------------------------------------------------------------------------

require_once 'private/creds.php';

use PHPUnit\Framework\TestCase;

# ------------------------------------------------------------------------------
# Check that creds constants have been properly defined.

final class CredsTest extends TestCase {

    # --------------------------------------------------------------------------

    public function setUp(): void {
        return;
    }
    # --------------------------------------------------------------------------
    
    public function tearDown(): void {
        return;
    }
    # --------------------------------------------------------------------------

    public function test_has_creds_db(): void {
        $ok = isset(DB['host']) and (strlen(DB['host']) > 0) and
            isset(DB['user']) and (strlen(DB['user']) > 0) and
            isset(DB['password']) and (strlen(DB['password']) > 0) and
            isset(DB['dbname']) and (strlen(DB['dbname']) > 0);
        $this->assertTrue($ok);
    }
    # --------------------------------------------------------------------------
    
    public function test_has_creds_other(): void {
        $ok = (strlen(ENVIRONMENT) > 0);
        $this->assertTrue($ok);
    }    
    # --------------------------------------------------------------------------
}
# ------------------------------------------------------------------------------

/*
End
*/
