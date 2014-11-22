/**
 * Angular Controller for the manager template shift schedule
 *  portion of the site.
 *
 * Managers can:
 *     See all template shifts for a schedule
 *
 * @author: Vicky Gong, Anji Ren
 * TODO: commments
 */

var ZhiftApp = angular.module('ZhiftApp');

ZhiftApp.controller('ManagerScheduleController', function($scope, ScheduleService, TemplateShiftService, UserService) {

    /**
     * Get roles, shifts, and template shifts from database.
     * @param  {String} org The name of the organization from which to get data.
     */
    $scope.init = function(org) {
        $scope.org = org;
        $scope.currentScheduleId = 1;
        $scope.schedules = [];
        $scope.employeesBySchedule = {};
        $scope.templateShiftsByDay = 
            {'Monday': {},
            'Tuesday': {},
            'Wednesday': {},
            'Thursday': {},
            'Friday': {},
            'Saturday': {},
            'Sunday': {}};

        getAllSchedules($scope.org, function() {
            $scope.currentScheduleId = $scope.schedules[0]._id;
            $scope.$apply();
            console.log($scope.schedules);

            getTemplateShifts($scope.currentScheduleId, function(err) {
                $scope.$apply();
                console.log($scope.templateShiftsByDay);
            })
        });

        getAllEmployees($scope.org, function(err) {
            $scope.$apply();
            console.log("hi " +$scope.employeesBySchedule);
            console.log($scope.employeesBySchedule);
        });

    };

    var getTemplateShifts = function(scheduleId, callback){
        TemplateShiftService.getTemplateShifts(scheduleId, function(err, templateShifts){
            if (!err){
                // Go through template shifts
                for (var i = 0; i < templateShifts.length; i++){
                    var templateDay = templateShifts[i].dayOfWeek;
                    var templateHour = getHour(templateShifts[i].start);

                    var scopeDayHour = $scope.templateShiftsByDay[templateDay];
                    
                    // Append templateshift to proper day and hour
                    if (!scopeDayHour[templateHour]){
                        scopeDayHour[templateHour] = [];
                    }

                    scopeDayHour[templateHour].push(templateShifts[i]);
                }
                callback();
            }
            else {
                callback(err);
            }
        });
    }

    /*  Turns "HH:MM" into hour */
    var getHour = function(string){
        return parseInt(string.split(":")[0]);
    }

    var getAllSchedules = function(orgId, callback) {
        ScheduleService.getSchedules(orgId, function(schedules) {
            $scope.schedules = schedules;
            callback();
        })
    }

    $scope.setCurrentSchedule = function(scheduleId) {
        $scope.currentSchedule = scheduleId;
        getTemplateShifts(scheduleId, function(err){
            if (!err)
                $scope.$apply();
        });
        
    }

    var getAllEmployees = function(orgId, callback) {
        // Get list of employees (User objects)
        UserService.getEmployees(orgId, function(err, employees) {
            if (!err) {
                // Go through employees and organize by role.
                for (var i = 0; i < employees.length; i++) {
                    var employee = employees[i];
                    var role = employees[i].schedule;
                    if (!$scope.employeesBySchedule[role]) {
                        $scope.employeesBySchedule[role] = [];
                    }

                    $scope.employeesBySchedule[role].push(employee);
                }
                return callback();
            }
            return callback(err);
        });
    }

    $scope.createTemplateShift = function(day, startTime, endTime, employeeId, scheduleId){
        TemplateShiftService.createTemplateShift(day, startTime, endTime, employeeId, scheduleId, 
            function(err, newTemplateShift){
                if (!err){

                }
            });
    }
   
})
.directive('setCurrentSchedule', function(){
    return {
        restrict: 'C', 
        link: function(scope, element, attrs) {
            element.unbind('click');
            element.bind('click', function(evt) {
                evt.stopPropagation();
                var scheduleId = evt.currentTarget.id;
                scope.setCurrentSchedule(scheduleId);
            });
        }
    };
});
