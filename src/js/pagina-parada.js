// @ts-check

import { simpleFetch } from './simpleFetch.js'
import { HttpError } from './class/HttpError.js'

const API_PORT = location.port ? `:${location.port}` : ''

/** @import {Usuario} from './class/usuario.js' */

// Asigno en el DOM los eventos cargados 
document.addEventListener('DOMContentLoaded', onDomContentLoaded)

//Eventos
async function onDomContentLoaded() {

    //recuperar datos sessionStorage
    recuperarSessionStorage()
    //boton de volver al inicio (resetear toda la info)
    const backButton = document.getElementById('back')
    //resetear el buscador y volver inicio
    backButton?.addEventListener('click', backButtonClick)
    //Imprime ficha de la parada
    // @ts-ignore
    await obtenerParadasInfo()
}


function backButtonClick() {
    // 1. Guardar el texto del input de búsqueda
    const searchInput = document.getElementById('searchInput');
    if (searchInput instanceof HTMLInputElement) {
        localStorage.setItem('busqueda_texto', searchInput.value);
    } else {
        console.error('Elemento de búsqueda no encontrado.');
    }

    // 2. Guardar los resultados de búsqueda (paradas recomendadas)
    const paradasGuardadas = localStorage.getItem('paradasRecomendadas');
    if (paradasGuardadas !== null) {
      localStorage.setItem('paradas_mostradas', paradasGuardadas);
    } else {
      console.log('No paradas guardadas found');
      localStorage.setItem('paradas_mostradas', '');
    }

    // 3. Guardar el título de la ciudad
    const tituloCiudad = document.getElementById('tituloCiudad');
    localStorage.setItem('titulo_ciudad', tituloCiudad?.innerText ?? '');

    // 4. Navegar hacia atrás
    history.back();
}

//Mtetodos
/**
 * Get data from API
//corregir el ignore de ts no le gusta def
 * @returns {Promise<Object>}
 */
async function obtenerParadasInfo() {
    // Obtener el ID de la URL usando URLSearchParams
    const urlParams = new URLSearchParams(location.search);
    const rutaId = urlParams.get('id');
    console.log(rutaId)
    // Send fetch to API, create new ruta
    if (rutaId !== null) {
        const response = await getParadasData(`${location.protocol}//${location.hostname}${API_PORT}/api/read/paradas/${rutaId}`)
        console.log(response);
        document.getElementById('infoParada')?.setAttribute('parada', JSON.stringify(response))
        return response 
    } else {
       return {}
    }
}


/**
 * Get data from API
 * @param {string} apiURL
 * @param {string} method
 * @param {Object} [data]
 * @returns {Promise<Object>}
 */
export async function getParadasData (apiURL, method = 'GET', data) {
    let paradas

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
      paradas  = await simpleFetch (apiURL, { 
        // Si la petición tarda demasiado, la abortamos
        signal: AbortSignal.timeout(3000),
        method: method,
        // @ts-ignore
        body: data ?? undefined,
        headers: headers
      });
      if (!paradas) {
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
    return paradas
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