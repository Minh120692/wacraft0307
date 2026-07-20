<?php
// Nhúng file autoload của Composer
require 'vendor/autoload.php';

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

header('Content-Type: text/plain; charset=UTF-8');

// Get POST data and sanitize
$name = isset($_POST['name']) ? trim($_POST['name']) : '';
$email = isset($_POST['email']) ? filter_var(trim($_POST['email']), FILTER_VALIDATE_EMAIL) : false;
$subject = isset($_POST['subject']) ? trim($_POST['subject']) : 'Contact form message';
$message = isset($_POST['message']) ? trim($_POST['message']) : '';
$preferred = isset($_POST['preferred_datetime']) ? trim($_POST['preferred_datetime']) : '';
$dt = '';

if (empty($name) || !$email || empty($message)) {
    http_response_code(400);
    echo 'Please complete all required fields.';
    exit;
}

$mail = new PHPMailer(true);
try {
    $smtpHost = getenv('SMTP_HOST') ?: 'smtp.gmail.com';
    $smtpPort = (int) (getenv('SMTP_PORT') ?: 587);
    $smtpUser = getenv('SMTP_USER') ?: '';
    $smtpPass = getenv('SMTP_PASS') ?: '';
    $fromEmail = getenv('SMTP_FROM_EMAIL') ?: $smtpUser;
    $fromName = getenv('SMTP_FROM_NAME') ?: 'WA+CRAFT Contact';
    $toEmail = getenv('CONTACT_TO_EMAIL') ?: 'sunflora92612@gmail.com';

    if (empty($smtpUser) || empty($smtpPass) || empty($fromEmail) || empty($toEmail)) {
        throw new Exception('Email delivery is not configured.');
    }

    // SMTP configuration
    $mail->isSMTP();
    $mail->Host       = $smtpHost;
    $mail->SMTPAuth   = true;
    $mail->Username   = $smtpUser;
    $mail->Password   = $smtpPass;
    $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
    $mail->Port       = $smtpPort;

    // From and recipient
    $mail->setFrom($fromEmail, $fromName);
    $mail->addAddress($toEmail);
    $mail->addReplyTo($email, $name);

    // Content
    $mail->isHTML(true);
    $mail->Subject = $subject;

    $body = '<h2>Contact form message</h2>';
    $body .= '<p><strong>Name:</strong> ' . htmlspecialchars($name, ENT_QUOTES, 'UTF-8') . '</p>';
    $body .= '<p><strong>Email:</strong> ' . htmlspecialchars($email, ENT_QUOTES, 'UTF-8') . '</p>';
    if (!empty($preferred)) {
        // format the datetime for display
        $dt = date('Y-m-d H:i', strtotime($preferred));
        $body .= '<p><strong>Preferred contact datetime:</strong> ' . htmlspecialchars($dt, ENT_QUOTES, 'UTF-8') . '</p>';
    }
    $body .= '<p><strong>Message:</strong><br>' . nl2br(htmlspecialchars($message, ENT_QUOTES, 'UTF-8')) . '</p>';

    $mail->Body = $body;
    $mail->AltBody = "Name: $name\nEmail: $email\n";
    if (!empty($preferred)) {
        $mail->AltBody .= "Preferred contact datetime: $dt\n";
    }
    $mail->AltBody .= "\n$message";

    $mail->send();
    echo 'OK';
} catch (Exception $e) {
    http_response_code(500);
    echo "Lỗi khi gửi: " . $mail->ErrorInfo;
}
