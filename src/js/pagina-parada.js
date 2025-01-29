// @ts-check


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

    //Procesar datos de json/API
    await processCiudadesData()
    //Procesar datos de json/API
    await processParadasData()
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
    localStorage.setItem('busqueda_texto', searchInput?.value);

    // 2. Guardar los resultados de búsqueda (paradas recomendadas)
    const paradasGuardadas = localStorage.getItem('paradasRecomendadas'); //Ya se guardan al buscar, no hace falta volver a guardarlas
    localStorage.setItem('paradas_mostradas', paradasGuardadas);

    // 3. Guardar el título de la ciudad
    const tituloCiudad = document.getElementById('tituloCiudad');
    localStorage.setItem('titulo_ciudad', tituloCiudad?.innerText);

    // 4. Navegar hacia atrás
    history.back();
}

//Mtetodos

//funcion para activar las funciones que obtienen datos del json/API y los añaden el el DOM
async function processCiudadesData() {
    getCiudadesData()
    pushCiudadesData()
}

//funcion para leer datos del json/API
async function getCiudadesData () {
    /** @type {Ciudad[]} */
    const ciudadesData = await fetch (apiConfig.API_CIUDADES_URL)
    .then ((response) => {
        if (!response.ok) {
            showError()
        }
        return response.json();
    })
    return ciudadesData
}
//funcion para obtener datos del json/API
async function pushCiudadesData() {
    const datosCiudades = await getCiudadesData()
    ciudades = datosCiudades
    
}

//funcion para leer datos del json/API

async function getParadasData () {
    /** @type {Ciudad[]} */
    const ciudadesData = await fetch (apiConfig.API_CIUDADES_URL)
    .then ((response) => {
        if (!response.ok) {
            showError()
        }
        return response.json();
    })
    const paradasData = ciudadesData.map(ciudad => ciudad.paradas).flat()
    return paradasData
}

//funcion para obtener datos del json/API
async function pushParadasData() {
    const datosParadas = await getParadasData()
    paradas = datosParadas
}

//funcion para activar las funciones que obtienen datos del json/API y los añaden el el DOM
async function processParadasData() {
    await getParadasData()
    await pushParadasData()
}

//funcion que muestra error en caso de no obtener datos del API
function showError() {
    throw new Error("Function not implemented.")
}

//Funcion para imprimir ficha de la parada
function printParada () {
    const urlParams = new URLSearchParams(window.location.search)
    const nombreParada = decodeURIComponent(urlParams.get('nombre_parada'))
    const paradaSeleccionada = paradas.find(parada => parada.nombre_parada === nombreParada)
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
