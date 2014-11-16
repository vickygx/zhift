/**
 * EditOrgService
 * 
 * Angular Service for editOrg mixin
 * 
 * @author: Lily Seropian
 */

var ZhiftApp = angular.module('ZhiftApp');

ZhiftApp.service('EditOrgService', ['$rootScope', function($rootScope) {
    var service = {
        // Function to display all shifts associated with a schedule
        createSchedule: function(orgName, roleName, callback) {
            $.ajax({
                datatype: 'json', 
                type: 'POST', 
                url: '/schedule/',
                data: {
                    org: orgName,
                    role: roleName,
                }
            }).success(function(res) {
                callback(res);
            }).error(function(res){
                // TODO: error handling
                console.log(res.responseText);
                callback(res);
            });
        },

        getSchedules: function(orgName, callback) {
            $.ajax({
                datatype: 'json',
                type: 'GET',
                url: '/schedule/all/' + orgName,
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