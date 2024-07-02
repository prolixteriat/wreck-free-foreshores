<?php declare (strict_types=1);

# ------------------------------------------------------------------------------
# Define constants for different build environments.
define('DEV', 'dev');
define('LOCAL', 'local');
define('PROD', 'prod');
define('TEST', 'test');

# Set the current environment.
define('ENVIRONMENT', LOCAL);

# ------------------------------------------------------------------------------
# Path constants.

if (ENVIRONMENT === DEV) {
    define('BASE_URL', '');
    define('API_URL', '');
    define('HOME_URL', '');
} else if (ENVIRONMENT === LOCAL) {
    define('BASE_URL', '');
    define('API_URL', '');
    define('HOME_URL', '');
} else if (ENVIRONMENT === PROD) {
    define('BASE_URL', 'https://map.wreckfree.org');
    define('API_URL', 'https://api.wreckfree.org');
    define('HOME_URL', 'https://wreckfree.org');
} else if (ENVIRONMENT === TEST) {
    define('BASE_URL', '');
    define('API_URL', '');
    define('HOME_URL', '');
} else {
    die('Invalid environment');
}  

define('LOGBASE', '../logs');
define('LOGPATH', LOGBASE . '/api.log');

# ------------------------------------------------------------------------------

/*
End
*/