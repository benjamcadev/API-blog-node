const mongoose = require("mongoose");


const conexion = async() => {

    try {
        mongoose.connect("mongodb://localhost:27017/mi_blog");

        // Parametors opciones para la conexion
        // useNewUrlPArser: true
        // useUnifiedTopology: true
        // useCreateIndex: true

        console.log("Conectado correctamente a la base de datos mi_blog");


    } catch (error) {
        console.error(error);
        throw new Error("No s eha podido conectar a la BD");
    }
}

module.exports = {
    conexion
}