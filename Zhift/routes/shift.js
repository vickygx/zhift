/*  File controller all the routes relating to shifts
    
    @author: Vicky Gong 
*/
var express = require('express');
var router = express.Router();

// Controllers
var ShiftController = require('../controllers/shift');
var errors = require('../errors/errors');
var errorChecking = require('../errors/error-checking');

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Express through shift for now' });
});

/*  POST request to create shift */
router.post('/', function(req, res){

});

/*  POST request to put shift up for grabs */
router.put('/putUpForGrabs/:id', function(req, res){

});

/*  POST request to put shift up for grabs */
router.put('/putUpForGrabs/:id', function(req, res){

});

/*  GET request to get all shifts associated with a schedule */
router.get('/all/:scheduleid', function(req, res){

});

/*  GET request to get all shifts being offered associated with a schedule */
router.get('/upForGrabs/:scheduleid', function(req, res){

});

/*  GET request to claim a given shift by user who is logged in */
router.get('/claimShift/:id', function(req, res){

});

module.exports = router;