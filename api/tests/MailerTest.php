<?php declare (strict_types=1);

# ------------------------------------------------------------------------------

require_once 'private/mailer.php';

use PHPUnit\Framework\TestCase;

# ------------------------------------------------------------------------------
# 

final class MailerTest extends TestCase {

    private Mailer $mailer;

    # --------------------------------------------------------------------------

    public function setUp(): void {
        $this->mailer = new Mailer();
    }
    # --------------------------------------------------------------------------
    
    public function tearDown(): void {
        unset($this->mailer);
    }
    # --------------------------------------------------------------------------

    public function test_send_reset(): void {
        $ok = $this->mailer->send_reset('test@example.com', '123456');
        $this->assertTrue($ok);
    }
    # --------------------------------------------------------------------------
    public function test_send_verify(): void {
        $ok = $this->mailer->send_verify('test@example.com');
        $this->assertTrue($ok);
    }
    # --------------------------------------------------------------------------
}
# ------------------------------------------------------------------------------

/*
End
*/
