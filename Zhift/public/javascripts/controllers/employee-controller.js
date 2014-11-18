/**
 * Angular Controller for an employee.
 *
 * @author: Lily Seropian
 *
 * TODO: error handling
 */

var ZhiftApp = angular.module('ZhiftApp');

ZhiftApp.controller('EmployeeController', function($scope, ShiftService, UserService, SwapService) {
    $scope.init = function(user_id) {
        UserService.getEmployee(user_id, function(employee) {
            $scope.user = employee;
            $scope.myShifts = {};
            $scope.allShiftsForMyRole = {};
            $scope.openShifts = {};
            $scope.myShiftsICanSwap = {};
            $scope.swapProposals = {};

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

            ShiftService.getShiftsUpForGrabs($scope.user.schedule.$oid, function(shifts) {
                $scope.openShifts = {};
                for (var i = 0; i < shifts.length; i++) {
                    $scope.openShifts[shifts[i]._id] = shifts[i];
                }
                $scope.$apply();
            });

            ShiftService.getShiftsUpForSwap($scope.user.schedule.$oid, function(shifts) {
                shifts.forEach(function(shift) {
                    $scope.openShifts[shift._id] = shift;
                    $scope.$apply();

                    SwapService.getSwapForShift(shift._id, function(swap) {
                        if ($scope.myShifts[shift._id] !== undefined) {
                            $scope.myShifts[shift._id].swapId = swap._id;
                        }
                        if (swap.shiftOfferedInReturn) {
                            $scope.swapProposals[swap._id] = swap;
                            $scope.$apply();
                        }
                    });
                });
            });
        });
    }

    $scope.swap = function(shiftId) {
        SwapService.putUpForSwap(shiftId, $scope.myShifts[shiftId].schedule, function(swap) {
            $scope.myShifts[shiftId].upForSwap = true;
            $scope.myShifts[shiftId].swapId = swap._id;
            $scope.openShifts[shiftId] = $scope.myShifts[shiftId];
            $scope.$apply();
        });
    }

    $scope.showShiftsForSwapping = function(shiftId) {
        $scope.myShiftsICanSwap = $scope.myShifts;
    }

    $scope.proposeSwap = function(shiftId) {
        SwapService.proposeSwap($scope.myShifts[shiftId].swapId, shiftId, function(swap) {
            $scope.swapProposals[swap._id] = swap;
        });
    }

    $scope.putUpForGrabs = function(shiftId) {
        ShiftService.putUpForGrabs(shiftId, function(swap) {
            // store swap id
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

    $scope.acceptSwap = function(swapId) {
        SwapService.acceptSwap(swapId, function(swap) {
            console.log('swap accepted');
        });
    }
});