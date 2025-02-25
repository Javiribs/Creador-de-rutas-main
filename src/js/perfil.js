// @ts-check
import { simpleFetch } from './simpleFetch.js'
import { HttpError } from './class/HttpError.js'

export const API_PORT = location.port ? `:${location.port}` : ''

/** @import {Ciudad, Paradas} from './class/ciudades.js' */
/** @import {RutaPersonalizada, ParadasRutas} from './class/rutaPersonalizada.js' */
/** @import {Usuario} from './class/usuario.js' */

document.addEventListener('DOMContentLoaded', onDomContentLoaded);

async function onDomContentLoaded() {
  //boton de volver al inicio (resetear toda la info)
  const volverInicioButton = document.getElementById('boton-inicio')
 
  // Recuperar datos de sessionStorage
  await recuperarSessionStorage()

  // Eventos para los botones
  //resetear el buscador y volver inicio
  volverInicioButton?.addEventListener('click', inicioButtonClick)

  const logoutButton = document.getElementById('logout-button');
    if (logoutButton) {
        logoutButton.addEventListener('click', cerrarSesion); // Corrección: No se llama a la función aquí
    }

    const eliminarButton = document.getElementById('delete-usuario');
    if (eliminarButton) {
        eliminarButton.addEventListener('click', eliminarUsuario);
    }
}


//-----------------EVENTOS-----------------//
//funcion para resetear toda la busqueda
function inicioButtonClick() {
  window.location.href = 'inicio.html'
}



//-------------CRUD---------------//
/**
 * Get data from API
 * @param {string} apiURL
 * @param {string} method
 * @param {Object} [data]
 * @returns {Promise<Object>}
 */
export async function getApiData (apiURL, method = 'GET', data) {
    let apiData

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
      apiData  = await simpleFetch (apiURL, { 
        // Si la petición tarda demasiado, la abortamos
        signal: AbortSignal.timeout(3000),
        method: method,
        // @ts-ignore
        body: data ?? undefined,
        headers: headers
      });
      if (!apiData) {
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
    return apiData
}

/**
 * Get usuario data from API
 * @returns {Promise<Object>}
 */
export async function obtenerInfoUsuario() {
  const usuarioGuardado = getLoggedUserData();
  const usuarioId = usuarioGuardado?._id;
  try {
      const response = await getApiData(`${location.protocol}//${location.hostname}${API_PORT}/api/read/usuarios/${usuarioId}`, 'GET');

      if (!response) {
          throw new Error('Error al obtener las rutas del usuario');
      }
      
      return response; 

  } catch (error) {
      console.error('Error al obtener rutas:', error);
      return {};
  }
}

/**
 * Get data from API
 * @returns {Promise<Array<Object>>}
 */
export async function obtenerRutasUsuario() {
  const usuarioGuardado = getLoggedUserData();
  const usuarioId = usuarioGuardado?._id;
  try {
      const response = await getApiData(`${location.protocol}//${location.hostname}${API_PORT}/api/read/rutasPersonalizadas/usuario/${usuarioId}`, 'GET');

      if (!response) {
          throw new Error('Error al obtener las rutas del usuario');
      }
      
      // Verificar si la respuesta es un array
      if (!Array.isArray(response)) {
          console.error('La respuesta de la API no es un array:', response);
          throw new Error('La respuesta de la API no tiene el formato esperado');
      }

      return response; // Devuelve el array de objetos RutaPersonalizada

  } catch (error) {
      console.error('Error al obtener rutas:', error);
      return []; // Devuelve un array vacío en caso de error
  }
}

/**
 * @function eliminarRuta
 * @param {string} rutaId - ID de la ruta a eliminar
 */
export async function eliminarRuta(rutaId) {
  try {
      const usuarioGuardado = getLoggedUserData();
      if (!usuarioGuardado) {
          throw new Error("Usuario no logueado");
      }
      const response = await getApiData(`${location.protocol}//${location.hostname}${API_PORT}/api/delete/rutasPersonalizadas/${rutaId}`, 'DELETE');

      if (!response) {
          throw new Error('Error al eliminar la ruta');
      }

      console.log('Ruta eliminada:', response);
  } catch (error) {
      console.error('Error al eliminar ruta:', error);
      alert('Error al eliminar la ruta. Por favor, inténtalo de nuevo más tarde.');
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
            const usuarioGuardado = getLoggedUserData();
            const response = await getApiData(`${location.protocol}//${location.hostname}${API_PORT}/api/delete/usuarios/${usuarioGuardado?._id}`, 'DELETE');
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


export async function recuperarSessionStorage() {
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
