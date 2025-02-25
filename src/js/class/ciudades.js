// @ts-check


//creamos objeto ciudad que contiene el nombre ciudad y sus paradas
 export class Ciudad {
    _id
    name
    country
    /**
     * @param {string} _id - Id generada en mongo
     * @param {string} name - El nombre de la ciudad.
     * @param {string} country - El nombre del país.
     */
    constructor(_id, name, country) {
        this._id = _id
        this.name = name
        this.country = country
    }
} 


//creamos la clase paradas (objeto con info interior)
 export class Paradas {
    ciudad_id
    _id
    nombre_parada
    coordenadas
    descripcion
    imagen
    horario
    categoria
    enlace
    info
    visitada = false
    /**
     * @param {string} ciudad_id
     * @param {string} _id
     * @param {string} nombre_parada 
     * @param {Number[]} coordenadas
     * @param {string} descripcion
     * @param {string} imagen
     * @param {string} horario
     * @param {string} categoria
     * @param {string} enlace
     * @param {string} info
     */
    constructor(ciudad_id, _id, nombre_parada, coordenadas, descripcion, imagen, horario, categoria, enlace, info) {
        this.ciudad_id = ciudad_id
        this._id = _id
        this.nombre_parada = nombre_parada
        this.coordenadas = coordenadas
        this.descripcion = descripcion
        this.imagen = imagen
        this.horario = horario
        this.categoria = categoria
        this.enlace = enlace
        this.info = info
    }
} 

