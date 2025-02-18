import express, { Router } from 'express';
import bodyParser from 'body-parser';
import serverless from 'serverless-http'
import { MongoClient, ObjectId } from 'mongodb';

const URI = process.env.MONGO_ATLAS;
const api = express();
const router = Router();

//-----------------EXPRESS-----------------//

//------------------------USUARIO------------------------//

//MÉTODOS USUARIO
router.get('/check/:nombre', async (req, res) => {
  const usuarios = await db.usuario.count()
  res.send(`Hola ${req.params.nombre}, hay ${usuarios} usuarios`)
})

//CRUD USUARIOS
router.post('/create/usuarios', async (req, res) => {
  res.json(await db.usuario.create(req.body))
})

router.get('/api/read/usuarios', async (req, res) => {
  res.json(await db.usuario.get())
})


router.put('/update/usuarios/:id', requireAuth, async (req, res) => {
  res.json(await db.usuario.update(req.params.id, req.body))
})

router.post('/login', async (req, res) => {
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

function gooogleOauth2() {
  return '123456'
}


router.delete('/delete/usuarios/:id', requireAuth, async (req, res) => {
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
router.get('/check/:nombre', async (req, res) => {
  const ciudades = await db.ciudades.count()
  res.send(`Hola ${req.params.nombre}, hay ${ciudades} ciudades`)
})

//CRUD CIUDADES

router.get('/read/ciudades', requireAuth, async (req, res) => {
  res.json(await db.ciudades.get())
})

router.get('/filter/ciudades/:name', requireAuth, async (req, res) => {
  const ciudades = await db.ciudades.get({ $text: { $search: req.params.name } })
  console.log('ciudad recibida:', ciudades)
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

//funcion de busqueda por nombre para el searchProposal!
router.get('/filter/ciudadesName/:name', async (req, res) => {
  const ciudades = await db.ciudades.get({}, {_id: 0, name: 1, country: 1})
  res.json(ciudades) 
});

//------------------------PARADAS------------------------//

//MÉTODOS PARADAS
router.get('/check/:nombre', async (req, res) => {
  const paradas = await db.paradas.count()
  res.send(`Hola ${req.params.nombre}, hay ${paradas} puntos de interés`)
})

//CRUD PARADAS

router.get('/read/paradas/:id', requireAuth, async (req, res) => {
  console.log(req.params.id)
  res.json(await db.paradas.get(req.params.id))
  console.log('paradas recibidas:', await db.paradas.get(req.params.id))
})

//------------------------rutasPersonalizadas------------------------//

//MÉTODOS rutasPersonalizadas
router.get('/check/:nombre', async (req, res) => {
  const rutasPersonalizadas = await db.rutasPersonalizadas.count()
  res.send(`Hola ${req.params.nombre}, hay ${rutasPersonalizadas} rutas personalizadas`)
})

//CRUD rutasPersonalizadas
router.post('/create/rutasPersonalizadas', requireAuth, async (req, res) => {
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

//obtener ruta personalizada a partir del id de la rutapersonalizada
router.get('/read/rutasPersonalizadas/:id', requireAuth, async (req, res) => {
  const rutaPersonalizada = await db.rutasPersonalizadas.get(req.params.id);
  const paradasRuta = await db.paradasRuta.get(req.params.id);
  console.log(paradasRuta)
  const rutaConParadas = {
    ...rutaPersonalizada, // Incluye los datos de la ruta
    paradas: paradasRuta // Incluye las paradas
  };
  console.log('he creado', rutaConParadas);
  res.json(rutaConParadas);
});

//obtener ruta personalizada a partir del id del usuario
router.get('/read/rutasPersonalizadas/usuario/:id', requireAuth, async (req, res) => {
  const rutasPersonalizadas = await db.rutasPersonalizadas.getPorUsuario(req.params.id);
  console.log('he creado', rutasPersonalizadas);
  res.json(rutasPersonalizadas)
})

router.put('/update/rutasPersonalizadas/:id', requireAuth, async (req, res) => {
  res.json(await db.rutasPersonalizadas.update(req.params.id, req.body))
})

router.delete('/delete/rutasPersonalizadas/:id', requireAuth, requireAuth, async (req, res) => {
  res.json(await db.rutasPersonalizadas.delete(req.params.id))
})


//------------------------paradasRuta------------------------//

//MÉTODOS paradasRuta
router.get('/check/:nombre', async (req, res) => {
  const paradasRuta = await db.paradasRuta.count()
  res.send(`Hola ${req.params.nombre}, hay ${paradasRuta} paradas para la ruta`)
})

//CRUD paradasRuta
router.post('/create/paradasRuta', requireAuth, async (req, res) => {
  res.json(await db.paradasRuta.create(req.body))
})

router.get('/read/paradasRuta', requireAuth, async (req, res) => {
  res.json(await db.paradasRuta.get())
})


router.put('/update/paradasRuta/:id', requireAuth, async (req, res) => {
  res.json(await db.paradasRuta.update(req.params.id, req.body))
})

router.delete('/delete/paradasRuta/:id', requireAuth, async (req, res) => {
  res.json(await db.paradasRuta.delete(req.params.id))
})


//------------------rutasConParadas------------------//

router.get('/read/rutasConParadas/:id', async (req, res) => {
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

// for parsing application/json
api.use(bodyParser.json())
// for parsing application/x-www-form-urlencoded
api.use(bodyParser.urlencoded({ extended: true }))
api.use('/api/', router)

export const handler = serverless(api);

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
        getPorUsuario: getRutaPersonalizadaDelUsuario,
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
      },
      rutaConParadas: {
        get: getRutaConParadas
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
 * Elimina Usuario de la database creadorRutas
 *
 * @param {string} id - Id del usuario a eliminar
 * @returns {Promise<string>} Id del usuario eliminado
 */
async function deleteUsuario(id) {
    const client = new MongoClient(URI);
    const creadorDB = client.db('CreadorRutas');
    const usersCollection = creadorDB.collection('Usuarios');
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
    const paradasCollection = creadorDB.collection('Paradas');
    return await paradasCollection.countDocuments()
}

//-------------------CRUD--------------------//

/**
 * Obtiene paradas de la colección database.
 * @param {string} id
 * @returns {Promise<Array<object>>}  - Array de paradas.
 */
async function getParadas(id) {
    const client = new MongoClient(URI);
    const creadorDB = client.db('CreadorRutas');
    const paradasCollection = creadorDB.collection('Paradas');
    let resultados;

    if (typeof id === 'string') {
        const objectId = new ObjectId(id);
        resultados = await paradasCollection.find({ _id: objectId }).toArray();
        console.log('Resultados por id de parada: ', resultados);

    } else if (typeof id === 'object' && 'ciudad_id' in id) {
        resultados = await paradasCollection.find({ ciudad_id: id.ciudad_id }).toArray();
        console.log('Resultados con filtro por ciudad_id: ', resultados);
    }
    
    return resultados;
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
    console.log(rutaPersonalizada)
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
    const ruta = await rutaPersonalizadaCollection.findOne({ _id: new ObjectId(id) }); 
    return ruta;
}

/**
 * Obtiene RutaPersonalizada de la colección database.
 * @param {string} id
 * @returns {Promise<Array<object>>} - Array de RutaPersonalizada.
 */
async function getRutaPersonalizadaDelUsuario(id){
    const client = new MongoClient(URI);
    try {
        await client.connect();
        const db = client.db('CreadorRutas');
        const rutaPersonalizadaCollection = db.collection('RutaPersonalizada');

        // 1. Consulta inicial para obtener las rutas del usuario
        const rutas = await rutaPersonalizadaCollection.find({ usuario_id: id }).toArray();

        if (!rutas || rutas.length === 0) {
            return []; // Devuelve un array vacío si no se encuentran rutas
        }

        // 2. Construir el pipeline de agregación
        let pipeline = [];

        // 3. $match para las rutas encontradas (usando $in)
        pipeline.push({ $match: { _id: { $in: rutas.map(ruta => ruta._id) } } });

        // 4. $lookup para Ciudad
        pipeline.push({
            $lookup: {
                from: 'Ciudades',
                let: { ciudadId: '$ciudad_id' },
                pipeline: [
                    {
                        $match: {
                            $expr: { $eq: ['$_id', { $toObjectId: '$$ciudadId' }] }
                        }
                    },
                    {
                        $project: {
                            _id: 0,
                            name: 1,
                            country: 1
                        }
                    }
                ],
                as: 'ciudad'
            }
        });

        pipeline.push({ $unwind: '$ciudad' });

        // 5. $lookup para ParadasRuta (con $lookup anidado para Paradas)
        pipeline.push({
            $lookup: {
                from: 'ParadasRuta',
                let: { rutaId: '$_id' },
                pipeline: [
                    {
                        $match: {
                            $expr: { $eq: ['$rutaPersonalizada_id', '$$rutaId'] }
                        }
                    },
                    {
                        $lookup: {
                            from: 'Paradas',
                            let: { paradaId: '$parada_id' },
                            pipeline: [
                                {
                                    $match: {
                                        $expr: { $eq: ['$_id', { $toObjectId: '$$paradaId' }] }
                                    }
                                }
                            ],
                            as: 'parada'
                        }
                    },
                    { $unwind: '$parada' }
                ],
                as: 'paradasRuta'
            }
        });

        // 6. Ejecutar el pipeline de agregación
        let result = await db.collection('RutaPersonalizada').aggregate(pipeline).toArray();

        console.log("Resultados del pipeline:", result);

        return result;

    } finally {
        await client.close();
    }
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
 * @param {string} id - Id de la ParadasRuta a actualizar
 * @returns {Promise<Array<string>>} - Array de ParadasRuta.
 */
async function getParadasRuta(id){
    const client = new MongoClient(URI);
    const creadorDB = client.db('CreadorRutas');
    const paradasRutaCollection = creadorDB.collection('ParadasRuta');
    const paradas = await paradasRutaCollection.find({ rutaPersonalizada_id: new ObjectId(id) }).toArray();
    return paradas;
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




//--------------MÉTODOS PARA rutaConParadas-------------------//

/**
 * Obtains a customized route with its associated stops and city details from the database.
 * @param {string} rutaId - The ID of the customized route to retrieve.
 * @returns {Promise<Array<object>>} - A promise that resolves to an array of objects,
 */

async function getRutaConParadas(rutaId) {
    const client = new MongoClient(URI);
    try {
        await client.connect();
        const db = client.db('CreadorRutas');

        let pipeline = [
            { $match: { _id: new ObjectId(rutaId) } },
            {
                $lookup: {
                    from: 'Ciudades',
                    let: { ciudadId: '$ciudad_id' },
                    pipeline: [
                        {
                            $match: {
                                $expr: { $eq: ['$_id', { $toObjectId: '$$ciudadId' }] }
                            }
                        },
                        {
                            $project: {
                                _id: 0,
                                name: 1,
                                country: 1
                            }
                        }
                    ],
                    as: 'ciudad'
                }
            },
            { $unwind: '$ciudad' },
            {
                $lookup: {
                    from: 'ParadasRuta',
                    let: { rutaId: '$_id' },
                    pipeline: [
                        {
                            $match: {
                                $expr: { $eq: ['$rutaPersonalizada_id', '$$rutaId'] }
                            }
                        },
                        { // <-- Nuevo $lookup anidado para Paradas
                            $lookup: {
                                from: 'Paradas',
                                let: { paradaId: '$parada_id' },
                                pipeline: [
                                    {
                                        $match: {
                                            $expr: { $eq: ['$_id', { $toObjectId: '$$paradaId' }] }
                                        }
                                    }
                                ],
                                as: 'parada'
                            }
                        },
                        { $unwind: '$parada' } // <-- Unwind para tener un objeto parada y no un array
                    ],
                    as: 'paradasRuta'
                }
            }
        ];

        let result = await db.collection('RutaPersonalizada').aggregate(pipeline).toArray();
        console.log("Resultados del pipeline:", result);

        return result;

    } finally {
        await client.close();
    }
}