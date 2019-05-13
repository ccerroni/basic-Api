// modules

//models
const userModel = require('../models/users');
const animalModel = require('../models/animals');
const fs = require('fs');
const path = require('path');

//servicio jwt
const jwtService = require('../services/jwt.service');

function test(req, res) {
  res.status(200).send({
    message: "Test success"
  });
}

function saveAnimal(req, res) {
  let animal = new animalModel();
  let params = req.body;
  console.log(params);
  if (params.name) {
    animal.name = params.name;
    animal.description = params.description;
    animal.year = params.year;
    animal.image = null;
    animal.user = req.user.sub;

    animal.save((err, animalStored) => {
      if (err) {
        res.status(500).send({ message: 'Error saving animal' });
      }
      else {
        if (!animalStored) {
          res.status(404).send({ message: 'Animal did not save' });
        }
        else {
          res.status(200).send({ animal: animalStored });
        }
      }
    });
  }
  else {
    res.status(200).send({ message: 'Name is required' });
  }

}

function getAnimals(req, res) {
  animalModel.find({

  }).populate({ path: 'user' }).exec((err, animals) => {
    if (err) {
      res.status(500).send({ message: 'Error getting animals' });
    }
    else {
      if (!animals) {
        res.status(404).send({ message: 'There are not animals' });
      }
      else {
        res.status(200).send({ animals });
      }
    }
  });
}

function getAnimal(req, res) {
  let animalId = req.params.id;
  animalModel.findById(animalId).populate({ path: 'user' }).exec((err, animal) => {
    if (err) {
      res.status(500).send({ message: 'Error getting an animal' });
    }
    else {
      if (!animal) {
        res.status(404).send({ message: 'Animal not found' });
      }
      else {
        res.status(200).send({ animal });
      }
    }
  });
}

function updateAnimal(req, res) {
  let animalId = req.params.id;
  let update = req.body;

  animalModel.findByIdAndUpdate(animalId, update, { new: true }, (err, animalUpdated) => {
    if (err) {
      res.status(500).send({ message: 'Error updating an animal' });
    }
    else {
      if (!animalUpdated) {
        res.status(404).send({ message: 'Animal was not updated' });
      }
      else {
        res.status(200).send({ animal: animalUpdated });
      }
    }
  });
}


function uploadImage(req, res) {
  const animalId = req.params.id;

  if (req.files) {
    const file_path = req.files.image.path;
    let file_split = file_path.split('\\');
    let file_name = file_split[2];
    const extension = file_name.split('.')[1];
    if (extension == 'png' || extension == 'jpg' || extension == 'gif') {
      animalModel.findByIdAndUpdate(animalId, { image: file_name }, { new: true }, (err, animalUpdated) => {
        if (err) {
          res.status(500).send({ message: 'Error updating Animal' });
        }
        else {
          if (!animalUpdated) {
            res.status(404).send({ message: 'Animal is not able to be updated' });
          }
          else {
            res.status(200).send({ animal: animalUpdated, image: file_name });
          }
        }
      });
    }
    else {
      fs.unlink(file_path, (err) => {
        if (err) {
          return res.status(200).send({ message: 'Extension is not valid and document did not deleted' });
        }
        else {
          return res.status(200).send({ message: 'Extension is not valid' });
        }
      });
    }
  }
  else {
    return res.status(200).send({ message: 'There are no files' });
  };
}

function getImageFile(req, res) {
  let imageFile = req.params.imageFile;
  let path_file = `./uploads/animals/${imageFile}`;
  console.log('Name', imageFile);
  console.log('pathFile', path_file);

  fs.exists(path_file, (exists) => {
    if (exists) {
      res.sendFile(path.resolve(path_file));
    }
    else {
      res.status(200).send({ message: 'the image does no exist' });
    }
  });
}

function deleteAnimal(req, res) {
  animalId = req.params.id;
  animalModel.findByIdAndRemove(animalId, (err, animalRemoved) => {
    if(err){
      return res.status(200).send({ message: 'The animal was NOT removed' });
    }
    else {
      if (!animalRemoved){
        return res.status(200).send({ message: 'The animal does not exist' });
      }
      else {
        return res.status(200).send({ animal: animalRemoved});
      }
    }
  });
}

module.exports = {
  test,
  saveAnimal,
  getAnimals,
  getAnimal,
  updateAnimal,
  uploadImage,
  getImageFile,
  deleteAnimal
}