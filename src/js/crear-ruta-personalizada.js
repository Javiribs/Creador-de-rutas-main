// @ts-check

//FUNCION CREA OBJETO RUTA PERSONALIZADA AL HACER CLICK BOTON CREAR RUTA

import { simpleFetch } from './simpleFetch.js'
import { HttpError } from './class/HttpError.js'

const API_PORT = location.port ? `:${location.port}` : ''

//importo la clase ciudad
/** @import {Ciudad} from './class/ciudades.js' */
//importo la clase paradas
/** @import {Paradas} from './class/ciudades.js' */
//importo la clase usuario
/** @import {Usuario} from './class/usuario.js' */
//importo la clase ciudad
/** @import {RutaPersonalizada} from './class/rutaPersonalizada.js' */

/**
 * @param {HTMLButtonElement} botonCrearRuta
 * @param {Paradas[]} paradasSeleccionadas
 * @param {Ciudad} ciudadEncontrada
  */
export async function inicializarCreacionRuta(botonCrearRuta, paradasSeleccionadas, ciudadEncontrada) {
    botonCrearRuta?.addEventListener('click', async () => {
        if (Array.isArray(paradasSeleccionadas) && paradasSeleccionadas.length < 2) {
            alert("Debes seleccionar al menos dos paradas para crear una ruta.");
            return;
        }

       //Obtener usuarioId desde sessionStorage
        const usuarioGuardado = sessionStorage.getItem('usuario');
        const usuario = JSON.parse(usuarioGuardado || '{}');
        const usuarioId = usuario?.id;

        let i = 0
        const selectedParadas = paradasSeleccionadas.map((parada) => {
          return {
            parada_id: parada._id,
            orden: i++,
            rutaPersonalizada_id: ''
          }
        });

        const rutaPersonalizadaData = { 
            
          ciudad_id: ciudadEncontrada._id,
          nombre: 'Mi ruta',
          usuario_id: usuarioId,
          fechaCreacion: new Date(),
          selectedParadas
        }

        console.log(selectedParadas)

        try {
          
          const payload = JSON.stringify(rutaPersonalizadaData)
          // Send fetch to API, create new ruta
          console.log("Datos que se enviarán al servidor:", rutaPersonalizadaData);
          const response = await getAPIData(`${location.protocol}//${location.hostname}${API_PORT}/api/create/rutasPersonalizadas`, 'POST', payload) // Ruta al archivo JSON 
          console.log("Respuesta del servidor:", response);
          if (!response) {
            throw new Error('Error al crear la ruta') // Muestra el error del servidor o un mensaje genérico
          }

          const rutaId = response._id;
          window.location.href = `ruta.html?id=${rutaId}`;
        } catch (error) {
          console.error('Error al crear la ruta:', error)
          alert('Error al crear la ruta. Por favor, inténtalo de nuevo más tarde.')   
      } // Pasar solo el ID
  })
}

//C.R.U.D

/**
 * Get data from API
 * @param {string} apiURL
 * @param {string} method
 * @param {Object} [data]
 * @returns {Promise<RutaPersonalizada>}
 */
async function getAPIData(apiURL, method = 'GET', data) {
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
      apiData = await simpleFetch(apiURL, {
        // Si la petición tarda demasiado, la abortamos
      signal: AbortSignal.timeout(3000),
      method: method,      
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
  
    return apiData
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


