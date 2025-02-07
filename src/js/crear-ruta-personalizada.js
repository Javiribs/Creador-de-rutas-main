// @ts-check

// crear-ruta-personalizada.js
import { RutaPersonalizada } from './class/rutaPersonalizada.js';

/**
 * @param {HTMLButtonElement} botonCrearRuta
 * @param {any[]} paradasSeleccionadas
 * @param {RutaPersonalizada[]} rutas
  */
export function inicializarCreacionRuta(botonCrearRuta, paradasSeleccionadas, rutas) {
    botonCrearRuta?.addEventListener('click', () => {
        console.log("Button clicked!");
        if (Array.isArray(paradasSeleccionadas) && paradasSeleccionadas.length < 2) {
            alert("Debes seleccionar al menos dos paradas para crear una ruta.");
            return;
        }

       // Obtener usuarioId desde sessionStorage
       const usuarioGuardado = sessionStorage.getItem('usuario');
       const usuario = JSON.parse(usuarioGuardado || '{}');
       const usuarioId = usuario?.id;
        
        const nuevaRuta = new RutaPersonalizada("Mi ruta", paradasSeleccionadas, new Date(), usuarioId); // Nombre por defecto
        rutas.push(nuevaRuta);
        guardarRutas(rutas);

        // Crear objeto con la información de la ruta
        const rutaData = {
            nombre: nuevaRuta.nombre,
            fecha: nuevaRuta.fechaCreacion,
            paradas: nuevaRuta.paradas,
            usuarioId: nuevaRuta.usuario,
            id: nuevaRuta.id // Asegúrate de incluir el ID
        };

        // Codificar la información de la ruta en formato JSON para la URL
        const rutaDataJSON = encodeURIComponent(JSON.stringify(rutaData));


        window.location.href = `ruta.html?id=${rutaDataJSON}`; // Redirigir con el nombre como ID
    });

    /**
     * @param {RutaPersonalizada[]} rutas
     */
    function guardarRutas(rutas) {
        localStorage.setItem('rutas', JSON.stringify(rutas));
    }
}