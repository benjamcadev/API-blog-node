
const express = require("express");
const multer = require("multer");
const ArticuloController = require("../controladores/articulo");

const router = express.Router();

const almacenamiento = multer.diskStorage({
    destination: (req,file,cb) => {
        cb(null,'./imagenes/articulos/'); //En destination definimos la ruta donde se guardaran los files

    },
    filename: (req,file,cb) => {
        cb(null,"articulo"+ Date.now() + file.originalname); //Definimos los nombres que tendran los archivos
    }
})

const subidas = multer({storage: almacenamiento});




//Rutas de pruebas
router.get("/ruta-de-prueba",ArticuloController.prueba);
router.get("/curso",ArticuloController.curso);


//Rutas del proyecto
router.post("/crear",ArticuloController.crear);
router.get("/articulos/:ultimos?",ArticuloController.listar); //:ultimos seria un parametros obligatorio pero agregar ? es opcional
router.get("/articulo/:id",ArticuloController.uno);
router.delete("/articulo/:id",ArticuloController.borrar);
router.put("/articulo/:id",ArticuloController.editar);
router.post("/subir-imagen/:id",[subidas.single("file0")],ArticuloController.subir); // single significa que sera 1 archivo y el "file0" es le nombre del campo
router.get("/imagen/:fichero",ArticuloController.imagen);
router.get("/buscar/:busqueda",ArticuloController.buscador);


module.exports = router;

