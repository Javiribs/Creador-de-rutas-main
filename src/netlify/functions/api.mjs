import express, { Router } from 'express';
import bodyParser from 'body-parser';
import serverless from 'serverless-http'
import { MongoClient, ObjectId } from 'mongodb';

const URI = process.env.MONGO_ATLAS;
const api = express();
const router = Router();
//const USUARIOS_URL = './server/BBDD/new.usuarios.json'
//const RUTA_PERSONALIZADA_URL = './server/BBDD/new.ruta.personalizada.json'

router.use(express.static('src'))
// for parsing application/json
router.use(bodyParser.json())
// for parsing application/x-www-form-urlencoded
router.use(bodyParser.urlencoded({ extended: true }))

//------------------------USUARIO------------------------//

//MÉTODOS USUARIO
router.get('/api/check/:nombre', async (req, res) => {
  const usuarios = await db.usuario.count()
  res.send(`Hola ${req.params.nombre}, hay ${usuarios} usuarios`)
})

//CRUD USUARIOS
router.post('/api/create/usuarios', async (req, res) => {
  res.json(await db.usuario.create(req.body))
})

router.get('/api/read/usuarios', async (req, res) => {
  res.json(await db.usuario.get())
})


router.put('/api/update/usuarios/:id', requireAuth, async (req, res) => {
  res.json(await db.usuario.update(req.params.id, req.body))
})

router.post('/api/login', async (req, res) => {
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

// for parsing application/json
api.use(bodyParser.json())
// for parsing application/x-www-form-urlencoded
api.use(bodyParser.urlencoded({ extended: true }))
api.use('/api/', router)

export const handler = serverless(api);

function gooogleOauth2() {
  return '123456'
}

router.delete('/api/delete/usuarios/:id', requireAuth, async (req, res) => {
  res.json(await db.usuario.delete(req.params.id))
})

//------------------------CIUDADES------------------------//

//MÉTODOS CIUDADES
router.get('/api/check/:nombre', async (req, res) => {
  const ciudades = await db.ciudades.count()
  res.send(`Hola ${req.params.nombre}, hay ${ciudades} ciudades`)
})

//CRUD CIUDADES

router.get('/api/read/ciudades', requireAuth, async (req, res) => {
  res.json(await db.ciudades.get())
})

router.get('/api/filter/ciudades/:name', requireAuth, async (req, res) => {
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

router.get('/api/filter/ciudadesName/:name', async (req, res) => {
  const ciudades = await db.ciudades.get({}, {_id: 0, name: 1, country: 1})
  res.json(ciudades) 
});

//------------------------PARADAS------------------------//

//MÉTODOS PARADAS
router.get('/api/check/:nombre', async (req, res) => {
  const paradas = await db.paradas.count()
  res.send(`Hola ${req.params.nombre}, hay ${paradas} puntos de interés`)
})

//CRUD PARADAS

router.get('/api/read/paradas', async (req, res) => {
  res.json(await db.paradas.get())
})


//------------------------rutasPersonalizadas------------------------//

//MÉTODOS rutasPersonalizadas
router.get('/api/check/:nombre', async (req, res) => {
  const rutasPersonalizadas = await db.rutasPersonalizadas.count()
  res.send(`Hola ${req.params.nombre}, hay ${rutasPersonalizadas} rutas personalizadas`)
})

//CRUD rutasPersonalizadas
router.post('/api/create/rutasPersonalizadas', requireAuth, async (req, res) => {
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

router.get('/api/read/rutasPersonalizadas/:id', requireAuth, async (req, res) => {
  const rutaPersonalizada = await db.rutasPersonalizadas.get(req.params.id);
  const paradasRuta = await db.paradasRuta.get({rutaPersonalizada_id: req.params.id});
  const rutaConParadas = {
    ...rutaPersonalizada, // Incluye los datos de la ruta
    paradas: paradasRuta // Incluye las paradas
  };
  console.log('he creado', rutaConParadas);
  res.json(rutaConParadas);
});


router.put('/api/update/rutasPersonalizadas/:id', requireAuth, async (req, res) => {
  res.json(await db.rutasPersonalizadas.update(req.params.id, req.body))
})

router.delete('/api/delete/rutasPersonalizadas/:id', requireAuth, requireAuth, async (req, res) => {
  res.json(await db.rutasPersonalizadas.delete(req.params.id))
})

//------------------------paradasRuta------------------------//

//MÉTODOS paradasRuta
router.get('/api/check/:nombre', async (req, res) => {
  const paradasRuta = await db.paradasRuta.count()
  res.send(`Hola ${req.params.nombre}, hay ${paradasRuta} paradas para la ruta`)
})

//CRUD paradasRuta
router.post('/api/create/paradasRuta', requireAuth, async (req, res) => {
  res.json(await db.paradasRuta.create(req.body))
})

router.get('/api/read/paradasRuta', requireAuth, async (req, res) => {
  res.json(await db.paradasRuta.get())
})


router.put('/api/update/paradasRuta/:id', requireAuth, async (req, res) => {
  res.json(await db.paradasRuta.update(req.params.id, req.body))
})

router.delete('/api/delete/paradasRuta/:id', requireAuth, async (req, res) => {
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


//------------------MONGODB------------------//

export const db = {
    usuario: {
      get: getUsuario,
      create: createUsuario,
      count: countUsuario,
      update: updateUsuario,
      logIn: logInUser,
      delete: deleteUsuario
    },
    ciudades: {
        get: getCiudades,
        count: countCiudades
    },
    paradas: {
        get: getParadas,
        count: countParadas,
    },
    rutasPersonalizadas: {
        get: getRutaPersonalizada,
        create: createRutaPersonalizada,
        count: countRutaPersonalizada,
        update: updateRutaPersonalizada,
        delete: deleteRutaPersonalizada
      },
      paradasRuta: {
        get: getParadasRuta,
        create: createParadasRuta,
        count: countParadasRuta,
        update: updateParadasRuta,
        delete: deleteParadasRuta
      }
  }



  //--------------MÉTODOS PARA USUARIOS-------------------//

/**
 * Devuelve el número de usuarios que hay registrados.
 *
 * @returns {Promise<number>} Número de usuarios
 */
  async function countUsuario() {
    const client = new MongoClient(URI);
    const creadorDB = client.db('CreadorRutas');
    const usersCollection = creadorDB.collection('Usuarios');
    return await usersCollection.countDocuments()
}


//-------------------CRUD--------------------//

  /**
 * Crea un nuevo usuario en la database.
 *
 * @param {object} usuario - usuario que quiero crear
 * @returns {Promise<object>} - usuario creado
 */
async function createUsuario(usuario) {
    const client = new MongoClient(URI);
    const creadorDB = client.db('CreadorRutas');
    const usersCollection = creadorDB.collection('Usuarios');
    const returnValue = await usersCollection.insertOne(usuario);
    console.log('db createUsuario', returnValue, usuario._id)
    return usuario
}


/**
 * Obtiene usuario de la colección database.
 *
 * @returns {Promise<Array<object>>} - Array de usuarios.
 */
async function getUsuario(filter){
    const client = new MongoClient(URI);
    const creadorDB = client.db('CreadorRutas');
    const usersCollection = creadorDB.collection('Usuarios');
    return await usersCollection.find(filter).toArray()
}


/**
 * Actualiza los usuarios de la database CreadorRutas.
 *
 * @param {string} id - Id del usuario a actualizar
 * @param {object} updates - Campos y valores nuevos a ser actualizados
 * @returns {Promise<UpdateResult>} Resultado operación
 */
async function updateUsuario(id, updates) {
    const client = new MongoClient(URI);
    const creadorDB = client.db('CreadorRutas');
    const usersCollection = creadorDB.collection('Usuarios');
    const returnValue = await usersCollection.updateOne({ _id: new ObjectId(id) }, { $set: updates });
    console.log('db updateUsuario', returnValue, updates)
    return returnValue
}

/**
 * Busca un usuario en la database de creadorRuta
 * un email y un password.
 *
 * @param {{email: string, password: string}} data - data que buscar en usuario
 * @returns {Promise<object>} el objeto usuario que se encuentra
 */
async function logInUser({email, password}) {
    const client = new MongoClient(URI);
    const creadorDB = client.db('CreadorRutas');
    const usersCollection = creadorDB.collection('Usuarios');
    return await usersCollection.findOne({ email, password })
  }

/**
 * Elimina usuarios de la database creadorRutas
 *
 * @param {string} id - Id del usuario a eliminar
 * @returns {Promise<string>} Id del usuario eliminado
 */
async function deleteUsuario(id) {
    const client = new MongoClient(URI);
    const creadorDB = client.db('CreadorRutas');
    const usersCollection = creadorDB.collection('Usuario');
    const returnValue = await usersCollection.deleteOne({ _id: new ObjectId(id) });
    console.log('db deleteUsuario', returnValue, id)
    return id
}


//--------------MÉTODOS PARA CIUDADES-------------------//

/**
 * Devuelve el número de usuarios que hay registrados.
 *
 * @returns {Promise<number>} Número de ciudades que hay en database
 */
async function countCiudades() {
    const client = new MongoClient(URI);
    const creadorDB = client.db('CreadorRutas');
    const ciudadesCollection = creadorDB.collection('Ciudades');
    return await ciudadesCollection.countDocuments()
}

//-------------------CRUD--------------------//

/**
 * Obtiene el objeto completo ciudad de la colección database.
 *
 * @returns {Promise<Array<object>>} - Array de objeto Ciudades.
 */
async function getCiudades(filter, projection){
    const client = new MongoClient(URI);
    const creadorDB = client.db('CreadorRutas');
    const ciudadesCollection = creadorDB.collection('Ciudades');
    return await ciudadesCollection.find(filter).project(projection).toArray()
}


//--------------MÉTODOS PARA PARADAS-------------------//

/**
 * Devuelve el número de usuarios que hay registrados.
 *
 * @returns {Promise<number>} Número de usuarios
 */
async function countParadas() {
    const client = new MongoClient(URI);
    const creadorDB = client.db('CreadorRutas');
    const ciudadesCollection = creadorDB.collection('Usuarios');
    return await ciudadesCollection.countDocuments()
}

//-------------------CRUD--------------------//

/**
 * Obtiene ciudad de la colección database.
 *
 * @returns {Promise<Array<object>>} - Array de paradas.
 */
async function getParadas(filter){
    console.log(filter)
    const client = new MongoClient(URI);
    const creadorDB = client.db('CreadorRutas');
    const paradasCollection = creadorDB.collection('Paradas');
    return await paradasCollection.find(filter).toArray()
}


//--------------MÉTODOS PARA Rutas Personalizadas-------------------//

/**
 * Devuelve el número de RutaPersonalizada que hay registrados.
 *
 * @returns {Promise<number>} Número de rutas personalizadas
 */
async function countRutaPersonalizada() {
    const client = new MongoClient(URI);
    const creadorDB = client.db('CreadorRutas');
    const rutaPersonalizadaCollection = creadorDB.collection('RutaPersonalizada');
    return await rutaPersonalizadaCollection.countDocuments()
}


//-------------------CRUD--------------------//

  /**
 * Crea una nueva RutaPersonalizada en la database.
 *
 * @param {object} rutaPersonalizadas - RutaPersonalizada que quiero crear
 * @returns {Promise<object>} - RutaPersonalizada creada
 */
async function createRutaPersonalizada(rutaPersonalizada) {
    const client = new MongoClient(URI);
    const creadorDB = client.db('CreadorRutas');
    const rutaPersonalizadaCollection = creadorDB.collection('RutaPersonalizada');
    const returnValue = await rutaPersonalizadaCollection.insertOne(rutaPersonalizada);
    console.log('db createRutaPersonalizada', returnValue, rutaPersonalizada._id)
    return rutaPersonalizada
}


/**
 * Obtiene RutaPersonalizada de la colección database.
 * @param {string} id
 * @returns {Promise<Array<object>>} - Array de RutaPersonalizada.
 */
async function getRutaPersonalizada(id){
    const client = new MongoClient(URI);
    const creadorDB = client.db('CreadorRutas');
    const rutaPersonalizadaCollection = creadorDB.collection('RutaPersonalizada');
    return await rutaPersonalizadaCollection.find({ _id: new ObjectId(id) }).toArray()
}


/**
 * Actualiza las RutaPersonalizada de la database CreadorRutas.
 *
 * @param {string} id - Id de la RutaPersonalizada a actualizar
 * @param {object} updates - Campos y valores nuevos a ser actualizados
 * @returns {Promise<UpdateResult>} Resultado operación
 */
async function updateRutaPersonalizada(id, updates) {
    const client = new MongoClient(URI);
    const creadorDB = client.db('CreadorRutas');
    const rutaPersonalizadaCollection = creadorDB.collection('RutaPersonalizada');
    const returnValue = await rutaPersonalizadaCollection.updateOne({ _id: new ObjectId(id) }, { $set: updates });
    console.log('db updateRutaPersonalizada', returnValue, updates)
    return returnValue
}

/**
 * Elimina RutaPersonalizada de la database creadorRutas
 *
 * @param {string} id - Id de la RutaPersonalizada a eliminar
 * @returns {Promise<string>} Id de la RutaPersonalizada eliminado
 */
async function deleteRutaPersonalizada(id) {
    const client = new MongoClient(URI);
    const creadorDB = client.db('CreadorRutas');
    const rutaPersonalizadaCollection = creadorDB.collection('RutaPersonalizada');
    const returnValue = await rutaPersonalizadaCollection.deleteOne({ _id: new ObjectId(id) });
    console.log('db deleteRutaPersonalizada', returnValue, id)
    return id
}


//--------------MÉTODOS PARA ParadasRuta-------------------//

/**
 * Devuelve el número de ParadasRuta que hay registrados.
 *
 * @returns {Promise<number>} Número de ParadasRuta
 */
async function countParadasRuta() {
    const client = new MongoClient(URI);
    const creadorDB = client.db('CreadorRutas');
    const paradasRutaCollection = creadorDB.collection('ParadasRuta');
    return await paradasRutaCollection.countDocuments()
}


//-------------------CRUD--------------------//

  /**
 * Crea una nueva ParadasRuta en la database.
 *
 * @param {object} paradasRuta - ParadasRuta que quiero crear
 * @returns {Promise<object>} - ParadasRuta creada
 */
async function createParadasRuta(paradasRuta) {
    const client = new MongoClient(URI);
    const creadorDB = client.db('CreadorRutas');
    const paradasRutaCollection = creadorDB.collection('ParadasRuta');
    const returnValue = await paradasRutaCollection.insertOne(paradasRuta);
    console.log('db createParadasRuta', returnValue, paradasRuta._id)
    return paradasRuta
}


/**
 * Obtiene ParadasRuta de la colección database.
 *
 * @returns {Promise<Array<object>>} - Array de ParadasRuta.
 */
async function getParadasRuta(filter){
    const client = new MongoClient(URI);
    const creadorDB = client.db('CreadorRutas');
    const paradasRutaCollection = creadorDB.collection('ParadasRuta');
    const result = await paradasRutaCollection.find(filter).toArray();
    if (result.length === 0) {
        throw new Error('No se encontraron paradas de la ruta personalizada');
    }
    return result;
}


/**
 * Actualiza las ParadasRuta de la database CreadorRutas.
 *
 * @param {string} id - Id de la ParadasRuta a actualizar
 * @param {object} updates - Campos y valores nuevos a ser actualizados
 * @returns {Promise<UpdateResult>} Resultado operación
 */
async function updateParadasRuta(id, updates) {
    const client = new MongoClient(URI);
    const creadorDB = client.db('CreadorRutas');
    const paradasRutaCollection = creadorDB.collection('ParadasRuta');
    const returnValue = await paradasRutaCollection.updateOne({ _id: new ObjectId(id) }, { $set: updates });
    console.log('db updateParadasRuta', returnValue, updates)
    return returnValue
}

/**
 * Elimina ParadasRuta de la database creadorRutas
 *
 * @param {string} id - Id de la ParadasRuta a eliminar
 * @returns {Promise<string>} Id de la ParadasRuta eliminado
 */
async function deleteParadasRuta(id) {
    const client = new MongoClient(URI);
    const creadorDB = client.db('CreadorRutas');
    const paradasRutaCollection = creadorDB.collection('ParadasRuta');
    const returnValue = await paradasRutaCollection.deleteOne({ _id: new ObjectId(id) });
    console.log('db deleteParadasRuta', returnValue, id)
    return id
}