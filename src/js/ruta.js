
// @ts-check
import { simpleFetch } from './simpleFetch.js'
import { HttpError } from './class/HttpError.js'
import { initMap, abrirGoogleMaps, obtenerGeolocalizacion } from './lib/mapsFunctions.js'

const API_PORT = location.port ? `:${location.port}` : ''

/** @import {Ciudad} from './class/ciudades.js' */
/** @import {Usuario} from './class/usuario.js' */

document.addEventListener('DOMContentLoaded', onDomContentLoaded);


async function onDomContentLoaded() {
  
    // boton de volver al inicio (resetear toda la info) 
    const volverInicioButton = document.getElementById('boton-inicio')
    //boton perfil
    const botonPerfil = document.getElementById('boton-perfil')
    //boton mostrar más paradas para añadir
    const botonAñadirParadas = document.getElementById('boton-anadir-paradas')
    //boton reenviar a google.maps
    const botonGoogleMaps = document.getElementById("boton-google-maps");
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

    //boton mostrar más paradas que añadir
    botonAñadirParadas?.addEventListener('click', añadirParadas);
  
    //boton reenviar a google.maps
    botonGoogleMaps?.addEventListener("click", () => {
    // Obtiene la URL del atributo data-url del botón
    const url = botonGoogleMaps.dataset.url;
    abrirGoogleMaps(url);
    });
    const botonGeolocalizacion = document.getElementById("boton-geolocalizacion");
    botonGeolocalizacion?.addEventListener("click", () => {
    // @ts-ignore
    // eslint-disable-next-line no-undef
    obtenerGeolocalizacion(map); // Pasa el objeto map a la función
    });
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

//funcion para mostrar paradas que añadir
function añadirParadas() {
  mostrarParadasDisponibles()
}

//-------------CRUD---------------//

/**
 * Get data de la API
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
      signal: AbortSignal.timeout(10000),
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

//Obtengo toda la info de la ruta (de la Api) con el id como parámetro
export async function obtenerRuta() {
    // Obtener el ID de la URL usando URLSearchParams
    const urlParams = new URLSearchParams(location.search);
    const rutaId = urlParams.get('id');
    // Send fetch to API, create new ruta
    if (rutaId !== null) {
      const response = await getApiData(`${location.protocol}//${location.hostname}${API_PORT}/api/read/rutasConParadas/${rutaId}`)
      return response 
    } else {
       return []
    }
}

/**
 * @typedef {Array<Ruta>} Rutas
 */

/**
 * @typedef {object} Ruta
 * @property {string} _id
 * @property {string} nombre
 * @property {Ciudad} ciudad
 * @property {string} ciudad_id
 * @property {string} fechaCreacion
 * @property {ParadaRuta[]} paradasRuta
 * @property {string} usuario_id
 */

/**
 * @typedef {object} Ciudad
 * @property {string} name
 * @property {string} country
 */

/**
 * @typedef {object} ParadaRuta
 * @property {string} _id
 * @property {string} parada_id
 * @property {number} orden
 * @property {string} rutaPersonalizada_id
 * @property {string} rutaPersonalizada_id_obj
 * @property {Parada} parada
 */

/**
 * @typedef {object} Parada
 * @property {string} _id
 * @property {string} ciudad_id
 * @property {string} nombre_parada
 * @property {number[]} coordenadas
 * @property {string} descripcion
 * @property {string} imagen
 * @property {string} categoria
 */

/**
 * funcion para pintar la informacion de la ruta personalizada con el detalle de las paradas
 * @param {Rutas} rutaConParadas 
 */
//Pintar elementos en el DOM
async function addRuta(rutaConParadas) {
  const LISTADO = document.getElementsByClassName('ruta-info')[0];
  LISTADO.innerHTML = '';
  
  if (rutaConParadas && rutaConParadas.length > 0) {    
    const ruta = rutaConParadas[0];      
    const nombreRutaSpan = document.getElementById('nombre-ruta');
    if (nombreRutaSpan) {
        nombreRutaSpan.innerText = ruta.nombre; 
    } else {
         console.error('Elemento con ID "nombre-ruta" no encontrado.');
    }
    const tituloCiudadSpan = document.getElementById('tituloCiudad');
    if (tituloCiudadSpan) {
        tituloCiudadSpan.innerText = ruta.ciudad.name;
    } else {
          console.error('Elemento con ID "tituloCiudad" no encontrado.');
     }
    
    // Crear botón para editar el nombre de la ruta
    const botonEditarNombre = document.getElementById('boton-editar-nombre-ruta');
    botonEditarNombre?.addEventListener('click', async () => {
        const urlParams = new URLSearchParams(location.search);
        const rutaIdData = urlParams.get('id');
        const nuevoNombre = prompt('Ingrese el nuevo nombre para la ruta:', ruta.nombre);
        if (nuevoNombre && nuevoNombre !== ruta.nombre) {
          ruta.nombre = nuevoNombre;
          const nombreRutaSpan = document.getElementById('nombre-ruta');
          if (nombreRutaSpan) {
            nombreRutaSpan.innerText = ruta.nombre;
          } else {
            console.error('Elemento con ID "nombre-ruta" no encontrado.');
          }
          await actualizarRutaPersonalizada(rutaIdData, nuevoNombre);
        }
    });
    
     const paradasCompletas = ruta.paradasRuta
     // Inicializar el mapa
     initMap(paradasCompletas);
     
  } else {
      console.error('No se encontraron datos de la ruta.');
  }
}


// Función para mostrar las paradas no seleccionadas en la ruta
async function mostrarParadasDisponibles() {
  const rutaConParadas = await obtenerRuta();
  // Obtener las paradas de la ciudad que no están en la ruta
  // @ts-ignore
  const paradasDisponibles = await obtenerParadasDisponibles(rutaConParadas[0].ciudad_id);
  const listaParadasDisponibles = document.getElementById('lista-paradas-disponibles');
  if (listaParadasDisponibles) {
      listaParadasDisponibles.innerHTML = ''; 

      paradasDisponibles.forEach((parada) => {
          const paradaItem = document.createElement('li');
          // @ts-ignore
          paradaItem.textContent = parada.nombre_parada;

          // Añadir botón para ver más info
          const botonInfoParada = document.createElement('button');
          botonInfoParada.textContent = '+ Info';
          botonInfoParada.id = 'mi-boton-info-parada';
          botonInfoParada.classList.add('boton-info-parada');
          botonInfoParada.addEventListener('click', () => {
            localStorage.setItem('paradaId', parada._id);
            window.location.href = `info-parada.html?id=${parada._id}`;
          });
          paradaItem.appendChild(botonInfoParada);

          // Añadir botón para agregar la parada a la ruta
          const botonAgregarParada = document.createElement('button');
          botonAgregarParada.textContent = 'Agregar';
          botonAgregarParada.id = 'mi-boton-agregar-parada';
          botonAgregarParada.classList.add('boton-agregar-parada');
          // @ts-ignore
          botonAgregarParada.addEventListener('click', () => agregarParadaARuta(rutaConParadas[0]._id, parada._id));

          paradaItem.appendChild(botonAgregarParada);
          listaParadasDisponibles.appendChild(paradaItem);
      });

      // Cambiar el texto y la funcionalidad del botón
      const botonAnadirParadas = document.getElementById('boton-anadir-paradas');
      const botonOcultarParadas = document.getElementById('boton-ocultar-paradas');
      if (botonAnadirParadas && botonOcultarParadas) {
          botonAnadirParadas.textContent = 'Ocultar paradas disponibles';
          botonAnadirParadas.style.display = 'none';
          botonOcultarParadas.style.display = 'block';

          // Mostrar la lista de paradas disponibles
          const paradasDisponiblesSection = document.getElementById('paradas-disponibles');
          if (paradasDisponiblesSection) {
              paradasDisponiblesSection.style.display = 'block';
          }
      }
  }
}

// Asociar la funcionalidad al botón "Ocultar paradas disponibles"
const botonOcultarParadas = document.getElementById('boton-ocultar-paradas');
if (botonOcultarParadas) {
  botonOcultarParadas.addEventListener('click', () => {
      const botonAnadirParadas = document.getElementById('boton-anadir-paradas');
      const botonOcultarParadas = document.getElementById('boton-ocultar-paradas');
      if (botonAnadirParadas && botonOcultarParadas) {
          botonAnadirParadas.textContent = 'Añadir Puntos de Interés';
          botonAnadirParadas.style.display = 'block';
          botonOcultarParadas.style.display = 'none';

          // Ocultar la lista de paradas disponibles
          const paradasDisponiblesSection = document.getElementById('paradas-disponibles');
          if (paradasDisponiblesSection) {
              paradasDisponiblesSection.style.display = 'none';
          }
      }
  });
}


/**
 * Función para obtener las paradas que no forman parte de la ruta personalizada
 * pero son de la ciudad seleccionada.
 * @function obtenerParadasDisponibles
 * @param {string} ciudadId
 */
async function obtenerParadasDisponibles(ciudadId) {
  const urlParams = new URLSearchParams(location.search);
  const rutaId = urlParams.get('id');
  const paradasDeLaRuta = await getApiData(`${location.protocol}//${location.hostname}${API_PORT}/api/read/paradasRuta/rutaPersonalizada/${rutaId}`)
  console.log(paradasDeLaRuta);
  try {
      const response = await getApiData(`${location.protocol}//${location.hostname}${API_PORT}/api/read/paradasPorCiudad/${ciudadId}`, 'GET');
      if (!response || !Array.isArray(response)) {
          throw new Error('Error al obtener las paradas de la ciudad.');
      }

      // Eliminar las paradas que ya están en la ruta
      const paradasDisponibles = response.filter((ruta) => {
        // @ts-ignore
        return !paradasDeLaRuta.some((parada) => {
            // @ts-ignore
            return parada.parada_id === ruta._id;
        });
    });
    console.log(paradasDisponibles);
    return paradasDisponibles;

} catch (error) {
    console.error('Error al obtener paradas disponibles:', error);
    return [];
}
}


/**
 * Funcion para crear el objeto ParadasRuta el cual va a contener el id de la parada
 * que contiene su información y el id de la ruta personalizada
 * 
 * @param {string} rutaId 
 * @param {string} paradaId 
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
    const response = await getApiData(`${location.protocol}//${location.hostname}${API_PORT}/api/create/ParadasRuta`, 'POST', payload)
    console.log(response);
    if (!response) {
      throw new Error('Error al agregar la parada a la ruta');
    }
    alert('Parada agregada a la ruta.');
    // @ts-ignore
    // eslint-disable-next-line no-undef
    paintParadaRow(response);
    }  catch (error) {
    console.error('Error al agregar parada a la ruta:', error);
    alert('Error al agregar la parada a la ruta. Por favor, inténtalo de nuevo más tarde.');
  }
 }
}

/**
 * 
 * @param {string | null} rutaIdData 
 * @param {string} nuevoNombre 
 */
// Función para actualizar el nombre de la ruta a través de su id
async function actualizarRutaPersonalizada(rutaIdData, nuevoNombre) {
  try {
      // Lógica para actualizar la ruta personalizada
      const payload = JSON.stringify({ nombre: nuevoNombre });
      const response = await getApiData(`${location.protocol}//${location.hostname}${API_PORT}/api/update/rutasPersonalizadas/${rutaIdData}`, 'PUT', payload);

      if (!response) {
          throw new Error('Error al actualizar la ruta personalizada.');
      }

      console.log('Ruta personalizada actualizada con éxito.');

  } catch (error) {
      console.error('Error al actualizar la ruta personalizada:', error);
      alert('Error al actualizar la ruta personalizada. Por favor, inténtalo de nuevo más tarde.');
  }
}

// Recuperar datos de sessionStorage del usuario al cargar la página
async function recuperarSessionStorage() {
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
* verifica que el usuario este logueado, si no lo devuelve al inicio
* @returns {Usuario | null}
*/
function getLoggedUserData() {
  const storedUser = sessionStorage.getItem('usuario');
  return storedUser ? JSON.parse(storedUser) : null
}