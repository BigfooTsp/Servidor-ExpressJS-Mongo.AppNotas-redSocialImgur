/** Los controladores son funciones que se pueden
 * solicitar indicándolas como  argumento en las 
 * funciones de enrutamiento.
 * En este archivo se recopila todo lo que se puede 
 * hacer con las imágenes
 */
const path = require('path');
const { randomNumber } = require('../helpers/libs');
const fs = require('fs-extra');

const { Image } = require('../models/index');

const ctrl = {};

/** Generando vista de imagen 
 *  GET /images/:image_id 
 */
ctrl.index = async (req, res) => {
  // Búsqueda. La expresión regular es para que incluya la extensión en la dirección 
  const image = await Image.findOne({ filename: { $regex: req.params.image_id } });  
  res.render('image', { image });
};


/** Subiendo imagen al servidor 
 * POST /images
*/
ctrl.create = (req, res) => {
  // configurando nombre de archivo
  const saveImage = async () => {
    const imgURL = randomNumber();
    const images = await Image.find({ filename: imgURL });  // Comprobando que no está repetido                // Comprueba si el nombre está repetido
    if (images.length > 0) {
      saveImage();                                  // Si es igual, repite la función (recursión)
    } else {                                        // Si no, guarda archivo
      // Confirgurando directorios
      const imageTempPath = req.file.path;
      const ext = path.extname(req.file.originalname)
        .toLowerCase(); // Obtiene la extensión de la imagen
      const targetPath = path.resolve(`src/public/upload/${imgURL}${ext}`);

      // Validación de si el archivo es una imagen
      if (ext === '.png' || ext === '.gif' || ext === '.jpg' || ext === '.jpeg') {
        // Guardando imagen renombrada en destino /public/upload
        await fs.rename(imageTempPath, targetPath);
        // Guardando datos de imagen en base de datos
        const newImg = new Image({                  // Crea Modelo
          title: req.body.title,
          filename: imgURL + ext,
          description: req.body.description,
        });
        const imageSaved = await newImg.save();     // Guarda los datos en Mongo
      } else {
        await fs.unlink(imageTempPath);             // si no, elimina el archivo de public/temp
        res.status(500).json({ error: 'Solo se permiten archivos de imagen' }); // Manda error 500 y mensaje
      }
      res.redirect(`/images/${imgURL}`);
    }
  };

  saveImage();
};



ctrl.like = (req, res) => {

};

ctrl.comment = (req, res) => {

};

ctrl.remove = (req, res) => {

};

module.exports = ctrl;