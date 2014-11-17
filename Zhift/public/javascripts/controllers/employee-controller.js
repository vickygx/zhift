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
           
            ShiftService.getShiftsFor($scope.user._id.$oid, function(shifts) {
                $scope.myShifts = shifts;
                $scope.$apply();
            });

            ShiftService.getShifts($scope.user.schedule.$oid, function(shifts) {
                $scope.allShiftsForMyRole = shifts;
                $scope.$apply();
            });

            ShiftService.getOpenShifts($scope.user.schedule.$oid, function(shifts) {
                $scope.openShifts = shifts;
                $scope.$apply();
            });
        });
    }

    $scope.swap = function(shiftId) {
        console.log('swapping', shift);
    }

    $scope.putUpForGrabs = function(shiftId) {
        ShiftService.putUpForGrabs(shiftId, function(shift) {
            $scope.openShifts.push(shift);
            $scope.$apply();
        });
    }

    $scope.claim = function(shiftId) {
        ShiftService.claim(shiftId, function(shift) {
            // TODO: make idiomatic
            var index = 0;
            for (var i = 0; i < $scope.openShifts.length; i++) {
                if ($scope.openShifts[i]._id === shift._id) {
                    index = i;
                    break;
                }
            }
            $scope.openShifts.splice(index, 1);
            $scope.$apply();
        });
    }
});