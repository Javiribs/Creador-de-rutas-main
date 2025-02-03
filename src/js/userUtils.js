// @ts-check


// Asigno en el DOM los eventos cargados 
document.addEventListener('DOMContentLoaded', onDomContentLoaded)


//EVENTOS
function onDomContentLoaded() {
    //obtengo elemento del DOM por su ID
    const loginForm = document.getElementById('login-form')
    //activo evento mediante boton submit
    loginForm?.addEventListener('submit', logInButton)
}

/**
 * @param {SubmitEvent} e
 */
//Funciones que se activan al apretar el loginbutton
//busca coincidencias entre email y password
    async function logInButton(e) {
        e.preventDefault();
      
        const loginEmailElement = document.getElementById('login-email');
        const loginPasswordElement = document.getElementById('login-password');
      
        if (loginEmailElement instanceof HTMLInputElement && loginPasswordElement instanceof HTMLInputElement) {
            const loginEmail = loginEmailElement.value;
            const loginPassword = loginPasswordElement.value;
        try {
            const response = await fetch('./api/usuario.json') // Ruta al archivo JSON
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`)
            }
            const usuariosJSON = await response.json();

            const usuarioEncontrado = usuariosJSON.find(
                (/** @type {{ email: any; password: any; }} */ usuario) => usuario.email === loginEmail && usuario.password === loginPassword
            );

            if (usuarioEncontrado) {
                alert('Inicio de sesión exitoso. ¡Bienvenido, ' + usuarioEncontrado.name + '!')
                window.location.href = 'index.html' // Redirige a index.html si las credenciales son correctas
            } else {
                alert('Credenciales incorrectas. Inténtalo de nuevo.')
            }
        } catch (error) {
            console.error('Error al cargar usuarios desde JSON:', error)
            alert('Error al iniciar sesión. Por favor, inténtalo de nuevo más tarde.')
        }
    }
}
