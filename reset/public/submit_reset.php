<?php declare(strict_types=1);

# ------------------------------------------------------------------------------

error_reporting(E_ALL);
ini_set('error_log', '../logs/php-errors.log');
ini_set('log_errors', 1);
# Set next value to 0 in production code or 1 in dev code
ini_set('display_errors', 0);

# ------------------------------------------------------------------------------

require_once '../vendor/autoload.php';
require_once '../private/database.php';

# ------------------------------------------------------------------------------

if (!isset($_POST['token']) || 
    !isset($_POST['email']) || 
    !isset($_POST['password']) ) {
  echo get_page('Invalid request');
  exit();
}
$email = $_POST['email'];
$token = $_POST['token'];
$password = $_POST['password'];

$db = new DbInterface();
$status = $db->check_token($email, $token);
if ($status->success) {
  $status = $db->update_password($email, $password);
}
unset($db);

echo get_page($status->message);

# ------------------------------------------------------------------------------
/*
End
*/