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

//pide y devuelve info usuario por su id
app.get('/api/read/usuarios/:id', async (req, res) => {
  res.json(await db.usuario.get(req.params.id))
})


app.put('/api/update/usuarios/:id', requireAuth, async (req, res) => {
  res.json(await db.usuario.update(req.params.id, req.body))
})

app.post('/api/login', async (req, res) => {
  console.log('Llegó a la función de login')
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

import { ObjectId } from 'mongodb';
app.delete('/api/delete/usuarios/:id', requireAuth, async (req, res) => {
  try {
    let userId;
    console.log("ID recibido en la ruta (string):", req.params.id);
    try {
      userId = new ObjectId(req.params.id);
      console.log("ID convertido a ObjectId:", userId);
      } catch (error) {
          console.error("Error en el id:", error);
          return res.status(400).json({ error: "ID de usuario inválido" }); // Manejar ID inválido
      }
      console.log("Tipo de userId antes de eliminar:", typeof userId);
      console.log("ID que se va a usar para eliminar:", userId); // Log 3
      const result = await db.usuario.delete(userId);
      res.status(result.error ? 404 : 200).json(result);
  } catch (error) {
      console.error("Error en la ruta delete:", error);
      res.status(500).json({ error: "Error interno del servidor" });
  }
});



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
  const ciudades = await db.ciudades.get({ $text: { $search: req.params.name } });
  console.log('ciudad recibida:', ciudades);
  const ciudadesConParadas = await Promise.all(
      ciudades.map(async (ciudad) => {
          return {
              ...ciudad,
              paradas: await db.paradasPorCiudad.get(ciudad._id.toString()),
          };
      })
  );
  res.json(ciudadesConParadas);
});

//funcion de busqueda por nombre para el searchProposal!
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
//busca paradas por su id
app.get('/api/read/paradas/:id', requireAuth, async (req, res) => {
  console.log(req.params.id)
  res.json(await db.paradas.get(req.params.id))
  console.log('paradas recibidas:', await db.paradas.get(req.params.id))
})

//busca paradas por id de la ciudad
app.get('/api/read/paradasPorCiudad/:id', requireAuth, async (req, res) => {
  console.log(req.params.id)
  res.json(await db.paradasPorCiudad.get(req.params.id))
  console.log('paradas recibidas:', await db.paradasPorCiudad.get(req.params.id))
})


//------------------------rutasPersonalizadas------------------------//

//MÉTODOS rutasPersonalizadas
app.get('/api/check/:nombre', async (req, res) => {
  const rutasPersonalizadas = await db.rutasPersonalizadas.count()
  res.send(`Hola ${req.params.nombre}, hay ${rutasPersonalizadas} rutas personalizadas`)
})

//CRUD rutasPersonalizadas
app.post('/api/create/rutasPersonalizadas', requireAuth, async (req, res) => {
  res.json(await db.rutasPersonalizadas.create(req.body))
})

//obtener ruta personalizada a partir del id de la rutapersonalizada
app.get('/api/read/rutasPersonalizadas/:id', requireAuth, async (req, res) => {
  const rutaPersonalizada = await db.rutasPersonalizadas.get(req.params.id);
  const paradasRuta = await db.paradasRuta.get(req.params.id);
  console.log(paradasRuta)
  const rutaConParadas = {
    ...rutaPersonalizada, 
    paradas: paradasRuta 
  };
  console.log('he creado', rutaConParadas);
  res.json(rutaConParadas);
});

//obtener ruta personalizada a partir del id del usuario
app.get('/api/read/rutasPersonalizadas/usuario/:id', requireAuth, async (req, res) => {
  const rutasPersonalizadas = await db.rutasPersonalizadas.getPorUsuario(req.params.id);
  console.log('he creado', rutasPersonalizadas);
  res.json(rutasPersonalizadas)
})

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

//read paradas de la ruta por el id de la ruta personalizada
app.get('/api/read/paradasRuta/rutaPersonalizada/:id', requireAuth, async (req, res) => {
  res.json(await db.paradasRuta.getParadasRutaPersonalizada(req.params.id))
})

app.put('/api/update/paradasRuta/:id', requireAuth, async (req, res) => {
  res.json(await db.paradasRuta.update(req.params.id, req.body))
})

app.delete('/api/delete/paradasRuta/:id', requireAuth, async (req, res) => {
  res.json(await db.paradasRuta.delete(req.params.id))
})


//------------------rutasConParadas------------------//

app.get('/api/read/rutasConParadas/:id', async (req, res) => {
  res.json(await db.rutaConParadas.get(req.params.id))
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