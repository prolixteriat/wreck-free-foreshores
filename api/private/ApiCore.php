<?php declare (strict_types=1);

# ------------------------------------------------------------------------------

require_once 'QueryCore.php';

# ------------------------------------------------------------------------------

use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;

# ------------------------------------------------------------------------------
# Message constants.

define('AUTH_FAILED', 'Authorisation failed. Please login first.');
define('ADMIN_REQUIRED', 'Administrator permissions required');

# ------------------------------------------------------------------------------

$app->post('/v1/add-user', function (Request $request, Response $response) {
    
    $query = new QueryMain();
    $status = $query->add_user($request->getParsedBody());
    unset($query);    
    $response->getBody()->write($status->message);

    return $response
        ->withHeader('Content-Type', 'application/json')
        ->withStatus($status->code);
});

# ------------------------------------------------------------------------------
# TODO
$app->get('/v1/get-audit', function (Request $request, Response $response) {

    $status = is_admin($request) ?
        new Status(false, 501, 'Successful authorisation. Endpoint not implemented') :
        new Status(false, 401, ADMIN_REQUIRED);
    
    $response->getBody()->write($status->message);

    return $response
        ->withHeader('Content-Type', 'application/json')
        ->withStatus($status->code);
})->add(\PsrJwt\Factory\JwtMiddleware::json(JWT_KEY, 'jwt', array(AUTH_FAILED)));

# ------------------------------------------------------------------------------
 
$app->get('/v1/get-users-all', function (Request $request, Response $response) {

    if (is_admin($request)) {
        $query = new QueryMain();
        $status = $query->get_users_all(get_token_payload($request));
        unset($query);    
    } else {
        $status = new Status(false, 401, ADMIN_REQUIRED);
    }
    
    $response->getBody()->write($status->message);

    return $response
        ->withHeader('Content-Type', 'application/json')
        ->withStatus($status->code);
})->add(\PsrJwt\Factory\JwtMiddleware::json(JWT_KEY, 'jwt', array(AUTH_FAILED)));

# ------------------------------------------------------------------------------

$app->post('/v1/login', function (Request $request, Response $response, $args) {

    $query = new QueryMain();
    $status = $query->login($request->getParsedBody());
    unset($query);

    if ($status->success) {
        $factory = new \PsrJwt\Factory\Jwt();
        $builder = $factory->builder();
        $token = $builder->setSecret(JWT_KEY)
            ->setSubject($status->data['username'])
            ->setNotBefore(time() - 30)       
            ->setExpiration(time() + (604800 * 4))       // 4 week
            ->setPayloadClaim('role', $status->data['role'])
            ->setPayloadClaim('user_id', $status->data['user_id'])
            ->build();
        $response->getBody()->write(json_encode($token->getToken()));
    } else {
        $response->getBody()->write($status->message);
    }
	return $response
			->withHeader('Content-Type', 'application/json')
            ->withStatus($status->code);   	
});

# ------------------------------------------------------------------------------

$app->post('/v1/password-reset', function (Request $request, Response $response, $args) {

    $query = new QueryMain();
    $status = $query->password_reset($request->getParsedBody());
    unset($query);
    $response->getBody()->write($status->message);
    return $response
			->withHeader('Content-Type', 'application/json')
            ->withStatus($status->code); 
});

# ------------------------------------------------------------------------------
# TODO
$app->post('/v1/update-role/{username}/{role}', function (Request $request, Response $response, $args) {

    $status = is_admin($request) ?
        new Status(false, 501, 'Successful authorisation. Endpoint not implemented') :
        new Status(false, 401, ADMIN_REQUIRED);
    
    $response->getBody()->write($status->message);

    return $response
        ->withHeader('Content-Type', 'application/json')
        ->withStatus($status->code);
})->add(\PsrJwt\Factory\JwtMiddleware::json(JWT_KEY, 'jwt', array(AUTH_FAILED)));

# ------------------------------------------------------------------------------

$app->get('/v1/verify-email/{token}', function (Request $request, Response $response, $args) {
    $query = new QueryMain();
    $status = $query->verify_email($args);
    unset($query);
    $response->getBody()->write($status->data);
	return $response
			->withHeader('Content-Type', 'text/html')
            ->withStatus($status->code);
});

# ------------------------------------------------------------------------------

$app->get('/v1/verify-resend/{email}', function (Request $request, Response $response, $args) {
    $query = new QueryMain();
    $status = $query->verify_resend($args);
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