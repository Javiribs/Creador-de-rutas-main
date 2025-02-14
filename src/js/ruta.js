// @ts-check
import { simpleFetch } from './simpleFetch.js'
import { HttpError } from './class/HttpError.js'

const API_PORT = location.port ? `:${location.port}` : ''

/** @import {Ciudad, Paradas} from './class/ciudades.js' */
/** @import {RutaPersonalizada, ParadasRutas} from './class/rutaPersonalizada.js' */
/** @import {Usuario} from './class/usuario.js' */

document.addEventListener('DOMContentLoaded', onDomContentLoaded);


async function onDomContentLoaded() {
    //recuperar datos sessionStorage
    recuperarSessionStorage()
    //corregir el ignore de ts no le gusta def
    // @ts-ignore
    addRuta(await obtenerRuta()) //marcar que es un objeto
}


/**
 * Get data from API
//corregir el ignore de ts no le gusta def
 * @returns {Promise<Object>}
 */
async function obtenerRuta() {
    // Obtener el ID de la URL usando URLSearchParams
    const urlParams = new URLSearchParams(location.search);
    const rutaId = urlParams.get('id');
    // Send fetch to API, create new ruta
    if (rutaId !== null) {
    const response = await getRutaPersonalizadaData(`${location.protocol}//${location.hostname}${API_PORT}/api/read/rutasPersonalizadas/${rutaId}`)
        return response 
    } else {
       return {}
       //corregir, me está devolviendo undefined!!!!!!!!!!!!!!!!!!!!!!!!
        //console.error('No se proporcionó un ID válido');
    }
}


/**
 * Get data from API
 * @param {string} apiURL
 * @param {string} method
 * @param {Object} [data]
 * @returns {Promise<Object>}
 */
async function getRutaPersonalizadaData (apiURL, method = 'GET', data) {
    let rutaConParadas

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
    rutaConParadas  = await simpleFetch (apiURL, { 
        // Si la petición tarda demasiado, la abortamos
        signal: AbortSignal.timeout(3000),
        method: method,
        body: data ?? undefined,
        headers: headers
      });
      if (!rutaConParadas) {
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
    return rutaConParadas
}




/**
 * @param {Object} rutaConParadas
 * @param {Paradas[]} rutaConParadas.paradas
 * @param {string} rutaConParadas.nombre
 * @param {string} rutaConParadas.ciudad_id
 */
async function addRuta(rutaConParadas) {
    
    console.log(rutaConParadas);
    
    const LISTADO = document.getElementsByClassName('ruta-info')[0];
    LISTADO.innerHTML = '';
    
    const nombreRutaSpan = document.getElementById('nombre-ruta');
    if (nombreRutaSpan) {
        nombreRutaSpan.innerText = rutaConParadas.nombre;
    } else {
        console.error('Elemento con ID "nombre-ruta" no encontrado.');
    }

    const tituloCiudadSpan = document.getElementById('tituloCiudad');
    if (tituloCiudadSpan) {
        tituloCiudadSpan.innerText = rutaConParadas.ciudad_id; // Mostrar el ID de la ciudad
    } else {
        console.error('Elemento con ID "tituloCiudad" no encontrado.');
    }

    rutaConParadas.paradas.forEach(parada => { // Usar ruta.selectedParadas
        const newParadasItem = document.createElement('li');
        const newArticleParadas = document.createElement('article');
        const newFigureParadas = document.createElement('figure');
        const newImgParadas = document.createElement('img');
        const newCardParadas = document.createElement('section');
        const newNameParadas = document.createElement('h2');
        const newCategoriaParadas = document.createElement('h3');
        const newBotonParadas = document.createElement('button');

        newParadasItem.appendChild(newArticleParadas);
        newArticleParadas.appendChild(newFigureParadas);
        newImgParadas.src = parada.imagen; // Asegúrate de que parada.imagen exista
        newFigureParadas.appendChild(newImgParadas);
        newArticleParadas.appendChild(newCardParadas);
        newNameParadas.innerText = parada.nombre_parada;
        newCardParadas.appendChild(newNameParadas);
        newCategoriaParadas.innerText = 'Categoría: ' + parada.categoria; // Asegúrate de que parada.categoria exista
        newCardParadas.appendChild(newCategoriaParadas);
        newBotonParadas.textContent = '+ Info';

        newBotonParadas.addEventListener('click', () => {
            localStorage.setItem('paradasRecomendadas', JSON.stringify(rutaConParadas.paradas)); // Usar ruta.selectedParadas
            window.location.href = `info-parada.html?nombre_parada=${parada.nombre_parada}`;
        });
        newCardParadas.appendChild(newBotonParadas);

        LISTADO.appendChild(newParadasItem);
    });
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

  /**
 * Checks if there is a user logged in by verifying the presence of a token
 * in the local storage.
  * @returns {Usuario | null}
 */
  function getLoggedUserData() {
    const storedUser = sessionStorage.getItem('usuario');
    return storedUser ? JSON.parse(storedUser) : null
  }