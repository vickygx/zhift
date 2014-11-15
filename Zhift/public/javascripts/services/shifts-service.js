/*  ShiftsService
*
*   Angular Service for shifts mixin
*   Takes care of the data population, ajax calls of data related to shifts
* 
*   @author: Vicky Gong
*/

var ZhiftApp = angular.module('ZhiftApp');

ZhiftApp.service('ShiftService', ['$rootScope', function($rootScope) {
  
    var helpers = (function(){
    
        return {     
        }

    })();

  var service =  {
  
    shifts: [],
    error: 'All is good!',
    
    // Function to display all shifts associated with a schedule
    displayAllShifts: function(scheduleId){
        // AJAX call to get all shifts
        $.ajax({
            datatype: "json", 
            type: 'GET', 
            url: 'shift/all/' + scheduleId, 
        }).success(function(res) {
            // TODO: update service
            $rootScope.$broadcast( 'shifts.update' );
        }).error(function(res){
            service.error = res.responseText ? res.responseText : 'error';
            $rootScope.$broadcast( 'shifts.error' );
        });

    },

    // Function to display all shifts associated with a user
    displayUserShifts: function(){
        var user = $rootScope.user;
        var userId = ''; // TODO: do something with user to get id

        // AJAX call to get all shifts
        $.ajax({
            datatype: "json", 
            type: 'GET', 
            url: '/shift/user/' + userId, 
        }).success(function(res) {
            // TODO: update service
            $rootScope.$broadcast( 'shifts.update' );
        }).error(function(res){
            service.error = res.responseText ? res.responseText : 'error';
            $rootScope.$broadcast( 'shifts.error' );
        });
    },

    // Function to display user images
    displayOpenShifts: function(scheduleId){
        // AJAX call to get all shifts
        $.ajax({
            datatype: "json", 
            type: 'GET', 
            url: '/shift/upForGrabs/' + scheduleId, 
        }).success(function(res) {
            // TODO: update service
            $rootScope.$broadcast( 'shifts.update' );
        }).error(function(res){
            service.error = res.responseText ? res.responseText : 'error';
            $rootScope.$broadcast( 'shifts.error' );
        });
    },

  }
  
  return service;

}]);