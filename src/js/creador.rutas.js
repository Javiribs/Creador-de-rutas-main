// @ts-check

import { simpleFetch } from './simpleFetch.js'
import { HttpError } from './class/HttpError.js'

const API_PORT = location.port ? `:${location.port}` : ''

/** @import {Ciudad} from './class/ciudades.js' */
//variable vacia a rellenar con datos de json/api fetch

/** @import {Usuario} from './class/usuario.js' */


/** @import {RutaPersonalizada} from './class/rutaPersonalizada.js' */
//varibale de ruta personalizada vacia
/**
 * @type {RutaPersonalizada[]}
 */

// Asigno en el DOM los eventos cargados 
document.addEventListener('DOMContentLoaded', onDomContentLoaded) 

//Eventos
async function onDomContentLoaded() {
    //Asocio elementos del DOM por su ID a variables
    //boton buscar
    const searchButton = document.getElementById('searchButton')
    //caja usuario pone nombre ciudad
    const searchInput = document.getElementById('searchInput')
    //el propio formulario completo de busqueda
    const searchForm = document.getElementById('searchForm')
    //boton de volver al inicio (resetear toda la info)
    const volverInicioButton = document.getElementById('boton-inicio')
    //boton perfil
    const botonPerfil = document.getElementById('boton-perfil')
    //recuperar datos sessionStorage
    recuperarSessionStorage()
    
    //Evitar refresh boton enter
    searchForm?.addEventListener('submit', blockEnterButton)
    //Autocompletar input del usuario
    searchInput?.addEventListener('input', searchProposal)
    //Buscador de la app (coincidencia input con base datos)
    searchButton?.addEventListener('click', searchButtonOnClick)
    //resetear el buscador y volver inicio
    volverInicioButton?.addEventListener('click', inicioButtonClick)
    //boton accede al perfil
    botonPerfil?.addEventListener('click', perfilButtonClick)
       
}


//evento para bloquear el boton enter teclado
/**
 * @param {SubmitEvent} e
 */
function blockEnterButton(e) {
    e.preventDefault();
}

//funcion para resetear toda la busqueda
function inicioButtonClick() {
    resetBuscador()
}

//funcion acceder al perfil activando boton
function perfilButtonClick() {
    window.location.href = 'perfil.html' // Redirige a perfil.html
}

//funcion acttivar buscador con click
async function searchButtonOnClick() {
  const resultadosList = document.querySelector('.paradas-interesantes');
  if (resultadosList) {
      resultadosList.innerHTML = '';
  }
  try {
      const ciudadEncontrada = await obtenerCiudadPorNombre();
      if (!ciudadEncontrada) {
          // Si no se encuentra la ciudad, puedes mostrar un mensaje de error o hacer algo más
          console.error("Ciudad no encontrada");
          alert("Ciudad no encontrada");
          return; // Salir de la función
      }
      // Obtener el componente LitInfoListaParadas
      const componenteParadas = document.querySelector('info-lista-paradas');
      // Asignar los datos al componente
      if (componenteParadas) {
        componenteParadas.setAttribute('ciudadEncontradaInfo', JSON.stringify([ciudadEncontrada]));
      }
      addTitle(ciudadEncontrada);
  } catch (error) {
      console.error("Error en la búsqueda de ciudades:", error);
      alert("Ocurrió un error durante la búsqueda. Inténtalo de nuevo más tarde.");
  } finally {
      const searchInput = document.getElementById('searchInput');
      searchInput?.setAttribute('value', " ");
  }
}


// METODOS que están recogidos en el Listener

//funcion para resetear toda la busqueda
function resetBuscador() {
    localStorage.removeItem('paradasRecomendadas')
    const LISTADO = document.getElementsByClassName('paradas-interesantes')[0]
    if (LISTADO) {
        LISTADO.innerHTML = '' // Elimina todos los elementos de la lista
    }

    // 2. Limpiar el título de la ciudad (si lo tienes)
    const titleList = document.getElementById('tituloCiudad')
    if (titleList) {
        titleList.innerText = '' // Restablece el título a su valor inicial o vacío
    }

    // 3. Limpiar el input de búsqueda (si lo tienes)
    const searchInput = document.getElementById('searchInput')
    if (searchInput instanceof HTMLInputElement) {
        searchInput.value = ''
    }
}

//funcion propuesta autocompletar inputSearch usuario
async function searchProposal() {
    const searchInput = document.getElementById('searchInput')
    const nameBuscado = getInputValue(searchInput)?.toLowerCase()
    const datalist = document.getElementById('ciudades')
    const sugerencias = await getCiudadesData(`${location.protocol}//${location.hostname}${API_PORT}/api/filter/ciudadesName/${nameBuscado}`);
      if (datalist) {
        datalist.innerHTML = ""
      }
      
      sugerencias.forEach(ciudad => {
        const option = document.createElement('option');
        option.value = `${ciudad.name} (${ciudad.country})`; 
        
        datalist?.appendChild(option);
      });
}
   

//----------------------------C.R.U.D---------------------------//


/**
 * Get data de la API
 * @param {string} apiURL
 * @param {string} method
 * @param {Object} [data]
 * @returns {Promise<Array<Ciudad>>}
 */
//Obtener datos de la API
export async function getCiudadesData (apiURL, method = 'GET', data) {
  let ciudadesData
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
  /** @type {Ciudad[]} */
  ciudadesData = await simpleFetch (apiURL, { 
      // Si la petición tarda demasiado, la abortamos
      signal: AbortSignal.timeout(3000),
      method: method,
      // @ts-ignore
      body: data ?? undefined,
      headers: headers
    });
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
  return ciudadesData
}

//funcion obtener datos a partir del parametro name de la ciudad
/**
* Obtiene los datos de la ciudad por nombre.
* @returns {Promise<Ciudad | null>}
*/
export async function obtenerCiudadPorNombre() {
const searchInput = document.getElementById('searchInput');
const nameBuscado = getInputValue(searchInput)?.toLowerCase();
const nombreCiudad = nameBuscado.split(' (')[0];
try {
    const ciudadInfo = await getCiudadesData(`${location.protocol}//${location.hostname}${API_PORT}/api/filter/ciudades/${nombreCiudad}`);
    if (ciudadInfo && ciudadInfo.length > 0) {
        return ciudadInfo[0]; 
    }
    return null; 
} catch (error) {
    console.error("Error al obtener la ciudad por nombre:", error);
    return null; 
}
}

//funcion para obtener el value del elemento concreto
/**
 * @param {HTMLElement | null} inputElement
 * @returns {string} 
 */
function getInputValue(inputElement) {
    if (inputElement) {
      return /** @type {HTMLInputElement} */(inputElement).value
    } else {
      return ''
    }
  }

//Pintar el título con el nombre de la ciudad encontrada
/**
 * @param {Ciudad} ciudadEncontrada
 */
function addTitle(ciudadEncontrada) {
    const recomendacion = document.getElementById('recomendacion')    
    const titleList = document.getElementById('tituloCiudad')
    if (titleList && recomendacion) {
      recomendacion.innerText = `Nuestras recomendaciones para:`
      titleList.innerText = ciudadEncontrada.name;
    } else {
      console.error('Elemento con ID "tituloCiudad" no encontrado.')
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
