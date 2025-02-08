// @ts-check

import { Ciudad } from './class/ciudades.js';

//importo clase ruta personalizada
import {RutaPersonalizada} from './class/rutaPersonalizada.js'
/** @import {Paradas} from './class/ciudades.js' */

// Asigno en el DOM los eventos cargados 
document.addEventListener('DOMContentLoaded', onDomContentLoaded)
//EVENTOS
async function onDomContentLoaded() {
  try {
    // Obtener datos del localStorage
    const rutasGuardadas = localStorage.getItem('rutas');

    if (rutasGuardadas) {
        const rutas = JSON.parse(rutasGuardadas);

        // Verificar si hay rutas guardadas
        if (rutas.length > 0) {
            // Obtener la última ruta creada (o la que necesites)
            const ultimaRuta = rutas[rutas.length - 1];

            // Crear instancia de RutaPersonalizada a partir de los datos guardados
            const ciudad = new Ciudad(ultimaRuta.ciudad.name, '', []); // Asegúrate de que ciudad sea un objeto Ciudad válido
            const nombreCiudad = ciudad.name
            const rutaPersonalizada = new RutaPersonalizada(
                nombreCiudad,
                ultimaRuta.nombre,
                ultimaRuta.paradas,
                new Date(ultimaRuta.fechaCreacion),
                ultimaRuta.usuario
            );

            addRuta(rutaPersonalizada);
            console.log(rutaPersonalizada);
        } else {
            console.log('No hay rutas guardadas en el localStorage.');
            // Puedes mostrar un mensaje al usuario o realizar alguna otra acción
        }
    } else {
        console.log('No hay rutas guardadas en el localStorage.');
        // Puedes mostrar un mensaje al usuario o realizar alguna otra acción
    }
} catch (error) {
    console.error('Error al cargar datos del localStorage:', error);
    alert('Error al cargar datos. Por favor, inténtalo de nuevo más tarde.');
}
}


//CRUD

//funcion para crear elementos del DOM con información api
/**
 * @param {RutaPersonalizada} rutaPersonalizada
 */
function addRuta(rutaPersonalizada) {
    const LISTADO = document.getElementsByClassName('ruta-info')[0]

    // Obtener referencias a los spans
    const nombreRutaSpan = document.getElementById('nombre-ruta')
    if (nombreRutaSpan) {
      nombreRutaSpan.innerText = rutaPersonalizada.nombre;
    } else {
      console.error('Elemento con ID "nombre-ruta" no encontrado.')
    }
    const tituloCiudadSpan = document.getElementById('tituloCiudad')
    if (tituloCiudadSpan) {
    tituloCiudadSpan.innerText = rutaPersonalizada.ciudad;
    } else {
    console.error('Elemento con ID "tituloCiudad" no encontrado.')
    } 
    
    
    rutaPersonalizada.paradas.forEach((/** @type {Paradas}} */ parada) => {
        const newParadasItem = document.createElement('li')
        const newArticleParadas = document.createElement('article')
        const newFigureParadas = document.createElement('figure')
        const newImgParadas = document.createElement('img')
        const newCardParadas = document.createElement('section')
        const newNameParadas = document.createElement('h2')
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
        newCategoriaParadas.innerText = 'Categoría: ' + parada.categoria
        newCardParadas.appendChild(newCategoriaParadas)
        newBotonParadas.textContent = '+ Info'

        //evento para redirigir al html de la info detallada de la parada
        newBotonParadas.addEventListener('click', () => {
            localStorage.setItem('paradasRecomendadas', JSON.stringify(rutaPersonalizada.paradas));
            window.location.href = `info-parada.html?nombre_parada=${parada.nombre_parada}`
        })
        newCardParadas.appendChild(newBotonParadas)
     
        //almacenado todo a la UL del html
        LISTADO.appendChild(newParadasItem)
    })
}
