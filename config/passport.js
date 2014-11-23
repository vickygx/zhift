/**
 * @author Anji Ren, Lily Seropian, Dylan Joss
 * TODO: when creating a new manager, add their email to req.session.managerEmails
 * TODO: when deleting a manager, remove their email from req.session.managerEmails
 * TODO: when creating a new manager, set req.session.isManager to true
 */

var mongoose           = require('mongoose');
var LocalStrategy      = require('passport-local').Strategy;
var User               = require('../models/user');
var EmployeeUser       = require('../models/employee-user');
var UserController     = require('../controllers/user');
var OrgController      = require('../controllers/organization');
var ScheduleController = require('../controllers/schedule');
var bCrypt             = require('bcrypt-nodejs');

module.exports = function(passport) {

    /**
     * Create hash for the given password
     * 
     * @param {String}: password:  plaintext password
     * @return {String}: hashed password
     */
	var createHash = function(password) {
        // data, salt
        return bCrypt.hashSync(password, bCrypt.genSaltSync(10));
    }

    /**
     * Compare the user-inputted password to the stored, hashed version
     * 
     * @param {User} user: User object from the User database
     * @param {String} password: user-inputted password
     * @return {Boolean}: whether the user-inputted password matches 
     * the stored, hashed version
     */
	var isCorrectPassword = function(user, password) {
		return bCrypt.compareSync(password, user.password);
	}

    passport.serializeUser(function(user, done) {
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
    }, function(req, email, password, done) {
        var name = req.body.name;
        var org = req.body.org;
        var type = req.body.userType;
        var role = req.body.userRole;
        var scheduleID = null;

        // only employees accounts are associated with a role
        if (role) {
            ScheduleController.retrieveScheduleByOrgAndRole(org, role, function(err, schedule) {
                if (err) {
                    return done(null, false, req.flash('message', err));                 
                }
                if (schedule) {
                    scheduleID = schedule._id;
                }
            });
        }

        UserController.retrieveUser(email, org, function(err, retrievedUser) {
            if (err) {
                // TODO
                return done(null, false, req.flash('message', err));                 
            }

            OrgController.retrieveOrg(org, function(err, retrievedOrg) {
                if (err) {
                    return done(null, false, req.flash('message', err));
                }
                if (retrievedOrg && retrievedUser) {
                    return done(null, false, req.flash('message',
                        'An organization with this name already exists!'));
                }
                // creating a manager associated with a new organization --> create that organization
                if (!retrievedOrg && !scheduleID) {
                    OrgController.createOrg(org, function(err, newOrg) {
                        if (err) {
                            return done(null, false, req.flash('message', err)); 
                        }
                    });
                }
            });

            password = createHash(password);
            UserController.createUser(name, email, password, org, scheduleID, function(err, newUser) {
                if (err) {
                    return done(null, false, req.flash('message', err)); 
                    //TODO
                }
                return done(null, newUser);
            });
        });
    }));

    passport.use('login', new LocalStrategy({
        usernameField: 'email',
        passReqToCallback: true
    }, function(req, email, password, done) {
        var org = req.body.org;
        UserController.retrieveUser(email, org, function(err, user) {
            if (err) {
                return done(null, false, req.flash('message', err));
            }

            if (!user) {
                return done(null, false, req.flash('message', 'User not found.'));
            }

            if (!isCorrectPassword(user, password)) {
                return done(null, false, req.flash('message', 'Incorrect password.'));
            }

            UserController.retrieveManagersByOrgId(org, function(err, managers) {
                req.session.managerEmails = managers.map(function(manager) {
                    if (manager._id.toString() === user._id.toString()) {
                        req.session.isManager = true;
                    }
                    return manager.email;
                });
                return done(null, user);
            });
        });
    }));
}
