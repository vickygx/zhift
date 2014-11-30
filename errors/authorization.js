

// TODO put all this on module.exports then require it in whatever file uses it
// 
// isEmployee
// isManager
// 
// isEmployeeOfOrg cannot be done in middleware




module.exports.isEmployeeOfOrg = function(org) {
    return function(req, res, next) {
        if (req.user.org === org) {
            return next();
        }
        res.redirect('/');
    }
}


shift.get('/', isEmployeeOfOrg())