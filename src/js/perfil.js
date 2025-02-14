// @ts-check

import { simpleFetch } from './simpleFetch.js'

const API_PORT = location.port ? `:${location.port}` : ''

document.addEventListener('DOMContentLoaded', onDomContentLoaded);

function onDomContentLoaded() {
    // Recuperar datos de sessionStorage
    recuperarSessionStorage()

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
                const usuario = JSON.parse(usuarioGuardado);
                const response = await simpleFetch(`${location.protocol}//${location.hostname}${API_PORT}/api/delete/usuarios/${usuario._id}`, 'DELETE');
                
                sessionStorage.removeItem('usuario');
                window.location.href = 'inicio.html';
                console.log("Respuesta del servidor:", response);
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

async function recuperarSessionStorage() {
    // Recuperar datos de sessionStorage al cargar la página
    const usuarioGuardado = sessionStorage.getItem('usuario');

    if (usuarioGuardado) {
        try { // Intenta parsear los datos, maneja posibles errores
            const usuario = JSON.parse(usuarioGuardado);
            // El usuario ha iniciado sesión

            // Mostrar información del usuario en la página, etc.
            console.log("Usuario logueado:", usuario);

            const botonPerfil = document.getElementById('boton-perfil');
            if (botonPerfil) {
                botonPerfil.textContent = usuario.name;
            }
        } catch (error) {
            console.error("Error al parsear datos de usuario:", error);
            // Si hay un error al parsear, elimina los datos de sessionStorage y redirige al login
            sessionStorage.removeItem('usuario');
            window.location.href = 'inicio.html';
        }
    } else {
        // El usuario no ha iniciado sesión
        window.location.href = 'inicio.html';
      }
  }