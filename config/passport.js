/**
 * User login and account creation
 * 
 * @author Anji Ren, Lily Seropian, Dylan Joss
 * 
 * The logged in user's associated organization may be accessed by req.user.org
 * Whether the logged in user is an employee or manager may be determined by
 *     req.user.schedule (will be set for employees, not for managers)
 * 
 */

var mongoose           = require('mongoose');
var LocalStrategy      = require('passport-local').Strategy;
var User               = require('../models/user');
var EmployeeUser       = require('../models/employee-user');
var ManagerUser        = require('../models/manager-user');
var UserController     = require('../controllers/user');
var OrgController      = require('../controllers/organization');
var ScheduleController = require('../controllers/schedule');
var bCrypt             = require('bcrypt-nodejs');

module.exports = function(passport) {

    /**
     * Create hash for the given password
     * @param  {String} password plaintext password
     * @return {String}          hashed password
     */
	var createHash = function(password) {
        // data, salt
        return bCrypt.hashSync(password, bCrypt.genSaltSync(10));
    }

    /**
     * Compare the user-inputted password to the stored, hashed version
     * @param  {User}   user     User object from the User database
     * @param  {String} password user-inputted password
     * @return {Boolean}         whether the user-inputted password matches 
     *                           the stored, hashed version
     */
	var isCorrectPassword = function(user, password) {
		return bCrypt.compareSync(password, user.password);
	}

    // serialization to enable user sessions
    passport.serializeUser(function(user, done) {
        done(null, user._id);
    });

    // deserialization enable user sessions
    passport.deserializeUser(function(id, done) {
        EmployeeUser.findById(id, function(err, user) {
            if (!user) {
                ManagerUser.findById(id, function(err, user) {
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
        // user inputs
        var name = req.body.name;
        var org = req.body.org;
        var type = req.body.userType;
        var role = req.body.userRole;

        // managers must not be associated with roles 
        if (role) {
            console.log('role exists');
            if (type === 'manager') {
                return done(null, false, req.flash('message', 'Managers are not associated with roles.'));                 
            }
        }
        // employees must be associated with roles
        else {
            if (type === 'employee') {
                return done(null, false, req.flash('message', 'Employees must be associated with roles.'));                 
            }
        }
        console.log('just finished checking some shit');

        OrgController.retrieveOrg(org, function(err, retrievedOrg) {
            if (err) {
                return done(null, false, req.flash('message', err));
            }
            // creating a manager associated with a new organization --> create that organization
            if (!retrievedOrg) {
                if (type === 'manager') {
                    console.log('about to create new org');
                    OrgController.createOrg(org, function(err, newOrg) {
                        if (err) {
                            return done(null, false, req.flash('message', err)); 
                        }
                    }); 
                }
                else {
                    return done(null, false, req.flash('message', 'Cannot associate employee with nonexistent organization'));
                }   
            }
            console.log('about to call createUser');
            password = createHash(password);
            UserController.createUser(name, email, password, org, role, function(err, newUser) {
                if (err) {
                    return done(null, false, req.flash('message', err.message)); 
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
                return done(null, false, req.flash('message', 'User with that email and organization not found.'));
            }
            if (!isCorrectPassword(user, password)) {
                return done(null, false, req.flash('message', 'Incorrect password.'));
            }

            // logic for record creation
            UserController.retrieveManagersByOrgId(org, function(err, managers) {
                if (err) {
                    return done(null, false, req.flash('message', err));
                }
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
