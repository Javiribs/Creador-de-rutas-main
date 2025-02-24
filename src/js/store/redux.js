// @ts-check
//Importo las clases de ciudades.js
/** @import {Ciudad, Paradas} from '../class/ciudades.js' */
/** @import { Usuario } from '../class/usuario.js' */


//Aciones que se pueden ejecutar en la app
/**
 * @typedef {Object} ActionTypeCiudad
 * @property {string} type
 * @property {Ciudad} [ciudad]
 */
/**
 * @typedef {Object} ActionTypeParadas
 * @property {string} type
 * @property {Paradas} [paradas]
 */
/**
 * @typedef {Object} ActionTypeUsuario
 * @property {string} type
 * @property {Usuario} [usuario]
 */

const ACTION_TYPES = {
    CREATE_CIUDAD: 'CREATE_CIUDAD',
    UPDATE_CIUDAD: 'UPDATE_CIUDAD',
    DELETE_CIUDAD: 'DELETE_CIUDAD',
    CREATE_PARADA: 'CREATE_PARADA',
    UPDATE_PARADA: 'UPDATE_PARADA',
    DELETE_PARADA: 'DELETE_PARADA',
    CREATE_USUARIO: 'CREATE_USUARIO',
    UPDATE_USUARIO: 'UPDATE_USUARIO',
    DELETE_USUARIO: 'DELETE_USUARIO',
    READ_LIST: 'READ_LIST'
  }

  
  // Estado inicial
  /**
 * @typedef {Object.<(string), any>} State
 * @property {Array<Ciudad>} ciudades
 * @property {Array<Paradas>} paradas
 * @property {Array<Usuario>} usuarios // Nuevo: array de usuarios
 * @property {Usuario | null} usuarioActual // Nuevo: usuario logueado
 * @property {boolean} isLoading
 * @property {boolean} error
 */
  /**
 * @type {State}
 */
  const INITIAL_STATE = {
    ciudades: [],
    paradas: [],
    usuarios: [],
    usuarioActual: null,
    isLoading: false,
    error: false
  }
  
  // Reducer, gestion del estado de ciudades (array vacio de inicio) mediante 7 acciones
  /**
 * Reducer for the app state.
 *
 * @param {State} state - The current state
 * @param {ActionTypeCiudad | ActionTypeParadas | ActionTypeUsuario} action - The action to reduce
 * @returns {State} The new state
 */
  const appReducer = (state = INITIAL_STATE, action) => {
    const actionWithCiudad = /** @type {ActionTypeCiudad} */(action)
    const actionWithParadas = /** @type {ActionTypeParadas} */(action)
    const actionWithUsuario = /** @type {ActionTypeUsuario} */(action)
    switch (action.type) {
    //accion 1 añade el objeto ciudad al INITIAL_STATE
    case ACTION_TYPES.CREATE_CIUDAD:
        return {
            ...state,
            ciudades: [
                ...state.ciudades,
                actionWithCiudad?.ciudad
            ]
        };
    //accion 2 actualiza las ciudad guardadas en el INITIAL_STATE
    case ACTION_TYPES.UPDATE_CIUDAD:
        return {
            ...state,
            ciudades: state.ciudades.map((/** @type {{ id: string | boolean; }} */ ciudad) =>
            ciudad.id === (typeof actionWithCiudad?.ciudad === 'object' && actionWithCiudad.ciudad?.id)
            ? actionWithCiudad.ciudad
            : ciudad
            )
        };
    //accion 3 elimina ciudad del listado ciudades
    case ACTION_TYPES.DELETE_CIUDAD:
        return {
            ...state,
            ciudades: state.ciudades.filter((/** @type {{ id: string | undefined; }} */ ciudad) => ciudad.id !== actionWithCiudad?.ciudad?.id)
        };
    //accion 4 añade bojeto parada al INITIAL_STATE
    case ACTION_TYPES.CREATE_PARADA:
        return {
            ...state,
            paradas: [
                ...state.paradas,
                actionWithParadas.paradas
            ]
        };
        //accion 5 actualiza las parada guardadas en el INITIAL_STATE
        case ACTION_TYPES.UPDATE_PARADA:
            return {
              ...state,
              paradas: state.paradas.map((/** @type {{ id: string | undefined; }} */ parada) =>
                parada.id === actionWithParadas?.paradas?.id ? actionWithParadas.paradas : parada
              )
            };
        //accion 6 elimina parada del listado paradas
        case ACTION_TYPES.DELETE_PARADA:
            return {
                ...state,
                paradas: state.paradas.filter((/** @type {{ id: any; }} */ parada) => parada.id !== parada.id)        
            };
        //accion 7 crear un nuevo usuario
        case ACTION_TYPES.CREATE_USUARIO:
              return {
                  ...state,
                  usuario: [
                      ...state.usuario,
                      actionWithUsuario.usuario
                  ]
              };
        //accion 8 actualiza usuarios guardados en el INITIAL_STATE
        case ACTION_TYPES.UPDATE_USUARIO:
              return {
                  ...state,
                  usuario: state.usuario.map((/** @type {{ id: string | undefined; }} */ usuario) =>
                      usuario.id === actionWithUsuario?.usuario?.id ? actionWithUsuario.usuario : usuario
                    )
                };
        //accion 9 elimina usuario del listado paradas
        case ACTION_TYPES.DELETE_USUARIO:
              return {
                  ...state,
                  usuario: state.usuario.filter((/** @type {{ id: any; }} */ usuario) => usuario.id !== usuario.id)        
              };    
    // accion  lee el listado de ciudades
    case ACTION_TYPES.READ_LIST:
        default:
        return state;
    }
  }
  
/**
 * @typedef {Object} PublicMethods
 * @property {function} create
  *@property {function} update
 * @property {function} delete
 * @property {function} read
 * @property {function} getById
 * @property {function} getAll
 * /
/**
 * @typedef {Object} Store
 * @property {function} getState
 * @property {PublicMethods} ciudad
 * @property {PublicMethods} parada
 * @property {PublicMethods} usuario
 */
  /**
 * Creates the store singleton.
 * @param {appReducer} reducer
 * @returns {Store}
 */
  const createStore = (/** @type {any} */ reducer) => {
    let currentState = INITIAL_STATE
    let currentReducer = reducer
  
    // Actions
/**
* Creates a new Ciudad inside the store
* @param {Ciudad} ciudad
* @returns void
*/
const createCiudad = (ciudad) => _dispatch({ type: ACTION_TYPES.CREATE_CIUDAD, ciudad });

/**
 * Updates an ciudad
 * @param {Ciudad} ciudad
 * @returns void
 */
const updateCiudad = (ciudad) => _dispatch({ type: ACTION_TYPES.UPDATE_CIUDAD, ciudad });
/**
 * Deletes an ciudad
 * @param {Ciudad} ciudad
 * @returns void
 */
const deleteCiudad = (ciudad) => _dispatch({ type: ACTION_TYPES.DELETE_CIUDAD, ciudad });
/**
* Creates a new parada inside the store
* @param {Paradas} paradas
* @returns void
*/
const createParada = (paradas) => _dispatch({ type: ACTION_TYPES.CREATE_PARADA, paradas });

/**
 * Updates a parada
 * @param {Paradas} paradas
 * @returns void
 */
const updateParada = (paradas) => _dispatch({ type: ACTION_TYPES.UPDATE_PARADA, paradas });
/**
 * Deletes a parada
 * @param {Paradas} paradas
 * @returns void
 */
const deleteParada = (paradas) => _dispatch({ type: ACTION_TYPES.DELETE_PARADA, paradas });

/**
 * Crea usuario
 * @param {Usuario} usuario
 * @returns void
 */
const createUsuario = (usuario) => _dispatch({ type: ACTION_TYPES.CREATE_USUARIO, usuario });
/**
 * Update an usuario
 * @param {Usuario} usuario
 * @returns void
 */
const updateUsuario = (usuario) => _dispatch({ type: ACTION_TYPES.UPDATE_USUARIO, usuario }); 
/**
 * Deletes a parada
 * @param {Usuario} usuario
 * @returns void
 */
const deleteUsuario = (usuario) => _dispatch({ type: ACTION_TYPES.DELETE_USUARIO, usuario });
/**
   * Reads the list of articles
   * @returns state
   */
const readList = () => _dispatch({ type: ACTION_TYPES.READ_LIST });

// Public methods
 /**
   *
   * @returns {State}
   */
const getState = () => { return currentState };
/**
 * Returns the ciudad with the specified id
 * @param {string} id
 * @returns {Ciudad | undefined}
 */
const getCiudadById = (id) => { return currentState.ciudad.find((/** @type {Ciudad} */ ciudad) => ciudad.id === id) };

/**
 * Returns the parada with the specified id
 * @param {string} id
 * @returns {Paradas | undefined}
 */
const getParadaById = (id) => { return currentState.ciudad.find((/** @type {Paradas} */ parada) => parada.id === id) };

/**
 * Returns the parada with the specified id
 * @param {string} id
 * @returns {Usuario | undefined}
 */
const getUsuarioById = (id) => { return currentState.ciudad.find((/** @type {Usuario} */ usuario) => usuario.id === id) };

 /**
   * Returns all the ciudades
   * @returns {Array<Ciudad>}
   */
 const getAllCiudades = () => { return currentState.ciudades };

 /**
   * Returns all the paradas
   * @returns {Array<Paradas>}
   */
 const getAllParadas = () => { return currentState.paradas };

  /**
   * Returns all the paradas
   * @returns {Array<Usuario>}
   */
  const getAllUsuario = () => { return currentState.usuario };

    // Private methods
  /**
   *
   * @param {ActionTypeCiudad | ActionTypeParadas | ActionTypeUsuario} action
   * @param {function | undefined} [onEventDispatched]
   */
  const _dispatch = (action, onEventDispatched) => {
    let previousValue = currentState;
    let currentValue = currentReducer(currentState, action);
    currentState = currentValue;
    // TODO: CHECK IF IS MORE ADDECUATE TO SWITCH TO EventTarget: https://developer.mozilla.org/en-US/docs/Web/API/EventTarget
    window.dispatchEvent(new CustomEvent('stateChanged', {
        detail: {
            changes: _getDifferences(previousValue, currentValue)
        },
        cancelable: true,
        composed: true,
        bubbles: true
    }));
    if (onEventDispatched) {
        onEventDispatched();
    }
  }
  /**
   * Returns a new object with the differences between the `previousValue` and
   * `currentValue` objects. It's used to create a payload for the "stateChanged"
   * event, which is dispatched by the store every time it changes.
   *
   * @param {State} previousValue - The old state of the store.
   * @param {State} currentValue - The new state of the store.
   * @returns {Object} - A new object with the differences between the two
   *     arguments.
   * @private
   */
  const _getDifferences = (previousValue, currentValue) => {
    return Object.keys(currentValue).reduce((diff, key) => {
        if (previousValue[key] === currentValue[key]) return diff
        return {
            ...diff,
            [key]: currentValue[key]
        };
    }, {});
  }
 
// Namespaced actions
  /** @type {PublicMethods} */
  const ciudad = {
    create: createCiudad,
    update: updateCiudad,
    delete: deleteCiudad,
    read: readList,
    getById: getCiudadById,
    getAll: getAllCiudades
  }

  // Namespaced actions
  /** @type {PublicMethods} */
  const parada = {
    create: createParada,
    update: updateParada,
    delete: deleteParada,
    read: readList,
    getById: getParadaById,
    getAll: getAllParadas
  }

    // Namespaced actions
  /** @type {PublicMethods} */
  const usuario = {
    create: createUsuario,
    update: updateUsuario,
    delete: deleteUsuario,
    read: readList,
    getById: getUsuarioById,
    getAll: getAllUsuario
  }


    return {
        //Actions
      ciudad,
      parada,
      usuario,
       //Public methods
       getState
    }
  }
  
  // Export store
  export const store = createStore(appReducer)