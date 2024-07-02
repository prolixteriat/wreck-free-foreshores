<?php declare (strict_types=1);

# ------------------------------------------------------------------------------

require_once 'private/mailer.php';
require_once 'private/QueryCore.php';
require_once 'tests/creds.php';

use PHPUnit\Framework\TestCase;

# ------------------------------------------------------------------------------

final class QueryCoreTest extends TestCase {

    private QueryCore $query;
    private string $password;

    # --------------------------------------------------------------------------

    public function setUp(): void {
        $this->query = new QueryCore();
        $this->password = TEST_PASSWORD;
    }
    # --------------------------------------------------------------------------
    
    public function tearDown(): void {
        unset($this->query);
    }
    # --------------------------------------------------------------------------

    public function test_add_user(): void {
        # success
        $name = 'test_' . strval(random_int(0, 99999));
        $params = array('username' => $name, 'email' => "$name@bandolin.co.uk", 
            'password' => $this->password, 'terms_accepted' => 1);
        $status = $this->query->add_user($params);
        $this->assertTrue($status->code === 200);
        # duplicate email
        $params = array('username' => 'newuser', 'email' => 'user@bandolin.co.uk', 
            'password' => 'junkpass', 'terms_accepted' => 1);
        $status = $this->query->add_user($params);
        $this->assertTrue($status->code === 409);
        # incorrect query
        $params = array('username' => 'newuser', 'email' => 'user@bandolin.co.uk', 
            'password' => $this->password);
        $status = $this->query->add_user($params);
        $this->assertTrue($status->code === 400); 
    }
    # --------------------------------------------------------------------------

    public function test_get_users_all(): void {
        # success
        $token_payload = array('sub' => 'test_user');
        $status = $this->query->get_users_all($token_payload);
        $this->assertTrue($status->code === 200); 
        # disabled user
        $token_payload = array('sub' => 'test_disabled');
        $status = $this->query->get_users_all($token_payload);
        $this->assertTrue($status->code === 403); 
        # incorrect query - token
        $token_payload = array('user_id' => '1');
        $status = $this->query->get_users_all($token_payload);
        $this->assertTrue($status->code === 400);       
    }    
    # --------------------------------------------------------------------------

    public function test_login(): void {
        # success
        $params = array('email' => 'user@bandolin.co.uk', 'password' => $this->password);
        $status = $this->query->login($params);
        $this->assertTrue($status->code === 200);
        # wrong password
        $params = array('email' => 'user@bandolin.co.uk', 'password' => 'incorrect');
        $status = $this->query->login($params);
        $this->assertTrue($status->code === 401);
        # unverified
        $params = array('email' => 'unverified@bandolin.co.uk', 'password' => $this->password);
        $status = $this->query->login($params);
        $this->assertTrue($status->code === 401);
        # disabled
        $params = array('email' => 'disabled@bandolin.co.uk', 'password' => $this->password);
        $status = $this->query->login($params);
        $this->assertTrue($status->code === 403);
        # incorrect query
        $params = array('username' => 'nosuchaddress@bandolin.co.uk');
        $status = $this->query->login($params);
        $this->assertTrue($status->code === 400);        
    }
    # --------------------------------------------------------------------------

    public function test_password_reset(): void {
        # success
        #* temporarily commented out to avoid spamming me
        $params = array('email' => 'user@bandolin.co.uk');
        $status = $this->query->password_reset($params);
        $this->assertTrue($status->code === 200);
        # unregistered email
        $params = array('email' => 'nosuchaddress@bandolin.co.uk');
        $status = $this->query->password_reset($params);
        $this->assertTrue($status->code === 404);
        # incorrect query
        $params = array('username' => 'nosuchaddress@bandolin.co.uk');
        $status = $this->query->password_reset($params);
        $this->assertTrue($status->code === 400);
    }      
    # --------------------------------------------------------------------------

    public function test_verify_email(): void {
        # success - token can only be used once, so test will fail if reused
        /*
        $params = array('token' => '8533c486b5248fe48ca783f504095b0e4f81b2d51b1894c039392a024172e3ab');
        $status = $this->query->verify_email($params);
        $this->assertTrue($status->code === 200);  
        */ 
        # invalid token
        $params = array('token' => 'sdf897sdf987h23kjhadsvv346');
        $status = $this->query->verify_email($params);
        $this->assertTrue($status->code === 500);
        # incorrect query
        $params = array('username' => 'nosuchaddress@bandolin.co.uk');
        $status = $this->query->verify_email($params);
        $this->assertTrue($status->code === 400);
    }      
    # --------------------------------------------------------------------------

    public function test_verify_resend(): void {
        # success
        $params = array('email' => 'user@bandolin.co.uk');
        $status = $this->query->verify_resend($params);
        $this->assertTrue($status->code === 200); 
        # unregistered email address
        $params = array('email' => 'nosuchaddress@bandolin.co.uk');
        $status = $this->query->verify_resend($params);
        $this->assertTrue($status->code === 200);
        # incorrect query
        $params = array('username' => 'nosuchaddress@bandolin.co.uk');
        $status = $this->query->verify_resend($params);
        $this->assertTrue($status->code === 400);
    }   
    # --------------------------------------------------------------------------
}
# ------------------------------------------------------------------------------

/*
End
*/
