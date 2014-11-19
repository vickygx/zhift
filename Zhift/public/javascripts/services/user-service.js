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
            $.ajax({
                datatype: 'json',
                type: 'GET',
                url: '/user/employee/' + employeeId,
            }).success(function(res) {
                callback(res);
            }).error(function(res) {
                // TODO: error handling
                console.log(res.responseText);
                callback(res.responseText);
            });
        },
    };
  
    return service;
}]);