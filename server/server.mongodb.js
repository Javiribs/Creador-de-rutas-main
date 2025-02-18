import { MongoClient, ObjectId } from 'mongodb';

const URI = process.env.MONGO_URI;

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