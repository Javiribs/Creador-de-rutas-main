// INFO: https://www.freecodecamp.org/espanol/news/como-crear-una-aplicacion-crud-de-linea-de-comandos-con-node-js/
import { read } from './crud/read.js';
import { create } from './crud/create.js';
import { deleteById } from './crud/delete.js';
import { update } from './crud/update.js';


const RUTA_PERSONALIZADA_URL = './server/BBDD/new.ruta.personalizada.json'

// READ:
// read(USERS, (data) => console.log('server', data));

// CREATE:
// create(USERS, { name: 'pepe', age: 12 }, (data) => console.log(`server ${data.name} creado`, data));

export const crud_rutas_personalizadas = {
  read: (file = RUTA_PERSONALIZADA_URL, callback) => read(file, callback),
  create: (file = RUTA_PERSONALIZADA_URL, data, callback) => create(file, data, callback),
  delete: (file, id, callback) => deleteById(file, id, callback), // Use deleteById instead of delete
  update: (file = RUTA_PERSONALIZADA_URL, id, modifiedData, callback) => update(file, id, modifiedData, callback),
}