/**
 * @author Anji Ren, Lily Seropian, Dylan Joss
 */

var mongoose 		   = require('mongoose');
var LocalStrategy 	   = require('passport-local').Strategy;
var User               = require('../models/user');
var EmployeeUser       = require('../models/employee-user');
var UserController 	   = require('../controllers/user');
var OrgController      = require('../controllers/organization');
var ScheduleController = require('../controllers/schedule');
var bCrypt			   = require('bcrypt-nodejs');

module.exports = function(passport) {

	var createHash = function(password) {
        return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
    }

	var isCorrectPassword = function(user, password) {
		return bCrypt.compareSync(password, user.password);
	}

	passport.serializeUser(function(user, done) {
		console.log('Passport: serializing user: '+ user);
		done(null, user._id);
	});

	passport.deserializeUser(function(id, done) {
		EmployeeUser.findById(id, function(err, user) {
            if (!user) {
                User.findById(id, function(err, user) {
                    done(err, user);
                });
            }
            else {
                done(err, user);
            }
		});
	});

	passport.use('signup', new LocalStrategy({
			usernameField: 'email',
			passReqToCallback: true
		},
		function(req, email, password, done) {
			var name = req.body.name;
			var org = req.body.org;
			var type = req.body.userType;
			var role = req.body.userRole;
			var scheduleID = null;

			// only employees accounts are associated with a role
			if (role) {
				ScheduleController.retrieveScheduleByOrgAndRole(org, role, function(err, schedule) {
					if (err) {
						console.log(err);
						return done(null, false, req.flash('message', err));                 
					}
					if (schedule) {
						console.log('successfully associated new employee with an existing schedule');
						scheduleID = schedule._id;
					}
				});
			}

			UserController.retrieveUser(email, org, function(err, retrievedUser) {
				if (err) {
					console.log(err);
					// TODO
					return done(null, false, req.flash('message', err));                 
				}

				OrgController.retrieveOrg(org, function(err, retrievedOrg) {
					if (err) {
						console.log(err);
						return done(null, false, req.flash('message', err));
					}
					if (retrievedOrg && retrievedUser) {
						console.log('An organization with this name already exists!');
						return done(null, false, req.flash('message',
							'An organization with this name already exists!'));
					}
					// creating a manager associated with a new organization --> create that
					// organization
					if (!retrievedOrg && !scheduleID) {
        				OrgController.createOrg(org, function(err, newOrg) {
        					if (err) {
        						console.log('messed up creating a new org');
        						console.log(err);
        						return done(null, false, req.flash('message', err)); 
        					}
        					console.log('da new org we done created is');
        					console.log(newOrg);
        				});
					}
				});
				/*
				if (retrievedUser) {
					console.log('A user with this email already exists in this organization.');
					return done(null, false, req.flash('message', 
						'A user with this email already exists in this organization.'));
				}
				*/

				password = createHash(password);
				UserController.createUser(name, email, password, org, scheduleID, function(err, newUser) {
					if (err) {
						console.log(err);
						return done(null, false, req.flash('message', err)); 
						//TODO
					}
					console.log('created newUser');
					console.log(newUser);
					return done(null, newUser);
				});
			});
	}));

	passport.use('login', new LocalStrategy({
			usernameField: 'email',
            passReqToCallback: true
        },
        function(req, email, password, done) {
        	var org = req.body.org;
	  		UserController.retrieveUser(email, org, function(err, user) {
	  			if (err) {
	  				console.log(err);
	  				return done(null, false, req.flash('message', err)); 
	  				//TODO
	  			}
	  			if (!isCorrectPassword(user, password)) {
	  				console.log('Incorrect password.');
	  				return done(null, false, req.flash('message', 'Incorrect password.'));
	  			}
	  			return done(null, user);
	  		});

	}));
}