/*  All routes relating to users 
    
    @author: Dylan Joss
*/

var express = require('express');
var router = express.Router();

// Controllers
var OrgController = require('../controllers/organization');
var errors = require('../errors/errors');
var errorChecking = require('../errors/error-checking');

/* GET users listing. */
router.get('/', function(req, res) {
    res.send('respond with a resource');
});

module.exports = router;
