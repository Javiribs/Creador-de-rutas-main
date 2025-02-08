// @ts-check

//FUNCION CREA OBJETO RUTA PERSONALIZADA AL HACER CLICK BOTON CREAR RUTA

import { simpleFetch } from './simpleFetch.js'
import { HttpError } from './class/HttpError.js'

//importo la clase ciudad
/** @import {Ciudad} from './class/ciudades.js' */

// crear-ruta-personalizada.js
import { RutaPersonalizada } from './class/rutaPersonalizada.js';

/**
 * @param {HTMLButtonElement} botonCrearRuta
 * @param {any[]} paradasSeleccionadas
 * @param {RutaPersonalizada[]} rutas
 * @param {Ciudad} ciudadEncontrada
  */
export async function inicializarCreacionRuta(botonCrearRuta, paradasSeleccionadas, rutas, ciudadEncontrada) {
    botonCrearRuta?.addEventListener('click', async () => {
        if (Array.isArray(paradasSeleccionadas) && paradasSeleccionadas.length < 2) {
            alert("Debes seleccionar al menos dos paradas para crear una ruta.");
            return;
        }

       // Obtener usuarioId desde sessionStorage
        const usuarioGuardado = sessionStorage.getItem('usuario');
        const usuario = JSON.parse(usuarioGuardado || '{}');
        const usuarioId = usuario?.id;

        const nuevaRuta = new RutaPersonalizada(ciudadEncontrada,"Mi ruta", paradasSeleccionadas, new Date(), usuarioId);
         // *** Comprobacion se recogen los datos***
         console.log("Nueva ruta creada:", nuevaRuta);
         
        rutas.push(nuevaRuta);
        guardarRutas(rutas);

        const timestamp = new Date();
        const rutaId = String(timestamp.getTime()); // ID único para la ruta

        const rutaData = {
            nombre: nuevaRuta.nombre,
            ciudad: ciudadEncontrada.name,
            fecha: nuevaRuta.fechaCreacion,
            paradas: nuevaRuta.paradas,
            usuarioId: nuevaRuta.usuario,
            id: rutaId // Usar el ID generado
        }

        try {
          const payload = JSON.stringify(rutaData);
          const response = await getAPIData(`http://${location.hostname}:1337/create/rutas_personalizadas`, 'POST', payload);

          if (!response) {
              throw new Error('Error al crear ruta');
          }

      } catch (error) {
          console.error('Error al crear ruta:', error);
          alert('Error al crear ruta. Por favor, inténtalo de nuevo más tarde.');
          return; // Importante: Detener la ejecución si hay un error
      }

      window.location.href = `ruta.html?id=${rutaId}`; // Pasar solo el ID
  })

    /**
     * @param {RutaPersonalizada[]} rutas
     */
    function guardarRutas(rutas) {
        localStorage.setItem('rutas', JSON.stringify(rutas));
    }
}

/**
 * Get data from API
 * @param {string} apiURL
 * @param {string} method
 * @param {Object} [data]
 * @returns {Promise<Array<RutaPersonalizada>>}
 */
async function getAPIData(apiURL = './server/BBDD/new.usuarios.json', method = 'GET', data) {
    let apiData

    try {
      let headers = new Headers()
  
      headers.append('Content-Type', 'application/json')
      headers.append('Access-Control-Allow-Origin', '*')
      if (data) {
        headers.append('Content-Length', String(JSON.stringify(data).length))
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