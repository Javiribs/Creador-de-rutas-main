// INFO: https://www.freecodecamp.org/espanol/news/como-crear-una-aplicacion-crud-de-linea-de-comandos-con-node-js/
import { read } from './crud/read.js';
import { create } from './crud/create.js';


const USUARIOS_URL = './server/BBDD/new.usuarios.json'
// const ARTICLES = './server/BBDD/articles.json'

// READ:
// read(USERS, (data) => console.log('server', data));
// read(ARTICLES, (data) => console.log('server', data));

// CREATE:
// create(USERS, { name: 'pepe', age: 12 }, (data) => console.log(`server ${data.name} creado`, data));

export const crud = {
  read: (file = USUARIOS_URL, callback) => read(file, callback),
  create: (file = USUARIOS_URL, data, callback) => create(file, data, callback),
}