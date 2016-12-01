var passport = require('passport');
var mongoose = require('mongoose');
var User = mongoose.model('User');

var sendJSONresponse = function (res, status, content) {
  res.status(status);
  res.json(content);
};

module.exports.register = function (req, res) {
  if (!req.body.name || !req.body.email || !req.body.password || !req.body.role) {
    sendJSONresponse(res, 400, {
      'message': 'All fields required',
    });
    return;
  }

  var user = new User();

  user.name = req.body.name;
  user.email = req.body.email;
  user.setPassword(req.body.password);
  user.role = req.body.role;

  user.save(function (err) {
    if (err) {
      res.status(404).json(err);
      return;
    }
    var token;
    token = user.generateJwt();
    res.status(200);
    res.json({
      'token': token,
    });
  });

};

module.exports.login = function (req, res) {

  if (!req.body.email || !req.body.password) {
    sendJSONresponse(res, 400, {
      'message': 'All fields required',
    });
    return;
  }

  passport.authenticate('local', function (err, user, info) {
    var token;

    // If Passport throws/catches an error
    if (err) {
      res.status(404).json(err);
      return;
    }

    // If a user is found
    if (user) {
      token = user.generateJwt();
      res.status(200);
      res.json({
        token,
      });
    } else {
      // If user is not found
      res.status(401).json(info);
    }
  })(req, res);

};

module.exports.getUsers = function (req, res) {
  if (!req.payload._id) return res.status(401).send({ 'message': 'UnauthorizedError: private profile' });
  var query = req.params.query;
  var role = req.params.role;
  User.find({ 'name': new RegExp(query, 'i'), 'role': role }, 'name email')
    .exec(function (err, users) {
      if (err) return res.status(400).send(err);
      res.status(200).send(users);
    });
};
