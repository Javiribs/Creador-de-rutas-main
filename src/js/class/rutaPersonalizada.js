// @ts-check

/** @import {Paradas} from  './ciudades.js' */
//variable vacia a rellenar con datos de json/api fetch
/** @type {Paradas[]} */

//creamos objeto rutaPersonalizada que contiene los datos de la ruta personalizada
export class RutaPersonalizada {
    id
    nombre
    fechaCreacion
    paradas
    usuario
    /**
     * @param {string} nombre - El nombre de la ruta.
     * @param {Paradas[]} paradas - Un arreglo de objetos con las propiedades de Paradas.
     * @param {string} usuario - El nombre del usuario que crea la ruta.
     * @param {Date} fechaCreacion - La fecha de creación de la ruta.
     */
    constructor(nombre, paradas, fechaCreacion, usuario) {
        if (!nombre) {
            throw new Error("El nombre de la ruta no puede estar vacío.");
        }
        if (!Array.isArray(paradas)) {
            throw new Error("Las paradas deben ser un array.");
        }
        const timestamp = new Date()
        this.id = nombre + '_' + String(timestamp.getTime())
        this.nombre = nombre
        this.fechaCreacion = new Date()
        this.paradas = paradas
        this.usuario = usuario
    }
} 