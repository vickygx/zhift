/*  File controller all the routes relating to shifts
    
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

    OrgController.createOrg(req.body.name,
        // TODO: error handling
        function(err, org) {
            if (err) {
                next(err);
            } 
            else {
                res.send(org);
            }
        }
    );
});

/* GET request to get org with name */
router.get('/:name', function(req, res, next) {
    // TODO : any permissions

    OrgController.getOrg(req.param('name'),
        // TODO: error handling
        function(err, org) {
            if (err) {
                next(err);
            } 
            else {
                res.send(org);
            }
        }
    );
});

module.exports = router;