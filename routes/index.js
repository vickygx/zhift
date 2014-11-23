/**
 * Routing for page rendering and authentication.
 * @author Anji Ren
 */

var express = require('express');
var router = express.Router();

/**
 * Authentication middleware: redirect the user to '/' if they are not authenticated.
 */
var isAuthenticated = function (req, res, next) {
	// if user is authenticated in the session, call the next() to call the next request handler 
	// Passport adds this method to request object. A middleware is allowed to add properties to
	// request and response objects.
	if (req.isAuthenticated()) {
		return next();
	}
	// if the user is not authenticated then redirect him to the login page
	res.redirect('/');
}

module.exports = function(passport) {
	/**
	 * GET API demo page.
	 */
	router.get('/api', function(req, res){
	    res.render('api-demo/apidemo', {title: 'API testing'});
	});

	/**
	 * GET login page.
	 */
	router.get('/', function(req, res) {
    	// Display the Login page with any flash message, if any
		res.render('account-management/login', { message: req.flash('message') });
	});

	/**
	 * POST to login a user.
	 */
	router.post('/login', passport.authenticate('login', {
		successRedirect: '/home',
		failureRedirect: '/',
		failureFlash: true  
	}));

	/**
	 * GET Registration Page.
	 */
	router.get('/signup', function(req, res) {
		res.render('account-management/register', {message: req.flash('message')});
	});

	/**
	 * POST to signup a new user.
	 */
	router.post('/signup', passport.authenticate('signup', {
		successRedirect: '/home',
		failureRedirect: '/signup',
		failureFlash: true  
	}));

	/**
	 * GET Home Page.
	 */
	router.get('/home', isAuthenticated, function(req, res) {
		res.render('index', {user: req.user});
	});

	/**
	 * GET to sign out a user.
	 */
	router.get('/signout', function(req, res) {
		req.logout();
		res.redirect('/');
	});

	/**
	 * GET shift test page.
	 */
	router.get('/shifts', isAuthenticated, function(req, res) {
    	res.render('shift/test_shift', {title: 'shift calendar testing', user: req.user});
	});

	/**
	 * GET dashboard page.
	 */
	router.get('/dashboard', isAuthenticated, function(req, res) {
		res.render('dashboard/dash', {user: req.user});
	});

	return router;
}