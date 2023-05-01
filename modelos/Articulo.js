
const {Schema, model} = require("mongoose");

//Estamos creando el schema de la coleccion
const ArticuloSchema = Schema({
    titulo: {type: String, require: true},
    contenido: String, //Tambien se puede detallar mas con {type: String, requiere: true}
    fecha: {type: Date, default: Date.now},
    imagen: {type: String, default: "default.png"}
});


//El primer parametro es como quiero que se llame el modelo, el segundo le indico el schema que acabo de creae, el tercer parametro es como se llama la coleccion en la base de datos
module.exports = model("Articulo",ArticuloSchema,"articulos");

