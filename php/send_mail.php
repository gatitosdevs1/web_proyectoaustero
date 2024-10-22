<?php
// Cargar Composer's autoload (necesario si usas Composer)

//Cambiar origins en producción!!!
header("Access-Control-Allow-Origin: *");//!!!
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

require 'vendor/autoload.php';

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;
use Dotenv\Dotenv;

// $dotenv=Dotenv::createImmutable(__DIR__);
$dotenv = Dotenv::createImmutable('../');
$dotenv->load();

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Capturar los datos enviados desde el formulario
    $name = $_POST['name'];
    $email = $_POST['email'];
    $message = $_POST['message'];
    $body_content = "
    <h3>Tienes un nuevo mensaje de proyectoaustero.com</h3>
    <p><strong>Nombre:</strong> $name</p>
    <p><strong>Email:</strong> $email</p>
    <p><strong>Mensaje:</strong><br>$message</p>
";


$mail = new PHPMailer(true);

try {
    // servidor SMTP
    $mail->isSMTP();
    $mail->Host = 'smtp.gmail.com'; // Cambiar si ees necesario
    $mail->SMTPAuth = true;
    $mail->Username = $_ENV['SMTP_USERNAME']; // mail
    $mail->Password = $_ENV['SMTP_PASSWORD']; 
    $mail->SMTPSecure = 'tls'; 
    $mail->Port = 587; // TLS (465 para SSL)

    // correo
    $mail->CharSet = 'UTF-8';
    $mail->setFrom($_ENV['SMTP_USERNAME'], 'ProyectoAustero'); // Remitente
    $mail->addAddress('mail', 'Destinatario'); // Destinatario, agregar mail
    $mail->Subject = 'Nuevo mensaje de contacto';


    $mail->isHTML(true);
    $mail->Body    = $body_content;
    $mail->AltBody = "Tienes un nuevo mensaje de proyectoaustero.com\nNombre: $name\nEmail: $email\nMensaje: $message\n\nEste es el texto sin formato para clientes que no soportan HTML.";

 
    $mail->send();
    // echo '¡Correo enviado con éxito!';
    http_response_code(200);
    echo json_encode(['message' => '¡Mensaje enviado!']);
} catch (Exception $e) {
    // echo "Hubo un problema al enviar el correo: {$mail->ErrorInfo}";
    http_response_code(500);
    echo json_encode(['error' => "Hubo un problema al enviar el correo: {$mail->ErrorInfo}"]);

}
}
?>
