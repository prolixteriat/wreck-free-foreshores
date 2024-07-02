<?php declare(strict_types=1);

# ------------------------------------------------------------------------------

require_once 'creds.php';
require_once 'utils.php';

use Monolog\Logger;

# ------------------------------------------------------------------------------
# Implements core database functionality (user management, auditing).

class DbCore {
    # Properties
    protected mysqli $conn;
    protected Logger $logger;

    # --------------------------------------------------------------------------
    # Methods
    # --------------------------------------------------------------------------

    function __construct() {

        $this->logger = get_logger('DbInterface');
        $this->conn = new mysqli(DB['host'], DB['user'], 
                                 DB['password'], DB['dbname']);
        if ($this->conn->connect_error) {
            $this->logger->error('Database connection failed: ' . 
                                 $this->conn->connect_error);
            die('Database connection failed');            
        }
        $this->conn->set_charset('utf8mb4');
    }
    # --------------------------------------------------------------------------

    function __destruct() {
        $this->conn->close();
    }   
    # --------------------------------------------------------------------------
    #
    protected function add_audit(string $operation, string $description): bool {

        try {
            $query = 'INSERT INTO audit (operation, description) VALUES (?, ?)';
            $stmt = $this->conn->prepare($query);
            $stmt->bind_param('ss', $operation, $description);
            $status = $stmt->execute();
        } catch (Exception $e) {
            $this->logger->error('add_audit: ' . $e->getMessage());
            $status = false;
        } finally {
            if (isset($stmt)) { $stmt->close(); }            
        }
        return $status;      
    }    
     # --------------------------------------------------------------------------
    #
    public function add_user(array $params): Status {

        try {
            $username = clean_input($params['username']);
            $email = clean_input($params['email']);
            $password = $params['password'];
            $terms_accepted = $params['terms_accepted'];

            $user_exists = $this->get_row('SELECT user_id FROM users WHERE username=?', $username);
            $email_exists = $this->get_row('SELECT user_id FROM users WHERE email=?', $email);
            $valid_username = is_validusername($username);
            if ($user_exists || $email_exists || !$valid_username || !$terms_accepted) {
                $msg = '';
                if ($user_exists) {
                    $msg .= "Username '$username' exists already. Please select another username. ";
                }
                if ($email_exists) {
                    $msg .= "Email '$email' exists already. Use the password reset link if you have forgotten the password. ";
                }
                if (!$valid_username) {
                    $msg .= "Invalid username. Username must be between 3 and 10 characters in length and not contain an '@' character. ";
                }
                if (!$terms_accepted) {
                    $msg .= "Terms and conditions must be accepted before creating an account. ";
                }                
                return new Status(false, 409, $msg);
            }                
            $hash_password = hash('sha256', $password);
            $query = 'INSERT INTO users (username, password, email, terms_accepted) VALUES (?, ?, ?, ?)';
            $stmt = $this->conn->prepare($query);
            $stmt->bind_param('ssss', $username, $hash_password, $email, $terms_accepted);

            if ($stmt->execute() && ($this->conn->affected_rows > 0) ) {
                $status = new Status(true, 200, "Account successfully created. We just sent an email to $email with a link to allow you to confirm ownership of the email account. Didn't see an email? Check your junk or spam folders.");
                $status->data = $this->conn->insert_id;
            } else {
                $status = new Status(false, 500, 'Failed to create user');
            }
            if ($status) {
                $this->add_audit('add_user', "Successfully created username: $username");
            }
        } catch (Exception $e) {
            $this->logger->error('add_user: ' . $e->getMessage());
            $status = new Status(false, 500, 'Error occurred (add_user)');
        } finally {
            if (isset($stmt)) { $stmt->close(); }            
        }
        return $status;    
    }
    # ----------------------------------------------------------------------
    # Return true if the given email exists.
    
    public function email_exists(string $email): bool {

        $row = $this->get_row('SELECT user_id FROM users WHERE email=?', $email);
        $rv = $row !== null;
        return $rv;
    }
    # --------------------------------------------------------------------------
    # 
    protected function get_row(string $query, string $value): array|null {
    
        try {
            $stmt = $this->conn->prepare($query);
            $stmt->bind_param('s', $value);
            $stmt->execute();
            $result = $stmt->get_result();
            $status = $result->fetch_assoc();
        }
        catch (Exception $e) {
            $this->logger->error('get_row: ' . $e->getMessage());
            $status = null;
        }
        finally {
            if (isset($stmt)) { $stmt->close(); } 
        }
        return $status;
    }
    # ----------------------------------------------------------------------
    # 
    protected function get_username(int|null $user_id): string|null {

        if (!$user_id) {
            return null;
        }
        $row = $this->get_row('SELECT username FROM users WHERE user_id=?', strval($user_id));
        $rv = ($row) ? $row['username'] : null;
        return $rv;
    }      
    # ----------------------------------------------------------------------
    # 
    public function get_users_all(array $token_payload): Status {
        try {
            $username = $token_payload['sub'];
            if ($this->username_disabled($username)) {
               return new Status(false, 403, 'Account is disabled'); 
            }
            $query = 'SELECT u.user_id, u.username, u.role, 
                        COUNT(w.reporter_id) as postings, u.verified, 
                        u.disabled, u.terms_accepted, u.created_at 
                      FROM users u
                      LEFT JOIN wrecks w ON u.user_id = w.reporter_id
                      GROUP BY u.user_id';
            $stmt = $this->conn->prepare($query);
            $stmt->execute();
            $result = $stmt->get_result();               
            $users = array();
            while($row = $result->fetch_assoc()) {
                $users[] = $row;
            }
            $status = new Status(true, 200, $users);
        } catch (Exception $e) {
            $this->logger->error('get_usersall: ' . $e->getMessage());
            $status = new Status(false, 500, 'Error occurred (get_usersall)');
        } finally {
            if (isset($stmt)) { $stmt->close(); }            
        }
        return $status;
    }     
    # --------------------------------------------------------------------------
    # 
    public function login(string $email, string $password): Status {
        try {
            $hash_password = hash('sha256', $password);
            $query = 'SELECT role, user_id, username, disabled, verified FROM users WHERE email=? AND password=?';
            $stmt = $this->conn->prepare($query);
            $stmt->bind_param('ss', $email, $hash_password);
            $stmt->execute();
            $result = $stmt->get_result();
            $row = $result->fetch_assoc();
            if ($row) {
                if ($row['disabled'] === 1) {
                    $status = new Status(false, 403, 'Account is disabled');
                } else if ($row['verified'] === 1) {
                        $this->add_audit('login', "Successful login: $email");
                    $status = new Status(true, 200, 'Successful login');
                    $status->data = array('username' => $row['username'], 
                                      'user_id' => $row['user_id'],
                                      'role' => $row['role']);
                } else {
                    $status =new Status(false, 401, 'Email address has not been verified. ' . 
                        'Please click on link in the verification email before attempting to login. ' .
                        'If you have not received a verification email, please use the "Forgotten password?" link instead.');
                }
            }
            else {
                $this->logger->warning('login: Incorrect credentials for '. $email);
                $status = new Status(false, 401, 'Failed to login. Please check email and password are correct.');
            }
        } catch (Exception $e) {
            $this->logger->error('login: '. $e->getMessage());
            $status = new Status(false, 500, 'Error occurred (login)');
        } finally {
            if (isset($stmt)) { $stmt->close(); }
        }
        return $status;
    }  
    # --------------------------------------------------------------------------
    #
    public function password_reset(string $email): Status {

        try {
            $email_exists = $this->get_row('SELECT user_id FROM users WHERE email=?', $email);
            if (!$email_exists) {
                return new Status(false, 404, 'No matching email address');
            }
            $token = md5($email . uniqid());
            $token_hash = hash('sha256', $token);
            $query = 'INSERT INTO password_reset (email, token) VALUES (?, ?)';
            $stmt = $this->conn->prepare($query);
            $stmt->bind_param('ss', $email, $token_hash);
            if ($stmt->execute()) {
                $status = new Status(true, 200, 'Password reset token created');
                $status->data = $token;
                $this->add_audit('password_reset', "Password reset token created for email: $email");
            } else {
                $status = new Status(false, 500, 'Failed to create password reset token');
            }
        } catch (Exception $e) {
            $this->logger->error('password_reset: '. $e->getMessage());
            $status = new Status(false, 500, 'Error occurred (password_reset)');
        } finally {
            if (isset($stmt)) { $stmt->close(); }
        }
        return $status;
    }  
    # --------------------------------------------------------------------------
    # Return true if the account linked to username is disabled or does not exist.
    
    protected function username_disabled(string $username): bool {

        $row = $this->get_row('SELECT disabled FROM users WHERE username=?', $username);
        $rv = $row === null || $row['disabled'];
        return $rv;
    } 
    # --------------------------------------------------------------------------

    public function verify_email(string $token): Status {
        
        $url = HOME_URL;
        try {
            $hash_qry = 'SHA2(CONCAT(email, "' . EMAIL_SALT . '"), 256)';
            $query = "UPDATE users SET verified=1 WHERE ($hash_qry=?)";
            $stmt = $this->conn->prepare($query);
            $stmt->bind_param('s', $token);
            $status = new Status(false, 500, 'Failed to verify email address');
            $status = $stmt->execute() && ($this->conn->affected_rows > 0) ? 
                new Status(true, 200, "Email address successfully verified. You can now return to <a href='$url' class='underline text-blue-600 hover:text-blue-800 visited:text-purple-600'>Wreck-Free Foreshores</a> and login. "): 
                new Status(false, 500, 'Failed to verify email address');
        } catch (Exception $e) {
            $this->logger->error('verify_email: '. $e->getMessage());
            $status = new Status(false, 500, 'Error occurred (verify_email)');
        } finally {
            if (isset($stmt)) { $stmt->close(); }
        }
        return $status;
    }
    # --------------------------------------------------------------------------
}
# ------------------------------------------------------------------------------

/*
End
*/
