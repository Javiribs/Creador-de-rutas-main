import express from 'express';
import { crud_usuario } from "./server.crud.usuarios.js";
import { crud_rutas_personalizadas } from "./server.crud.rutas.personalizadas.js";
import bodyParser from 'body-parser';

const app = express();
const port = process.env.PORT;
const USUARIOS_URL = './server/BBDD/new.usuarios.json'
const RUTA_PERSONALIZADA_URL = './server/BBDD/new.ruta.personalizada.json'

app.use(express.static('src'))
// for parsing application/json
app.use(bodyParser.json())
// for parsing application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }))

app.get('/hello/:nombre', (req, res) => {
    res.send(`Hola ${req.params.nombre}`);
})

//CRUD USUARIOS
app.post('/create/usuarios', (req, res) => {
    console.log("Datos recibidos en /create/usuarios:", req.body);
    crud_usuario.create(USUARIOS_URL, req.body, (data) => {
      res.json(data)
    });
  })

app.get('/read/usuarios', (req, res) => {
    crud_usuario.read(USUARIOS_URL, (data) => {
      res.json(data)
    });
  })

  app.put('/update/usuarios/:id', (req, res) => {
    crud_usuario.update(USUARIOS_URL, req.params.id, req.body, (data) => {
      res.json(data)
    });
  })

app.delete('/delete/usuarios/:id', async (req, res) => {
    await crud_usuario.delete(USUARIOS_URL, req.params.id, (data) => {
      res.json(data)
    });
  })
  
  app.listen(port, () => {
    console.log(`Creador de rutas app listening on port ${port}`)
  })


  //CRUD RUTA PERSONALIZADA
  app.post('/create/rutas_personalizadas', (req, res) => {
    console.log("Datos recibidos en /create/rutas_personalizadas:", req.body);
    crud_rutas_personalizadas.create(RUTA_PERSONALIZADA_URL, req.body, (data) => {
      res.json(data)
    });
  })

app.get('/read/rutas_personalizadas', (req, res) => {
    crud_rutas_personalizadas.read(RUTA_PERSONALIZADA_URL, (data) => {
      res.json(data)
    });
  })

  app.put('/update/rutas_personalizadas/:id', (req, res) => {
    crud_rutas_personalizadas.update(RUTA_PERSONALIZADA_URL, req.params.id, req.body, (data) => {
      res.json(data)
    });
  })

app.delete('/delete/rutas_personalizadas/:id', async (req, res) => {
    await crud_rutas_personalizadas.delete(RUTA_PERSONALIZADA_URL, req.params.id, (data) => {
      res.json(data)
    });
  })
  
  app.listen(port, () => {
    console.log(`Creador de rutas app listening on port ${port}`)
  })