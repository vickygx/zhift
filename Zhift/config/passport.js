var mongoose 		= require('mongoose')
var LocalStrategy 	= require('passport-local').Strategy
var User 			= require('../models/user')
var UserController 	= require('../controllers/user')
var bCrypt			= require('bcrypt-nodejs')

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
		User.findById(id, function(err, user) {
			done(err, user);
		})
	});

	passport.use('signup', new LocalStrategy({
			usernameField: 'email',
			passReqToCallback: true
		},
		function(req, email, password, done) {
			var name = req.body.name;
			var org = req.body.org;
			var type = req.body.userType;
			console.log('here');
			UserController.retrieveUser(email, org, function(err, user) {
				if (err) {
					console.log(err);
					//TODO
					return done(null, false, req.flash('message', err));                 
				}
				//TODO: DO FIND ON ORG TO SEE IF ORG WAS ALREADY CREATED

				if (user) {
					console.log("An user with this email and in this organization already exists!");
					return done(null, false, req.flash('message', 
						'An user with this email already exists in this organization.'));
				}

				// encrypt password
				password = createHash(password);
				UserController.createUser(name, email, password, org, type, function(err, newUser) {
					if (err) {
						console.log(err);
						return done(null, false, req.flash('message', err)); 
						//TODO
					}
					console.log("New user successfully created.");
					return done(null, newUser);
				});
			})
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