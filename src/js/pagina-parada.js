// @ts-check


//crear const amb id de la ciutat i aquesta es la que m'extreu la info 
//fer el mateix que l'altre js

//Importo datos del json
const API_CIUDADES_URL = './ciudades.json/lista-ciudades.json'
import {Ciudad, Paradas} from './class/ciudades.js'
//variable vacia a rellenar con datos de json/api fetch
/** @type {Ciudad[]} */
let ciudades = []
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
    //Imprime ficha de la parada
    printParada()
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
    const ciudadesData = await fetch (API_CIUDADES_URL)
    .then ((response) => {
        if (!response.ok) {
            showError(response.status)
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
    const ciudadesData = await fetch (API_CIUDADES_URL)
    .then ((response) => {
        if (!response.ok) {
            showError(response.status)
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
/**
 * @param {number} status
 */
function showError(status) {
    throw new Error("Function not implemented.")
}


//Funcion para imprimir ficha de la parada

function printParada () {
    const urlParams = new URLSearchParams(window.location.search)
    const nombreParada = decodeURIComponent(urlParams.get('nombre_parada'))
    const paradaSeleccionada = paradas.find(parada => parada.nombre_parada === nombreParada)
    const LISTA = document.getElementsByClassName('ficha-parada')[0]

    const newH2CiudadParada = document.createElement('h2')
    const newH1Parada = document.createElement('h1')
    const newPResumenParada = document.createElement('p')
    const newPictureParada = document.createElement('picture')
    const newImagenParada = document.createElement('img')
    const newSpanNombreFotoParada = document.createElement('span')
    const newArticleParada = document.createElement('article')
    const newInfoParada = document.createElement('p')
    const newEnlaceParada = document.createElement('a')
    const newSpanCategoriaParada = document.createElement('span')
    
    
    
}

/*<h2>Ciudad, País</h2>
<h1>Nombre Parada</h1>
<p>resumen</p>
<picture>
    <img src="" alt=""> foto
    <span>nombre foto</span>
</picture>
<article>
    <p>info</p> 
    <a href="#">+ info</a>
    <span>categoria</span> 
</article> -->
*/