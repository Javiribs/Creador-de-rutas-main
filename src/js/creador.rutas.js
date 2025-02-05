// @ts-check

import { simpleFetch } from './simpleFetch.js'
import { HttpError } from './class/HttpError.js'
//Importo datos del json
import { apiConfig } from './data/singleton.js'
/** @import {Ciudad} from './class/ciudades.js' */
//variable vacia a rellenar con datos de json/api fetch
/** @type {Ciudad[]} */
let ciudades = []
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
    //guardar y recuperar datos local Storeage
    recuperarLocalStorage()
    //Procesar datos de json/API
    ciudades = await getCiudadesData()
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
    window.location.href = 'perfil.html'; // Redirige a perfil.html
}

//evento buscadora, main funcion para buscar coincidencias de ciudades

//esta funcion recoge todo lo que sucede al apretar boton buscar
function searchButtonOnClick() {
    //limpiamos resultados busqueda anterior
    const resultadosList = document.querySelector('.paradas-interesantes')
    if (resultadosList) {
        resultadosList.innerHTML = ''
    }
    const searchInput = document.getElementById('searchInput')
    //aseguramos que el input pase a minúscula
    //a la vez que pasamos el valor sarch input(del usuario) por la funcion que obtiene su value
    const nameBuscado = getInputValue(searchInput)?.toLowerCase()
    //obtenemos el nombre de la ciudad buscada para que se tenga en cuenta el país
    const nombreCiudad = nameBuscado.split(' (')[0]
    //condición para que input y info de json coincidan(buscador)
    const ciudadEncontrada = ciudades.find(ciudad => ciudad.name.toLowerCase() === nombreCiudad)
    
    if (ciudadEncontrada) {
        const nameEncontrado = ciudadEncontrada
        //funcion que imprime nombre ciudad buscada
        addTitle(nameEncontrado)
        //funcion que imprime lista monumentos ciudad buscada
        addParadasList(ciudadEncontrada)
        //funcion que guarda datos en localStorage
        localStorage.setItem('paradasRecomendadas', JSON.stringify(ciudadEncontrada.paradas))
        console.log("La ciudad encontrada es:", nameEncontrado)
        } else {
        notFound(nameBuscado)
        console.log('Ciudad no encontrada')
        }
    searchInput?.setAttribute('value', " ")
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
    const titleList = document.getElementById('tituloCiudad');
    if (titleList) {
        titleList.innerText = '' // Restablece el título a su valor inicial o vacío
    }

    // 3. Limpiar el input de búsqueda (si lo tienes)
    const searchInput = document.getElementById('searchInput');
    if (searchInput instanceof HTMLInputElement) {
        searchInput.value = '';
    }
}

/**
 * Get data from API
 * @returns {Promise<Array<Ciudad>>}
 */
//funcion para leer datos del json/API
async function getCiudadesData () {
    let ciudadesData
    try {
    /** @type {Ciudad[]} */
    ciudadesData = await simpleFetch (apiConfig.API_CIUDADES_URL, {
        // Si la petición tarda demasiado, la abortamos
        signal: AbortSignal.timeout(3000),
        headers: {
          'Content-Type': 'application/json',
          // Add cross-origin header
          'Access-Control-Allow-Origin': '*',
        },
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
function searchProposal() {
    const searchInput = document.getElementById('searchInput')
    const nameBuscado = getInputValue(searchInput)?.toLowerCase()
    const sugerencias = ciudades.filter(ciudad =>
    ciudad.name.toLowerCase().startsWith(nameBuscado))
    const datalist = document.getElementById('ciudades')
    if(datalist) {
        datalist.innerHTML = '' // Limpiar opciones anteriores
    }  
    sugerencias.forEach(ciudad => {
        const option = document.createElement('option')
        option.value = `${ciudad.name} (${ciudad.country})`
        datalist?.appendChild(option);
    })
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
 * @param {Ciudad} nameEncontrado
 */
function addTitle(nameEncontrado) {
    const titleList = document.getElementById('tituloCiudad')
    if (titleList) {
      titleList.innerText = nameEncontrado.name;
    } else {
      console.error('Elemento con ID "tituloCiudad" no encontrado.')
    }
}

//Crear la lista con elementos html pintados
/**
 * @param {Ciudad} ciudadEncontrada
 */
function addParadasList(ciudadEncontrada){
    const LISTADO = document.getElementsByClassName('paradas-interesantes')[0]
    addTitle(ciudadEncontrada)
    ciudadEncontrada.paradas.forEach (( /** @type {{ nombre_parada: string; imagen: string; descripcion: string; categoria: string; info: string;}} */ parada) => {
    //Crear elemntos en DOM para almacenar la info
    const newParadasItem = document.createElement('li')
    const newArticleParadas = document.createElement('article')
    const newFigureParadas = document.createElement('figure')
    const newImgParadas = document.createElement('img')
    const newCardParadas = document.createElement('section')
    const newNameParadas = document.createElement('h2')
    const newDescriptionParadas = document.createElement('p')
    const newCategoriaParadas = document.createElement('h3')
    const newBotonParadas = document.createElement('button')
    

    //Asociar cada elemento DOM con info de json
    //Asociar cada elemento hijo con su padre
    newParadasItem.appendChild(newArticleParadas)
    newArticleParadas.appendChild(newFigureParadas)
    newImgParadas.src = parada.imagen
    newFigureParadas.appendChild(newImgParadas)
    newArticleParadas.appendChild(newCardParadas)
    newNameParadas.innerText = parada.nombre_parada
    newCardParadas.appendChild(newNameParadas)
    newDescriptionParadas.innerText = parada.descripcion
    newCardParadas.appendChild(newDescriptionParadas)
    newCategoriaParadas.innerText = 'Categoría: ' + parada.categoria
    newCardParadas.appendChild(newCategoriaParadas)
    newBotonParadas.textContent = '+ Info'
    newBotonParadas.addEventListener('click', () => {
        localStorage.setItem('paradasRecomendadas', JSON.stringify(ciudadEncontrada))
        window.location.href = `info-parada.html?nombre_parada=${parada.nombre_parada}`
    })
    newCardParadas.appendChild(newBotonParadas)
    
    
    //almacenado todo a la OL del html
    LISTADO.appendChild(newParadasItem)
    })
}

//Crear texto ciudad no encontrada
/**
 * @param {string} nameBuscado
 */
function notFound(nameBuscado) {
    const ciudadSinInfo = document.getElementById('tituloCiudad')

    if (ciudadSinInfo) {
        ciudadSinInfo.innerText = 'No hay ruta para ' + nameBuscado.toUpperCase()
    } else {
        console.error('Elemento con ID "tituloCiudad" no encontrado.')
    }
}

//funcion para guardar y cargar elementos guardados local storage
async function recuperarLocalStorage() {
    const paradasGuardadas = localStorage.getItem('paradasRecomendadas');
    if (paradasGuardadas) {
      try {
        const datosRecuperados = JSON.parse(paradasGuardadas);
        addParadasList(datosRecuperados);
      } catch (error) {
        console.error("Error al parsear datos guardados:", error);
        // Manejar el error
      }
    } else {
      // No mostrar nada si no hay búsqueda previa
      return;
    }
  }

