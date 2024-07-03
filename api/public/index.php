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
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use Slim\Exception\HttpNotFoundException;

# ------------------------------------------------------------------------------

$app = AppFactory::create();
$app->addBodyParsingMiddleware();
$app->addRoutingMiddleware();
$app->add(new BasePathMiddleware($app));
# Set first boolean to false in production code
$app->addErrorMiddleware(false, true, true);

# ------------------------------------------------------------------------------
# Include API core and main code.

require_once '../private/ApiCore.php';
require_once '../private/ApiMain.php';

# ------------------------------------------------------------------------------
# Handle OPTIONS preflight requests for CORS on all routes.

$app->options('/{routes:.+}', 
    function (Request $request, Response $response, $args) {
        // $logger = get_logger('OptionsHandler');
        // $logger->info('Options: ' . (string)$request->getUri());
        return $response;
    }
);
# ------------------------------------------------------------------------------
# Log all unmatched calls. Must come last in route chain.

$app->map(['GET', 'POST', 'PUT', 'DELETE', 'PATCH'], '/{routes:.+}', 
    function (Request$request, Response$response) {
        $logger = get_logger('UnmatchedRequests');
        $logger->warning('Unmatched request: ' . (string)$request->getMethod());
        throw new HttpNotFoundException($request);
    }
);
# ------------------------------------------------------------------------------

$app->run();

# ------------------------------------------------------------------------------

/*
End
*/