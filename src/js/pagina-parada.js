// @ts-check

import { HttpError } from './class/HttpError.js'
//crear const amb id de la ciutat i aquesta es la que m'extreu la info 
//fer el mateix que l'altre js

//Importo datos del json
import { apiConfig } from './data/singleton.js'
/** @import {Ciudad, Paradas} from './class/ciudades.js' */

//variable vacia a rellenar con datos de json/api fetch
/** @type {Ciudad[]} */
let ciudades = []
console.log(ciudades)

//variable vacia a rellenar con datos de json/api fetch
/** @type {Paradas[]} */
let paradas = []
console.log(paradas)
// Asigno en el DOM los eventos cargados 
document.addEventListener('DOMContentLoaded', onDomContentLoaded)

//Eventos
async function onDomContentLoaded() {

    //recuperar datos sessionStorage
    recuperarSessionStorage()
    //Procesar datos de json/API
    ciudades = await getCiudadesData()
    //Procesar datos de json/API
    paradas = await getParadasData()
    //boton de volver al inicio (resetear toda la info)
    const backButton = document.getElementById('back')
    //resetear el buscador y volver inicio
    backButton?.addEventListener('click', backButtonClick)
    //Imprime ficha de la parada
    printParada()
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
 * @param {string | URL | Request} url
 */
async function fetchData(url) {
    try {
      const response = await fetch(url, {
        signal: AbortSignal.timeout(3000),
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    } catch (/** @type {any | HttpError} */err) {
      if (err.name === 'AbortError') {
        console.error('Fetch abortado');
      } else if (err instanceof HttpError) {
        if (err.response.status === 404) {
          console.error('Not found');
        } else if (err.response.status === 500) {
          console.error('Internal server error');
        } else {
          console.error('Error desconocido:', err);
        }
      }
      throw err; // Re-lanzar el error para que pueda ser manejado en el nivel superior
    }
  }
  
  async function getCiudadesData() {
    return await fetchData(apiConfig.API_CIUDADES_URL);
  }
  
  async function getParadasData() {
    const ciudadesData = await fetchData(apiConfig.API_CIUDADES_URL);
    const paradasData = ciudadesData.map((/** @type {{ paradas: any; }} */ ciudad) => ciudad.paradas).flat();
    return paradasData;
  }

//Funcion para imprimir ficha de la parada
function printParada () {
    const urlParams = new URLSearchParams(window.location.search)
    const nombreParada = urlParams.get('nombre_parada');
    let decodedNombreParada;
    if (nombreParada !== null) {
        decodedNombreParada = decodeURIComponent(nombreParada);
    } else {
        // handle the case when nombreParada is null
        console.error("No parada selected");
        return;
    }
    const paradaSeleccionada = paradas.find(parada => parada.nombre_parada === decodedNombreParada)
    console.log()
    const LISTA = document.getElementsByClassName('ficha-parada')[0]
    //Crear elemntos en DOM para almacenar la info
    const newH1Parada = document.createElement('h1')
    const newPResumenParada = document.createElement('p')
    const newPictureParada = document.createElement('picture')
    const newImagenParada = document.createElement('img')
    const newSpanNombreFotoParada = document.createElement('span')
    const newArticleParada = document.createElement('article')
    const newInfoParada = document.createElement('p')
    const newEnlaceParada = document.createElement('a')
    const newSpanCategoriaParada = document.createElement('span')
    
    //Asociar cada elemento DOM con info de json
    //Asociar cada elemento hijo con su padre
    newH1Parada.innerText = paradaSeleccionada?.nombre_parada ?? ""
    newPResumenParada.innerText = paradaSeleccionada?.descripcion ?? ""
    newPictureParada.appendChild(newImagenParada)
    newImagenParada.src = paradaSeleccionada?.imagen ?? ""
    newPictureParada.appendChild(newSpanNombreFotoParada)
    newSpanNombreFotoParada.innerText = paradaSeleccionada?.nombre_parada ?? ""
    newArticleParada.appendChild(newInfoParada)
    newInfoParada.innerText = paradaSeleccionada?.info ?? ""
    newArticleParada.appendChild(newEnlaceParada)
    newEnlaceParada.href = paradaSeleccionada?.enlace ?? ""
    newEnlaceParada.textContent = 'Visita sitio web'
    newArticleParada.appendChild(newSpanCategoriaParada)
    newSpanCategoriaParada.innerText = paradaSeleccionada?.categoria ?? ""

    LISTA.appendChild(newH1Parada)
    LISTA.appendChild(newPResumenParada)
    LISTA.appendChild(newPictureParada)
    LISTA.appendChild(newArticleParada)
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
      window.location.href = 'inicio.html';
    }
}