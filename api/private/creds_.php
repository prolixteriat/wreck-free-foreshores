<?php declare (strict_types=1);

# ------------------------------------------------------------------------------

require_once 'config.php';

# ------------------------------------------------------------------------------
# Crypto values.
# 'JWT'- Key for signing of JWT tokens.
# 'EMAIL_SALT' - Salt value used in generation of email verification tokens.

if ((ENVIRONMENT === LOCAL) || (ENVIRONMENT === TEST)) {
       define('JWT_KEY', '');
       define('EMAIL_SALT', '');   
} else if ((ENVIRONMENT === DEV) || (ENVIRONMENT === PROD)) {
       define('JWT_KEY', '');
       define('EMAIL_SALT', '');
} else {
       die('Invalid environment');
}
# ------------------------------------------------------------------------------
# Database credentials.

if (ENVIRONMENT === DEV) {
       define('DB', array(
              'host'     => '',
              'user'     => '',	
              'password' => '',
              'dbname'   => ''));
} else if (ENVIRONMENT === LOCAL) {
       define('DB', array(
              'host'     => '',
              'user'     => '',	
              'password' => '',
              'dbname'   => ''));
} else if (ENVIRONMENT === PROD) {
       define('DB', array(
              'host'     => '',
              'user'     => '',	
              'password' => '',
              'dbname'   => ''));
} else if (ENVIRONMENT === TEST) {
       define('DB', array(
              'host'     => '',
              'user'     => '',	
              'password' => '',
              'dbname'   => ''));       
} else {
       die('Invalid environment');
}
# ------------------------------------------------------------------------------
# Email credentials.

if ((ENVIRONMENT === LOCAL) || (ENVIRONMENT === TEST) ){
       define('MAIL', array(
              'host'     => '',
              'username' => '',
              'password' => ''));     
} else if ((ENVIRONMENT === DEV) || (ENVIRONMENT === PROD)) {
       define('MAIL', array(
              'host'     => '',
              'username' => '',
              'password' => ''));
} else {
       die('Invalid environment');
}
# ------------------------------------------------------------------------------

/*
End
*/