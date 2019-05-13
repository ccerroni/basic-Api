const jwt = require('jwt-simple');
const moment = require('moment');
const secret = 'pechera';

exports.ensureAuth = function(req, res, next) {
  if(!req.headers.authorization) {
    return res.status(403).send({ message: 'The request has not security header'});
  }
  
  let token = req.headers.authorization.replace(/['"]+/g, '');
  
  try {
    var payload = jwt.decode(token, secret);
    if(payload.exp <= moment.unix()) {
      return res.status(401).send({ message: 'the token has expired'});
    }
  }
  catch(ex) {
    return res.status(404).send({ message: 'the token is invalid'});
  }

  req.user = payload;
  next();
}