//centralización de errores, registra en la consola y muestra al usuario

export class ErrorHandler {
    manejarError(error) {
        console.error('Ocurrió un error:', error);
        alert('Ocurrió un error inesperado. Por favor, inténtalo de nuevo más tarde.');
    }
}