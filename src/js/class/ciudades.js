// @ts-check


//creamos objeto ciudad que contiene el nombre ciudad y sus paradas
 export class Ciudad {
    id
    name
    country
    paradas
    /**
     * @param {string} name - El nombre de la ciudad.
     * @param {string} country - El nombre del país.
     * @param {Paradas[]} paradas - Un arreglo de objetos con las propiedades de Paradas.
     */
    constructor(name, country, paradas) {
        const timestamp = new Date()
        this.id = name + '_' + String(timestamp.getTime())
        this.name = name
        this.country = country
        this.paradas = paradas
    }
} 


//creamos la clase paradas (objeto con info interior)
 export class Paradas {
    id
    nombre_parada
    coordenadas
    descripcion
    imagen
    horario
    categoria
    enlace
    info
    /**
     * @param {string} nombre_parada 
     * @param {Number[]} coordenadas
     * @param {string} descripcion
     * @param {string} imagen
     * @param {string} horario
     * @param {string} categoria
     * @param {string} enlace
     * @param {string} info
     */
    constructor(nombre_parada, coordenadas, descripcion, imagen, horario, categoria) {
        const timestamp = new Date()
        this.id = nombre_parada + '_' + String(timestamp.getTime())
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

