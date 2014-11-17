/**
 * UserService
 * 
 * Angular Service for users
 * 
 * @author: Lily Seropian
 */

var ZhiftApp = angular.module('ZhiftApp');

ZhiftApp.service('UserService', ['$rootScope', function($rootScope) {
    var service = {
        getEmployee: function(employeeId, callback) {
            callback({
                "__t": "EmployeeUser",
                "name": "employee",
                "email": "employee@employee.com",
                "password": "$2a$10$ZYwn23BxhxIwm7Zy6bRtOeUHwpfxtM6xOYVIoEnQpJBFHn4dNtcRy",
                "org": "test",
                "schedule": {
                    "$oid": "546950fe3c296cc429466efe"
                },
                "_id": {
                    "$oid": "54695460ebfaf2f129a79db4"
                },
                "__v": 0
            });
            // TODO: unmock!
            /**
            $.ajax({
                datatype: 'json',
                type: 'GET',
                url: '/user/' + employeeId,
            }).success(function(res) {
                callback(res);
            }).error(function(res) {
                // TODO: error handling
                console.log(res.responseText);
                callback(res.responseText);
            });
            */
        },
    };
  
    return service;
}]);