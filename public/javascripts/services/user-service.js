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
         * GET /user/employee/[employeeId]
         * @param {String} employeeId The id of the employee to get.
         * @param {Function} callback Called with retrieved employee or error.
         */
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

        /**
         * GET /user/org/[orgId]/employee
         * @param {String} id The id of the organization for which to get all employees.
         * @param {Function} callback Called with retrieved employees or error.
         */
        getEmployees: function(id, callback) {
            $.ajax({
                datatype: 'json',
                type: 'GET',
                url: '/user/org/' + id + '/employee/',
            }).success(function(res) {
                callback(null, res);
            }).error(function(res) {
                // TODO: error handling
                console.log(res.responseText);
                callback(res.responseText, null);
            });
        },

        /**
         * GET /user/sched/[scheduleId]
         * @param {String} id The id of the schedule for which to get all employees.
         * @param {Function} callback Called with retrieved employees or error.
         */
        getEmployeesForSchedule: function(id, callback) {
            $.ajax({
                datatype: 'json',
                type: 'GET',
                url: '/user/sched/' + id,
            }).success(function(res) {
                callback(res);
            }).error(function(res) {
                // TODO: error handling
                console.log(res.responseText);
                callback(res.responseText);
            });
        },

        /**
         * GET /user/org/[orgId]/manager
         * @param {String} id The id of the organization for which to get all managers.
         * @param {Function} callback Called with retrieved managers or error.
         */
        getManagers: function(id, callback) {
            $.ajax({
                datatype: 'json',
                type: 'GET',
                url: '/user/org/' + id + '/manager/',
            }).success(function(res) {
                callback(null, res);
            }).error(function(res) {
                // TODO: error handling
                console.log(res.responseText);
                callback(res.responseText, null);
            });
        }
    };
  
    return service;
}]);