<?php declare (strict_types=1);

# ------------------------------------------------------------------------------

require_once 'QueryMain.php';

# ------------------------------------------------------------------------------

use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;

# ------------------------------------------------------------------------------
# 
$app->post('/v1/add-wreck', function (Request $request, Response $response) {
    
    $query = new QueryMain();
    $status = $query->add_wreck($request->getParsedBody(), get_token_payload($request));
    unset($query);    
    $response->getBody()->write($status->message);

    return $response
        ->withHeader('Content-Type', 'application/json')
        ->withStatus($status->code);
})->add(\PsrJwt\Factory\JwtMiddleware::json(JWT_KEY, 'jwt', array(AUTH_FAILED)));

// Allow additional preflight requests for CORS
$app->options('/v1/add-wreck', function (Request $request, Response $response): Response {
    return $response;
});

# ------------------------------------------------------------------------------

$app->get('/v1/get-photo/{id}', function (Request $request, Response $response, $args) {

    $query = new QueryMain();
    $status = $query->get_photo($args);
    unset($query);
    ($status->success) ? 
        $response->getBody()->write($status->data) :
        $response->getBody()->write($status->message);
	return $response
			->withHeader('Content-Type', 'data:image/jpeg')
            ->withStatus($status->code);   	
});

# ------------------------------------------------------------------------------

$app->get('/v1/get-photo-info/{id}', function (Request $request, Response $response, $args) {

    $query = new QueryMain();
    $status = $query->get_photo_info($args);
    unset($query);
    $response->getBody()->write($status->message);
	return $response
			->withHeader('Content-Type', 'application/json')
            ->withStatus($status->code);   	
});

# ------------------------------------------------------------------------------

$app->get('/v1/get-wrecks', function (Request $request, Response $response, $args) {

    $query = new QueryMain();
    $status = $query->get_wrecks();
    unset($query);
    $response->getBody()->write($status->message);
	return $response
			->withHeader('Content-Type', 'application/json')
            ->withStatus($status->code);   	
});

# ------------------------------------------------------------------------------

/*
End
*/