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
        createSchedule: function(orgName, roleName) {
            $.ajax({
                datatype: 'json', 
                type: 'POST', 
                url: '/schedule/',
                data: {
                    org: orgName,
                    role: roleName,
                }
            }).success(function(res) {
                // TODO: update list of roles
            }).error(function(res){
                // TODO: error handling
                console.log(res.responseText);
            });
        },
    };
  
    return service;
}]);