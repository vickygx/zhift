var express = require('express');
var router = express.Router();

// Controllers
var ShiftController = require('../controllers/shift');
var errors = require('../errors/errors');
var errorChecking = require('../errors/errorChecking');

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Express through shift for now' });
});

module.exports = router;