// @ts-check

/** @import {Ciudad} from  './ciudades.js' */ // Importa la clase Ciudad

/** @import {Paradas} from  './ciudades.js' */
//variable vacia a rellenar con datos de json/api fetch
/** @type {Paradas[]} */

//creamos objeto rutaPersonalizada que contiene los datos de la ruta personalizada
export class RutaPersonalizada {
    _id
    ciudad_id
    nombre
    usuario_id
    fechaCreacion
    /**
     * @param {string} _id
     * @param {string} ciudad_id - El nombre de la ciudad.
     * @param {string} nombre - El nombre de la ruta.
     * @param {string} usuario_id - El nombre del usuario que crea la ruta.
     * @param {Date} [fechaCreacion] - La fecha de creación de la ruta.
     */
    constructor(_id, ciudad_id, nombre, usuario_id, fechaCreacion) {
        this._id = _id
        this.ciudad_id = ciudad_id
        this.nombre = nombre
        this.usuario_id = usuario_id
        this.fechaCreacion = fechaCreacion || new Date()
    }
} 

export class ParadasRutas {
    _id
    rutaPersonalizada_id
    parada_id
    orden
    /**
     * @param {string} _id
     * @param {string} rutaPersonalizada_id
     * @param {string} parada_id
     * @param {number} orden
     */
    constructor(_id, rutaPersonalizada_id, parada_id, orden) {
        this._id = _id
        this.rutaPersonalizada_id = rutaPersonalizada_id
        this.parada_id = parada_id
        this.orden = orden
    }
}