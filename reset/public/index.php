<?php declare(strict_types=1);

/*
TODO:
- Use common HTML function for reset.php and submit_reset.php.
- Check latest Tailwind CDN.
- Add page icon.
- Check HTML and CSS validity.
- Check accessibility.

*/
# ------------------------------------------------------------------------------

error_reporting(E_ALL);
ini_set('error_log', '../logs/php-errors.log');
ini_set('log_errors', 1);
# Set next value to 0 in production code or 1 in dev code
ini_set('display_errors', 0);

# ------------------------------------------------------------------------------

require_once '../vendor/autoload.php';
require_once '../private/database.php';
require_once '../private/utils.php';

# ------------------------------------------------------------------------------

if (!isset($_GET['token']) || !isset($_GET['email']) ) {
  echo get_page('Invalid request');
  exit();
}
$email = $_GET['email'];
$token = $_GET['token'];
$db = new DbInterface();
$status = $db->check_token($email, $token);
unset($db);
if (!$status->success) {
  echo get_page($status->message);
  exit();
}
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
					<button onclick="window.close()" class="text-gray-400 hover:text-gray-600">
							<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
							</svg>
					</button>
			</div>
			
			<!-- Modal Body -->
			<form id="passwordResetForm" method="post" action="submit_reset.php">
				<label class="font-medium block mb-1 mt-6 text-gray-700" for="passwordInput">
					Enter new password
				</label>
				<div class="relative w-full">
					<div class="absolute inset-y-0 right-0 flex items-center px-2">
						<input class="hidden js-password-toggle" id="toggle" type="checkbox" />
						<label class="bg-gray-300 hover:bg-gray-400 rounded px-2 py-1 text-sm text-gray-600 font-mono cursor-pointer js-password-label" for="toggle">show</label>
					</div>
					<input class="appearance-none border-2 rounded w-full py-3 px-3 leading-tight border-gray-300 bg-gray-100 focus:outline-none focus:border-indigo-700 focus:bg-white text-gray-700 pr-16 font-mono js-password" id="passwordInput" type="password" name="password" autocomplete="off"
					/>
				</div>
				<div id="passwordStrength" class="text-sm text-red-500 mb-4 hidden">
						Password must be at least 8 characters long and contain at least 1 uppercase letter, 1 lowercase letter and 1 number.
				</div>
				<br>
				<!-- Modal Footer -->
				<div class="flex justify-end">
						<button type="submit" class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline-none focus:ring focus:ring-blue-300">Submit</button>
				</div>
				<input type="hidden" id="email" name="email" value="$email">
				<input type="hidden" id="token" name="token" value="$token">
			</form>

		</div>
	</div>

	<script>	
	document.addEventListener('DOMContentLoaded', function () {
		const passwordToggle = document.querySelector('.js-password-toggle');
		const passwordInput = document.getElementById('passwordInput');
		const passwordStrength = document.getElementById('passwordStrength');
		const passwordResetForm = document.getElementById('passwordResetForm');

		passwordToggle.addEventListener('change', function() {
			const password = document.querySelector('.js-password');
			const passwordLabel = document.querySelector('.js-password-label');

			if (password.type === 'password') {
				password.type = 'text'
				passwordLabel.innerHTML = 'hide'
			} else {
				password.type = 'password'
				passwordLabel.innerHTML = 'show'
			}
			password.focus();
		});

		passwordResetForm.addEventListener('submit', function (e) {
			const lengthRegex = /.{8,}/;
			const upperCaseRegex = /[A-Z]/;
			const lowerCaseRegex = /[a-z]/;
			const numberRegex = /[0-9]/;			

			const password = passwordInput.value;
			const isValid = lengthRegex.test(password) && upperCaseRegex.test(password) && lowerCaseRegex.test(password)&& numberRegex.test(password);
			if (!isValid) {
				e.preventDefault();
				passwordStrength.classList.remove('hidden');
			} else {
				passwordStrength.classList.add('hidden');
			}
		});
	});
	</script>			
	</body>
 </html>
EOD;

echo $html;

# ------------------------------------------------------------------------------
/*
End
*/