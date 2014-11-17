/*  All routes relating to users 
    
    @author: Dylan Joss
*/

var express = require('express');
var router = express.Router();

// Controllers
var OrgController = require('../controllers/organization');
var errors = require('../errors/errors');
var errorChecking = require('../errors/error-checking');

/* POST request to create new manager */
router.post('/manager', function(req, res) {

});

/* POST request to create new employee */
router.post('/employee', function(req, res) {

});

/* GET the manager associated with the id */
router.get('/manager/:id', function(req, res) {

});

/* GET the manager associated with the id */
router.get('/employee/:id', function(req, res) {

});

/* PUT to change the password of the given manager */
router.put('/manager/:id', function(req, res) {

});

/* PUT to change the password of the given employee */
router.put('/employee/:id', function(req, res) {

});

/* GET all managers associated with the org with the id */
router.get('/org/:id/manager', function(req, res) {

});

/* GET all employees associated with the org with the id */
router.get('/org/:id/employee', function(req, res) {

});

/* DELETE the user with the id */
router.delete('/:id', function(req, res) {

});

/* GET all employees associated with the schedule with the id */
router.get('/sched/:id', function(req, res) {

});

module.exports = router;
