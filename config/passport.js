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
     * @param  {String} password Plaintext password
     * @return {String}          Hashed password
     */
	var createHash = function(password) {
        // data, salt
        return bCrypt.hashSync(password, bCrypt.genSaltSync(10));
    }

    /**
     * Compare the user-inputted password to the stored, hashed version
     * @param  {User}   user     User object from the User database
     * @param  {String} password User-inputted password
     * @return {Boolean}         Whether the user-inputted password matches 
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
        password = createHash(password);

        if (type === 'manager') {
            // managers must not be associated with roles 
            if (role) {
                return done(null, false, req.flash('message', 'Managers are not associated with roles.'));                 
            }
            else {
                UserController.createManager(name, email, password, org, function(err, newManager) {
                    if (err) {
                        return done(null, false, req.flash('message', err.message));
                    }
                    return done(null, newManager);
                });
            }
        }
        // employees must be associated with roles
        if (type === 'employee') {
            if (!role) {
                return done(null, false, req.flash('message', 'Employees must be associated with roles.'));                 
            }
            else {
                UserController.createEmployee(name, email, password, org, role, function(err, newEmployee) {
                    if (err) {
                        return done(null, false, req.flash('message', err.message));
                    }
                    return done(null, newEmployee);
                });
            }
        }
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
