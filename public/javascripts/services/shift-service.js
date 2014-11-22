/**
 * ShiftsService
 *
 * Angular Service for shifts mixin.
 * TODO: Error handling
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
                callback(null,res);
            }).error(function(res){
                callback(res);
            });
        },

        getShiftsFor: function(employeeId, callback) {
            $.ajax({
                datatype: 'json',
                type: 'GET',
                url: 'shift/user/' + employeeId,
            }).success(function(res) {
                callback(res);
            }).error(function(res){
                callback(res);
            });
        },

        getShiftsUpForGrabs: function(scheduleId, callback) {
            $.ajax({
                datatype: 'json',
                type: 'GET',
                url: 'shift/upForGrabs/' + scheduleId,
            }).success(function(res) {
                callback(res);
            }).error(function(res){
                callback(res);
            });
        },

        getShiftsUpForSwap: function(scheduleId, callback) {
            $.ajax({
                datatype: 'json',
                type: 'GET',
                url: 'shift/upForSwap/' + scheduleId,
            }).success(function(res) {
                callback(res);
            }).error(function(res){
                callback(res);
            });
        },

        putUpForGrabs: function(shiftId, callback) {
            $.ajax({
                datatype: 'json',
                type: 'PUT',
                url: 'shift/upForGrabs/' + shiftId,
            }).success(function(res) {
                callback(res);
            }).error(function(res) {
                callback(res);
            });
        },

        claim: function(shiftId, employeeId, callback) {
            $.ajax({
                datatype: 'json',
                type: 'PUT',
                url: 'shift/claim/' + shiftId,
                data: {
                    employeeId: employeeId,
                }
            }).success(function(res) {
                callback(res);
            }).error(function(res) {
                callback(res);
            });
        }
    };
  
    return service;
}]);