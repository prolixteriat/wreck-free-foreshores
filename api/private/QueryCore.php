<?php declare(strict_types=1);

# ------------------------------------------------------------------------------

require_once 'config.php';
require_once 'DbMain.php';
require_once 'mailer.php';
require_once 'utils.php';

# ------------------------------------------------------------------------------

use Monolog\Logger;

# ------------------------------------------------------------------------------

class QueryCore {
    protected DbMain $db;    
    protected Logger $logger;     
    protected Mailer $mailer;    

    # --------------------------------------------------------------------------
    # Methods
    # --------------------------------------------------------------------------
    # Constructor

    function __construct() {

        $this->logger = get_logger('QueryMan');
        $this->db = new DbMain();
        $this->mailer = new Mailer();
    }
    # --------------------------------------------------------------------------

    function __destruct() {
        unset($this->db);
        unset($mailer->db);
    }   
    # --------------------------------------------------------------------------
    # 
    public function add_user(array $params): Status {

        $required_params = ['username', 'email', 'password', 'terms_accepted'];
        if (validate_params($params, $required_params)) {
            $status = $this->db->add_user($params);
            if ($status->success) {
                $this->mailer->send_verify($params['email']);
            }            
        } else {
            $status = new Status(false, 400, 
                'Incorrectly formatted query. Must supply all required parameters.');
        }
        return $status;
    } 
    # --------------------------------------------------------------------------
    # 
    public function get_users_all(array $token_payload): Status {
        
        $required_params = ['sub'];
        if (!validate_params($token_payload, $required_params)) {
            return new Status(false, 400, 'Incorrectly formatted authorisation token');
        }
        $status = $this->db->get_users_all($token_payload);
        return $status;
    }  
    # --------------------------------------------------------------------------
    # 
    public function login(array $params): Status {
        
        $required_params = ['email', 'password'];
        $status = validate_params($params, $required_params) ?
            $this->db->login($params['email'], $params['password']) :
            new Status(false, 400, 'Incorrectly formatted query. Must supply email and password.');

        return $status;
    }  
    # --------------------------------------------------------------------------
    
    public function password_reset(array $params): Status {

        $required_params = ['email'];
        if (validate_params($params, $required_params)) {
            $status = $this->db->password_reset($params['email']);
            if ($status->success) {
                $this->mailer->send_reset($params['email'], $status->data);
            }
        } else {
            $status = new Status(false, 400, 'Incorrectly formatted query. Must supply email.');
        }
        return $status;
    }    
    # --------------------------------------------------------------------------
    
    public function verify_email(array $args): Status {
   
        $required_params = ['token'];
        $status = validate_params($args, $required_params) ?
            $this->db->verify_email($args['token']) :
            new Status(false, 400, 'Incorrectly formatted query. Must supply token.');
         
        $html = get_page('Email Verification', json_decode($status->message));
        $status->data = $html;
        return $status;
    }  
    # --------------------------------------------------------------------------
    
    public function verify_resend(array $args): Status {
   
        $required_params = ['email'];
        if (validate_params($args, $required_params)) {
            if ($this->db->email_exists($args['email']) ) {
                $this->mailer->send_verify($args['email']);
            }
            $status = new Status(true, 200, 'If the email address has been registered, a password reset email will have been sent');
        } else {
            $status = new Status(false, 400, 'Incorrectly formatted query. Must supply email.');
        }            
        return $status;
    }        
    # --------------------------------------------------------------------------

}

# ------------------------------------------------------------------------------

/*
End
*/
