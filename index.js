// const http=require("http")
// const app = http.createServer((req,res)=>{
//   res.writeHead(200,{"Content-type":"text/plain"})
//   res.end("hola xdd")
// })

// con express
const express = require('express')
const cors = require('cors')
const app = express()

const logger = require('./loggerMiddleware')
// ahora app va a usar, soportar un objeto json para parsearlo y devolverlo al req.body
app.use(express.json())
app.use(cors())

let notes = [
  {
    id: 1,
    content: 'Me tengo que ir',
    date: '2019-25848',
    important: true
  },

  {
    id: 2,
    content: 'Me tengo que ir',
    date: '2019-25848',
    important: true
  },
  {
    id: 3,
    content: 'Me tengo que ir',
    date: '2019-25848',
    important: false
  }
]
// app.use((req, res, next) => {
//   console.log(req.method)
//   next()// pasara al get hola de abajo
// })
app.use(logger) // traemos aca la funcion importada

app.get('/', (req, res) => {
  // el 1 param es la ruta
  res.send('<h1>Hola</h1>')
})

app.get('/api', (req, res) => {
  res.json(notes) // aca responde un json
})

app.get('/api/:id', (req, res) => {
  const id = Number(req.params.id) // aca venia el numero en un string y no en number por eso abajo en find no encontraba una coincidencia-se pude poner dentro de un Number
  const note = notes.find((note) => note.id === id)
  // se puede añadir algo basico cuando sale un error
  if (note) {
    res.json(note)
  } else {
    res.status(404).end() // esto manda un status 404 que es error y termina con un end()
  }
})
// con delete.
app.delete('/api/:id', (req, res) => {
  const id = Number(req.params.id)
  notes = notes.filter((note) => note.id !== id)
  res.status(204).end() // puedes ver aqui tipos de error https://http.cat/ en este caso ponemos el de no content
})

app.post('/api', (req, res) => {
  const note = req.body // aca llega lo que le envian en el post
  // console.log(note)
  // aca hacer que el content de la nota que envie el usuario sea requerido
  if (!note || !note.content) {
    // si note o note.content no existe
    return res.status(400).json({
      // devuelvo(aca va el return para que acabe la funcion de aqui y no siga para abajo) un status 404(esto es cuando se crea mal un recurso )
      error: 'note.content is missing' // y se devuelve un objeto json
    })
  }
  // crear un id para enviar
  const ids = notes.map((note) => note.id) // aca por cada nota que me devuelva su id
  const maxId = Math.max(...ids) // aca me trae el maximo numero de todo lo que tenia dentro la const ids que es un arreglo
  // ahora para crear una nueva nota
  const newNote = {
    id: maxId + 1,
    content: note.content, // recordar que en note ya viene parseado lo que le envio el usuario
    important: typeof note.important !== 'undefined' ? note.important : false, // typeof sig. tipo de es decir si el tipo de lo que le pase es diferente de undefined,significa que le pase un true o flase,entonces sera lo que envio si no por defecto false,eso quiere deicr que no envio ningun important,ya que el tipode es si no envias nada es undefined
    data: new Date().toISOString() // esto devuleve una fecha en formato iso
  }

  notes = [...notes, newNote] // ahora para actualizar las notas sera una copia de todas las notas agregando la nueva nota
  res.status(201).json(newNote) // se devuelve al usuario la nueva nota y el status 201 que sig. creado
})
// usando un use-este es bueno usarlo cuando el usuario ponga una ruta inexistente y salga este error
app.use((req, res) => {
  console.log(req.path) // la ruta que ha puesto el usuario
  res.status(404).json({
    error: 'Not found'
  })
})

const PORT = 3001
app.listen(PORT, () => {
  console.log('SERVER RUNNING')
})

// ps1 iniciar con npm init -y
// crear un script en pk.json npm star node index.js
// ver los comandos con npm run
// instalar nodemon apra no estar haciendo ctrl c para cerrar el proyecto y luego abrirlo,
// pero recommiendan instalar como modo desarrollador npm i nodemon -D.para usarlo en la consola apretar nodemon y tu archivo
// si queremos agregar un script a nodemon se pone "dev":"nodemon tu archivo"- ahora e usara npm run dev
// ps2 instalar npm i express- el ^ actualiza lo que instalaste cuando sale una nueva version pero si en un 0.0.8-solo actualizara el ultimo numero- para instalar uno sin el ^ se pone un -E al final de tu npm i algo -E
// version lens es una extension que te dice si una dependencia tiene una version actualizada
// crear un app pero con delete
// pero para usar el delete usar el postam o el insomnia,pero en visualcode se puede usar una extension rest client-crear una carpeta reques y un archivo.rest-ir ahi
// usar ahora el post-crear otro .rest de post donde enviaremos un objeto-pero este no la acepta ya que es un json-para que lo acepte y lo parsee se usa un comando de express
// al postear puedes probar borrando el important,te debera salir en false ya que lo configuramos asi arriba en el typeof
// al hacer los post ,ver en el get lo agregado
// ps3 usar npm i eslint -D- usar tambien en el com. ./node_modules/.bin/eslint --init- escoger la 3-lg escoger la 3 porque estamos usando el require-lgt el none -no-node(me escogio el browser)-answer questioj-javascr-espacios-uso el double-windows-no semicolons
// descargar la etendsion eslint-para que te muestro los errores en una misma linea descarga errorlens-ir a eslint y configurarlo en la ruedita
// aw añade al settings.jsoon "editor.codeActionsOnSave": {
//   "source.fixAll.eslint": true
// },
// crear un script en el pakjson- ./node_modules/.bin/eslint .(este es para el comando)  ese punto al final sign que es el archivo actual donde estoy o puedes poner el name de tu archivo
// en el archivo eslint cambiar en indent a 2

// en google buscar github standard(creo que es como una configuracion de eslint) - usar npm i standart -D-boorar el eslint del packjs y eliminar el carret de standart-borrar el arch. eslintrc y en el pack agregar un eslintconfig
// midleware es una funcion que intercepta lo que esta pasando a tu api. app.use recibe cualquier peticion(get,delete,put,etc),si no tiene path recibe todas las rutas-de param se le puede poner un next, esto es cuando no tienes nada que responder osea el res y pasa al siguiente app
// se crea otro arch. donde tendra una funcion para importar- como va a ser comonnjs tiene otro tipo de exportado y para importarlo aca tambien es otro tipo
// ps 4 clonar su repositorio git clone https://github.com/midudev/notes-app-full-stack-bootcamp.git pero para que salga el del video se clona y en su bash se pone git checkout 99c8f7f8dc0d93fa60e1ef11b755c6b9e465d7e2  (este es un commit pasado)
// en services-notes.js del project clonado, ahi se configura la const baseurl con la ruta de tu api , en mi caso termina con/api
// al hacer un get a la api hay un problema de cors(creo que sig. que no se puede pasar algunos archivos entre servidores)- instalar npm i cors -E (el e es version exacta)-traerlo con require y que el app lo use- para ver mas de cors buscar cors express
// ps 5 crear un repositorio-hacer un git bash a la carpeta de tu api-añadir commit(no se porque)-git add .crear el archivo .-el prof se equivoco y añadio el node_modules-hacer un git checkout . -git reset . .gitignore-ahi añadir al node_modules-git checkout para comprobar-añadir el commit-usar el git branch _M main-añadir el gitremoteadd-luego el push
