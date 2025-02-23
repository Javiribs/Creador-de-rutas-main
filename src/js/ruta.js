// @ts-check
import { simpleFetch } from './simpleFetch.js'
import { HttpError } from './class/HttpError.js'

const API_PORT = location.port ? `:${location.port}` : ''

/** @import {Ciudad, Paradas} from './class/ciudades.js' */
/** @import {RutaPersonalizada, ParadasRutas} from './class/rutaPersonalizada.js' */
/** @import {Usuario} from './class/usuario.js' */

document.addEventListener('DOMContentLoaded', onDomContentLoaded);


async function onDomContentLoaded() {
  //no se como implmentar router 
  // navigateTo('/ruta.html');
    // boton de volver al inicio (resetear toda la info)
    const volverInicioButton = document.getElementById('boton-inicio')
    //boton perfil
    const botonPerfil = document.getElementById('boton-perfil')
    //recuperar datos sessionStorage
    recuperarSessionStorage()
    //corregir el ignore de ts no le gusta def
    // @ts-ignore
    addRuta(await obtenerRuta()) //marcar que es un objeto

    // Eventos para los botones
    //resetear el buscador y volver inicio
    volverInicioButton?.addEventListener('click', inicioButtonClick)

    //boton accede al perfil
    botonPerfil?.addEventListener('click', perfilButtonClick)

    //boton editar ruta añadiendo paradas
    const botonAñadirParadas = document.getElementById('boton-añadir-paradas');
    if (botonAñadirParadas) {
      botonAñadirParadas.addEventListener('click', mostrarParadasDisponibles);
    }
  }


//-------------------EVENTOS-------------------//
//funcion para resetear toda la busqueda
function inicioButtonClick() {
  window.location.href = 'inicio.html'
}

//funcion acceder al perfil activando boton
function perfilButtonClick() {
  window.location.href = 'perfil.html' // Redirige a perfil.html
}


//-------------CRUD---------------//

/**
 * Get data from API
//corregir el ignore de ts no le gusta def
 * @returns {Promise<Array<RutaConParadas>>}
 */
async function obtenerRuta() {
    // Obtener el ID de la URL usando URLSearchParams
    const urlParams = new URLSearchParams(location.search);
    const rutaId = urlParams.get('id');
    // Send fetch to API, create new ruta
    if (rutaId !== null) {
      const response = await getRutaPersonalizadaData(`${location.protocol}//${location.hostname}${API_PORT}/api/read/rutasConParadas/${rutaId}`)
        return response 
    } else {
       return []
    }
}

/**
 * Get data from API
 * @param {string} apiURL
 * @param {string} method
 * @param {Object} [data]
 * @returns {Promise<Array<RutaConParadas>>}
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
        // @ts-ignore
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
    
    // Crear botón para editar el nombre de la ruta
    const botonEditarNombre = document.getElementById('boton-editar-nombre-ruta');
    botonEditarNombre?.addEventListener('click', () => {
        const nuevoNombre = prompt('Ingrese el nuevo nombre para la ruta:', ruta.nombre);
        if (nuevoNombre && nuevoNombre !== ruta.nombre) {
          ruta.nombre = nuevoNombre;
          const nombreRutaSpan = document.getElementById('nombre-ruta');
          if (nombreRutaSpan) {
            nombreRutaSpan.innerText = ruta.nombre;
          } else {
            console.error('Elemento con ID "nombre-ruta" no encontrado.');
          }
          actualizarNombreRuta(ruta._id); 
        }
    });

    
        const urlParams = new URLSearchParams(location.search);
        const rutaId = urlParams.get('id');
        const paradasDeLaRuta = await getRutaPersonalizadaData(`${location.protocol}//${location.hostname}${API_PORT}/api/read/paradasRuta/rutaPersonalizada/${rutaId}`)

        // Obtener la información completa de cada parada
        const paradasCompletas = await Promise.all(paradasDeLaRuta.map(async (paradaRuta) => {
          // @ts-ignore
          const paradaId = paradaRuta.parada_id;
          const paradaCompleta = await getRutaPersonalizadaData(`${location.protocol}//${location.hostname}${API_PORT}/api/read/paradas/${paradaId}`);
          return paradaCompleta;
        }));

        /**
        * @param {Parada} parada
        */
        paradasCompletas.forEach((parada, index) => {
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
          // @ts-ignore
          newImgParadas.src = parada.imagen; // Acceder a la imagen de la parada
          newFigureParadas.appendChild(newImgParadas);
          newArticleParadas.appendChild(newCardParadas);
          // @ts-ignore
          newNameParadas.innerText = parada.nombre_parada; // Acceder al nombre de la parada
          newCardParadas.appendChild(newNameParadas);
          // @ts-ignore
          newCategoriaParadas.innerText = 'Categoría: ' + parada.categoria; // Acceder a la categoría de la parada
          newCardParadas.appendChild(newCategoriaParadas);
          newBotonParadas.textContent = '+ Info';

          newBotonParadas.addEventListener('click', () => {
            // Obtener el ID de la parada
            const paradaRuta = paradasDeLaRuta[index]; // Acceder al _id de la parada
            console.log(paradaRuta);
            // @ts-ignore
            const paradaId = paradaRuta.parada_id;
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


// Función para actualizar el nombre de la ruta en la API
/**
 * @param {string} rutaId
 */
async function actualizarNombreRuta(rutaId) {
  try {
      const response = await getRutaPersonalizadaData(
          `${location.protocol}//${location.hostname}${API_PORT}/api/update/rutasPersonalizadas/${rutaId}`, 'PUT');

      if (!response) {
          throw new Error('Error al actualizar el nombre de la ruta');
      }
  } catch (error) {
      console.error('Error al actualizar el nombre de la ruta:', error);
      alert('Error al actualizar el nombre de la ruta. Por favor, inténtalo de nuevo más tarde.');
  }
}




//funcion para mostrar las paradas no seleccionadas en la ruta
async function mostrarParadasDisponibles() {
  //no se como implmentar router 
  // navigateTo('/paradas-disponibles'); // Navegar a la ruta /paradas-disponibles
  const rutaConParadas = await obtenerRuta();
  
  // Obtener las paradas de la ciudad que no están en la ruta
  const paradasDisponibles = await obtenerParadasDisponibles(rutaConParadas[0].ciudad_id);
  const listaParadasDisponibles = document.getElementById('lista-paradas-disponibles');
    if (listaParadasDisponibles) {
       listaParadasDisponibles.innerHTML = ''; // Limpiar la lista

       paradasDisponibles.forEach((parada) => {
           const paradaItem = document.createElement('li');
           // @ts-ignore
           paradaItem.textContent = parada.nombre_parada;

           // Añadir botón para agregar la parada a la ruta
           const botonAgregarParada = document.createElement('button');
           botonAgregarParada.textContent = 'Agregar';
           botonAgregarParada.addEventListener('click', () => agregarParadaARuta(rutaConParadas[0]._id, parada._id));

           paradaItem.appendChild(botonAgregarParada);
           listaParadasDisponibles.appendChild(paradaItem);
        });

    }
}


/**
 * @function obtenerParadasDisponibles
 * @param {string} ciudadId 
 */
async function obtenerParadasDisponibles(ciudadId) {
  const urlParams = new URLSearchParams(location.search);
    const rutaId = urlParams.get('id');
  const paradasDeLaRuta = await getRutaPersonalizadaData(`${location.protocol}//${location.hostname}${API_PORT}/api/read/paradasRuta/rutaPersonalizada/${rutaId}`)
    try {
      console.log('id ciudad + las paradas ya seleccioandas', ciudadId, paradasDeLaRuta);
        const response = await getRutaPersonalizadaData(
            `${location.protocol}//${location.hostname}${API_PORT}/api/read/paradasPorCiudad/${ciudadId}`,
            'GET'
        );
        console.log(response);
        if (!response || !Array.isArray(response)) {
            throw new Error('Error al obtener las paradas de la ciudad.');
        }

        // Eliminar las paradas que ya están en la ruta
        const paradasDisponibles = response.filter((ruta) => {
          return !paradasDeLaRuta.some((parada) => {
              // @ts-ignore
              return parada.parada_id === ruta._id;
          });
      });
      return paradasDisponibles;

  } catch (error) {
      console.error('Error al obtener paradas disponibles:', error);
      return [];
  }
}


/**
 * Adds a stop to the specified route.
 * 
 * @param {string} rutaId - The ID of the route to which the stop will be added.
 * @param {string} paradaId - The ID of the stop to be added to the route.
 */

async function agregarParadaARuta(rutaId, paradaId) {
  if (confirm('¿Estás seguro de que quieres agregar esta parada a la ruta?')) {
  try {
    const paradaRutaData = {
      parada_id: paradaId,
      orden: 0,
      rutaPersonalizada_id: rutaId,
    };
    const payload = JSON.stringify(paradaRutaData);
    const response = await getRutaPersonalizadaData(`${location.protocol}//${location.hostname}${API_PORT}/api/create/ParadasRuta`, 'POST', payload)
    console.log(response);
    if (!response) {
      throw new Error('Error al agregar la parada a la ruta');
    }
    alert('Parada agregada a la ruta.');
      await actualizarRutaPersonalizada()
      window.location.reload();
    }  catch (error) {
    console.error('Error al agregar parada a la ruta:', error);
    alert('Error al agregar la parada a la ruta. Por favor, inténtalo de nuevo más tarde.');
  }
 }
}

// Función para actualizar la ruta personalizada
async function actualizarRutaPersonalizada() {
  // Obtener el ID de la URL usando URLSearchParams
  const urlParams = new URLSearchParams(location.search);
  const rutaIdData = urlParams.get('id');
  try {
      // Lógica para actualizar la ruta personalizada
      const response = await getRutaPersonalizadaData(`${location.protocol}//${location.hostname}${API_PORT}/api/update/rutasPersonalizadas/${rutaIdData}`, 'PUT');

      if (!response) {
          throw new Error('Error al actualizar la ruta personalizada.');
      }

      console.log('Ruta personalizada actualizada con éxito.');
      // Puedes agregar aquí lógica adicional después de la actualización

  } catch (error) {
      console.error('Error al actualizar la ruta personalizada:', error);
      alert('Error al actualizar la ruta personalizada. Por favor, inténtalo de nuevo más tarde.');
  }
}

