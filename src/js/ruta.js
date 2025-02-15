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
    //const response = await getRutaPersonalizadaData(`${location.protocol}//${location.hostname}${API_PORT}/api/read/rutasPersonalizadas/${rutaId}`)
        const response = await getRutaPersonalizadaData(`${location.protocol}//${location.hostname}${API_PORT}/api/read/rutasConParadas/${rutaId}`)
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
 * @typedef {Object} RutaConParadas
 * @property {string} _id - ID de la ruta
 * @property {string} nombre - Nombre de la ruta
 * @property {string} ciudad_id - ID de la ciudad
 * @property {Object[]} paradasRuta - Array de paradas de la ruta
 * @property {string} paradasRuta._id - ID de la parada
 * @property {string} paradasRuta.parada_id - ID de la parada
 * @property {string} paradasRuta.rutaPersonalizada_id - ID de la ruta personalizada
 */

/**
 * @typedef {Object} Parada
 * @property {string} _id - ID de la parada
 * @property {string} nombre_parada - Nombre de la parada
 * @property {string} categoria - Categoría de la parada
 * @property {string} imagen - Imagen de la parada
 */

/**
 * @typedef {Object} Ciudad
 * @property {string} _id - ID de la ciudad
 * @property {string} name - Nombre de la ciudad
 */

/**
 * @typedef {Object} RutaConParadasResponse
 * @property {RutaConParadas} rutaConParadas - Ruta con paradas
 * @property {Parada[]} paradas - Array de paradas
 * @property {Ciudad} ciudad - Ciudad
 */

/**
 * @function addRuta
 * @param {RutaConParadasResponse} rutaConParadas - Ruta con paradas
 */
async function addRuta(rutaConParadas) {
  console.log('Toda la info de rutaConParadas creada:', rutaConParadas);

  const LISTADO = document.getElementsByClassName('ruta-info')[0];
  LISTADO.innerHTML = '';

  // Verifica si rutaConParadas tiene al menos un elemento
  // @ts-ignore
  if (rutaConParadas && rutaConParadas.length > 0) {
    //corregir ts no le gusta def al no contener any de rutaConParadas  
    // @ts-ignore
    const ruta = rutaConParadas[0]; // Obtener el primer objeto del array
      
      const nombreRutaSpan = document.getElementById('nombre-ruta');
      if (nombreRutaSpan) {
          nombreRutaSpan.innerText = ruta.nombre; // Acceder al nombre de la ruta
      } else {
          console.error('Elemento con ID "nombre-ruta" no encontrado.');
      }

      const tituloCiudadSpan = document.getElementById('tituloCiudad');
      if (tituloCiudadSpan) {
          tituloCiudadSpan.innerText = ruta.ciudad.name; // Acceder al nombre de la ciudad
      } else {
          console.error('Elemento con ID "tituloCiudad" no encontrado.');
      }

      
        ruta.paradasRuta.forEach((/** @type {{ parada: any; nombre_parada: any; }} */ paradaRuta) => {
          
          const parada = paradaRuta.parada;

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
          newImgParadas.src = parada.imagen; // Acceder a la imagen de la parada
          newFigureParadas.appendChild(newImgParadas);
          newArticleParadas.appendChild(newCardParadas);
          newNameParadas.innerText = parada.nombre_parada; // Acceder al nombre de la parada
          newCardParadas.appendChild(newNameParadas);
          newCategoriaParadas.innerText = 'Categoría: ' + parada.categoria; // Acceder a la categoría de la parada
          newCardParadas.appendChild(newCategoriaParadas);
          newBotonParadas.textContent = '+ Info';

          newBotonParadas.addEventListener('click', () => {
            // Obtener el ID de la parada
            const paradaId = paradaRuta.parada._id; // Acceder al _id de la parada
        
            // Guardar el ID en localStorage (opcional, pero recomendado para usar en la página de destino)
            localStorage.setItem('paradaId', paradaId);
        
            // Redireccionar a la página de info-parada.html con el ID
            window.location.href = `info-parada.html?id=${paradaId}`; // Usar el ID en la URL
        });
          newCardParadas.appendChild(newBotonParadas);

          LISTADO.appendChild(newParadasItem);

        });
     
  } else {
      console.error('No se encontraron datos de la ruta.');
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