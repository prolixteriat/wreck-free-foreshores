<?php declare (strict_types=1);

# ------------------------------------------------------------------------------

require_once 'config.php';

# ------------------------------------------------------------------------------
# Database credentials.

if (ENVIRONMENT === DEV) {
       define('DB', array(
              'host'     => '',
              'user'     => '',	
              'password' => '',
              'dbname'   => ''));   
} else if (ENVIRONMENT === LOCAL){
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

/*
End
*/