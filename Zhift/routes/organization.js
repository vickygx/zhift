/*  All the routes relating to shifts
    
    @author: Vicky Gong 
*/
var express = require('express');
var router = express.Router();

// Controllers
var OrgController = require('../controllers/organization');
var errors = require('../errors/errors');
var errorChecking = require('../errors/error-checking');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express through org for now' });
});

/* POST request to create org */
router.post('/', function(req, res, next) {
    // TODO : any permissions

    // TODO: error handling
    OrgController.createOrg(req.body.name, function(err, org) {
        if (err) {
            next(err);
        } 
        else {
            res.send(org);
        }
    });
});

/* GET request to get org with name */
router.get('/:name', function(req, res, next) {
    // TODO : any permissions

    // TODO: error handling
    OrgController.retrieveOrg(req.param('name'), function(err, org) {
        if (err) {
            next(err);
        } 
        else {
            res.send(org);
        }
    });
});

module.exports = router;