// @ts-check
import { simpleFetch } from './simpleFetch.js'
import { HttpError } from './class/HttpError.js'

const API_PORT = location.port ? `:${location.port}` : ''

/** @import {Usuario} from './class/usuario.js' */

document.addEventListener('DOMContentLoaded', onDomContentLoaded);

function onDomContentLoaded() {
    // Recuperar datos de sessionStorage
    recuperarSessionStorage()

    // Eventos para los botones
    const botonInicio = document.getElementById('boton-inicio');
    if (botonInicio) {
        botonInicio.addEventListener('click', () => {
            window.location.href = 'inicio.html';
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

//-------------CRUD---------------//
/**
 * Get data from API
 * @param {string} apiURL
 * @param {string} method
 * @param {Object} [data]
 * @returns {Promise<Object>}
 */
async function getUsuarioData (apiURL, method = 'GET', data) {
    let usuarioInfo

    try {
      let headers = new Headers()
  
      headers.append('Content-Type', 'application/json')
      headers.append('Access-Control-Allow-Origin', '*')
      if (data) {
        headers.append('Content-Length', String(JSON.stringify(data).length))
      }
      // Set Bearer authorization if user is logged in
      const loggedUser = getLoggedUserData();
      if (loggedUser) {
      headers.append('Authorization', `Bearer ${loggedUser?.token}`)
      }   
      usuarioInfo  = await simpleFetch (apiURL, { 
        // Si la petición tarda demasiado, la abortamos
        signal: AbortSignal.timeout(3000),
        method: method,
        body: data ?? undefined,
        headers: headers
      });
      if (!usuarioInfo) {
        console.error('La respuesta del servidor no tiene la estructura correcta.');
      }
    } catch (/** @type {any | HttpError} */err) {
        if (err.name === 'AbortError') {
          console.error('Fetch abortado');
        }
        if (err instanceof HttpError) {
          if (err.response.status === 404) {
            console.error('Not found');
          }
          if (err.response.status === 500) {
            console.error('Internal server error');
          }
        }
      }
    return usuarioInfo
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
            const usuarioGuardado = getLoggedUserData();
            const response = await getUsuarioData(`${location.protocol}//${location.hostname}${API_PORT}/api/delete/usuarios/${usuarioGuardado?._id}`, 'DELETE');
            console.log("Respuesta del servidor:", response);
            if (response) {
                console.log("Usuario eliminado con exito");
                sessionStorage.removeItem('usuario');
                window.location.href = 'index.html';
               
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
            window.location.href = 'index.html';
        }
    } else {
        // El usuario no ha iniciado sesión
        window.location.href = 'index.html';
      }
  }

  /**
 * Checks if there is a user logged in by verifying the presence of a token
 * in the local storage.
  * @returns {Usuario | null}
 */
  function getLoggedUserData() {
    const storedUser = sessionStorage.getItem('usuario');
    return storedUser ? JSON.parse(storedUser) : null
  }