<?php declare(strict_types=1);

# ------------------------------------------------------------------------------

require_once 'creds.php';
require_once 'utils.php';

use Monolog\Logger;

# ------------------------------------------------------------------------------

class Status {
    # Properties
    public bool $success;
    public string $message;

    # --------------------------------------------------------------------------
    # Methods
    # --------------------------------------------------------------------------
    # Constructor

    function __construct(bool $success, string $message) {
        $this->success = $success;
        $this->message = $message;
    }
    # --------------------------------------------------------------------------
}
# ------------------------------------------------------------------------------

class DbInterface {
    # Properties
    private mysqli $conn;       
    private Logger $logger;     

    # --------------------------------------------------------------------------
    # Methods
    # --------------------------------------------------------------------------
    # Constructor

    function __construct() {

        $this->logger = get_logger('DbInterface');
        # Create database connection
        $this->conn = new mysqli(DB['host'], DB['user'], 
                                 DB['password'], DB['dbname']);
        if ($this->conn->connect_error) {
            $this->logger->error('Database connection failed: ' . 
                                 $this->conn->connect_error);
            die('Database connection failed.');            
        }
        $this->conn->set_charset('utf8mb4');
    }
    # --------------------------------------------------------------------------
    # Destructor

    function __destruct() {
        $this->conn->close();
    }
    # --------------------------------------------------------------------------

    public function check_token(string $email, $token): Status {
        try {
            $token_hash = hash('sha256', $token);
            $query = 'SELECT expiry FROM password_reset WHERE token=? AND email=?';
            $stmt = $this->conn->prepare($query);
            $stmt->bind_param('ss', $token_hash, $email);
            $stmt->execute();
            $row = $stmt->get_result()->fetch_assoc();
            if ($row) {
                $expiry = $row['expiry'];
                $cur_date =  date('Y-m-d H:i:s');
                $status = ($expiry > $cur_date) ? 
                        new Status(true, 'Token is valid') : 
                        new Status(false, 'Token has expired. Please request another password reset.');

            } else {
                $status = new Status(false, 'Token is invalid') ;
            }
        } catch (Exception $e) {
            $status = new Status(false, 'Token validation error');
        } finally {
            if (isset($stmt)) { $stmt->close(); }            
        }
        return $status;
    }   
    # --------------------------------------------------------------------------
    
    private function delete_token(string $email): Status {
        try {
            $query = 'DELETE FROM password_reset WHERE email=?';
            $stmt = $this->conn->prepare($query);
            $stmt->bind_param('s', $email);
            $status = $stmt->execute() && ($this->conn->affected_rows > 0) ? 
                    new Status(true, 'Token deleted successfully') :
                    new Status(false, 'Token deletion failed');

        } catch (Exception $e) {
            $status = new Status(false, 'Token deletion failed');
        } finally {
            if (isset($stmt)) { $stmt->close(); }            
        }
        return $status;
    }
    # --------------------------------------------------------------------------

    public function update_password(string $email, string $password): Status {  
        try {
            $password_hash = hash('sha256', $password);
            $query = 'UPDATE users SET password=? WHERE email=?';
            $stmt = $this->conn->prepare($query);
            $stmt->bind_param('ss', $password_hash, $email);
            if ($status = $stmt->execute()) {
                $status = new Status(true, 'Password updated successfully. You can now return to the ' . 
                '<a href="https://map.wreckfree.org" class="text-blue-500 hover:text-blue-700 underline">
                login page</a>.');
                // Set 'verified' flag in case not already set
                $this->verify_email($email);
            } else {
                $status = new Status(false, 'Password update failed');
            }
        } catch (Exception $e) {
            $status = new Status(false, 'Password update failed');
        } finally {
            if (isset($stmt)) { $stmt->close(); }           
            $this->delete_token($email);
        }
        return $status;
    }  
 # --------------------------------------------------------------------------

 private function verify_email(string $email): void {
        
    try {
        $query = "UPDATE users SET verified=1 WHERE (email=?)";
        $stmt = $this->conn->prepare($query);
        $stmt->bind_param('s', $email);
        $stmt->execute(); 
    } catch (Exception $e) {
        $this->logger->error('verify_email: '. $e->getMessage());
    } finally {
        if (isset($stmt)) { $stmt->close(); }
    }
    return;
}
# --------------------------------------------------------------------------

}

# ------------------------------------------------------------------------------

/*
End
*/
