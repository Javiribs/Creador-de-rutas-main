// server.api.js
import * as http from "node:http";
import * as qs from "node:querystring";
import { crud } from "./server.crud.js";

const MIME_TYPES = {
  default: "application/octet-stream",
  html: "text/html; charset=UTF-8",
  js: "application/javascript",
  json: "application/json",
  css: "text/css",
  png: "image/png",
  jpg: "image/jpg",
  gif: "image/gif",
  ico: "image/x-icon",
  svg: "image/svg+xml",
};

 const USUARIOS_URL = './server/BBDD/new.usuarios.json'

 /**
 * Returns an object with the action name and id from the given pathname.
 * For example, for "/create/articles/:id", it will return { name: "/create/articles", id: ":id" }
 * @param {string} pathname
 * @returns {{name: string, id: string}}
 */
function getAction(pathname) {
  // /create/articles/:id
  const actionParts = pathname.split('/');
  return {
    name: `/${actionParts[1]}/${actionParts[2]}`,
    id: actionParts[3]
   }
}

http
  .createServer(async (request, response) => {
    const url = new URL(`http://${request.headers.host}${request.url}`);
    const urlParams = Object.fromEntries(url.searchParams);
    const action = getAction(url.pathname);
    const statusCode = 200
    let responseData = []
    let chunks = []
    console.log(request.method, url.pathname, urlParams, action.name, action.id);
    // Set Up CORS
    response.setHeader('Access-Control-Allow-Origin', '*');
    response.setHeader('Content-Type', MIME_TYPES.json);
    response.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET, POST, PUT, DELETE');
    response.setHeader("Access-Control-Allow-Headers", "*");
    response.setHeader('Access-Control-Max-Age', 2592000); // 30 days
    response.writeHead(statusCode);

    // Return on OPTIONS request
    if (request.method === 'OPTIONS') {
        response.end();
        return;
    }
    // CRUD
    switch (action.name) {
      case '/create/usuarios':
        request.on('data', (chunk) => {
          chunks.push(chunk)
        })
        request.on('end', () => {
          let body = Buffer.concat(chunks)
          console.log('create usuarios - body BUFFER', body)
          let parsedData = qs.parse(body.toString())
          console.log('create usuarios - body', parsedData)
          crud.create(USUARIOS_URL, parsedData, (data) => {
            console.log(`server create usuarios ${data.name} creado`, data)
            responseData = data

            response.write(JSON.stringify(responseData));
            response.end();
          });
        })
        break;
        case '/update/usuarios':
          request.on('data', (chunk) => {
            chunks.push(chunk)
          })
          request.on('end', () => {
            let body = Buffer.concat(chunks)
            let parsedData = qs.parse(body.toString())
            crud.update(USUARIOS_URL, action.id, parsedData, (data) => {
              console.log(`server update usuarios ${action.id} modificado`, data)
              responseData = data
  
              response.write(JSON.stringify(responseData));
              response.end();
            });
          })
          break;
      case '/delete/usuarios':
        console.log('delete', action.id)
        crud.delete(USUARIOS_URL, action.id, (data) => {
            console.log('server delete usuarios', action.id, data)
            responseData = data
  
            response.write(JSON.stringify(responseData));
            response.end();
          })
        break;
      case '/read/usuarios':
        crud.read(USUARIOS_URL, (data) => {
          console.log('server read usuarios', data)
          responseData = data

          response.write(JSON.stringify(responseData));
          response.end();
        });
        break;
      default:
        console.log('no se encontro el endpoint');

        response.write(JSON.stringify('no se encontro el endpoint'));
        response.end();
        break;
    }
  })
  .listen(process.env.API_PORT, process.env.IP);

  console.log('Server running at http://' + process.env.IP + ':' + process.env.API_PORT + '/');