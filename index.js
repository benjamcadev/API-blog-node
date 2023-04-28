const {conexion} = require('./database/conexion');
const express = require('express');
const cors = require('cors');

//CONECTAR A LA BASE DE DATOS
conexion();


//CREAR SERVIDOR NODE
const app = express();
const puerto = 3900;


//Configurar Cors
app.use(cors());

//CONVERTIR BODY A OBJETO JS , TODA PETICION QUE LLEGUE SE PARSEA A OBJETO  
app.use(express.json());

//RUTAS
app.get("/probando",(req,res) => {
    console.log("Se ha ejecutado el endpoint probando");

    return res.status(200).json(   //EL MEOTODO json ENVIA SOLO JSON Y EL METODO send LO QUE SE DE LA GANA
        [
            {
            curso: "Master en React",
            autor: "Victor Robles web",
            url: "victorrobles.com"
            },
            {
                curso: "Master en React",
                autor: "Victor Robles web",
                url: "victorrobles.com"
            }
        ]
    )
    //DEVOLVIENDO UN CODIGO HTML
    // return res.status(200).send(
    // `
    // <div>
    //     <h1>Probando ruta nodejs</h1>
    //     <p>Creando api rest con node</p>
    //     <ul>
    //         <li>lista</li>
    //     </ul>
    // </div>
    // `
    // )


});

app.get("/",(req,res) => {

    return res.status(200).send(
        `<h1>Empezando a crear un api rest con node</h1>`
    );
});  

//crear servidor y escuchar peticiones http
app.listen(puerto, () => {
    console.log("Servidor corriendo en el puerto"+puerto)
});