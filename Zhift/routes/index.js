var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
    res.render('index', { title: 'Express' });
});

/* GET API TEST */
router.get('/api', function(req, res){
    res.render('apidemo', {title: 'API testing'});
});

module.exports = router;
