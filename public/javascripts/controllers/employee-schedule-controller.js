/**
 * Angular Controller for the employee shift schedule
 *  portion of the site.
 *
 * Employees can:
 *     See all shifts for a schedule
 *
 * @author: Anji Ren, Vicky Gong
 */

var ZhiftApp = angular.module('ZhiftApp');

ZhiftApp.controller('EmployeeScheduleController', function($scope, ShiftService, SwapService) {

    /**
     * Get roles, shifts, and template shifts from database.
     * @param  {String} org The name of the organization from which to get data.
     *         {String} username The name of the user currently logged in
     */        
    $scope.init = function(userId, username, org, scheduleId) {
        $scope.currentUserId = userId;
        $scope.username = username;
        $scope.org = org;
        $scope.myShifts = {};
        $scope.currentScheduleId = scheduleId;
        $scope.availableShiftsForSwap = {};
        $scope.swapProposals = {};
        $scope.activeShift = {};
        $scope.activeSwapId = null;
        resetShifts();
        // get the current user's shifts
        ShiftService.getShiftsFor($scope.currentUserId, function(shifts) {
            $scope.myShifts = {};
            for (var i = 0; i < shifts.length; i++) {
                $scope.myShifts[shifts[i]._id] = shifts[i];
            }
            $scope.$apply();
        });

        // Populating templates based on current schedule
        getShifts($scope.currentUserId, $scope.currentScheduleId, function(err) {
            if (!err) {
                $scope.$apply();
                // get all shifts up for swap for the current user's role
                // get all swap proposals for any shifts the current user has put up for swap
                ShiftService.getShiftsUpForSwap($scope.currentScheduleId, function(shifts) {
                    for (var i = 0; i < shifts.length; i++) {
                        $scope.availableShiftsForSwap[shifts[i]._id] = shifts[i];

                        (function(shiftId) {
                            SwapService.getSwapForShift(shiftId, function(swap) {
                                console.log(swap);
                                $scope.availableShiftsForSwap[shiftId].swapId = swap._id;
                                $scope.$apply();
                                if ($scope.myShifts[shiftId] !== undefined && swap.shiftOfferedInReturn) {
                                    $scope.swapProposals[swap._id] = swap;
                                    $scope.$apply();
                                }
                            });
                        })(shifts[i]._id);
                    };
                });
            }
        });
    };

    /*  Gets template shifts associated with the scheduleId and 
    *   populates $scope.shiftsByDay such that it has the following format:
    *   
    *   $scope.shiftsByDay = {
    *       'Monday': {
    *           8: [], // list of template shifts starting at 8am on Monday
    *           9: [],
    *           etc.
    *        }
    *       'Tuesday':
    *       etc.
    *   }
    *
    *   @param {ObjectId} scheduleId        id of the schedule to get template shfits for
    *   @param {function} callback          callback function that takes err if there is an error, or null 
    *
    */
    var getShifts = function(userId, scheduleId, callback){
        //TODO: make sure it's organized by DATE also
        ShiftService.getShifts(scheduleId, function(err, shifts){
            if (!err){
                resetShifts();
                // Go through template shifts
                for (var i = 0; i < shifts.length; i++){
                    var templateDay = shifts[i].dayOfWeek;
                    var templateHour = getHour(shifts[i].start);

                    var scopeDayHour = $scope.shiftsByDay[templateDay];
                    
                    // Append templateshift to proper day and hour
                    if (!scopeDayHour[templateHour]){
                        scopeDayHour[templateHour] = [];
                    }

                    scopeDayHour[templateHour].push(shifts[i]);
                }
                callback();
            }
            else {
                callback(err);
            }
        });
    }

    var resetShifts = function(){
        $scope.shiftsByDay = 
            {'Monday': {},
            'Tuesday': {},
            'Wednesday': {},
            'Thursday': {},
            'Friday': {},
            'Saturday': {},
            'Sunday': {}};
    }

    $scope.setActiveShiftInfo = function(id, day, startTime, endTime) {
        $scope.activeShift = {
            shiftId: id,
            day: day,
            startTime: hourToHHMM(startTime),
            endTime: hourToHHMM(endTime)
        }
        $scope.$apply();
    }

    $scope.setActiveSwapInfo = function(swapId) {
        $scope.activeSwapId = swapId;
        console.log(swapId);
        $scope.$apply();
    }

    /*  Returns the hour of "HH:MM" */
    var getHour = function(string){
        return parseInt(string.split(":")[0]);
    }

    var hourToHHMM = function(hour) {
        // If hour is single digit
        var hourString = String(hour);
        if (hour < 10 && hour >= 0) {
            hourString = '0' + hourString;
        }
        return hourString + ':00';
    };

    $scope.isMyShift = function(shiftOwnerName, shiftId) {
        return (shiftOwnerName == $scope.username);
    };

    $scope.isUpForGrabs = function(shiftId) {
        ShiftService.getShift(shiftId, function(err, shift) {
            if (shift) {
                return shift.upForGrabs;
            }
        })     
    };

    $scope.putShiftUpForGrabs = function(shiftId) {
        ShiftService.putUpForGrabs(shiftId, function(err, shift) {
            if (!err) {
                getShifts($scope.currentUserId, $scope.currentScheduleId, function(err) {
                    if (!err) {
                        $scope.$apply();
                        // get all shifts up for swap for the current user's role
                        // get all swap proposals for any shifts the current user has put up for swap
                        ShiftService.getShiftsUpForSwap($scope.currentScheduleId, function(shifts) {
                            for (var i = 0; i < shifts.length; i++) {
                                $scope.availableShiftsForSwap[shifts[i]._id] = shifts[i];

                                (function(shiftId) {
                                    SwapService.getSwapForShift(shiftId, function(swap) {
                                        console.log(swap);
                                        $scope.availableShiftsForSwap[shiftId].swapId = swap._id;
                                        $scope.$apply();
                                        if ($scope.myShifts[shiftId] !== undefined && swap.shiftOfferedInReturn) {
                                            $scope.swapProposals[swap._id] = swap;
                                            $scope.$apply();
                                        }
                                    });
                                })(shifts[i]._id);
                            };
                        });
                    }
                });
            }
        })
    }

    $scope.putShiftUpForTrade = function(shiftId, scheduleId){
        SwapService.putUpForSwap(shiftId, scheduleId, function(err, shift) {
            if (!err) {
                getShifts($scope.currentUserId, $scope.currentScheduleId, function(err) {
                    if (!err) {
                        $scope.$apply();
                        // get all shifts up for swap for the current user's role
                        // get all swap proposals for any shifts the current user has put up for swap
                        ShiftService.getShiftsUpForSwap($scope.currentScheduleId, function(shifts) {
                            for (var i = 0; i < shifts.length; i++) {
                                $scope.availableShiftsForSwap[shifts[i]._id] = shifts[i];

                                (function(shiftId) {
                                    SwapService.getSwapForShift(shiftId, function(swap) {
                                        console.log(swap);
                                        $scope.availableShiftsForSwap[shiftId].swapId = swap._id;
                                        $scope.$apply();
                                        if ($scope.myShifts[shiftId] !== undefined && swap.shiftOfferedInReturn) {
                                            $scope.swapProposals[swap._id] = swap;
                                            $scope.$apply();
                                        }
                                    });
                                })(shifts[i]._id);
                            };
                        });
                    }
                });
            }
        })       
    }

    $scope.claimShift = function(shiftId, employeeId) {
        ShiftService.claim(shiftId, employeeId, function(err, shift) {
            if (!err) {
                getShifts($scope.currentUserId, $scope.currentScheduleId, function(err) {
                    if (!err) {
                        $scope.$apply();
                        // get all shifts up for swap for the current user's role
                        // get all swap proposals for any shifts the current user has put up for swap
                        ShiftService.getShiftsUpForSwap($scope.currentScheduleId, function(shifts) {
                            for (var i = 0; i < shifts.length; i++) {
                                $scope.availableShiftsForSwap[shifts[i]._id] = shifts[i];

                                (function(shiftId) {
                                    SwapService.getSwapForShift(shiftId, function(swap) {
                                        console.log(swap);
                                        $scope.availableShiftsForSwap[shiftId].swapId = swap._id;
                                        $scope.$apply();
                                        if ($scope.myShifts[shiftId] !== undefined && swap.shiftOfferedInReturn) {
                                            $scope.swapProposals[swap._id] = swap;
                                            $scope.$apply();
                                        }
                                    });
                                })(shifts[i]._id);
                            };
                        });
                    }
                });
            }
        })
    }

    $scope.offerSwap = function(swapId, shiftId) {
        SwapService.proposeSwap(swapId, shiftId, function(swap) {
            $scope.swapProposals[swap._id] = swap;
            $scope.$apply();
        });
    }

    /**
     * Accept a proposed swap.
     * @param {ObjectId} swapId The id of the swap to accept.
     */
    $scope.acceptSwap = function(swapId) {
        SwapService.acceptSwap(swapId, function(swap) {
            delete $scope.swapProposals[swap._id];
            $scope.myShifts[swap.shiftUpForSwap._id].upForSwap = false;
            $scope.$apply();
            getShifts($scope.currentUserId, $scope.currentScheduleId, function(err) {
                if (!err) {
                    $scope.$apply();
                    // get all shifts up for swap for the current user's role
                    // get all swap proposals for any shifts the current user has put up for swap
                    ShiftService.getShiftsUpForSwap($scope.currentScheduleId, function(shifts) {
                        for (var i = 0; i < shifts.length; i++) {
                            $scope.availableShiftsForSwap[shifts[i]._id] = shifts[i];

                            (function(shiftId) {
                                SwapService.getSwapForShift(shiftId, function(swap) {
                                    console.log(swap);
                                    $scope.availableShiftsForSwap[shiftId].swapId = swap._id;
                                    $scope.$apply();
                                    if ($scope.myShifts[shiftId] !== undefined && swap.shiftOfferedInReturn) {
                                        $scope.swapProposals[swap._id] = swap;
                                        $scope.$apply();
                                    }
                                });
                            })(shifts[i]._id);
                        };
                    });
                }
            });
        });
    }

    /**
     * Reject a proposed swap.
     * @param {ObjectId} swapId The id of the swap to reject.
     */
    $scope.rejectSwap = function(swapId) {
        SwapService.rejectSwap(swapId, function(swap) {
            delete $scope.swapProposals[swap._id];
            $scope.$apply();
            getShifts($scope.currentUserId, $scope.currentScheduleId, function(err) {
                if (!err) {
                    $scope.$apply();
                    // get all shifts up for swap for the current user's role
                    // get all swap proposals for any shifts the current user has put up for swap
                    ShiftService.getShiftsUpForSwap($scope.currentScheduleId, function(shifts) {
                        for (var i = 0; i < shifts.length; i++) {
                            $scope.availableShiftsForSwap[shifts[i]._id] = shifts[i];

                            (function(shiftId) {
                                SwapService.getSwapForShift(shiftId, function(swap) {
                                    console.log(swap);
                                    $scope.availableShiftsForSwap[shiftId].swapId = swap._id;
                                    $scope.$apply();
                                    if ($scope.myShifts[shiftId] !== undefined && swap.shiftOfferedInReturn) {
                                        $scope.swapProposals[swap._id] = swap;
                                        $scope.$apply();
                                    }
                                });
                            })(shifts[i]._id);
                        };
                    });
                }
            });
        });
    }
})

.directive('temp', function() {
    return {
        restrict: 'C', 
        link: function(scope, element, attrs) {
            element.unbind('click');
            element.bind('click', function(evt) {
                evt.stopPropagation();
            });
        }
    };
})

.directive('setActiveShiftInfo', function() {
    return {
        restrict: 'C', 
        link: function(scope, element, attrs) {
            element.unbind('click');
            element.bind('click', function(evt) {
                // Store information of clicked shift
                scope.setActiveShiftInfo(
                    evt.currentTarget.dataset.shiftId, 
                    evt.currentTarget.dataset.dayWeek, 
                    evt.currentTarget.dataset.startTime,
                    evt.currentTarget.dataset.endTime
                );
                console.log(
                    evt.currentTarget.dataset.shiftId, 
                    evt.currentTarget.dataset.dayWeek, 
                    evt.currentTarget.dataset.startTime,
                    evt.currentTarget.dataset.endTime
                );
            });
        }
    };
})

.directive('setActiveSwapInfo', function() {
    return {
        restrict: 'C', 
        link: function(scope, element, attrs) {
            element.unbind('click');
            element.bind('click', function(evt) {
                // Store information of clicked shift
                scope.setActiveShiftInfo(
                    evt.currentTarget.dataset.shiftId, 
                    evt.currentTarget.dataset.dayWeek, 
                    evt.currentTarget.dataset.startTime,
                    evt.currentTarget.dataset.endTime
                );

                scope.setActiveSwapInfo(
                    evt.currentTarget.dataset.swapId
                );

                console.log(
                    evt.currentTarget.dataset.shiftId, 
                    evt.currentTarget.dataset.dayWeek, 
                    evt.currentTarget.dataset.startTime,
                    evt.currentTarget.dataset.endTime
                );
            });
        }
    };
})

.directive('putUpForGrabs', function() {
    return {
        restrict: 'C', 
        link: function(scope, element, attrs) {
            element.unbind('click');
            element.bind('click', function(evt) {
                scope.putShiftUpForGrabs(
                    scope.activeShift['shiftId']
                );
            });
        }
    };
})

.directive('putUpForSwap', function() {
    return {
        restrict: 'C', 
        link: function(scope, element, attrs) {
            element.unbind('click');
            element.bind('click', function(evt) {
                scope.putShiftUpForTrade(
                    scope.activeShift['shiftId'],
                    scope.currentScheduleId
                );
            });
        }
    };
})

.directive('claimShift', function() {
    return {
        restrict: 'C', 
        link: function(scope, element, attrs) {
            element.unbind('click');
            element.bind('click', function(evt) {
                scope.claimShift(
                    scope.activeShift['shiftId'],
                    scope.currentUserId
                );
            });
        }
    };
})

.directive('offerSwapForShift', function() {
    return {
        restrict: 'C', 
        link: function(scope, element, attrs) {
            element.unbind('click');
            element.bind('click', function(evt) {
                scope.offerSwap(
                    scope.activeSwapId,
                    scope.activeShift['shiftId']
                );
            });
        }
    };
})
