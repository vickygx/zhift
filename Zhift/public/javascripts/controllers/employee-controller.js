/**
 * Angular Controller for an employee.
 *
 * @author: Lily Seropian
 */

var ZhiftApp = angular.module('ZhiftApp');

ZhiftApp.controller('EmployeeController', function($scope, ShiftService, UserService) {
    $scope.init = function(user_id) {
        UserService.getEmployee(user_id, function(employee) {
            $scope.user = employee;
            $scope.myShifts = {};
            $scope.allShiftsForMyRole = {};
            $scope.openShifts = {};

            ShiftService.getShiftsFor($scope.user._id.$oid, function(shifts) {
                $scope.myShifts = {};
                for (var i = 0; i < shifts.length; i++) {
                    $scope.myShifts[shifts[i]._id] = shifts[i];
                }
                $scope.$apply();
            });

            ShiftService.getShifts($scope.user.schedule.$oid, function(shifts) {
                $scope.allShiftsForMyRole = {};
                for (var i = 0; i < shifts.length; i++) {
                    $scope.allShiftsForMyRole[shifts[i]._id] = shifts[i];
                }
                $scope.$apply();
            });

            ShiftService.getOpenShifts($scope.user.schedule.$oid, function(shifts) {
                $scope.openShifts = {};
                for (var i = 0; i < shifts.length; i++) {
                    $scope.openShifts[shifts[i]._id] = shifts[i];
                }
                $scope.$apply();
            });
        });
    }

    $scope.swap = function(shiftId) {
        console.log('swapping', shiftId);
    }

    $scope.putUpForGrabs = function(shiftId) {
        ShiftService.putUpForGrabs(shiftId, function(shift) {
            $scope.openShifts[shift._id] = shift;
            $scope.myShifts[shift._id] = shift;
            $scope.$apply();
        });
    }

    $scope.claim = function(shiftId) {
        ShiftService.claim(shiftId, function(shift) {
            delete $scope.openShifts[shift._id];
            $scope.myShifts[shift._id] = shift;
            $scope.$apply();
        });
    }
});