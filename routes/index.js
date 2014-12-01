/**
 * Routing for page rendering and authentication.
 * @author Anji Ren
 */

var express = require('express');
var router = express.Router();
var security = require('../errors/security');

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
	router.get('/home', security.isAuthenticated, function(req, res) {
		res.render('index', {user: req.user});
	});

	/**
	 * GET Edit Organization Page.
	 * TODO: security - must be manager
	 */
	router.get('/edit', security.isAuthenticated, function(req, res) {
		res.render('manager/edit', {user: req.user});
	});

	/**
	 * GET User Settings Page.
	 */
	router.get('/settings', security.isAuthenticated, function(req, res) {
		res.render('account-management/settings', {user: req.user});
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
	router.get('/shifts', security.isAuthenticated, function(req, res) {
    	res.render('shift/test_shift', {title: 'shift calendar testing', user: req.user});
	});

	/**
	 * GET dashboard page.
	 */
	router.get('/dashboard', security.isAuthenticated, function(req, res) {
		res.render('dashboard/dash', {user: req.user});
	});

	return router;
}