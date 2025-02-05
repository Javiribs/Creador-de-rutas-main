// @ts-check

import { simpleFetch } from './simpleFetch.js'

document.addEventListener('DOMContentLoaded', onDomContentLoaded);

function onDomContentLoaded() {
    // Recuperar datos de sessionStorage
    const usuarioGuardado = sessionStorage.getItem('usuario');

    if (usuarioGuardado) {
        try {
            const usuario = JSON.parse(usuarioGuardado);

            // Mostrar información del usuario en la página
            const nombreUsuarioElement = document.querySelector('figure figcaption'); // Usamos querySelector para acceder al elemento
            if (nombreUsuarioElement) {
                nombreUsuarioElement.textContent = usuario.name;
            }

            const paisUsuarioElement = document.querySelector('article h3'); // Usamos querySelector para acceder al elemento
            if (paisUsuarioElement) {
                paisUsuarioElement.textContent = usuario.country;
            }

            const imagenUsuarioElement = document.querySelector('figure img');
            if (imagenUsuarioElement instanceof HTMLImageElement) {
                imagenUsuarioElement.src = 'URL_IMAGEN_PERFIL_USUARIO';
                imagenUsuarioElement.alt = `Foto de perfil de ${usuario.name}`;
            }
        } catch (error) {
            console.error("Error al parsear datos de usuario:", error);
            sessionStorage.removeItem('usuario');
            window.location.href = 'inicio.html';
        }
    } else {
        // Usuario no ha iniciado sesión, redirigir a la página de inicio de sesión
        window.location.href = 'inicio.html';
    }

    // Eventos para los botones
    const botonInicio = document.getElementById('boton-inicio');
    if (botonInicio) {
        botonInicio.addEventListener('click', () => {
            window.location.href = 'index.html';
        });
    }

    const botonPerfil = document.getElementById('boton-perfil');
    if (botonPerfil) {
        botonPerfil.addEventListener('click', () => {
            window.location.href = 'perfil.html';
        });
    }

    const logoutButton = document.getElementById('logout-button');
    if (logoutButton) {
        logoutButton.addEventListener('click', cerrarSesion); // Corrección: No se llama a la función aquí
    }

    const eliminarButton = document.getElementById('delete-usuario');
    if (eliminarButton) {
        eliminarButton.addEventListener('click', eliminarUsuario);
    }
}

// Función para cerrar sesión
function cerrarSesion() {
    sessionStorage.removeItem('usuario');
    window.location.href = 'inicio.html';
}

async function eliminarUsuario() {
    const confirmacion = confirm("¿Estás seguro de que deseas eliminar tu cuenta? Esta acción es irreversible.");

    if (confirmacion) {
        try {
            const usuarioGuardado = sessionStorage.getItem('usuario');
            if (usuarioGuardado) {
                const usuario = JSON.parse(usuarioGuardado); //Necesitamos el id del usuario
                const response = await simpleFetch(`http://${location.hostname}:3333/delete/usuarios/${usuario.id}`);
                alert(response.message);
                sessionStorage.removeItem('usuario');
                window.location.href = 'inicio.html';
                if (!response) {
                    throw new Error(`Error al eliminar usuario: ${response.status}`);
                }
            } else {
                throw new Error("No se encontró información del usuario en sessionStorage.");
            }
        } catch (error) {
            console.error("Error al eliminar usuario:", error);
            alert("Error al eliminar usuario. Por favor, inténtalo de nuevo más tarde.");
        }
    }
}