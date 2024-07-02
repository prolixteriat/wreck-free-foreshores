<?php declare (strict_types=1);

# ------------------------------------------------------------------------------

error_reporting(E_ALL);
ini_set('error_log', '../logs/php-errors.log');
ini_set('log_errors', 1);
# Set next value to zero in production code
ini_set('display_errors', 0);

# ------------------------------------------------------------------------------

require_once '../vendor/autoload.php';
require_once '../private/config.php';

# ------------------------------------------------------------------------------

use Selective\BasePath\BasePathMiddleware;
use Slim\Factory\AppFactory;

# ------------------------------------------------------------------------------

$app = AppFactory::create();
$app->addBodyParsingMiddleware();
$app->addRoutingMiddleware();
$app->add(new BasePathMiddleware($app));
# Set first boolean to false in production code
$app->addErrorMiddleware(false, true, true);

# ------------------------------------------------------------------------------

require_once '../private/ApiCore.php';
require_once '../private/ApiMain.php';

# ------------------------------------------------------------------------------

$app->run();

# ------------------------------------------------------------------------------

/*
End
*/