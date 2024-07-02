<?php declare (strict_types=1);

# ------------------------------------------------------------------------------

require_once 'creds.php';
require_once 'utils.php';

use PHPMailer\PHPMailer\PHPMailer;
use Monolog\Logger;

# ------------------------------------------------------------------------------

class Mailer {
    # Properties
    private Logger $logger;     # Monolog logger object
    private PHPMailer $mail;

    # --------------------------------------------------------------------------
    # Methods
    # --------------------------------------------------------------------------
    # Constructor

    function __construct() {

        $this->logger = get_logger('Mailer');
        $this->mail = new PHPMailer();
        $this->mail->isSMTP();
        // $this->mail->SMTPDebug = 2;
        $this->mail->Host = MAIL['host'];
        $this->mail->SMTPSecure = 'tls';
        $this->mail->Port = 587;
        $this->mail->SMTPAuth = true;
        $this->mail->Username = MAIL['username'];
        $this->mail->Password = MAIL['password'];
        $parts = explode('@', MAIL['username']);
        $noreply = 'noreply@' . $parts[1];
        $this->mail->setFrom(MAIL['username'], $noreply);
        $this->mail->addReplyTo($noreply);
    }
    # --------------------------------------------------------------------------
    # 
    public function send_reset(string $email, string $token): bool {
        try {
            $reset_url = BASE_URL . "/reset/index.php?email=$email&token=$token"; 
            $this->mail->clearAllRecipients();
            $this->mail->isHTML(false);
            $this->mail->addAddress($email);
            $this->mail->Subject = 'Wreck-Free Foreshores: Reset your password';
            # $this->mail->msgHTML(file_get_contents('message.html'), __DIR__);
            $message = "We received a request to reset the password for the Wreck-Free Foreshores user associated with this email address. If you did make this request, you can ignore this email.\n\n"
                    . "Click the link below to reset your password:\n"
                    . "$reset_url\n\n"
                    . "This link expires in one hour.\n";
            $this->mail->Body = $message;
            $rv = $this->mail->send();
        } catch (Exception $e) {
            $this->logger->error('send_reset: ' . $e->getMessage());
            $rv = false;
        }
        return $rv;
    }    
    # --------------------------------------------------------------------------
    # 

    public function send_verify(string $email): bool {
        try {
            $token = hash('sha256', $email . EMAIL_SALT);
            $verify_url = API_URL . '/v1/verify-email/' . $token; 
            $this->mail->clearAllRecipients();
            $this->mail->isHTML(false);
            $this->mail->addAddress($email);
            $this->mail->Subject = 'Wreck-Free Foreshores: Verify your email address';
            # $this->mail->msgHTML(file_get_contents('message.html'), __DIR__);
            $message = "Please click the link below to verify your email address:\n\n"
                    . "$verify_url\n\n"
                    . "If you did not request this verification, please ignore this email.\n";
            $this->mail->Body = $message;
            $rv = $this->mail->send();
        } catch (Exception $e) {
            $this->logger->error('send_verify: ' . $e->getMessage());
            $rv = false;
        }
        return $rv;
    }
    # --------------------------------------------------------------------------
}
# ------------------------------------------------------------------------------

/*
End
*/