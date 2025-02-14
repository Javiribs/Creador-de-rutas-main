// @ts-check

import { simpleFetch } from './simpleFetch.js'
import { HttpError } from './class/HttpError.js'
//Importo datos del json
//import { apiConfig } from './data/singleton.js'

const API_PORT = location.port ? `:${location.port}` : ''

/** @import {Ciudad} from './class/ciudades.js' */
//variable vacia a rellenar con datos de json/api fetch
/** @type {Ciudad[]} */
//let ciudades = []

/** @import {Paradas} from './class/ciudades.js' */
//variable vacia a rellenar con datos de json/api fetch
/**
 * @type {Paradas[]}
 */
let paradasSeleccionadas = [] // Array para guardar las paradas seleccionadas

/** @import {Usuario} from './class/usuario.js' */


//importo funcion boton crear ruta
import { inicializarCreacionRuta } from './crear-ruta-personalizada.js'

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

//evento buscadora, main funcion para buscar coincidencias de ciudades

//esta funcion recoge todo lo que sucede al apretar boton buscar
async function searchButtonOnClick() {
  const resultadosList = document.querySelector('.paradas-interesantes');
  if (resultadosList) {
      resultadosList.innerHTML = '';
  }

  const searchInput = document.getElementById('searchInput');
  const nameBuscado = getInputValue(searchInput)?.toLowerCase();
  const nombreCiudad = nameBuscado.split(' (')[0];
  console.log(nombreCiudad);
  
    try {
      // Obtener datos de ciudades desde el servidor
      const ciudadEncontrada = await getCiudadesData(`${location.protocol}//${location.hostname}${API_PORT}/api/filter/ciudades/${nombreCiudad}`);
      console.log('La ciudadEncontrada es:', ciudadEncontrada)

      if (!ciudadEncontrada || ciudadEncontrada.length === 0) {
        notFound(nameBuscado);
        return; // Salir de la función para evitar errores posteriores
      }
      addTitle(ciudadEncontrada[0])
      addParadasList(ciudadEncontrada[0])
      
      if (!ciudadEncontrada) {
          throw new Error("No se pudieron obtener las ciudades desde el servidor.");
      } 
    } catch (error) {
      console.error("Error en la búsqueda de ciudades:", error);
      alert("Ocurrió un error durante la búsqueda. Inténtalo de nuevo más tarde.");
  } finally {
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

/**
 * Get data from API
 * @param {string} apiURL
 * @param {string} method
 * @param {Object} [data]
 * @returns {Promise<Array<Ciudad>>}
 */
//funcion para leer datos del json/API
async function getCiudadesData (apiURL, method = 'GET', data) {
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
   
//C.R.U.D

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

//Crear el título con el nombre de la ciudad encontrada
/**
 * @param {Ciudad} ciudadEncontrada
 */
function addTitle(ciudadEncontrada) {
    const titleList = document.getElementById('tituloCiudad')
    if (titleList) {
      titleList.innerText = ciudadEncontrada.name;
    } else {
      console.error('Elemento con ID "tituloCiudad" no encontrado.')
    }
}

//Crear la lista con elementos html pintados
/**
 * @param {Ciudad} ciudadEncontrada
 */
function addParadasList(ciudadEncontrada) {
  const LISTADO = document.getElementsByClassName('paradas-interesantes')[0];
  if (!LISTADO) {
      console.error("No se encontró el elemento con la clase 'paradas-interesantes'.");
      return; // Salir de la función si no se encuentra el elemento
  }
  LISTADO.innerHTML = ''; // Limpiar la lista antes de añadir nuevas paradas
  
  const newBotonCrearRuta = document.createElement('button');
  newBotonCrearRuta.id = 'crearRuta';
  newBotonCrearRuta.textContent = 'Crear ruta';
//error ts en el .paradas
  // @ts-ignore
  if (ciudadEncontrada && ciudadEncontrada.paradas && ciudadEncontrada.paradas.length > 0) { // Verifica que ciudadEncontrada y paradas existan y tengan elementos.
      // @ts-ignore
      ciudadEncontrada.paradas.forEach((/** @type {Paradas}} */ parada) => {
          // Crear elementos en el DOM para almacenar la info
          const newParadasItem = document.createElement('li');
          const newArticleParadas = document.createElement('article');
          const newFigureParadas = document.createElement('figure');
          const newImgParadas = document.createElement('img');
          const newCardParadas = document.createElement('section');
          const newNameParadas = document.createElement('h2');
          const newDescriptionParadas = document.createElement('p');
          const newCategoriaParadas = document.createElement('h3');
          const newCheckboxParada = document.createElement('input');
          const newLabelCheckbox = document.createElement('label');

          // Asociar cada elemento DOM con info de json
          newParadasItem.appendChild(newArticleParadas);
          newArticleParadas.appendChild(newFigureParadas);
          newImgParadas.src = parada.imagen;
          newFigureParadas.appendChild(newImgParadas);
          newArticleParadas.appendChild(newCardParadas);
          newNameParadas.innerText = parada.nombre_parada;
          newCardParadas.appendChild(newNameParadas);
          newDescriptionParadas.innerText = parada.descripcion;
          newCardParadas.appendChild(newDescriptionParadas);
          newCategoriaParadas.innerText = 'Categoría: ' + parada.categoria;
          newCardParadas.appendChild(newCategoriaParadas);

          newCheckboxParada.type = 'checkbox';
          newCheckboxParada.id = `parada-${parada.nombre_parada.replace(/\s+/g, '-').toLowerCase()}`; // ID único
          newCheckboxParada.classList.add('parada-checkbox'); // Clase para identificar checkboxes
          newCardParadas.appendChild(newCheckboxParada);
          newLabelCheckbox.htmlFor = newCheckboxParada.id;
          newLabelCheckbox.textContent = "Añadir a la ruta"; // Texto de la etiqueta
          newCardParadas.appendChild(newCheckboxParada);
          newCardParadas.appendChild(newLabelCheckbox);
          // evento para seleccionar o no la parada
          newCheckboxParada.addEventListener('change', () => {
              if (newCheckboxParada.checked) {
                  paradasSeleccionadas.push(parada); // Añadir parada al array
              } else {
                  paradasSeleccionadas = paradasSeleccionadas.filter(p => p.nombre_parada !== parada.nombre_parada); // Eliminar parada del array
              }
              console.log(paradasSeleccionadas); // Mostrar paradas seleccionadas en la consola (para depuración)
          });

          // Almacenar todo a la OL del html
          LISTADO.appendChild(newParadasItem);
      });
  } else {
      console.warn("No se encontraron paradas para la ciudad seleccionada o la información de la ciudad es inválida.");
      // Puedes agregar un mensaje al usuario indicando que no hay paradas disponibles.
      const mensajeNoParadas = document.createElement('li');
      mensajeNoParadas.textContent = "No hay paradas disponibles para esta ciudad.";
      LISTADO.appendChild(mensajeNoParadas);
  }
  // Almacenar botón crear ruta al final de la OL
  LISTADO.appendChild(newBotonCrearRuta);

  // Inicializar creación de rutas
  inicializarCreacionRuta(newBotonCrearRuta, paradasSeleccionadas, ciudadEncontrada);
}


//Crear texto ciudad no encontrada
/**
 * @param {string} nameBuscado
 */
function notFound(nameBuscado) {
    const ciudadSinInfo = document.getElementById('tituloCiudad')

    if (ciudadSinInfo) {
        ciudadSinInfo.innerText = 'No hay propuestas para ' + nameBuscado.toUpperCase()
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
