// modules
const bcrypt = require('bcrypt-nodejs');

//models
const userModel = require('../models/users');
const fs = require('fs');
const path = require('path');

//servicio jwt
const jwtService = require('../services/jwt.service');

// actions
function test(req, res) {
    res.status(200).send({
        message: "Test success"
    });
}

function saveUser(req, res) {
    //create user object
    let user = new userModel();

    //get params from request
    let params = req.body;

    //set values to user
    if (params.password && params.name && params.email) {
        user.name = params.name;
        user.lastName = params.lastName;
        user.email = params.email;
        user.role = params.role;
        user.image = params.image;
        //verify if user exists
        userModel.findOne({ email: user.email.toLowerCase() }, (err, existentUser) => {
            if (err) {
                res.status(200).send({ message: 'Error: user not found' });
            }
            else {
                if (!existentUser) {
                    bcrypt.hash(params.password, null, null, function (err, hash) {
                        user.password = hash;
                        //save user into database
                        user.save((err, userStored) => {
                            if (err) {
                                res.status(500).send({ message: 'Error saving user into database' });
                            }
                            else if (!userStored) {
                                res.status(400).send({ message: 'Error saving user into database' });
                            }
                            else {
                                res.status(200).send({ user: userStored });
                            }
                        });
                    });
                }
                else {
                    res.status(200).send({ message: 'Error: user already exists' });
                }
            }
        });
    }
    else {
        res.status(200).send({ message: 'Complete data to save user' });
    }
}

function login(req, res) {
    let params = req.body;
    userModel.findOne({ email: params.email.toLowerCase() }, (err, user) => {
        if (err || !user) {
            res.status(200).send({ message: 'Error: user not found' });
        }
        else {
            bcrypt.compare(params.password, user.password, (err, check) => {
                if (err || !check) {
                    res.status(200).send({ message: 'Error: invalid password' });
                }
                else {
                    //login
                    if(params.getToken == true || params.getToken == 'true') {
                        //return a new token
                        res.status(200).send(
                                { token: jwtService.createToken(user) }
                            );
                    }
                    else {
                        res.status(200).send({ user: user });
                    }                    
                }
            });
        }
    });
}

function updateUser(req, res) {
    let userId = req.params.id;
    let updateData = req.body;

    if(userId != req.user.sub) {
        return res.status(401).send({ message: 'You have not permissions to modify the user'});
    }

    userModel.findByIdAndUpdate(userId, updateData, {new: true}, (err, userUpdated) => {
        if(err) {
            res.status(500).send( {message: 'Error updating user'} );
        }
        else {
            if(!userUpdated) {
                res.status(404).send({message: 'User is not able to be updated'} );
            }
            else {
                res.status(200).send({user: userUpdated} );
            }
        }
    });
}

function uploadImage(req, res) {
    const userId = req.params.id;

    if(req.files) {
        const file_path = req.files.image.path;
        let file_split = file_path.split('\\');
        let file_name = file_split[2];
        const extension = file_name.split('.')[1];
        if( extension == 'png' || extension == 'jpg' || extension == 'gif' ){
            if(userId != req.user.sub) {
                return res.status(401).send({ message: 'You have not permissions to modify the user'});
            }
        
            userModel.findByIdAndUpdate(userId, {image: file_name}, {new: true}, (err, userUpdated) => {
                if(err) {
                    res.status(500).send( {message: 'Error updating user'} );
                }
                else {
                    if(!userUpdated) {
                        res.status(404).send({message: 'User is not able to be updated'} );
                    }
                    else {
                        res.status(200).send({user: userUpdated, image: file_name } );
                    }
                }
            });
        }
        else {
            fs.unlink(file_path, (err) => {
                if(err) {
                    return res.status(200).send({message: 'Extension is not valid and document did not deleted'} );
                }
                else {
                    return res.status(200).send({message: 'Extension is not valid'} );
                }
            });
        }
    }
    else {
        return res.status(200).send({message: 'There are no files'} );
    };
}

function getImageFile(req, res){
    let imageFile = req.params.imageFile;
    let path_file = `./uploads/users/${imageFile}`;
    console.log('Name', imageFile);
    console.log('pathFile', path_file);
    
    fs.exists(path_file, (exists) => {
        if(exists) {
            res.sendFile(path.resolve(path_file));
        }
        else {
            res.status(200).send({ message: 'the image does no exist' } );
        }
    });    
}

function getKeepers(req, res) {
    userModel.find({ role: 'ROLE_ADMIN'}).exec((err, users) => {
        if(err) {
            res.status(500).send( {message: 'Error getting keepers'} );
        }
        else {
            if(!users) {
                res.status(404).send({message: 'there are no keepers'} );
            }
            else {  
                res.status(200).send({ users } );
            }
        }
    });
}

module.exports = {
    test,
    saveUser,
    login,
    updateUser,
    uploadImage,
    getImageFile,
    getKeepers
}