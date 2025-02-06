import express from 'express';
import { crud } from "./server.crud.js";
import bodyParser from 'body-parser';

const app = express();
const port = process.env.PORT;
const USUARIOS_URL = './server/BBDD/new.usuarios.json'

app.use(express.static('src'))
// for parsing application/json
app.use(bodyParser.json())
// for parsing application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }))

app.get('/hello/:nombre', (req, res) => {
    res.send(`Hola ${req.params.nombre}`);
})

//CRUD
app.post('/create/usuarios', (req, res) => {
    console.log("Datos recibidos en /create/usuarios:", req.body);
    crud.create(USUARIOS_URL, req.body, (data) => {
      res.json(data)
    });
  })

app.get('/read/usuarios', (req, res) => {
    crud.read(USUARIOS_URL, (data) => {
      res.json(data)
    });
  })

  app.put('/update/usuarios/:id', (req, res) => {
    crud.update(USUARIOS_URL, req.params.id, req.body, (data) => {
      res.json(data)
    });
  })

app.delete('/delete/usuarios/:id', async (req, res) => {
    await crud.delete(USUARIOS_URL, req.params.id, (data) => {
      res.json(data)
    });
  })


  
  app.listen(port, () => {
    console.log(`Creador de rutas app listening on port ${port}`)
  })