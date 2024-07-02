<?php declare(strict_types=1);

# ------------------------------------------------------------------------------

use Monolog\Logger;
use Monolog\Handler\RotatingFileHandler;
use Monolog\Formatter\LineFormatter;
use Monolog\Processor\WebProcessor;

# ------------------------------------------------------------------------------
# Create and return a logger object.

function get_logger(string $channel, int $level=Logger::INFO, 
                    string $filename=LOGPATH): Logger {

    $output = "[%datetime%]-[%channel%]-[%level_name%] > %message% | %extra%\n";
    $dateFormat = 'd-M-Y H:i:s';
    $formatter = new LineFormatter($output, $dateFormat);

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

function get_page(string $msg): string {
  $title = 'Password Reset';
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
                </div>
                <!-- Modal Body -->
                <div class="text-gray-600">
                    <p>$msg</p>
                </div>
                <!-- Modal Footer -->
                <div class="flex justify-end">
                </div>
            </div>
        </div>
    </body>
    </html>
    EOD;
  
    return $html;
}
# ------------------------------------------------------------------------------
/*
End
*/
