var express = require('express');
var router = express.Router();
var jwt = require('express-jwt');
var auth = jwt({
    secret: 'MY_SECRET',
    userProperty: 'payload'
});

var ctrlProfile = require('./controllers/profile');
var ctrlAuth = require('./controllers/authentication');

// profile
router.get('/profile', auth, ctrlProfile.getProfileById);
router.get('/profiles', auth, ctrlProfile.getAllProfiles);
router.get('/profiles/:query', auth, ctrlProfile.getAllProfiles);
router.get('/profiles/:skills', auth, ctrlProfile.getProfilesBySkills);
router.get('/getAllSkills', ctrlProfile.getAllSkills);
router.get('/getSkills/:query', auth,  ctrlProfile.getSkills);
router.get('/getDesignations/:query', auth, ctrlProfile.getDesignations);
router.post('/upload', auth, ctrlProfile.uploadFile);
router.get('/getFile/:id', ctrlProfile.getFile);
// router.get('/deleteFile/:id', ctrlProfile.deleteFile);

// authentication
router.post('/register', ctrlAuth.register);
router.post('/login', ctrlAuth.login);
router.get('/getUsers/:query/:role', auth, ctrlAuth.getUsers);

module.exports = router;
