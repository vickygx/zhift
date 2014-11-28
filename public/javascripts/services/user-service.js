/**
 * UserService
 * 
 * Angular Service to contact User API.
 * 
 * @author: Lily Seropian
 */

var ZhiftApp = angular.module('ZhiftApp');

ZhiftApp.service('UserService', ['$rootScope', function($rootScope) {
    var service = {
        /**
         * GET /user/employee/[employeeId].
         * @param {String}   employeeId The id of the employee to get.
         * @param {Function} fn         Called with retrieved employee or error.
         */
        getEmployee: function(employeeId, fn) {
            $.ajax({
                datatype: 'json',
                type: 'GET',
                url: '/user/employee/' + employeeId,
            }).success(function(res) {
                fn(res);
            }).error(function(res) {
                // TODO: error handling
                console.log(res.responseText);
                fn(res.responseText);
            });
        },

        /**
         * GET /user/org/[orgId]/employee.
         * @param {String}   id The id of the organization for which to get all employees.
         * @param {Function} fn Called with retrieved employees or error.
         */
        getEmployees: function(id, fn) {
            $.ajax({
                datatype: 'json',
                type: 'GET',
                url: '/user/org/' + id + '/employee/',
            }).success(function(res) {
                fn(null, res);
            }).error(function(res) {
                // TODO: error handling
                console.log(res.responseText);
                fn(res.responseText, null);
            });
        },

        /**
         * GET /user/sched/[scheduleId].
         * @param {String}   id The id of the schedule for which to get all employees.
         * @param {Function} fn Called with retrieved employees or error.
         */
        getEmployeesForSchedule: function(id, fn) {
            $.ajax({
                datatype: 'json',
                type: 'GET',
                url: '/user/sched/' + id,
            }).success(function(res) {
                fn(res);
            }).error(function(res) {
                // TODO: error handling
                console.log(res.responseText);
                fn(res.responseText);
            });
        },

        /**
         * GET /user/org/[orgId]/manager.
         * @param {String}   id The id of the organization for which to get all managers.
         * @param {Function} fn Called with retrieved managers or error.
         */
        getManagers: function(id, fn) {
            $.ajax({
                datatype: 'json',
                type: 'GET',
                url: '/user/org/' + id + '/manager/',
            }).success(function(res) {
                fn(null, res);
            }).error(function(res) {
                // TODO: error handling
                console.log(res.responseText);
                fn(res.responseText, null);
            });
        },

        /**
         * POST /user/manager.
         * @param {String}   name  The name of the new manager.
         * @param {String}   email The email of the new manager.
         * @param {String}   org   The org of the new manager.
         * @param {Function} fn    Callback that takes (err, manager).
         */
        createManager: function(name, email, org, fn) {
            $.ajax({
                datatype: 'json',
                type: 'POST',
                url: '/user/manager/',
                data: {
                    username: name,
                    email: email,
                    password: email,
                    org: org,
                },
            }).success(function(res) {
                fn(null, res);
            }).error(function(res) {
                // TODO: error handling
                console.log(res.responseText);
                fn(res.responseText, null);
            });
        }
    };
  
    return service;
}]);