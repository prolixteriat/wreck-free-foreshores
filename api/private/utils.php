<?php declare(strict_types=1);

# ------------------------------------------------------------------------------

use Monolog\Logger;
use Monolog\Handler\RotatingFileHandler;
use Monolog\Formatter\LineFormatter;
use Monolog\Processor\WebProcessor;
use Psr\Http\Message\ServerRequestInterface as Request;
use PsrJwt\Helper\Request as HelperRequest;

# ------------------------------------------------------------------------------

class Status {
    # Properties
    public bool $success;
    public int $code;
    public string $message;
    public array|int|string|null $data;

    # --------------------------------------------------------------------------
    # Methods
    # --------------------------------------------------------------------------
    # Constructor

    function __construct(bool $success, int $code, string|array $message) {
        $this->success = $success;
        $this->code = $code;
        $this->message = json_encode($message);
        $this->data = null;
    }
    # --------------------------------------------------------------------------
}

# ------------------------------------------------------------------------------

function clean_json_array(string|null $input): array {
  if ($input === null) {
    $output = [];
  } else {
    $output = json_decode($input);
    foreach ($output as $key => $value) {
      $output[$key] = clean_input($value);
    }
  }
  return $output;
}

# ------------------------------------------------------------------------------

function clean_input(string|null $input): string|null {
    if ($input === null)  {
      $output = null;
    } else{
      $output = trim($input);
      $output = stripslashes($output);
      $output = htmlspecialchars($output);
    }
    return $output;
}
# ------------------------------------------------------------------------------

function clean_param(array $params, string $key): string|null {

  return isset($params[$key]) ? clean_input($params[$key]): null;
}
# ------------------------------------------------------------------------------

function clean_param_array(array $params, string $key): array|null {

  return isset($params[$key]) ? clean_json_array($params[$key]): null;
}
# --
# ------------------------------------------------------------------------------
# Create and return a logger object.

function get_logger(string $channel, int $level=Logger::INFO, 
                    string $filename=LOGPATH): Logger {

    # $output = "[%datetime%]-[%channel%]-[%level_name%] > %message% | %context% %extra%\n";
    $output = "[%datetime%]-[%channel%]-[%level_name%] > %message% | %extra%\n";
    $dateFormat = 'd-M-Y H:i:s';
    $formatter = new LineFormatter($output, $dateFormat);

    # Consider using Linux Logrotate rather than RotatingFileHandler for production use
    # https://betterstack.com/community/guides/logging/how-to-manage-log-files-with-logrotate-on-ubuntu-20-04/
    $stream = new RotatingFileHandler($filename, 30, $level);
    $stream->setFormatter($formatter);

    $proc_fields = ['url', 'ip'];
    $processor = new WebProcessor(extraFields: $proc_fields);

    $logger = new Logger($channel);
    $logger->pushHandler($stream);
    $logger->pushProcessor($processor);

    return $logger;
}
# ------------------------------------------------------------------------------

function get_page(string $title, string $msg): string {
    $html = <<<EOD
      <!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>$title</title>
          <link href="https://unpkg.com/tailwindcss@^2/dist/tailwind.min.css" rel="stylesheet">
      </head>
      <body class="bg-gray-100 flex items-center justify-center min-h-screen">

          <!-- Modal Container -->
          <div id="statusDialog" class="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75">
              <div class="bg-white rounded-lg shadow-lg max-w-lg w-full mx-4 p-6 space-y-4">
                  <!-- Modal Header -->
                  <div class="flex justify-between items-center border-b pb-2">
                      <h2 class="text-2xl font-semibold text-gray-800">$title</h2>
                      <button onclick="window.close()" class="text-gray-400 hover:text-gray-600">
                          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                          </svg>
                      </button>
                  </div>
                  <!-- Modal Body -->
                  <div class="text-gray-600">
                      <p>$msg</p>
                  </div>
                  <!-- Modal Footer -->
                  <div class="flex justify-end">
                      <button onclick="window.close()" class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline-none focus:ring focus:ring-blue-300">Close</button>
                  </div>
              </div>
          </div>
      </body>
      </html>
    EOD;
  
    return $html;
} 
# ------------------------------------------------------------------------------

function get_token_payload(Request $request): array {

    $helper = new HelperRequest();
    $payload = $helper->getTokenPayload($request, JWT_KEY);
    return $payload;
}
# ------------------------------------------------------------------------------

function is_admin(Request $request): bool {

    $helper = new HelperRequest();
    $payload = $helper->getTokenPayload($request, JWT_KEY);
    $rv = array_key_exists('role', $payload) && ($payload['role'] === 'admin');
    return $rv;
}
# ------------------------------------------------------------------------------

function is_validusername(string $username): bool {

    $valid = (strlen($username) >= 3) && 
             (strlen($username) <= 10) && 
             !str_contains($username, '@');
    return $valid;
}
# ------------------------------------------------------------------------------
# Return true if all required parameters are present.

function validate_params(array $params, array $required_params): bool {
    foreach ($required_params as $param) {
        if (!array_key_exists($param, $params)) {
            return false;
        }
    }
    return true;
}
# ------------------------------------------------------------------------------

/*
End
*/
