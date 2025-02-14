import express from 'express';
//import { crud_usuario } from "./server.crud.usuarios.js";
//import { crud_rutas_personalizadas } from "./server.crud.rutas.personalizadas.js";
import bodyParser from 'body-parser';

import { db } from "./server.mongodb.js";

import { gooogleOauth2 } from './server.oauth.js';

const app = express();
const port = process.env.PORT;
//const USUARIOS_URL = './server/BBDD/new.usuarios.json'
//const RUTA_PERSONALIZADA_URL = './server/BBDD/new.ruta.personalizada.json'

app.use(express.static('src'))
// for parsing application/json
app.use(bodyParser.json())
// for parsing application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }))

//------------------------USUARIO------------------------//

//MÉTODOS USUARIO
app.get('/api/check/:nombre', async (req, res) => {
  const usuarios = await db.usuario.count()
  res.send(`Hola ${req.params.nombre}, hay ${usuarios} usuarios`)
})

//CRUD USUARIOS
app.post('/api/create/usuarios', async (req, res) => {
  res.json(await db.usuario.create(req.body))
})

app.get('/api/read/usuarios', async (req, res) => {
  res.json(await db.usuario.get())
})


app.put('/api/update/usuarios/:id', requireAuth, async (req, res) => {
  res.json(await db.usuario.update(req.params.id, req.body))
})

app.post('/api/login', async (req, res) => {
  const user = await db.usuario.logIn(req.body)
  console.log(user)
  if (user) {
    // TODO: use OAuth2
    // ...
    // Simulation of authentication (OAuth2)
    user.token = gooogleOauth2()
    // Remove password
    delete user.password
    res.json(user)
  } else {
    // Unauthorized
    res.status(401).send('Unauthorized')
  }
})

app.delete('/api/delete/usuarios/:id', requireAuth, async (req, res) => {
  res.json(await db.usuario.delete(req.params.id))
})



//------------------------CIUDADES------------------------//

//MÉTODOS CIUDADES
app.get('/api/check/:nombre', async (req, res) => {
  const ciudades = await db.ciudades.count()
  res.send(`Hola ${req.params.nombre}, hay ${ciudades} ciudades`)
})

//CRUD CIUDADES

app.get('/api/read/ciudades', requireAuth, async (req, res) => {
  res.json(await db.ciudades.get())
})

app.get('/api/filter/ciudades/:name', requireAuth, async (req, res) => {
  const ciudades = await db.ciudades.get({ $text: { $search: req.params.name } })
  const ciudadesConParadas = await Promise.all(
    ciudades.map(async (ciudad) => {
      return {
        ...ciudad,
        paradas: await db.paradas.get({ciudad_id: ciudad._id.toString()})
        }
    })
  )
  res.json(ciudadesConParadas)
})

app.get('/api/filter/ciudadesName/:name', async (req, res) => {
  const ciudades = await db.ciudades.get({}, {_id: 0, name: 1, country: 1})
  res.json(ciudades) 
});

//------------------------PARADAS------------------------//

//MÉTODOS PARADAS
app.get('/api/check/:nombre', async (req, res) => {
  const paradas = await db.paradas.count()
  res.send(`Hola ${req.params.nombre}, hay ${paradas} puntos de interés`)
})

//CRUD PARADAS

app.get('/api/read/paradas', async (req, res) => {
  res.json(await db.paradas.get())
})


//------------------------rutasPersonalizadas------------------------//

//MÉTODOS rutasPersonalizadas
app.get('/api/check/:nombre', async (req, res) => {
  const rutasPersonalizadas = await db.rutasPersonalizadas.count()
  res.send(`Hola ${req.params.nombre}, hay ${rutasPersonalizadas} rutas personalizadas`)
})

//CRUD rutasPersonalizadas
app.post('/api/create/rutasPersonalizadas', requireAuth, async (req, res) => {
  //console.log('selectedParadas:', req.body.selectedParadas);
  const rutaPersonalizada = req.body
  const selectedParadas = [...rutaPersonalizada.selectedParadas]
  delete rutaPersonalizada.selectedParadas
  const nuevaRuta = await db.rutasPersonalizadas.create(rutaPersonalizada)
  await Promise.all(selectedParadas.map(parada =>  
    db.paradasRuta.create({...parada, rutaPersonalizada_id: nuevaRuta._id})
  ));
  
  res.json(nuevaRuta)
})

app.get('/api/read/rutasPersonalizadas/:id', requireAuth, async (req, res) => {
  const rutaPersonalizada = await db.rutasPersonalizadas.get(req.params.id);
  const paradasRuta = await db.paradasRuta.get({rutaPersonalizada_id: req.params.id});
  const rutaConParadas = {
    ...rutaPersonalizada, // Incluye los datos de la ruta
    paradas: paradasRuta // Incluye las paradas
  };
  console.log('he creado', rutaConParadas);
  res.json(rutaConParadas);
});


app.put('/api/update/rutasPersonalizadas/:id', requireAuth, async (req, res) => {
  res.json(await db.rutasPersonalizadas.update(req.params.id, req.body))
})

app.delete('/api/delete/rutasPersonalizadas/:id', requireAuth, requireAuth, async (req, res) => {
  res.json(await db.rutasPersonalizadas.delete(req.params.id))
})


//------------------------paradasRuta------------------------//

//MÉTODOS paradasRuta
app.get('/api/check/:nombre', async (req, res) => {
  const paradasRuta = await db.paradasRuta.count()
  res.send(`Hola ${req.params.nombre}, hay ${paradasRuta} paradas para la ruta`)
})

//CRUD paradasRuta
app.post('/api/create/paradasRuta', requireAuth, async (req, res) => {
  res.json(await db.paradasRuta.create(req.body))
})

app.get('/api/read/paradasRuta', requireAuth, async (req, res) => {
  res.json(await db.paradasRuta.get())
})


app.put('/api/update/paradasRuta/:id', requireAuth, async (req, res) => {
  res.json(await db.paradasRuta.update(req.params.id, req.body))
})

app.delete('/api/delete/paradasRuta/:id', requireAuth, async (req, res) => {
  res.json(await db.paradasRuta.delete(req.params.id))
})



//-------------------MIDLEWERE----------------//
function requireAuth(req, res, next) {
  // Simulation of authentication (OAuth2)
  if (req.headers.authorization === 'Bearer 123456') {
    next()
  } else {
    // Unauthorized
    res.status(401).send('Unauthorized')
  }
}


  //SOLO TENER 1!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
  app.listen(port, async () => {
    const usuarios = await db.usuario.count()
    const ciudades = await db.ciudades.count()
    const paradas = await db.paradas.count()
    const rutasPersonalizadas = await db.rutasPersonalizadas.count()
    console.log(`Creador de rutas app listening on port ${port}: ${usuarios} usuarios, hay ${ciudades} ciudades, hay ${paradas} puntos de interés y hay ${rutasPersonalizadas} rutas personalizadas `)
  })