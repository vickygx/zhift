/**
 * ShiftsService
 *
 * Angular Service for shifts mixin.
 * 
 * @author: Lily Seropian, Vicky Gong
 */

var ZhiftApp = angular.module('ZhiftApp');

ZhiftApp.service('ShiftService', ['$rootScope', function($rootScope) {
    var service = {
        getShifts: function(scheduleId, callback) {
            $.ajax({
                datatype: 'json', 
                type: 'GET', 
                url: 'shift/all/' + scheduleId, 
            }).success(function(res) {
                callback(res);
            }).error(function(res){
                // TODO: error handling
                callback(res);
            });
        },
    };
  
    return service;
}]);