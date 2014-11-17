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

        getShiftsFor: function(employeeId, callback) {
            $.ajax({
                datatype: 'json',
                type: 'GET',
                url: 'shift/user/' + employeeId,
            }).success(function(res) {
                callback(res.shifts);
            }).error(function(res){
                // TODO: error handling
                callback(res);
            });
        },

        getOpenShifts: function(scheduleId, callback) {
            $.ajax({
                datatype: 'json',
                type: 'GET',
                url: 'shift/upForGrabs/' + scheduleId,
            }).success(function(res) {
                callback(res.shifts);
            }).error(function(res){
                // TODO: error handling
                callback(res);
            });
        },

        putUpForGrabs: function(shiftId, callback) {
            $.ajax({
                datatype: 'json',
                type: 'PUT',
                url: 'shift/putUpForGrabs/' + shiftId,
            }).success(function(res) {
                callback(res);
            }).error(function(res) {
                // TODO: error handling
                callback(res);
            });
        },

        claim: function(shiftId, callback) {
            $.ajax({
                datatype: 'json',
                type: 'PUT',
                url: 'shift/claim/' + shiftId,
            }).success(function(res) {
                callback(res);
            }).error(function(res) {
                // TODO: error handling
                callback(res);
            });
        }
    };
  
    return service;
}]);