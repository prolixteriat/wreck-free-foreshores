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

define('LOGBASE', '../logs');
define('LOGPATH', LOGBASE . '/api.log');

# ------------------------------------------------------------------------------

/*
End
*/