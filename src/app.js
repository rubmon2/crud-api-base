const express = require("express")
const mongoose=require("mongoose")
const bodyParser= require("body-parser")
const {config}=require("dotenv")
config()

//ruta libros, todo lo q es respecto solicitudes http que se puedan hacer, que esta en book.routes.js
const bookRoutes=require("./routes/book.routes.js")

//samos expres ara los middlewares
const app=express()
app.use(bodyParser.json())


//lo que es process.env hace referen cia al archivo .env
//conectamos a la bse de datos:
mongoose.connect(process.env.MONGO_URL, {dbName: process.env.MONGO_DB_NAME})
const db = mongoose.connection;


//levantamos la ruta de libros, para las solicitudes http, arriba definimos cuales fueron
app.use("/books", bookRoutes)


//levanto en puerto 3000 o el puerto que este en el archivo .env
const port=process.env.PORT || 3000



app.listen(port, ()=>{

    console.log("servidor iniciado en el puerto : ", port)
})