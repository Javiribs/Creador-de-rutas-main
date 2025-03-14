// /server/server.js
import * as http from 'node:http';
import * as url from 'node:url';

const ciudadesJSON = `[  {
    "id": 1,
    "name": "Barcelona",
    "country": "España",
    "paradas": [ {
        "id": 1,
        "nombre_parada": "Sagrada Familia",
        "coordenadas": [41.403668, 2.174135],
        "descripcion": "Basílica expiatoria diseñada por Gaudí, una de las obras más emblemáticas de la arquitectura modernista.",
        "imagen": "https://placehold.co/200x200",
        "horario": "De 09:00 a 20:00 (varía según la temporada)",
        "categoria": "Monumento",
        "enlace": "https://sagradafamilia.org/es/home",
        "info": "La Sagrada Familia, diseñada por Antoni Gaudí, es un icono de Barcelona y una obra maestra de la arquitectura modernista. Iniciada en 1882, aún en construcción, es un símbolo de la creatividad humana. Gaudí concibió un templo inspirado en la naturaleza, con formas orgánicas y simbolismo religioso. Cada detalle, desde las fachadas hasta las torres, cuenta una historia. Las fachadas representan las diferentes etapas de la vida de Jesús y el interior es un bosque de columnas que crea una atmósfera espiritual. La luz, a través de las vidrieras, juega un papel fundamental. Gaudí utilizó técnicas innovadoras, como la catenaria, para crear estructuras esbeltas y resistentes. Tras su muerte, otros arquitectos continuaron su obra, pero la Sagrada Familia sigue evolucionando. Visitarla es una experiencia única, un viaje a través de la belleza y la complejidad de la arquitectura."
    },
    {   
        "id": 2,
        "nombre_parada": "Park Güell", 
        "coordenadas": [41.401985, 2.174358],
        "descripcion": "Parque diseñado por Gaudí, lleno de mosaicos y formas orgánicas.",
        "imagen": "https://placehold.co/200x200",
        "horario": "De 08:00 a 21:00",
        "categoria": "Parque",
        "info": "El Park Güell es un parque público en Barcelona, diseñado por Antoni Gaudí, que combina naturaleza y arquitectura de forma única. Concebido inicialmente como una urbanización de lujo, Gaudí transformó el espacio en un jardín onírico lleno de elementos arquitectónicos y esculturas. El parque, construido entre 1900 y 1914, es un claro ejemplo del modernismo catalán y Patrimonio Mundial de la UNESCO. Destaca la famosa salamandra o dragón, situada en la entrada principal, que se ha convertido en uno de los símbolos más reconocibles del parque. Las bancas onduladas de la plaza central, inspiradas en las formas de la naturaleza, ofrecen vistas panorámicas de la ciudad. La sala hipóstila con sus 86 columnas dóricas, crea un espacio mágico y misterioso. Y no podemos olvidar las casas-modelo, diseñadas para los posibles compradores de las parcelas, que son verdaderas joyas arquitectónicas. El Park Güell es mucho más que un parque. Es un espacio donde la naturaleza y la arquitectura se funden en una armonía perfecta, creando un ambiente mágico y surrealista. Un lugar donde perderse y disfrutar de la genialidad de Gaudí."      
    },
    {   
        "id": 3,
        "nombre_parada": "Casa Batlló",
        "coordenadas": [41.392193, 2.164106],
        "descripcion": "Edificio modernista de Gaudí con una fachada única y colorida.",
        "imagen": "https://placehold.co/200x200",
        "horario": "De 09:00 a 21:00",
        "categoria": "Monumento"
    },
    {   
      "id": 4,
        "nombre_parada": "La Pedrera",
        "coordenadas": [41.394286, 2.169407],
        "descripcion": "Otro edificio modernista de Gaudí, conocido por su forma ondulada.",
        "imagen": "https://placehold.co/200x200",
        "horario": "De 09:00 a 21:00",
        "categoria": "Monumento"
    },
    {   
        "id": 5,
        "nombre_parada": "Las Ramblas",
        "coordenadas": [41.382894, 2.174435],
        "descripcion": "Avenida peatonal llena de vida, tiendas, restaurantes y artistas callejeros.",
        "imagen": "https://placehold.co/200x200",
        "categoria": "Calle"
    },
    {
        "id": 6,
        "nombre_parada": "Barrio Gótico",
        "coordenadas": [41.382894, 2.174435],
        "descripcion": "Centro histórico de Barcelona, con calles estrechas y edificios medievales.",
        "imagen": "https://placehold.co/200x200",
        "categoria": "Barrio"
    },
    {   
        "id": 7,
        "nombre_parada": "Catedral de Barcelona",
        "coordenadas": [41.382894, 2.174435],
        "descripcion": "Imponente catedral gótica con una rica historia.",
        "imagen": "https://placehold.co/200x200",
        "categoria": "Religioso"
    },
    {
        "id": 8,
        "nombre_parada": "Puerto de Barcelona",
        "coordenadas": [41.383333, 2.195278],
        "descripcion": "Uno de los puertos más importantes del Mediterráneo, con una amplia oferta de ocio.",
        "imagen": "https://placehold.co/200x200",
        "categoria": "Puerto"
    },
    {   
        "id": 9,
        "nombre_parada": "Montjuïc",
        "coordenadas": [41.379386, 2.169515],
        "descripcion": "Colina con vistas panorámicas de la ciudad, que alberga varios museos y jardines.",
        "imagen": "https://placehold.co/200x200",
        "categoria": "Montaña"
    },
    {
        "id": 10,
        "nombre_parada": "Camp Nou",
        "coordenadas": [41.382596, 2.11068],
        "descripcion": "Estadio del FC Barcelona, uno de los más grandes de Europa.",
        "imagen": "https://placehold.co/200x200",
        "categoria": "Estadio" 
    }
    ]    
  },

   {
    "id": 2,
    "name": "Madrid",
    "country": "España",
    "paradas": [ {
        "id": 1,
        "nombre_parada": "Puerta del Sol",
        "coordenadas": [40.416775, -3.703790],
        "descripcion": "Corazón de Madrid, punto de encuentro y celebración de eventos importantes.",
        "imagen": "https://placehold.co/200x200",
        "horario": "24 horas",
        "categoria": "Plaza"
    },
    {   
        "id": 2,
        "nombre_parada": "Museo del Prado",
        "coordenadas": [40.416552, -3.703790],
        "descripcion": "Uno de los museos más importantes del mundo, con una vasta colección de arte español.",
        "imagen": "https://placehold.co/200x200",
        "horario": "De martes a domingo de 10:00 a 20:00",
        "categoria": "Museo"
    },
    {   
        "id": 3,
        "nombre_parada": "Palacio Real de Madrid",
        "coordenadas": [40.416781, -3.703322],
        "descripcion": "Residencia oficial de la Familia Real Española.",
        "imagen": "https://placehold.co/200x200",
        "horario": "Consulta la web oficial para horarios",
        "categoria": "Palacio"
    },
    {   
        "id": 4,
        "nombre_parada": "Parque del Retiro",
        "coordenadas": [40.416775, -3.703790],
        "descripcion": "Gran parque urbano con un lago, jardines y un palacio de cristal.",
        "imagen": "https://placehold.co/200x200",
        "horario": "24 horas",
        "categoria": "Parque"
    },
    {   
        "id": 5,
        "nombre_parada": "Plaza Mayor",
        "coordenadas": [40.417025, -3.704211],
        "descripcion": "Plaza rectangular rodeada de soportales y edificios históricos.",
        "imagen": "https://placehold.co/200x200",
        "horario": "24 horas",
        "categoria": "Plaza"
    },
    {
        "id": 6,
        "nombre_parada": "Templo de Debod",
        "coordenadas": [40.424259, -3.704170],
        "descripcion": "Templo egipcio donado a España y ubicado en los Jardines de Sabatini.",
        "imagen": "https://placehold.co/200x200",
        "horario": "Consulta la web oficial para horarios",
        "categoria": "Monumento"
    },
    {   
        "id": 7,
        "nombre_parada": "Museo Reina Sofía",
        "coordenadas": [40.416622, -3.703640],
        "descripcion": "Museo de arte contemporáneo que alberga obras de Picasso, Dalí y Miró.",
        "imagen": "https://placehold.co/200x200",
        "horario": "De lunes a domingo de 10:00 a 21:00",
        "categoria": "Museo"
    },
    {
        "id": 8,
        "nombre_parada": "Mercado de San Miguel",
        "coordenadas": [40.415833, -3.705278],
        "descripcion": "Mercado gastronómico con una gran variedad de productos y tapas.",
        "imagen": "https://placehold.co/200x200",
        "horario": "Consulta la web oficial para horarios",
        "categoria": "Mercado"
    },
    {   
        "id": 9,
        "nombre_parada": "Cibeles",
        "coordenadas": [40.417025, -3.704211],
        "descripcion": "Fuente monumental con una escultura de la diosa Cibeles.",
        "imagen": "https://placehold.co/200x200",
        "horario": "24 horas",
        "categoria": "Fuente"
    },
    {   
        "id": 10,
        "nombre_parada": "Estadio Santiago Bernabéu",
        "coordenadas": [40.447475, -3.694712],
        "descripcion": "Estadio del Real Madrid CF.",
        "imagen": "https://placehold.co/200x200",
        "horario": "Consulta la web oficial para horarios",
        "categoria": "Estadio"
    }]
   },
   {
    "id": 3,
    "name": "Rio de Janeiro",
    "country": "Brasil",
    "paradas": [
      {
        "id": 1,
        "nombre_parada": "Cristo Redentor",
        "coordenadas": [-22.95192, -43.21055],
        "descripcion": "Una de las Nuevas Siete Maravillas del Mundo Moderno.",
        "imagen": "https://placehold.co/200x200",
        "horario": "Todos los días",
        "categoria": "Monumento"
      },
      {
        "id": 2,
        "nombre_parada": "Playa de Copacabana",
        "coordenadas": [-22.969542, -43.190622],
        "descripcion": "Una de las playas más famosas del mundo.",
        "imagen": "https://placehold.co/200x200",
        "horario": "24 horas",
        "categoria": "Playa"
      },
      { 
        "id": 3,
        "nombre_parada": "Escadaria Selarón",
        "coordenadas": [-22.95192, -43.21055],
        "descripcion": "Escalera decorada con azulejos de todo el mundo.",
        "imagen": "https://placehold.co/200x200",
        "horario": "24 horas",
        "categoria": "Monumento"
      },
      {  
        "id": 4,
        "nombre_parada": "Maracanã",
        "coordenadas": [-22.913056, -43.238333],
        "descripcion": "Estadio de fútbol más famoso de Brasil.",
        "imagen": "https://placehold.co/200x200",
        "horario": "Consulta la web oficial para horarios",
        "categoria": "Estadio"
      },
      {
        "id": 5,
        "nombre_parada": "Corcovado",
        "coordenadas": [-22.95192, -43.21055],
        "descripcion": "Montaña con vistas panorámicas de la ciudad.",
        "imagen": "https://placehold.co/200x200",
        "horario": "Todos los días",
        "categoria": "Montaña"
      },
      {
        "id": 6,
        "nombre_parada": "Parque Lage",
        "coordenadas": [-22.953889, -43.209167],
        "descripcion": "Un antiguo palacete rodeado de naturaleza, ideal para relajarse y disfrutar de la vista.",
        "imagen": "https://placehold.co/200x200",
        "horario": "Todos los días",
        "categoria": "Parque"
      },
      {
        "id": 7,
        "nombre_parada": "Pan de Azúcar",
        "coordenadas": [-22.95192, -43.21055],
        "descripcion": "Un pico icónico con vistas impresionantes de la ciudad.",
        "imagen": "https://placehold.co/200x200",
        "horario": "Todos los días",
        "categoria": "Montaña"
      },
      {
        "id": 8,
        "nombre_parada": "Lapa",
        "coordenadas": [-22.907222, -43.182778],
        "descripcion": "Barrio bohemio con vida nocturna vibrante.",
        "imagen": "https://placehold.co/200x200",
        "horario": "24 horas",
        "categoria": "Barrio"
      },
      {
        "id": 9,
        "nombre_parada": "Quinta da Boa Vista",
        "coordenadas": [-22.9175, -43.209722],
        "descripcion": "Un gran parque con un palacio imperial y un zoológico.",
        "imagen": "https://placehold.co/200x200",
        "horario": "Todos los días",
        "categoria": "Parque"
      },
      {
        "id": 10,
        "nombre_parada": "Museo de Arte Moderno de Río de Janeiro",
        "coordenadas": [-22.953056, -43.188889],
        "descripcion": "Uno de los museos de arte moderno más importantes de Brasil.",
        "imagen": "https://placehold.co/200x200",
        "horario": "De martes a domingo de 10:00 a 18:00",
        "categoria": "Museo"
      },
      {
        "nombre_parada": "Scenarium",
        "coordenadas": [40.416775, -3.703790],
        "descripcion": "Espacio principal para eventos y conferencias.",
        "imagen": "https://placehold.co/200x200", 
        "horario": "De lunes a viernes de 9:00 a 21:00",
        "categoria": "Salón de eventos"
      }
    ]
  }
]`;

http.createServer(function server_onRequest (request, response) {
    let pathname = url.parse(request.url).pathname;

    console.log(`Request for ${pathname} received.`);
    // console.log(request.headers);

    response.setHeader('Access-Control-Allow-Origin', '*');
    response.setHeader('Content-Type', 'application/json');
    response.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET');
    response.setHeader("Access-Control-Allow-Headers", "*");
    response.setHeader('Access-Control-Max-Age', 2592000); // 30 days
    response.writeHead(200);

    // response.writeHead(200, {'Content-Type': 'application/json'});
    // response.write("<h1>Hello World</h1>");
    response.write(ciudadesJSON);
    response.end();
}).listen(process.env.PORT, process.env.IP);

console.log('Server running at http://' + process.env.IP + ':' + process.env.PORT + '/');