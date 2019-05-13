const jwt = require('jwt-simple');
const moment = require('moment');
const secret = 'pechera';

exports.createToken = function(user){
  let payload = {
    sub: user._id,
    name: user.name,
    lastName: user.lastName,
    email: user.email,
    role: user.role,
    image: user.image,
    iat: moment.unix(),
    exp: moment.unix().add(30, 'days')
  }; 

  return jwt.encode(payload, secret);
};