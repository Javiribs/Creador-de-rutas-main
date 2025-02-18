// @ts-check
import { simpleFetch } from './simpleFetch.js'
import { HttpError } from './class/HttpError.js'

const API_PORT = location.port ? `:${location.port}` : ''

/** @import {Ciudad, Paradas} from './class/ciudades.js' */
/** @import {RutaPersonalizada, ParadasRutas} from './class/rutaPersonalizada.js' */
/** @import {Usuario} from './class/usuario.js' */

document.addEventListener('DOMContentLoaded', onDomContentLoaded);

async function onDomContentLoaded() {
    // Recuperar datos de sessionStorage
    await recuperarSessionStorage()

    // Pintar elemntos del DOM
    // paintRutasUsuario(await obtenerRutasUsuario())
    paintRutasUsuario(await obtenerRutasUsuario())
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
async function getApiData (apiURL, method = 'GET', data) {
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
 * Get data from API
 * //corregir el ignore de ts no le gusta def
 * @returns {Promise<Array<Object>>}
 */
async function obtenerRutasUsuario() {
  const usuarioGuardado = getLoggedUserData();
  const usuarioId = usuarioGuardado?._id;
  try {
    console.log("ID del usuario:", usuarioId)
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
 * @function paintRutasUsuario
 * @param {RutaPersonalizada[]} rutasPersonalizadas - Rutas con paradas
 */
async function paintRutasUsuario(rutasPersonalizadas) {
  console.log('Toda la info de rutasPersonalizadas creada:', rutasPersonalizadas);
  const misRutasElement = document.getElementById('mis-rutas');
  if (!misRutasElement) {
    console.error('Elemento "mis-rutas" no encontrado');
    return;
  }

  if (!Array.isArray(rutasPersonalizadas)) {
    console.error('La respuesta de la API no es un array:', rutasPersonalizadas);
    return;
  }

  misRutasElement.innerHTML = '';

  rutasPersonalizadas.forEach((ruta) => {
    try {
        const rutaElement = document.createElement('li');
        rutaElement.classList.add('ruta-personalizada');

        // Crear elementos para la información de la ruta
        const nombreRuta = document.createElement('h2');
        nombreRuta.textContent = ruta.nombre;

        const fechaCreacion = document.createElement('p');
        const fecha = new Date(ruta.fechaCreacion); 
        fechaCreacion.textContent = `Fecha de creación: ${fecha.toLocaleDateString()}`;

       
        // Agregar los elementos a la lista
        rutaElement.appendChild(nombreRuta);
        rutaElement.appendChild(fechaCreacion);
        // rutaElement.appendChild(ciudadNombre);

        rutaElement.addEventListener('click', () => {
            // Agrega el comportamiento deseado aquí
        });

        misRutasElement.appendChild(rutaElement);
    } catch (error) {
        console.error('Error al crear elemento:', error);
    }
});
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
