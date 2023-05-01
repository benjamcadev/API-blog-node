
const Articulo = require("../modelos/Articulo");
const { validarArticulo } = require("../helpers/validar");
const fs = require("fs");
const path = require("path");


const prueba = (req, res) => {

    return res.status(200).json({
        mensaje: "Soy una funcion de prueba en el controlador articulos"
    });
}

const curso = (req, res) => {

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
}

const crear = (req, res) => {
    // Recoger parametros por post a guardar
    let parametros = req.body;


    // Validar datos
    try {

        validarArticulo(parametros);

    } catch (error) {
        return res.status(400).json({
            mensaje: "Faltan datos por enviar",
            status: "error"
        });
    }

    //Crear el objeto a guardar
    const articulo = new Articulo(parametros); // Al pasar "parametros" se asigna auto las variables que vienen en el json en el schema

    //Asignar valores a objeto basado en el schema u objeto (manual o auto)
    //articulo.titulo = parametros.titulo; // FORMA MANUAL


    // Guardar el articulo en la base de datos

    articulo.save()
        .then((articuloGuardado) => {

            //Devolver resultado
            return res.status(200).json({
                status: 'success',
                Articulo: articuloGuardado,
                mensaje: 'Articulo creado con exito'
            });
        })
        .catch((error) => {
            return res.status(400).json({
                status: 'error',
                mensaje: 'No se ha guardado el articulo: ' + error.message
            });
        });

}

const listar = (req, res) => {

    let consulta = Articulo.find({})
        .sort({ fecha: -1 }) //AGREGAR sort SON FILTROS UNA ESPECIE DE WHERE

    if (req.params.ultimos) {
        consulta.limit(2); //SIMILAR AL LIMIT EN MYSQL
    }

   
    consulta.then((articulos) => {

        if (!articulos) {
            return res.status(404).json({
                status: "error",
                mensaje: "No se han encontrado articulos",
            });

        }

        return res.status(200).send({
            status: "success",
            parametro_url: req.params.ultimos,
            articulos
        });

    })
        .catch((error) => {
            return res.status(500).json({
                status: "error",
                mensaje: "Ha ocurrido un error al listar los articulos",
                error: error.message,

            });

        });

};

const uno = (req, res) => {
    // Recoger una id por la url
    let id = req.params.id;
    //Buscar el articulo
    Articulo.findById(id)
        .then((articulo) => {
            //Si no existe devolver error
            if (!articulo) {
                return res.status(404).json({
                    status: "error",
                    mensaje: "No se ha encontrado el articulo",
                });

            }
            //DEvovler respuesta
            return res.status(200).send({
                status: "success",
                articulo
            });
        })

}

const borrar = (req, res) => {

    let articulo_id = req.params.id;

    Articulo.findOneAndDelete({ _id: articulo_id })
        .then((articuloBorrado) => {

            //Si no existe devolver error
            if (!articuloBorrado) {
                return res.status(404).json({
                    status: "error",
                    mensaje: "No se ha encontrado el articulo",
                });

            }

            return res.status(200).json({
                status: "success",
                articulo: articuloBorrado,
                mensaje: "Metodo de borrar"
            });
        })
        .catch((error) => {
            return res.status(500).json({
                status: "error",
                mensaje: "Error al borrar el articulo",
                error: error.message,

            });

        });


}



const editar = (req, res) => {
    //Recoger id
    let articuloId = req.params.id

    //Datos del body
    let parametros = req.body;

    //Validar datos
    try {

        validarArticulo(parametros);

    } catch (error) {
        return res.status(400).json({
            mensaje: "Faltan datos por enviar",
            status: "error"
        });
    }

    //Buscar y actualizar datos
    Articulo.findOneAndUpdate({ _id: articuloId }, parametros, { new: true })
        .then((articuloActualizado) => {

            //Si no existe devolver error
            if (!articuloActualizado) {
                return res.status(404).json({
                    status: "error",
                    mensaje: "No se ha encontrado el articulo",
                });

            }

            //Devolver datos
            return res.status(200).json({
                status: "success",
                articulo: articuloActualizado
            });
        })
        .catch((error) => {
            return res.status(500).json({
                status: "error",
                mensaje: "Error al editar el articulo",
                error: error.message,

            });

        });



}

const subir = (req, res) => {

    //Configurar multer (libreria para subir archivo)
    //Se configura en rutas


    //Recoger el archivo de imagen subido
    if (!req.file && !req.files) {
        return res.status(404).json({
            status: "error",
            mensaje: "Peticion invalida",
        });
    }

    //Nombre del archivo
    let archivo = req.file.originalname;

    //Extension del archivo
    let archivo_split = archivo.split("\.");
    let extension = archivo_split[1];

    //Comprobar extension correcta

    if (extension != "png" && extension != "jpg" &&
        extension != "jpeg" && extension != "gif") {

        //Borrar el archivo y dar respuesta
        fs.unlink(req.file.path, (error) => {
            return res.status(400).json({
                status: "error",
                mensaje: "Imagen invalida"
            })
        })
    } else {
        //Si todo sale bien, actualizar el articulo

        //Respuesta ok

        //Recoger id
        let articuloId = req.params.id

        //Buscar y actualizar datos
        Articulo.findOneAndUpdate({ _id: articuloId }, { imagen: req.file.filename }, { new: true })
            .then((articuloActualizado) => {

                //Si no existe devolver error
                if (!articuloActualizado) {
                    return res.status(404).json({
                        status: "error",
                        mensaje: "No se ha encontrado el articulo",
                    });

                }

                //Devolver datos
                return res.status(200).json({
                    status: "success",
                    articulo: articuloActualizado,
                    fichero: req.file
                });
            })
            .catch((error) => {
                return res.status(500).json({
                    status: "error",
                    mensaje: "Error al editar el articulo",
                    error: error.message,

                });

            });

    }




}

const imagen = (req,res) => {
    let fichero = req.params.fichero;
    let ruta_fisica = "./imagenes/articulos/"+fichero;

    fs.stat(ruta_fisica,(error,existe) => {
        if(existe){
            return res.sendFile(path.resolve(ruta_fisica));
        }else{
            return res.status(404).json({
                status: "error",
                mensaje: "El archivo no existe"
            });
        }
    })

}

const buscador = (req,res) => {
    // Sacar el string de busqueda
    let busqueda = req.params.busqueda;

    // un find a la bd pero con OR
    Articulo.find({"$or": [
        {"titulo": {"$regex": busqueda, "$options": "i"}},
        {"contenido": {"$regex": busqueda, "$options": "i"}}
    ]})
    .sort({fecha: -1})
    .then((articulosEncontrados) =>{

        if (!articulosEncontrados || articulosEncontrados.length <= 0 ) {
            return res.status(404).json({
                status: "error",
                mensaje: "No se han encontrado articulos"
            });
        }

        return res.status(200).json({
            status: "success",
            articulos: articulosEncontrados
        });

    })
    // .exec((error,articulosEncontrados) =>{

    //     if (error || !articulosEncontrados) {
    //         return res.status(404).json({
    //             status: "error",
    //             mensaje: "No se han encontrado articulos"
    //         });
            
    //     }
    //     return res.status(200).json({
    //         status: "success",
    //         articulos
    //     });

    // })

    //Aplicar un ORDERBY

    //Ejecutar consulta

    //DEvolver respuesta
}

module.exports = {
    prueba,
    curso,
    crear,
    listar,
    uno,
    borrar,
    editar,
    subir,
    imagen,
    buscador
}